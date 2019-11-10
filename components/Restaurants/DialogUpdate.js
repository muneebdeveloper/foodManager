import React,{Component} from 'react';
import firebase from '../firebase';

import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';

import Cancel from '@material-ui/icons/Cancel';


import styles from './index.css';


class DialogUpdate extends Component{

    state={
        name:this.props.editObject.name,
        address:this.props.editObject.address,
        openingTime:this.props.editObject.openingTime,
        closingTime:this.props.editObject.closingTime,
        deliveryCharges:this.props.editObject.deliveryCharges,
        restaurantRef:firebase.database().ref('RESTAURANTS')
    }

    changeHandler = (e)=>{

        this.setState({
            [e.target.name]:e.target.value
        });

    }

    formSubmitHandler = (e)=>{
        e.preventDefault();
        const {name,address,openingTime,closingTime,deliveryCharges} = this.state;
        this.state.restaurantRef
            .child(this.props.editObject.id)
            .update({
                name,
                address,
                openingTime,
                closingTime,
                deliveryCharges
            })
            .then(()=>{
                this.props.snackbarHandler("Restaurant was updated successfully");
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
        } = this.props;

        const {
            name,
            address,
            closingTime,
            openingTime,
            deliveryCharges
        } = this.state;

        return(
            <Dialog open={dialogUpdateOpen} onClose={dialogUpdateClose}>

            <div className="dialogTitleStyle">
                <h2 className={styles.edithstyle}>Edit Restaurant</h2>
                <IconButton onClick={dialogUpdateClose}>
                        <Cancel className={styles.delete} />
                </IconButton>
            </div>

            {/* <div className="dialogLoadingStyle">
                <CircularProgress size={70} />
            </div> */}
        
            <DialogContent>

                <form className={styles.editDialogMargin} onSubmit={this.formSubmitHandler}>
                    
                    <TextField
                        label="Name"
                        variant="outlined"
                        type="text"
                        name="name"
                        value={name}
                        autoFocus
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
                                    label="Opening Time"
                                    type="text"
                                    variant="outlined"
                                    name="openingTime"
                                    value={openingTime}
                                    onChange={this.changeHandler}
                                    required
                    />

                                <TextField
                                    label="Closing Time"
                                    type="text"
                                    variant="outlined"
                                    fullWidth
                                    name="closingTime"
                                    value={closingTime}
                                    onChange={this.changeHandler}
                                    required
                                />

                                <TextField
                                    label="Delivery Charges"
                                    type="number"
                                    fullWidth
                                    name="deliveryCharges"
                                    value={deliveryCharges}
                                    onChange={this.changeHandler}
                                    variant="outlined"
                                    required
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

            </Dialog>
        )
    }
}



export default DialogUpdate;