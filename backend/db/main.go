package main

import (
	"database/sql"
	"os"

	_ "github.com/mattn/go-sqlite3"
)

var fileName = "./testing.db"

func main() {
	database, _ := sql.Open("sqlite3", fileName)
	statement, err := database.Prepare("CREATE TABLE IF NOT EXISTS user (id INTEGER PRIMARY KEY, email TEXT UNIQUE, password TEXT)")
	checkError(err)
	statement.Exec()

	statement1, err := database.Prepare("CREATE TABLE IF NOT EXISTS session (session TEXT PRIMARY KEY, id INTEGER UNIQUE)")
	checkError(err)
	statement1.Exec()

	statement2, err := database.Prepare("CREATE TABLE IF NOT EXISTS ratings (id INTEGER NOT NULL, movie_id INTEGER NOT NULL, ratings FLOAT, PRIMARY KEY(id, movie_id))")
	checkError(err)
	statement2.Exec()
}

func checkError(err error) {
	if err != nil {
		_ = os.Remove(fileName)
		panic(err.Error())
	}
}
