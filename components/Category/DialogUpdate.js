import React,{Component} from 'react';
import firebase from '../firebase';

import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

import Cancel from '@material-ui/icons/Cancel';


import styles from './index.css';


class DialogUpdate extends Component{

    state={
        categoryname:this.props.editObject.name,
        categoryRef:firebase.database().ref('CATEGORIES')
    }

    changeHandler = (e)=>{

        this.setState({
            [e.target.name]:e.target.value
        });

    }

    formSubmitHandler = (e)=>{
        e.preventDefault();
        const {categoryname} = this.state;
        this.state.categoryRef
            .child(this.props.editObject.id)
            .update({
                name:categoryname
            })
            .then(()=>{
                this.props.snackbarHandler("Item was updated successfully");
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
            editObject
        } = this.props;

        const {
            categoryname,
        } = this.state;

        return(
            <Dialog open={dialogUpdateOpen} onClose={dialogUpdateClose}>

            <div className="dialogTitleStyle">
                <h2 className={styles.edithstyle}>Edit Category</h2>
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
                        name="categoryname"
                        value={categoryname}
                        autoFocus
                        onChange={this.changeHandler}
                        fullWidth
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