import React from "react";
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';

class Rating extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            rating: 1
        }
    }
    handleClose = () => {
        this
            .props
            .onClose();
    };
    handleSubmit = () => {
        // console.log(this.state.rating);
        let newMyMovie = {};
        newMyMovie["" + this.props.selectedMovie.ID] = parseFloat(this.state.rating);
        this
            .props
            .updateAction({movieID: this.props.selectedMovie.ID, ratings: this.state.rating, selectedMovie: newMyMovie})
        this.handleClose();
    }
    handleChange = event => {
        this.setState({
            rating: Number(event.target.value)
        });
    };
    render() {
        // console.log(this.props.selectedMovie); return (     <Dialog
        // open={this.props.open} onClose={this.handleClose}></Dialog> )
        return (
            <Dialog
                open={this.props.open}
                onClose={this.handleClose}
                aria-labelledby="simple-dialog-title">
                <DialogTitle id="simple-dialog-title">Rating this movie</DialogTitle>
                <DialogContent>
                    <form>
                        <FormControl>
                            <InputLabel htmlFor="age-native-simple">Rating</InputLabel>
                            <Select
                                native
                                value={this.state.rating}
                                onChange={this.handleChange}
                                input={< Input id = "age-native-simple" />}>
                                <option value={1}>1</option>
                                <option value={2}>2</option>
                                <option value={3}>3</option>
                                <option value={4}>4</option>
                                <option value={5}>5</option>
                            </Select>
                        </FormControl>
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.handleSubmit}>Submit</Button>
                </DialogActions>
            </Dialog>
        )
    }
}
export default Rating