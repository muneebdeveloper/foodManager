import React,{Component} from 'react';
import firebase from '../firebase';
import uuidv4 from 'uuidv4';
import mime from 'mime-types';

import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import Chip from '@material-ui/core/Chip';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import CircularProgress from '@material-ui/core/CircularProgress';

import Cancel from '@material-ui/icons/Cancel';

import styles from './index.css';


class DialogUpdate extends Component{

    state={
        name:this.props.editObject.name,
        price:this.props.editObject.price,
        description:this.props.editObject.description,
        deliveryCharges:this.props.editObject.deliveryCharges,
        tags:[...this.props.editObject.tags],
        shoppingRef:firebase.database().ref('SHOPPING'),
        imagesrc:this.props.editObject.image,
        loading:false,
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
        const filepath = `images/shopping/${uuidv4()}.jpg`;
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
        const {name, price, description, deliveryCharges, tags ,imagesrc} = this.state;
        this.state.shoppingRef
            .child(this.props.editObject.id)
            .update({
                name,
                price,
                description,
                deliveryCharges,
                imageURI:imagesrc,
                tags:[...tags]
            })
            .then(()=>{
                this.props.snackbarHandler("Shopping Item was updated successfully");
                this.props.dialogUpdateClose();
            })
            .catch(
                (err)=>{
                    this.props.errorDialogHandler();
                    this.props.dialogUpdateClose();
                }
                )
        }
        
        autocompleteHandler = (e,value)=>{
            this.setState({
                tags:[...value]
            })
        }

    render(){

        const {
            dialogUpdateOpen,
            dialogUpdateClose,
            tagsList
        } = this.props;

        const {
            name,
            price,
            description,
            deliveryCharges,
            tags,
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
                                    label="Price"
                                    variant="outlined"
                                    name="price"
                                    type="number"
                                    value={price}
                                    required
                                    onChange={this.changeHandler}
                                    fullWidth
                                />
                                
                                <TextField 
                                    label="Description"
                                    variant="outlined"
                                    name="description"
                                    type="text"
                                    value={description}
                                    required
                                    onChange={this.changeHandler}
                                    fullWidth
                                />

                                <TextField 
                                    label="Delivery Charges"
                                    variant="outlined"
                                    name="deliveryCharges"
                                    type="number"
                                    value={deliveryCharges}
                                    required
                                    onChange={this.changeHandler}
                                    fullWidth
                                />

                        <div style={{width:"100%"}}>
                                    <Autocomplete
                                        multiple
                                        options={tagsList}
                                        value={tags}
                                        onChange={this.autocompleteHandler}
                                        getOptionLabel={option => option.name}
                                        renderInput={params => (
                                            <TextField
                                                {...params}
                                                variant="standard"
                                                label="Choose Tags"
                                                placeholder="Choose Tags"
                                                fullWidth
                                            />
                                            )}
                                    />
                                </div>

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