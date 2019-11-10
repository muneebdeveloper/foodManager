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
        removeID
    } = props;


   const itemRemoveHandler = (id)=>{
        firebase.database().ref('ITEMS')
            .child(id)
            .remove()
            .then(()=>{
                    props.snackbarHandler("Item was successfully removed");
                    props.dialogRemoveClose();
                })
            .catch((err)=>props.errorDialogHandler())
    }

    return(
        <Dialog open={dialogRemoveOpen} onClose={()=>dialogRemoveClose()} >

            <div style={{padding:"16px 24px"}}>
                <h2 className={styles.edithstyle}>Are you sure, you want to remove this stock item?</h2>
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
                    onClick={()=>itemRemoveHandler(removeID)}
                >
                    yes
                </Button>

                </DialogActions>

                              
        </Dialog>
    );
}


export default DialogRemove;