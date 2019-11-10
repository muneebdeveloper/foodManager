import React from 'react';
import firebase from '../firebase';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';

import styles from './index.css';

const DialogRemove = (props)=>{

    const {
        dialogRemoveOpen,
        dialogRemoveClose,
        removeID,
        restaurantID
    } = props;

   const itemRemoveHandler = (id)=>{
        firebase.database().ref('FOOD')
            .child(id)
            .remove()
            .then(()=>{
                    props.snackbarHandler("Food was successfully removed");
                    props.dialogRemoveClose();
                })
            .catch((err)=>props.errorDialogHandler());
            let valueObject;
            firebase.database().ref("RESTAURANTS").child(restaurantID).once("value",(snap)=>{
                valueObject = snap.val().foodItems;
            });
            let foundIndex = valueObject.findIndex((el)=>el==id);
            valueObject.splice(foundIndex,1);
            firebase.database().ref("RESTAURANTS").child(restaurantID).update({
                foodItems:[...valueObject]
            });
    }

    return(
        <Dialog open={dialogRemoveOpen} onClose={()=>dialogRemoveClose()} >

            <div style={{padding:"16px 24px"}}>
                <h2 className={styles.edithstyle}>Are you sure, you want to remove this food?</h2>
            </div>

            <DialogActions>
                <Button 
                    variant="contained"
                    size="large"
                    onClick={()=>dialogRemoveClose()}
                    className={styles.deleteButton}
                >
                    Cancel
                </Button>

                <Button 
                    variant="contained"
                    size="large"
                    onClick={()=>itemRemoveHandler(removeID,restaurantID)}
                >
                    yes
                </Button>

                </DialogActions>

                              
        </Dialog>
    );
}


export default DialogRemove;