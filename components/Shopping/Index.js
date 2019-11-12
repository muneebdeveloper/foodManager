import React, {Component} from 'react';
import firebase from '../firebase';
import uuidv4 from 'uuidv4';
import mime from 'mime-types';

import Autocomplete from '@material-ui/lab/Autocomplete';
import ErrorDialog from '../misc/errordialog/ErrorDialog';
import SnackBar from '../misc/snackbar/Snackbar';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import ShoppingTable from './ShoppingTable';
import DialogUpdate from './DialogUpdate';
import DialogRemove from './DialogRemove';

import styles from './index.css';


class Shopping extends Component{

    state={
        name:'',
        price:'',
        description:'',
        deliveryCharges:'',
        tags:[],
        tagsList:[],
        shoppingItems:[],
        snackbar:false,
        errorDialog:false,
        errorMessage:'',
        snackbarMessage:'',
        shoppingRef:firebase.database().ref('SHOPPING'),
        loadingTableProgress:false,
        loadingFormProgress:true,
        dialogUpdateOpen:false,
        dialogRemoveOpen:false,
        editObject:{},
        removeID:''
    }

    changeHandler = (e)=>{

        this.setState({
            [e.target.name]:e.target.value
        });

    }

    componentDidMount(){
        let loadedShopping=[];
        let loadedTags = [];
        firebase.database().ref('TAGS').on('child_added',snap=>{
            loadedTags.push(snap.val());
            this.setState({
                tagsList:[...loadedTags],
                loadingFormProgress:false
            })
        });

        this.state.shoppingRef.on('child_added',snap=>{
            loadedShopping.push(snap.val());
            this.setState({
                shoppingItems:[...loadedShopping],
                loadingFormProgress:false
            })
        });
        
        this.removeShoppingListener(loadedShopping);
        this.updateShoppingListener(loadedShopping);
    }

    removeShoppingListener = (loadedShopping)=>{
        let loadedItem = {};

        this.state.shoppingRef.on('child_removed',snap=>{
            loadedItem = snap.val();
            this.setState((state)=>{
                let index = state.shoppingItems.findIndex((el)=>{
                    return(
                        el.id==loadedItem.id
                    )
                });
                state.shoppingItems.splice(index,1);
                loadedShopping.splice(index,1);
                return{
                    loadingTableProgress:false,
                }

            });
        })
    }

    updateShoppingListener = (loadedShopping)=>{
        let loadedItem = {};
        this.state.shoppingRef.on('child_changed',snap=>{
            loadedItem=snap.val();
            this.setState((state)=>{
                let index = state.shoppingItems.findIndex((el)=>{
                    return(
                        el.id==loadedItem.id
                    )
                });
                state.shoppingItems[index]={...loadedItem};
                loadedShopping[index]={...loadedItem};
                return{
                    loadingTableProgress:false
                }

            });
        })
    }

    formSubmitHandler = (e)=>{

        e.preventDefault();

        const {name,price,description,deliveryCharges,tags,imagefile} = this.state;
        this.setState({
            loadingFormProgress:true
        })
        const filepath = `images/shopping/${uuidv4()}.jpg`;
        const metadata = {contentType:mime.lookup(imagefile.name)};
        let task = firebase.storage().ref().child(filepath).put(imagefile,metadata);
        task
        .then(snapshot => snapshot.ref.getDownloadURL())
        .then(url => {
            const key = this.state.shoppingRef.push().key;
            this.state.shoppingRef
            .child(key)
            .set({
                id:key,
                name,
                price:Number(price),
                description,
                deliveryCharges:Number(deliveryCharges),
                imageURI:url,
                tags:[...tags]
            }).then(
                ()=>{
                    this.setState({
                        name:'',
                        price:'',
                        description:'',
                        deliveryCharges:'',
                        tags:'',
                        imagefile:'',
                        loadingFormProgress:false
                    });
                    this.snackbarHandler("Shopping item was successfully added");
                }
            ).catch(
                (err)=>{
                    this.errorDialogHandler();
                }
            );

        });
    }

    snackbarHandler=(message)=>{
        this.setState({
            snackbar:true,
            snackbarMessage:message
        })
    }

    errorDialogHandler = ()=>{
        this.setState({
            errorDialog:true,
            errorMessage:"something went wrong"
        })
    }

    imageChangeHandler = (e)=>{
        this.setState({
            imagefile:e.target.files[0]
        })
    }

