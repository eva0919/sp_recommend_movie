package main

import (
	"crypto/sha1"
	"database/sql"
	"encoding/csv"
	"fmt"
	"net/http"
	"os"
	"sort"
	"strconv"
	"time"

	"github.com/gin-gonic/contrib/static"
	"github.com/gin-gonic/gin"
	_ "github.com/mattn/go-sqlite3"
)

// Login is Struct Binding from JSON
type Login struct {
	Email    string `json:"email" binding:"required"`
	Password string `json:"password" binding:"required"`
}

type MovieVote struct {
	ID      string
	Ratings float32
	Votes   int
	Arvage  float32
}

type UpdateMovieStruct struct {
	MovieID int
	Ratings float32
}

type GetMovieResult struct {
	RecommendList []MovieVote
	MyMovie       map[string]float32
}

var hotRecomment map[string]float32
var movieVoteListGobal []MovieVote
var userRatingList []map[string]float32
var movieLabelList map[string]string
var db *sql.DB
var so *SlopeOne

func main() {
	var err error
	db, err = sql.Open("sqlite3", "./db/testing.db")
	checkErr(err)
	defer db.Close()
	db.SetMaxOpenConns(1)
	parseMovie("./data/movies.csv")
	userRatingList, movieVoteListGobal = parseRatings("./data/ratings.csv")
	// _, movieVoteListGobal = parseRatings("./data/ratings.csv")
	parseMovieVoteList()
	// hotRecomment = parseMovieVoteList(movieVoteList)
	so = NewSlopeOne(userRatingList)
	// user := make(map[string]float32)
	// user["31"] = 5.0

	router := gin.Default()
	router.Use(static.Serve("/", static.LocalFile("../frontend/public", true)))

	api := router.Group("/api")
	{
		api.GET("/movie_list", handlerOfMovieList)
		api.POST("/signup", handlerOfSignup)
		api.POST("/login", handlerOfLogin)
		api.POST("/logout", handlerOfLogout)
		api.PUT("/my_movies", handlerOfUpdateMyMovie)
		api.GET("/movie_label", handlerOfGetLabel)
	}
	router.Run() // listen and serve on 0.0.0.0:8080
}

func parseMovie(file string) {
	movieLabelList = map[string]string{}
	lines, err := openCSV(file)
	checkErr(err)
	lines = lines[1:]
	for _, line := range lines {
		movieLabelList[line[0]] = line[1]
		// movieLabelList = append(movieLabelList, string(line[1]))
	}
}

func parseRatings(file string) ([]map[string]float32, []MovieVote) {
	users := make([]map[string]float32, 0)
	movieVoteList := make([]MovieVote, 0)
	var index string
	lines, err := openCSV(file)
	if err != nil {
		panic(err)
	}
	lines = lines[1:]
	var movieVote *MovieVote
	for _, value := range lines {
		if string(value[0]) != index {
			index = value[0]
			newuser := map[string]float32{}
			users = append(users, newuser)
			movieVoteList = append(movieVoteList, MovieVote{ID: index})
		}
		user := users[len(users)-1]
		movieVote = &movieVoteList[len(movieVoteList)-1]
		f, err := strconv.ParseFloat(value[2], 32)
		if err != nil {
			panic(err)
		}
		user[string(value[1])] = float32(f)
		movieVote.Ratings += float32(f)
		movieVote.Votes++
	}
	return users, movieVoteList
}

// func parseMovieVoteList(movieVoteList []MovieVote) {
func parseMovieVoteList() {
	for index := range movieVoteListGobal {
		movieVoteListGobal[index].Arvage = movieVoteListGobal[index].Ratings / float32(movieVoteListGobal[index].Votes)
	}
	sort.Slice(movieVoteListGobal, func(i, j int) bool {
		return movieVoteListGobal[i].Arvage > movieVoteListGobal[j].Arvage
	})
}

func openCSV(file string) ([][]string, error) {
	f, err := os.Open(file)
	if err != nil {
		return nil, err
	}
	defer f.Close()

	lines, err := csv.NewReader(f).ReadAll()
	return lines, err
}

func checkErr(err error) {
	if err != nil {
		panic(err)
	}
}

func handlerOfSignup(c *gin.Context) {

	var json Login
	if err := c.ShouldBindJSON(&json); err == nil {
		statement, _ := db.Prepare("INSERT INTO user (email, password) VALUES (?, ?)")
		res, e := statement.Exec(json.Email, json.Password)
		if e != nil {
			c.JSON(http.StatusServiceUnavailable, gin.H{"error": err.Error()})
		} else {
			uid, _ := res.LastInsertId()
			session := getSession(int(uid))
			c.JSON(http.StatusOK, gin.H{"session": session})
		}
	} else {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	}
}

