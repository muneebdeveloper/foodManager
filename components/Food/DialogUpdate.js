import React,{Component} from 'react';
import firebase from '../firebase';
import uuidv4 from 'uuidv4';
import mime from 'mime-types';

import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import CircularProgress from '@material-ui/core/CircularProgress';

import Cancel from '@material-ui/icons/Cancel';


import styles from './index.css';


class DialogUpdate extends Component{

    state={
        name:this.props.editObject.name,
        price:this.props.editObject.price,
        deliveryCharges:this.props.editObject.deliveryCharges,
        restaurantID:this.props.editObject.restaurantID,
        previousRestaurant:this.props.editObject.restaurantID,
        foodRef:firebase.database().ref('FOOD'),
        imagesrc:this.props.editObject.image,
        loading:false
    }

    changeHandler = (e)=>{

        this.setState({
            [e.target.name]:e.target.value
        });

    }



    imageChangeHandler = (e)=>{
        this.setState({
            loading:true
        });
        let imagefile=e.target.files[0];
        const filepath = `images/food/${uuidv4()}.jpg`;
        const metadata = {contentType:mime.lookup(imagefile.name)};
        let task = firebase.storage().ref().child(filepath).put(imagefile,metadata);
        task
        .then(snapshot => snapshot.ref.getDownloadURL())
        .then(url=>{
            this.setState({
                imagesrc:url,
                loading:false
            })
        })
    }

    formSubmitHandler = (e)=>{
        e.preventDefault();
        const {name,price,deliveryCharges,restaurantID,previousRestaurant,imagesrc} = this.state;
        this.state.foodRef
            .child(this.props.editObject.id)
            .update({
                name,
                price,
                deliveryCharges,
                restaurantID,
                imageURI:imagesrc
            })
            .then(()=>{
                let valueObject;
                firebase.database().ref("RESTAURANTS").child(restaurantID).once("value",(snap)=>{
                    valueObject = snap.val();
                });
                
                firebase.database().ref("RESTAURANTS").child(restaurantID).update({
                    ...(valueObject.foodItems ? {foodItems:[...valueObject.foodItems,this.props.editObject.id]}:{foodItems:[this.props.editObject.id]})
                });

                firebase.database().ref("RESTAURANTS").child(previousRestaurant).once("value",(snap)=>{
                    valueObject = snap.val().foodItems;
                });
                
                let foundIndex = valueObject.findIndex((el)=>el==this.props.editObject.id);
                valueObject.splice(foundIndex,1);
                firebase.database().ref("RESTAURANTS").child(previousRestaurant).update({
                    foodItems:[...valueObject]
                });
                this.props.snackbarHandler("Food was updated successfully");
                this.props.dialogUpdateClose();
            })
            .catch(
                (err)=>{
                    this.props.errorDialogHandler();
                    this.props.dialogUpdateClose();
                }
                )
        }
    

    render(){

        const {
            dialogUpdateOpen,
            dialogUpdateClose,
            restaurants
        } = this.props;

        const {
            name,
            price,
            deliveryCharges,
            restaurantID,
            loading,
            imagesrc
        } = this.state;

        return(
            <Dialog open={dialogUpdateOpen} onClose={dialogUpdateClose}>

            {
                loading ? (
                    <div className="dialogLoadingStyle">
                        <CircularProgress size={70} />
                    </div>
                ):(
                    <>
<div className="dialogTitleStyle">
                <h2 className={styles.edithstyle}>Edit Offer</h2>
                <IconButton onClick={dialogUpdateClose}>
                        <Cancel className={styles.delete} />
                </IconButton>
            </div>

            <DialogContent>

                <form className={styles.editDialogMargin} onSubmit={this.formSubmitHandler}>
                    

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
                                    type="text"
                                    value={price}
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
                                    label="Delivery Charges"
                                    variant="outlined"
                                    name="deliveryCharges"
                                    type="number"
                                    value={deliveryCharges}
                                    onChange={this.changeHandler}
                                    fullWidth
                />

                    <img
                        src={imagesrc}
                        style={{width:"100%",objectFit:"cover"}}
                    />

                    <label htmlFor="imagefile" >Choose a new image</label>
                                <input 
                                    type="file" 
                                    name="imagefile"
                                    onChange={this.imageChangeHandler}
                                    accept="image/*" 
                                />

                    <Button 
                        type="submit"
                        variant="contained"
                        size="large"
                        fullWidth
                    >
                        Save Changes
                    </Button>

                </form>

            </DialogContent>
</>
                )
            }

            
            </Dialog>
        )
    }
}



export default DialogUpdate;