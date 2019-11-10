import React, {Component} from 'react';
import firebase from '../firebase';
import uuidv4 from 'uuidv4';
import mime from 'mime-types';

import ErrorDialog from '../misc/errordialog/ErrorDialog';
import SnackBar from '../misc/snackbar/Snackbar';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

import FoodTable from './FoodTable';
import DialogUpdate from './DialogUpdate';
import DialogRemove from './DialogRemove';

import styles from './index.css';

firebase.auth().signInWithEmailAndPassword("bombaychecking@gmail.com", "As12345").catch(function(error) {
    console.log("signin error",error);
  });

  let loadedFoods = [];
class Food extends Component{

    state={
        foodname:'',
        foods:[],
        categoryname:'',
        foodcount:'',
        foodprice:'',
        categoryid:'',
        categories:[],
        snackbar:false,
        errorDialog:false,
        errorMessage:'',
        snackbarMessage:'',
        foodRef:firebase.database().ref('ITEMS'),
        categoryRef:firebase.database().ref('CATEGORIES'),
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
        
        let loadedCategories=[];
        this.state.categoryRef.on('child_added',snap=>{
            loadedCategories.push(snap.val());
            this.setState({
                categories:[...loadedCategories],
                loadingFormProgress:false
            })
        });
        
        this.addFoodListener();
        this.removeFoodListener();
        this.updateFoodListener();
    }

    addFoodListener = ()=>{
        

        this.state.foodRef.on('child_added',snap=>{
            loadedFoods.push(snap.val());
            this.setState((state)=>{
                return(
                    {
                        foods:[...loadedFoods],
                        loadingTableProgress:false
                    }
                )
            });
        });

    }

   removeFoodListener = ()=>{
    let loadedItem = {};

        this.state.foodRef.on('child_removed',snap=>{
            loadedItem = snap.val();
            this.setState((state)=>{
                let index = state.foods.findIndex((el)=>{
                    return(
                        el.id==loadedItem.id
                    )
                });
                state.foods.splice(index,1);
                loadedFoods.splice(index,1);
                return{
                    loadingTableProgress:false
                }

            });
        })
    }

    updateFoodListener = ()=>{
        let loadedItem = {};
        this.state.foodRef.on('child_changed',snap=>{
            loadedItem=snap.val();
            this.setState((state)=>{
                let index = state.foods.findIndex((el)=>{
                    return(
                        el.id==loadedItem.id
                    )
                });
                state.foods[index]={...loadedItem};
                loadedFoods[index]={...loadedItem};
                return{
                    loadingTableProgress:false
                }

            });
        })
    }

    formSubmitHandler = (e)=>{

        e.preventDefault();

        const {categoryname,foodprice,foodname,imagefile} = this.state;
        this.setState({
            loadingFormProgress:true
        })
        const filepath = `images/foods/${uuidv4()}.jpg`;
        const metadata = {contentType:mime.lookup(imagefile.name)};
        let task = firebase.storage().ref().child(filepath).put(imagefile,metadata);
        task
        .then(snapshot => snapshot.ref.getDownloadURL())
        .then(url => {
            const key = this.state.foodRef.push().key;
            this.state.foodRef
            .child(key)
            .set({
                id:key,
                category:categoryname,
                count:0,
                imageURI:url,
                name:foodname,
                price:foodprice
            }).then(
                ()=>{
                    this.setState({
                        foodname:'',
                        categoryname:'',
                        foodprice:'',
                        foodcount:'',
                        loadingFormProgress:false
                    });
                    this.snackbarHandler("Food Item was successfully added");
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

    componentWillUnmount(){
        this.state.foodRef.off();
    }

    render(){
        const {
            foodname,
            foodprice,
            foods,
            categoryname,
            categories,
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
                <h2 className={styles.hstyle}>Manage the Food:</h2>
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
                                    name="foodname"
                                    type="text"
                                    value={foodname}
                                    required
                                    onChange={this.changeHandler}
                                    autoFocus
                                    fullWidth
                                />

                                <TextField 
                                    label="Price"
                                    variant="outlined"
                                    name="foodprice"
                                    type="number"
                                    value={foodprice}
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
                
                                
                                    <Button 
                                        variant="contained"
                                        type="submit"
                                        size="large"
                                        fullWidth
                                    >
                                        Create Food
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
                                        <th>Category</th>
                                        <th>Price</th>
                                        <th>Image</th>
                                        <th style={{minWidth:"81px"}}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        foods.map((food,index)=>{
                                            const {id,name,price,imageURI,category} = food;
                                            return(
                                                <FoodTable
                                                    id={id}
                                                    key={index}
                                                    sr={index+1}
                                                    name={name}
                                                    category={category}
                                                    price={price}
                                                    image={imageURI}
                                                    editClickHandler={
                                                        async (id,name,price,category,image)=>{
                                                            await this.setState({
                                                                dialogUpdateOpen:true,
                                                                editObject:{
                                                                    id,
                                                                    name,
                                                                    price,
                                                                    category,
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
                        categories={categories}
                        editObject={editObject}
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


export default Food;