    autocompleteHandler = (e,value)=>{
        this.setState({
            tags:[...value]
        })
    }

    componentWillUnmount(){
        this.state.shoppingRef.off();
    }

    render(){
        const {
            name,
            price,
            description,
            deliveryCharges,
            shoppingItems,
            tagsList,
            tags,
            snackbar,
            errorDialog,
            errorMessage,
            snackbarMessage,
            loadingFormProgress,
            loadingTableProgress,
            dialogUpdateOpen,
            dialogRemoveOpen,
            editObject,
            removeID
        } = this.state;
        
        return(
            <div className="maincover responsivepadding">
                <h2 className={styles.hstyle}>Manage the shoppingItems:</h2>
                    <form onSubmit={this.formSubmitHandler}>
                    <div className="formareastyles">
                        {
                            loadingFormProgress ? (
                                <div className="mainLoadingStyle">
                                    <CircularProgress size={70} />
                                </div>
                            ):(
                            <div className="mainFormStyle">
            
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

                                <label htmlFor="imagefile" >Choose an image</label>
                                <input 
                                    type="file" 
                                    name="imagefile"
                                    onChange={this.imageChangeHandler}
                                    accept="image/*" 
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

                                    <Button 
                                        variant="contained"
                                        type="submit"
                                        size="large"
                                        fullWidth
                                    >
                                        Create Shopping Item
                                    </Button>
                                
                            </div>
                            )
                        }
                        </div>
                    </form>

                
                    <table>
                                <thead>
                                    <tr>
                                        <th>Sr#</th>
                                        <th>Name</th>
                                        <th>Price</th>
                                        <th>Description</th>
                                        <th>Delivery Charges</th>
                                        <th>Tags</th>
                                        <th>Image</th>
                                        <th style={{minWidth:"81px"}}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        shoppingItems.map((shopping,index)=>{
                                            const {id,name,price,description,deliveryCharges,tags,imageURI} = shopping;
                                            return(
                                                <ShoppingTable
                                                    id={id}
                                                    key={index}
                                                    sr={index+1}
                                                    name={name}
                                                    deliveryCharges={deliveryCharges}
                                                    description={description}
                                                    price={price}
                                                    image={imageURI}
                                                    tags={tags}
                                                    editClickHandler={
                                                        async (id,name,price,description,deliveryCharges,tags,image)=>{
                                                            await this.setState({
                                                                dialogUpdateOpen:true,
                                                                editObject:{
                                                                    id,
                                                                    name,
                                                                    price,
                                                                    description,
                                                                    deliveryCharges,
                                                                    tags,
                                                                    image
                                                                }
                                                            })
                                                        }
                                                    }
                                                    removeClickHandler={
                                                        (removeID)=>{
                                                            this.setState({
                                                                dialogRemoveOpen:true,
                                                                removeID
                                                            })
                                                        }
                                                    }
                                                />
                                            );
                                        })
                                    }
                                </tbody>
                        </table>
                        
                        {
                            loadingTableProgress && (
                                <div className={styles.loadingtableprogress} >
                                    <CircularProgress size={70} />
                                </div>
                            )
                        }
                {
                    dialogUpdateOpen && (
                    <DialogUpdate 
                        dialogUpdateOpen={dialogUpdateOpen}
                        dialogUpdateClose={()=>this.setState({dialogUpdateOpen:false})}
                        editObject={editObject}
                        tagsList={tagsList}
                        snackbarHandler={(message)=>this.snackbarHandler(message)}
                        errorDialogHandler={()=>this.errorDialogHandler}
                    />
                    )
                }

                {
                    dialogRemoveOpen && (
                        <DialogRemove
                            dialogRemoveOpen={dialogRemoveOpen}
                            dialogRemoveClose={()=>this.setState({dialogRemoveOpen:false})}
                            removeID={removeID}
                            snackbarHandler={(message)=>this.snackbarHandler(message)}
                            errorDialogHandler={()=>this.errorDialogHandler}
                        />
                    )
                }

                <SnackBar snackbarValue={snackbar} snackbarClose={()=>this.setState({snackbar:false})}>
                    {snackbarMessage}
                </SnackBar>

                <ErrorDialog dialogValue={errorDialog} dialogClose={()=>this.setState({errorDialog:false})}>
                    {errorMessage}
                </ErrorDialog>

            </div>
        )
    }

}


export default Shopping;