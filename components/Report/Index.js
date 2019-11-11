import React, {Component} from 'react';
import firebase from '../firebase';


import ErrorDialog from '../misc/errordialog/ErrorDialog';
import SnackBar from '../misc/snackbar/Snackbar';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';


import styles from './index.css';


class Report extends Component{

    state={
        restaurants:[],
        restaurantID:'',
        snackbar:false,
        errorDialog:false,
        errorMessage:'',
        snackbarMessage:'',
        loadingFormProgress:true,
    }

    changeHandler = (e)=>{

        this.setState({
            [e.target.name]:e.target.value
        });

    }

    componentDidMount(){

        let loadedRestaurants = [];

        firebase.database().ref("RESTAURANTS").on('child_added',snap=>{

            loadedRestaurants.push(snap.val());


            this.setState({
                restaurants:[...loadedRestaurants],
                loadingFormProgress:false
            });

        });

    }

  

    formSubmitHandler = (e)=>{

        e.preventDefault();

        this.setState({
            loadingFormProgress:true
        })
    }

    snackbarHandler=(message)=>{
        this.setState({
            snackbar:true,
            snackbarMessage:message
        })
    }

    errorDialogHandler = ()=>{
        this.setState({
            errorDialog:true,
            errorMessage:"something went wrong"
        })
    }

    componentWillUnmount(){
    }

    render(){
        const {
            restaurants,
            restaurantID,
            snackbar,
            errorDialog,
            errorMessage,
            snackbarMessage,
            loadingFormProgress
        } = this.state;
        
        return(
            <div className="maincover responsivepadding">
                <h2 className={styles.hstyle}>Report:</h2>
                    <form onSubmit={this.formSubmitHandler}>
                    <div className="formareastyles">
                        {
                            loadingFormProgress ? (
                                <div className="mainLoadingStyle">
                                    <CircularProgress size={70} />
                                </div>
                            ):(
                            <div className="mainFormStyle">

                                <TextField
                                    label="Choose Start date &amp; time"
                                    name="dateStart"
                                    // value={dateStart}
                                    onChange={this.changeHandler}
                                    defaultValue="2017-05-24T10:30"
                                    InputLabelProps={{
                                        shrink:true
                                    }}
                                    type="datetime-local"
                                    fullWidth
                                />

                                <TextField
                                    label="Choose End date &amp; time"
                                    name="dateStart"
                                    // value={dateStart}
                                    onChange={this.changeHandler}
                                    defaultValue="2017-05-24T10:30"
                                    InputLabelProps={{
                                        shrink:true
                                    }}
                                    type="datetime-local"
                                    fullWidth
                                />

                                <FormControl fullWidth  required>
                                    <InputLabel>Select Restaurant</InputLabel>
                                    <Select
                                        name="restaurantID"
                                        value={restaurantID}
                                        onChange={this.changeHandler}
                                    >
                                        {   
                                            restaurants.map((restaurant,index)=>{
                                                const {id,name} = restaurant;
                                                return(
                                                    <MenuItem key={index} value={id}>{name}</MenuItem>
                                                    )
                                            })
                                        }
                                        </Select>
                                </FormControl>

                                <Button 
                                        variant="contained"
                                        type="submit"
                                        size="large"
                                        fullWidth
                                >
                                        Genearte Report
                                </Button>
                                
                            </div>
                            )
                        }
                        </div>
                    </form>

                <SnackBar snackbarValue={snackbar} snackbarClose={()=>this.setState({snackbar:false})}>
                    {snackbarMessage}
                </SnackBar>

                <ErrorDialog dialogValue={errorDialog} dialogClose={()=>this.setState({errorDialog:false})}>
                    {errorMessage}
                </ErrorDialog>

            </div>
        )
    }

}


export default Report;