import React, {Component} from 'react';
import firebase from '../firebase';
import uuidv4 from 'uuidv4';
import mime from 'mime-types';


import ErrorDialog from '../misc/errordialog/ErrorDialog';
import SnackBar from '../misc/snackbar/Snackbar';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

import FoodTable from './FoodTable';
import DialogUpdate from './DialogUpdate';
import DialogRemove from './DialogRemove';

import styles from './index.css';


let loadedFood=[];

class Food extends Component{

    state={
        name:'',
        price:'',
        deliveryCharges:'',
        restaurantID:'',
        restaurantRemoveID:'',
        food:[],
        restaurants:[],
        snackbar:false,
        errorDialog:false,
        errorMessage:'',
        imagefile:'',
        snackbarMessage:'',
        foodRef:firebase.database().ref('FOOD'),
        loadingTableProgress:false,
        loadingFormProgress:true,
        dialogUpdateOpen:false,
        dialogRemoveOpen:false,
        editObject:{},
        removeID:'',
        restaurantID:''
    }

    changeHandler = (e)=>{

        this.setState({
            [e.target.name]:e.target.value
        });

    }


    imageChangeHandler = (e)=>{
        this.setState({
            imagefile:e.target.files[0]
        })
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

        this.state.foodRef.on('child_added',snap=>{
            let requiredObject = snap.val();
            let restaurant = loadedRestaurants.find((restaurant)=>{
                return restaurant.id == requiredObject.restaurantID;
            });
            if(restaurant){
                loadedFood.push({...requiredObject,restaurantName:restaurant.name,restaurantID:restaurant.id});
            }
            
            this.setState({
                food:[...loadedFood],
                loadingTableProgress:false
            })
        });

        this.removeFoodListener();
        this.updateFoodListener();
    }

    removeFoodListener = ()=>{
        let loadedItem = {};

        this.state.foodRef.on('child_removed',snap=>{
            loadedItem = snap.val();
            this.setState((state)=>{
                let index = state.food.findIndex((el)=>{
                    return(
                        el.id==loadedItem.id
                    )
                });
                state.food.splice(index,1);
                loadedFood.splice(index,1);
                return{
                    loadingTableProgress:false
                }

            });
        })
    }

    updateFoodListener = ()=>{
        let loadedItem = {};
        this.state.foodRef.on('child_changed',snap=>{
            loadedItem=snap.val();
            let restaurant = this.state.restaurants.find((restaurant)=>{
                return restaurant.id===loadedItem.restaurantID; 
            });
            this.setState((state)=>{
                let index = state.food.findIndex((el)=>{
                    return(
                        el.id==loadedItem.id
                    )
                });
                state.food[index]={...loadedItem,restaurantName:restaurant.name,restaurantID:restaurant.id};
                loadedFood[index]={...loadedItem,restaurantName:restaurant.name,restaurantID:restaurant.id};
                return{
                    loadingTableProgress:false
                }

            });
        })
    }

    formSubmitHandler = (e)=>{

        e.preventDefault();

        const {name,price,deliveryCharges,restaurantID,imagefile} = this.state;
        this.setState({
            loadingFormProgress:true
        })
        const filepath = `images/food/${uuidv4()}.jpg`;
        const metadata = {contentType:mime.lookup(imagefile.name)};
    
        let task = firebase.storage().ref().child(filepath).put(imagefile,metadata);
        task
        .then(snapshot => snapshot.ref.getDownloadURL())
        .then(url => {
            const key = this.state.foodRef.push().key;
            this.state.foodRef
            .child(key)
            .set({
                id:key,
                name,
                price,
                deliveryCharges,
                restaurantID,
                count:0,
                restaurant:"null",
                imageURI:url,
            }).then(
                ()=>{
                    let valueObject;
                    firebase.database().ref("RESTAURANTS").child(restaurantID).once("value",(snap)=>{
                        valueObject = snap.val();
                    });
                    firebase.database().ref("RESTAURANTS").child(restaurantID).update({
                        ...(valueObject.foodItems ? {foodItems:[...valueObject.foodItems,key]}:{foodItems:[key]})
                    });
                    this.setState({
                        name:'',
                        price:'',
                        imagefile:'',
                        deliveryCharges:'',
                        restaurantID:'',
                        loadingFormProgress:false
                    });
                    this.snackbarHandler("Food was successfully added");
                }
            ).catch(
                (err)=>{
                    this.errorDialogHandler();
                }
            );

        });


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
        this.state.foodRef.off();
    }

    render(){
        const {
            name,
            price,
            deliveryCharges,
            restaurantID,
            restaurantRemoveID,
            food,
            restaurants,
            imagefile,
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
                <h2 className={styles.hstyle}>Manage the food:</h2>
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
                                    onChange={this.changeHandler}
                                    fullWidth
                            />

                            <TextField 
                                    label="Price"
                                    variant="outlined"
                                    name="price"
                                    type="number"
                                    value={price}
                                    onChange={this.changeHandler}
                                    fullWidth
                            />

                            <TextField 
                                    label="Delivery Charges"
                                    variant="outlined"
                                    name="deliveryCharges"
                                    type="number"
                                    value={deliveryCharges}
                                    onChange={this.changeHandler}
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

                                <label htmlFor="imagefile" >Choose an image</label>
                                <input 
                                    type="file" 
                                    name="imagefile"
                                    onChange={this.imageChangeHandler}
                                    accept="image/*" 
                                />


                                    <Button 
                                        variant="contained"
                                        type="submit"
                                        size="large"
                                        fullWidth
                                        disabled={!imagefile?true:false}
                                    >
                                        Create Food
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
                                        <th>Price</th>
                                        <th>Restaurant</th>
                                        <th>Delivery Charges</th>
                                        <th>Image</th>
                                        <th style={{minWidth:"81px"}}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        food.map((offer,index)=>{
                                            const {id,name,price,deliveryCharges,restaurantName,restaurantID,imageURI} = offer;
                                            return(
                                                <FoodTable
                                                    id={id}
                                                    key={index}
                                                    sr={index+1}
                                                    name={name}
                                                    price={price}
                                                    deliveryCharges={deliveryCharges}
                                                    restaurant={restaurantName}
                                                    restaurantID={restaurantID}
                                                    image={imageURI}
                                                    editClickHandler={
                                                        async (id,name,price,deliveryCharges,restaurantID,image)=>{
                                                            await this.setState({
                                                                dialogUpdateOpen:true,
                                                                editObject:{
                                                                    id,
                                                                    name,
                                                                    price,
                                                                    deliveryCharges,
                                                                    restaurantID,
                                                                    image,
                                                                }
                                                            })
                                                        }
                                                    }
                                                    removeClickHandler={
                                                        (removeID,restaurantID)=>{
                                                            this.setState({
                                                                dialogRemoveOpen:true,
                                                                removeID,
                                                                restaurantRemoveID:restaurantID
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
                        restaurants={[...restaurants]}
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
                            restaurantID={restaurantRemoveID}
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


export default Food;