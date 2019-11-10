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
        tagname:this.props.editObject.name,
        tagsRef:firebase.database().ref('TAGS')
    }

    changeHandler = (e)=>{

        this.setState({
            [e.target.name]:e.target.value
        });

    }

    formSubmitHandler = (e)=>{
        e.preventDefault();
        const {tagname} = this.state;
        this.state.tagsRef
            .child(this.props.editObject.id)
            .update({
                name:tagname
            })
            .then(()=>{
                this.props.snackbarHandler("Tag was updated successfully");
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
            tagname,
        } = this.state;

        return(
            <Dialog open={dialogUpdateOpen} onClose={dialogUpdateClose}>

            <div className="dialogTitleStyle">
                <h2 className={styles.edithstyle}>Edit a Tag</h2>
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
                        name="tagname"
                        value={tagname}
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