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
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

import Cancel from '@material-ui/icons/Cancel';


import styles from './index.css';


class DialogUpdate extends Component{

    state={
        foodname:this.props.editObject.name,
        foodprice:this.props.editObject.price,
        categoryname:this.props.editObject.category,
        categories:[...this.props.categories],
        foodRef:firebase.database().ref('ITEMS'),
        imagesrc:this.props.editObject.image,
        loading:false
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
        const filepath = `images/foods/${uuidv4()}.jpg`;
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
        const {foodname,foodprice,categoryname,imagesrc} = this.state;
        this.state.foodRef
            .child(this.props.editObject.id)
            .update({
                name:foodname,
                price:foodprice,
                category:categoryname,
                imageURI:imagesrc
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
            foodname,
            foodprice,
            categoryname,
            categories,
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
                <h2 className={styles.edithstyle}>Edit Food</h2>
                <IconButton onClick={dialogUpdateClose}>
                        <Cancel className={styles.delete} />
                </IconButton>
            </div>

            <DialogContent>

                <form className={styles.editDialogMargin} onSubmit={this.formSubmitHandler}>
                    
                    <TextField
                        label="Name"
                        variant="outlined"
                        type="text"
                        name="foodname"
                        value={foodname}
                        autoFocus
                        onChange={this.changeHandler}
                        fullWidth
                    />

                    <TextField
                        label="Price"
                        variant="outlined"
                        type="number"
                        name="foodprice"
                        value={foodprice}
                        onChange={this.changeHandler}
                        required
                        fullWidth
                    />

                    <FormControl fullWidth  required>
                        <InputLabel>Select Category</InputLabel>
                        <Select
                            name="categoryname"
                            value={categoryname}
                            onChange={this.changeHandler}
                        >
                            {   
                                categories.map((category,index)=>{
                                    const {id,name} = category;
                                    return(
                                        <MenuItem key={index} value={name}>{name}</MenuItem>
                                        )
                                    })
                            }
                        </Select>
                    </FormControl>

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