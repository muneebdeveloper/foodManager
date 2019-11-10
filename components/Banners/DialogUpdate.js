import React,{Component} from 'react';
import firebase from '../firebase';
import uuidv4 from 'uuidv4';
import mime from 'mime-types';

import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import CircularProgress from '@material-ui/core/CircularProgress';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

import Cancel from '@material-ui/icons/Cancel';


import styles from './index.css';


class DialogUpdate extends Component{

    state={
        clickable:this.props.editObject.clickable,
        targetURL:this.props.editObject.targetURL, 
        bannersRef:firebase.database().ref('BANNERS'),
        imagesrc:this.props.editObject.image,
        loading:false
    }

    changeHandler = (e)=>{

        this.setState({
            [e.target.name]:e.target.value
        });

    }

    checkboxChangeHandler = (e)=>{
        this.setState({
            clickable:e.target.checked,
            ...(!e.target.checked && {targetURL:''})
        })
    }

    imageChangeHandler = (e)=>{
        this.setState({
            loading:true
        });
        let imagefile=e.target.files[0];
        const filepath = `images/deals/${uuidv4()}.jpg`;
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
        const {clickable,targetURL,imagesrc} = this.state;
        this.state.bannersRef
            .child(this.props.editObject.id)
            .update({
                clickable,
                targetURL,
                imageURI:imagesrc
            })
            .then(()=>{
                this.props.snackbarHandler("Banner was updated successfully");
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
            clickable,
            targetURL,
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
                <h2 className={styles.edithstyle}>Edit Banner</h2>
                <IconButton onClick={dialogUpdateClose}>
                        <Cancel className={styles.delete} />
                </IconButton>
            </div>

            <DialogContent>

                <form className={styles.editDialogMargin} onSubmit={this.formSubmitHandler}>
                    
                    <div style={{width:"100%"}}>
                        <FormControlLabel
                        control={
                                        <Checkbox
                                            checked={clickable}
                                            onChange={this.checkboxChangeHandler}
                                            color="primary"
                                        />
                                        }
                                        label="Clickable"
                        />
                    </div>

                   <TextField 
                                    label="Target URL"
                                    variant="outlined"
                                    name="targetURL"
                                    type="text"
                                    value={targetURL}
                                    onChange={this.changeHandler}
                                    autoFocus
                                    disabled={!clickable ? true : false}
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