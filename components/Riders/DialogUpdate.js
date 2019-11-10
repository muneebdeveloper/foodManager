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

import Cancel from '@material-ui/icons/Cancel';

import styles from './index.css';


class DialogUpdate extends Component{

    state={
        name:this.props.editObject.name,
        phone:this.props.editObject.phone,
        ridersRef:firebase.database().ref('RIDERS'),
        imagesrc:this.props.editObject.image,
        loading:false,
        food:''
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
        const filepath = `images/riders/${uuidv4()}.jpg`;
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
        const {name,phone,imagesrc} = this.state;
        this.state.ridersRef
            .child(this.props.editObject.id)
            .update({
                name,
                phone,
                imageURI:imagesrc,
            })
            .then(()=>{
                this.props.snackbarHandler("Rider was updated successfully");
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
            phone,
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
                <h2 className={styles.edithstyle}>Edit Deal</h2>
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