func handlerOfLogin(c *gin.Context) {
	var json Login
	if err := c.ShouldBindJSON(&json); err == nil {
		res, e := db.Query("SELECT id FROM user WHERE email=? AND password=?", json.Email, json.Password)
		if e != nil {
			c.JSON(http.StatusServiceUnavailable, gin.H{"error": e.Error()})
		}
		var uid int
		if res.Next() {
			_ = res.Scan(&uid)
			res.Close()
		} else {
			res.Close()
			c.JSON(http.StatusServiceUnavailable, gin.H{"error": "Email or Password failed"})
		}

		if uid > 0 {
			session := getSession(uid)
			c.JSON(http.StatusOK, gin.H{"session": session})
		} else {
			c.JSON(http.StatusNotFound, gin.H{"error": ""})
		}
	} else {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	}
}

func handlerOfLogout(c *gin.Context) {
	session := c.Request.Header.Get("session")
	fmt.Println(session)
	statement, _ := db.Prepare("DELETE FROM session WHERE session.session=?")
	_, e := statement.Exec(session)
	if e != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": e.Error()})
	} else {
		c.JSON(http.StatusOK, gin.H{"status": "ok"})
	}

}

func handlerOfMovieList(c *gin.Context) {
	session := c.Request.Header.Get("session")
	movieResult := GetMovieResult{}
	fmt.Println("Session : ", session)
	if session == "" {
		fmt.Println("Session Not found")
		movieResult.RecommendList = movieVoteListGobal
		c.JSON(http.StatusOK, gin.H{"result": movieResult})
	} else {
		res, e := db.Query("SELECT id FROM session WHERE session=?", session)
		if e != nil {
			c.JSON(http.StatusServiceUnavailable, gin.H{"error": e.Error()})
		}
		var uid int
		if res.Next() {
			_ = res.Scan(&uid)
			res.Close()
		} else {
			res.Close()
			c.JSON(http.StatusServiceUnavailable, gin.H{"error": "Session not found"})
		}

		res, e = db.Query("SELECT movie_id, ratings FROM ratings WHERE id=?", uid)
		user := make(map[string]float32)

		var movieID int
		var movieRating float32
		for res.Next() {
			_ = res.Scan(&movieID, &movieRating)
			user[strconv.Itoa(movieID)] = movieRating
		}
		res.Close()
		if len(user) == 0 {
			movieResult.RecommendList = movieVoteListGobal
			c.JSON(http.StatusOK, gin.H{"result": movieResult})
		} else {
			// fmt.Println(user)
			predict := so.Predict(user)

			var movieVoteList []MovieVote

			for key, value := range predict {
				_, ok := user[key]
				// fmt.Println("get value? ->", ok, "rating ->", r)
				if !ok {
					movieVote := MovieVote{}
					movieVote.ID = key
					movieVote.Ratings = value
					movieVote.Votes = 1
					movieVote.Arvage = value
					movieVoteList = append(movieVoteList, movieVote)
				}
			}
			sort.Slice(movieVoteList, func(i, j int) bool {
				return movieVoteList[i].Arvage > movieVoteList[j].Arvage
			})
			movieResult.RecommendList = movieVoteList
			movieResult.MyMovie = user
			c.JSON(http.StatusOK, gin.H{"result": movieResult})
		}
	}

}

func handlerOfUpdateMyMovie(c *gin.Context) {
	session := c.Request.Header.Get("session")
	if session == "" {
		c.JSON(http.StatusOK, gin.H{"result": movieVoteListGobal})
	} else {
		fmt.Println("session found")
		res, e := db.Query("SELECT id FROM session WHERE session=?", session)
		if e != nil {
			c.JSON(http.StatusServiceUnavailable, gin.H{"error": e.Error()})
		}
		var uid int
		if res.Next() {
			_ = res.Scan(&uid)
			res.Close()
		} else {
			res.Close()
			c.JSON(http.StatusServiceUnavailable, gin.H{"error": "Session not found"})
		}
		fmt.Println("id ->", uid)
		var updateStruct UpdateMovieStruct
		if err := c.ShouldBindJSON(&updateStruct); err == nil {
			fmt.Println("movie ->", updateStruct.MovieID)
			fmt.Println("ratings ->", updateStruct.Ratings)
			statement, _ := db.Prepare("INSERT INTO ratings (id, movie_id, ratings) VALUES (?, ?, ?)")
			_, e := statement.Exec(uid, updateStruct.MovieID, updateStruct.Ratings)
			if e != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": e.Error()})
			} else {
				c.JSON(http.StatusOK, gin.H{"status": "ok"})
			}
		} else {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		}
	}
}

func handlerOfGetLabel(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"result": movieLabelList})
}

func getSession(uid int) string {
	now := time.Now()
	secs := now.Unix()
	h := sha1.New()
	s := strconv.Itoa(int(secs)) + strconv.Itoa(uid) + "intowow"
	h.Write([]byte(s))
	has := h.Sum(nil)
	session := fmt.Sprintf("%x", has)
	statement, _ := db.Prepare("INSERT INTO session (session, id) VALUES (?, ?)")
	_, e := statement.Exec(string(session), uid)
	if e != nil {
		return ""
	}
	return session
}
