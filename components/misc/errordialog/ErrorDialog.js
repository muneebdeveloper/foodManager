import React,{Component} from 'react';

import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";




const ErrorDialog = (props)=>{

    const {dialogValue,dialogClose} = props;

return(
            <Dialog open={dialogValue} onClose={dialogClose}>
                <DialogTitle>Error</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {props.children}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button 
                        variant="contained"
                        onClick={dialogClose}
                    >Ok</Button>
                </DialogActions>
            </Dialog>
        )
}

export default ErrorDialog;