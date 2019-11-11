import React, {Component} from 'react';
import firebase from '../firebase';

import ErrorDialog from '../misc/errordialog/ErrorDialog';
import SnackBar from '../misc/snackbar/Snackbar';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardTimePicker,
  } from '@material-ui/pickers';

import RestaurantTable from './RestaurantTable';
import DialogUpdate from './DialogUpdate';
import DialogRemove from './DialogRemove';

import styles from './index.css';



  let loadedRestaurants=[];
class Category extends Component{

    state={
        name:'',
        address:'',
        phone:'',
        openingTime:new Date(),
        closingTime:new Date(),
        deliveryCharges:'',
        restaurants:[],
        snackbar:false,
        errorDialog:false,
        errorMessage:'',
        snackbarMessage:'',
        restaurantRef:firebase.database().ref('RESTAURANTS'),
        loadingTableProgress:false,
        loadingFormProgress:false,
        dialogUpdateOpen:false,
        dialogRemoveOpen:false,
        editObject:{},
        removeID:''
    }

    changeHandler = (e)=>{

        this.setState({
            [e.target.name]:e.target.value
        });

    }

    componentDidMount(){
        

        this.state.restaurantRef.on('child_added',snap=>{
            this.setState({
                loadingTableProgress:true
            });
            loadedRestaurants.push(snap.val());
            this.setState({
                restaurants:[...loadedRestaurants],
                loadingTableProgress:false
            })
        });


    

        this.removeCategoryListener();
        this.updateCategoryListener();
    }

   removeCategoryListener = ()=>{
        let loadedItem = {};

        this.state.restaurantRef.on('child_removed',snap=>{
            loadedItem = snap.val();
            this.setState((state)=>{
                let index = state.restaurants.findIndex((el)=>{
                    return(
                        el.id==loadedItem.id
                    )
                });
                state.restaurants.splice(index,1);
                loadedRestaurants.splice(index,1);
                return{
                    loadingTableProgress:false
                }

            });
        })
    }

