import React,{Component} from 'react';
import firebase from '../firebase';
import uuidv4 from 'uuidv4';
import mime from 'mime-types';

import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
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
        foodData:[...this.props.editObject.foodItems],
        dealsRef:firebase.database().ref('DEALS'),
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
        const {name,price,foodData,imagesrc} = this.state;
        this.state.dealsRef
            .child(this.props.editObject.id)
            .update({
                name,
                price,
                imageURI:imagesrc,
                foodItems:[...foodData]
            })
            .then(()=>{
                this.props.snackbarHandler("Deal was updated successfully");
                this.props.dialogUpdateClose();
            })
            .catch(
                (err)=>{
                    this.props.errorDialogHandler();
                    this.props.dialogUpdateClose();
                }
                )
        }

        foodAddHandler = ()=>{
            this.setState((state)=>{
                return({
                        foodData:[...state.foodData,state.food],
                        food:''
                    })
            })
        }

        chipDeleteHandler = (food)=>{

            let foundIndex = this.state.foodData.findIndex((item)=>{
                   return item===food;
            });
            this.setState((state)=>{
                state.foodData.splice(foundIndex,1);
                return{};
            })
        }
    
    

    render(){

        const {
            dialogUpdateOpen,
            dialogUpdateClose,
        } = this.props;

        const {
            name,
            price,
            foodData,
            food,
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

                    <div className={styles.chipdiv}>
                        <TextField 
                                        label="Enter Food for deal"
                                        variant="outlined"
                                        name="food"
                                        type="text"
                                        value={food}
                                        onChange={this.changeHandler}
                                        className={styles.chipinput}
                        />
                        <Button
                                    variant="contained"
                                    onClick={this.foodAddHandler}
                                    disabled={!food?true:false}
                        >
                                    Add Food
                        </Button>
                    </div>
                            <div>
                                {
                                    foodData.map((food,index)=>{
                                        return(
                                        <Chip
                                            key={index}
                                            label={food}
                                            onDelete={()=>this.chipDeleteHandler(food)}
                                        />
                                        )
                                    })
                                }
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