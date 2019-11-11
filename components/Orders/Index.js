import React, {Component} from 'react';
import firebase from '../firebase';

import Pending from './Pending/Index';
import Ongoing from './Ongoing/Index';
import Completed from './Completed/Index';

import ErrorDialog from '../misc/errordialog/ErrorDialog';
import SnackBar from '../misc/snackbar/Snackbar';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';


import styles from './index.css';

let loadedPendingOrders = [], loadedOngoingOrders=[], loadedCompletedOrders = [], loadedRiders=[];

class Food extends Component{

    state={
        pendingOrders:[],
        ongoingOrders:[],
        completedOrders:[],
        ridersRef:firebase.database().ref("RIDERS"),
        riders:[],
        snackbar:false,
        errorDialog:false,
        errorMessage:'',
        snackbarMessage:'',
        ordersRef:firebase.database().ref('ORDERS'),
        orders:[],
        value:0
    }

    componentDidMount(){
        this.state.ordersRef.on('child_added',(snap)=>{
            let checkStatus = snap.val().status;
            switch(checkStatus){
                case "PENDING":
                    loadedPendingOrders.push(snap.val());
                    break;

                case "ONGOIND":
                    loadedOngoingOrders.push(snap.val());
                    break;

                case "COMPLETED":
                    loadedCompletedOrders.push(snap.val());
                    break;
            }
            this.setState({
                pendingOrders:[...loadedPendingOrders],
                ongoingOrders:[...loadedOngoingOrders],
                completedOrders:[...loadedCompletedOrders]
            })
        });

        this.state.ridersRef.once("value",(snap)=>{
            loadedRiders.push(snap.val());
            this.setState({
                riders:[...loadedRiders]
            })
        })
    }

    changeHandler = (e)=>{

        this.setState({
            [e.target.name]:e.target.value
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

    handleChange = (event, newValue) => {

        this.setState({
            value:newValue
        });

    }

    render(){
        const {
            pendingOrders,
            ongoingOrders,
            completedOrders,
            riders,
            snackbar,
            errorDialog,
            errorMessage,
            snackbarMessage,
            value
        } = this.state;
        
        return(
            <div className="maincover responsivepadding">
                <h2 className={styles.hstyle}>Manage Orders:</h2>

                <div>
                    <AppBar position="static">
                        <Tabs 
                            value={value} 
                            onChange={this.handleChange} 
                            aria-label="simple tabs example"
                            variant="fullWidth"    
                            centered
                        >
                        <Tab label="PENDING" />
                        <Tab label="ONGOING" />
                        <Tab label="COMPLETED" />
                        </Tabs>
                    </AppBar>

                    {
                        value===0 && (
                            <Pending pendingOrders={pendingOrders} />
                        )
                    }
                    
                    {
                        value===1 && (
                            <Ongoing ongoingOrders={ongoingOrders} riders={riders} />
                        )
                    }

                    {
                        value===2 && (
                            <Completed completedOrders={completedOrders} riders={riders} />
                        )
                    }

                </div>

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