    updateCategoryListener = ()=>{
        let loadedItem = {};
        this.state.restaurantRef.on('child_changed',snap=>{
            loadedItem=snap.val();
            this.setState((state)=>{
                let index = state.restaurants.findIndex((el)=>{
                    return(
                        el.id==loadedItem.id
                    )
                });
                state.restaurants[index]={...loadedItem};
                loadedRestaurants[index]={...loadedItem};
                return{
                    loadingTableProgress:false
                }

            });
        })
    }
    handleDateChange = (date,name) => {
        this.setState({
            [name]:date
        })
      };
    formSubmitHandler = (e)=>{

        e.preventDefault();

        const {name,address,phone,openingTime,closingTime,deliveryCharges} = this.state;
    
            const key = this.state.restaurantRef.push().key;
            this.state.restaurantRef
            .child(key)
            .set({
                id:key,
                name,
                address,
                phone,
                openingTime:openingTime.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true, minute: 'numeric' }),
                closingTime:closingTime.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true, minute: 'numeric' }),
                deliveryCharges
            }).then(
                ()=>{
                    this.setState({
                        name:'',
                        phone:'',
                        address:'',
                        openingTime:new Date(),
                        closingTime:new Date(),
                        deliveryCharges:''
                    });
                    this.snackbarHandler("Restaurant was successfully added");
                }
            ).catch(
                (err)=>{
                    this.errorDialogHandler();
                }
            );

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
        this.state.restaurantRef.off();
    }

    render(){
        const {

            name,
            address,
            phone,
            openingTime,
            closingTime,
            deliveryCharges,
            restaurants,
            snackbar,
            errorDialog,
            errorMessage,
            snackbarMessage,
            loadingFormProgress,
            loadingTableProgress,
            dialogUpdateOpen,
            dialogRemoveOpen,
            editObject,
            removeID
        } = this.state;
        
        return(
            <div className="maincover responsivepadding">
                <h2 className={styles.hstyle}>Manage the Restaurants:</h2>
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
                                    label="Name"
                                    variant="outlined"
                                    name="name"
                                    type="text"
                                    value={name}
                                    required
                                    onChange={this.changeHandler}
                                    fullWidth
                                />

                                <TextField 
                                    label="Address"
                                    variant="outlined"
                                    name="address"
                                    type="text"
                                    value={address}
                                    required
                                    onChange={this.changeHandler}
                                    fullWidth
                                />

                                <TextField 
                                    label="Phone"
                                    variant="outlined"
                                    name="phone"
                                    type="text"
                                    value={phone}
                                    required
                                    onChange={this.changeHandler}
                                    fullWidth
                                />

                                <MuiPickersUtilsProvider utils={DateFnsUtils}>

                                    <KeyboardTimePicker
                                        margin="normal"
                                        id="time-picker"
                                        fullWidth
                                        label="Opening Time"
                                        value={openingTime}
                                        onChange={(date)=>this.handleDateChange(date,"openingTime")}
                                            KeyboardButtonProps={{
                                                'aria-label': 'change time',
                                        }}
                                    />

                                    <KeyboardTimePicker
                                        margin="normal"
                                        id="time-picker"
                                        fullWidth
                                        label="Closing Time"
                                        value={closingTime}
                                        onChange={(date)=>this.handleDateChange(date,"closingTime")}
                                            KeyboardButtonProps={{
                                                'aria-label': 'change time',
                                        }}
                                    />

                                </MuiPickersUtilsProvider>

                                <TextField 
                                    label="Delivery Charges"
                                    variant="outlined"
                                    name="deliveryCharges"
                                    type="number"
                                    value={deliveryCharges}
                                    required
                                    onChange={this.changeHandler}
                                    fullWidth
                                />
                                
                                <Button 
                                        variant="contained"
                                        type="submit"
                                        size="large"
                                        fullWidth
                                >
                                    Create Restaurant
                                </Button>
                                
                            </div>
                            )
                        }
                        </div>
                    </form>

                
                    <table>
                                <thead>
                                    <tr>
                                        <th>Sr#</th>
                                        <th>Name</th>
                                        <th>Address</th>
                                        <th>Phone</th>
                                        <th>Opening Time</th>
                                        <th>Closing Time</th>
                                        <th>Delivery Charges</th>
                                        <th style={{minWidth:"81px"}}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        restaurants.map((restaurant,index)=>{
                                            const {id,name,address,phone,openingTime,closingTime,deliveryCharges} = restaurant;
                                            return(
                                                <RestaurantTable
                                                    id={id}
                                                    key={index}
                                                    sr={index+1}
                                                    name={name}
                                                    address={address}
                                                    phone={phone}
                                                    openingTime={openingTime}
                                                    closingTime={closingTime}
                                                    deliveryCharges={deliveryCharges}
                                                    editClickHandler={
                                                        async (id,name,address,phone,openingTime,closingTime,deliveryCharges)=>{
                                                            await this.setState({
                                                                dialogUpdateOpen:true,
                                                                editObject:{
                                                                    id,
                                                                    name,
                                                                    address,
                                                                    phone,
                                                                    openingTime,
                                                                    closingTime,
                                                                    deliveryCharges
                                                                }
                                                            })
                                                        }
                                                    }
                                                    removeClickHandler={
                                                        (removeID)=>{
                                                            this.setState({
                                                                dialogRemoveOpen:true,
                                                                removeID
                                                            })
                                                        }
                                                    }
                                                />
                                            );
                                        })
                                    }
                                </tbody>
                        </table>
                        
                        {
                            loadingTableProgress && (
                                <div className={styles.loadingtableprogress} >
                                    <CircularProgress size={70} />
                                </div>
                            )
                        }
                {
                    dialogUpdateOpen && (
                    <DialogUpdate 
                        dialogUpdateOpen={dialogUpdateOpen}
                        dialogUpdateClose={()=>this.setState({dialogUpdateOpen:false})}
                        editObject={editObject}
                        snackbarHandler={(message)=>this.snackbarHandler(message)}
                        errorDialogHandler={()=>this.errorDialogHandler}
                    />
                    )
                }

                {
                    dialogRemoveOpen && (
                        <DialogRemove
                            dialogRemoveOpen={dialogRemoveOpen}
                            dialogRemoveClose={()=>this.setState({dialogRemoveOpen:false})}
                            removeID={removeID}
                            snackbarHandler={(message)=>this.snackbarHandler(message)}
                            errorDialogHandler={()=>this.errorDialogHandler}
                        />
                    )
                }

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


export default Category;