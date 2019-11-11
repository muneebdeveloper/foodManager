import React,{Component} from 'react';
import firebase from '../firebase';

import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardTimePicker,
  } from '@material-ui/pickers';

import Cancel from '@material-ui/icons/Cancel';


import styles from './index.css';

const convertTime12to24 = (time12h) => {
    const [time, modifier] = time12h.split(' ');
  
    let [hours, minutes] = time.split(':');
  
    if (hours === '12') {
      hours = '00';
    }
  
    if (modifier === 'PM') {
      hours = parseInt(hours, 10) + 12;
    }
    if(hours<10){
        return `0${hours}:${minutes}`
    }
    return `${hours}:${minutes}`;
  }

class DialogUpdate extends Component{

    state={
        name:this.props.editObject.name,
        address:this.props.editObject.address,
        phone:this.props.editObject.phone,
        openingTime:new Date(`2014-08-18T${convertTime12to24(this.props.editObject.openingTime)}`),
        closingTime:new Date(`2014-08-18T${convertTime12to24(this.props.editObject.closingTime)}`),
        deliveryCharges:this.props.editObject.deliveryCharges,
        restaurantRef:firebase.database().ref('RESTAURANTS')
    }

    changeHandler = (e)=>{

        this.setState({
            [e.target.name]:e.target.value
        });

    }
    handleDateChange = (date,name) => {
        this.setState({
            [name]:date
        })
      };
    formSubmitHandler = (e)=>{
        e.preventDefault();
        const {name,address,phone,openingTime,closingTime,deliveryCharges} = this.state;
        this.state.restaurantRef
            .child(this.props.editObject.id)
            .update({
                name,
                address,
                phone,
                openingTime:openingTime.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true, minute: 'numeric' }),
                closingTime:closingTime.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true, minute: 'numeric' }),
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
            phone,
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