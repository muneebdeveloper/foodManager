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

import OffersTable from './OffersTable';
import DialogUpdate from './DialogUpdate';
import DialogRemove from './DialogRemove';

import styles from './index.css';


class Offers extends Component{

    state={
        name:'',
        restaurantID:'',
        originalPrice:'',
        discountedPrice:'',
        offers:[],
        restaurants:[],
        snackbar:false,
        errorDialog:false,
        errorMessage:'',
        imagefile:'',
        snackbarMessage:'',
        offersRef:firebase.database().ref('OFFERS'),
        loadingTableProgress:false,
        loadingFormProgress:true,
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


    imageChangeHandler = (e)=>{
        this.setState({
            imagefile:e.target.files[0]
        })
    }


    componentDidMount(){

        let loadedOffers=[];
        let loadedRestaurants = [];

        firebase.database().ref("RESTAURANTS").on('child_added',snap=>{

            loadedRestaurants.push(snap.val());

            this.setState({
                restaurants:[...loadedRestaurants],
                loadingFormProgress:false
            });

        });

        this.state.offersRef.on('child_added',snap=>{
            let requiredObject = snap.val();
            let restaurant = loadedRestaurants.find((restaurant)=>{
                return restaurant.id == requiredObject.restaurant;
            });
            if(restaurant){
                loadedOffers.push({...requiredObject,restaurantName:restaurant.name,restaurantID:restaurant.id});
            }
            this.setState({
                offers:[...loadedOffers],
                loadingTableProgress:false
            })
        });

        this.removeOffersListener(loadedOffers);
        this.updateOffersListener(loadedOffers);
    }

    removeOffersListener = (loadedOffers)=>{
        let loadedItem = {};

        this.state.offersRef.on('child_removed',snap=>{
            loadedItem = snap.val();
            this.setState((state)=>{
                let index = state.offers.findIndex((el)=>{
                    return(
                        el.id==loadedItem.id
                    )
                });
                state.offers.splice(index,1);
                loadedOffers.splice(index,1);
                return{
                    loadingTableProgress:false
                }

            });
        })
    }

    updateOffersListener = (loadedOffers)=>{
        let loadedItem = {};
        this.state.offersRef.on('child_changed',snap=>{
            loadedItem=snap.val();
            let restaurant = this.state.restaurants.find((restaurant)=>{
                return restaurant.id===loadedItem.restaurant; 
            });
            this.setState((state)=>{
                let index = state.offers.findIndex((el)=>{
                    return(
                        el.id==loadedItem.id
                    )
                });
                state.offers[index]={...loadedItem,restaurantName:restaurant.name,restaurantID:restaurant.id};
                loadedOffers[index]={...loadedItem,restaurantName:restaurant.name,restaurantID:restaurant.id};
                return{
                    loadingTableProgress:false
                }

            });
        })
    }

    formSubmitHandler = (e)=>{

        e.preventDefault();

        const {name,restaurantID,originalPrice,discountedPrice,imagefile} = this.state;
        this.setState({
            loadingFormProgress:true
        })
        const filepath = `images/offers/${uuidv4()}.jpg`;
        const metadata = {contentType:mime.lookup(imagefile.name)};
    
        let task = firebase.storage().ref().child(filepath).put(imagefile,metadata);
        task
        .then(snapshot => snapshot.ref.getDownloadURL())
        .then(url => {
            const key = this.state.offersRef.push().key;
            this.state.offersRef
            .child(key)
            .set({
                id:key,
                name,
                restaurant:restaurantID,
                originalPrice:Number(originalPrice),
                discountedPrice:Number(discountedPrice),
                imageURI:url,
            }).then(
                ()=>{
                    this.setState({
                        name:'',
                        originalPrice:'',
                        discountedPrice:'',
                        imagefile:'',
                        restaurantID:'',
                        restaurantName:'',
                        loadingFormProgress:false
                    });
                    this.snackbarHandler("Offer was successfully added");
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
        this.state.offersRef.off();
    }

    render(){
        const {
            name,
            originalPrice,
            discountedPrice,
            restaurantID,
            offers,
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
                <h2 className={styles.hstyle}>Manage the Offers:</h2>
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

                                <TextField 
                                    label="Original Price"
                                    variant="outlined"
                                    name="originalPrice"
                                    type="number"
                                    value={originalPrice}
                                    onChange={this.changeHandler}
                                    fullWidth
                                />

                                <TextField 
                                    label="Discounted Price"
                                    variant="outlined"
                                    name="discountedPrice"
                                    type="number"
                                    value={discountedPrice}
                                    onChange={this.changeHandler}
                                    fullWidth
                                />

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
                                        Create Offer
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
                                        <th>Original Price</th>
                                        <th>Discounted Price</th>
                                        <th>Restaurant</th>
                                        <th>Image</th>
                                        <th style={{minWidth:"81px"}}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        offers.map((offer,index)=>{
                                            const {id,name,originalPrice,discountedPrice,restaurantName,restaurantID,imageURI} = offer;
                                            return(
                                                <OffersTable
                                                    id={id}
                                                    key={index}
                                                    sr={index+1}
                                                    name={name}
                                                    originalPrice={originalPrice}
                                                    discountedPrice={discountedPrice}
                                                    restaurant={restaurantName}
                                                    restaurantID={restaurantID}
                                                    image={imageURI}
                                                    editClickHandler={
                                                        async (id,name,discountedPrice,originalPrice,restaurantID,image)=>{
                                                            await this.setState({
                                                                dialogUpdateOpen:true,
                                                                editObject:{
                                                                    id,
                                                                    name,
                                                                    discountedPrice,
                                                                    originalPrice,
                                                                    restaurantID,
                                                                    image,
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


export default Offers;