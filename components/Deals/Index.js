import React, {Component} from 'react';
import firebase from '../firebase';
import uuidv4 from 'uuidv4';
import mime from 'mime-types';

import ErrorDialog from '../misc/errordialog/ErrorDialog';
import SnackBar from '../misc/snackbar/Snackbar';
import Chip from '@material-ui/core/Chip';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import DealsTable from './DealsTable';
import DialogUpdate from './DialogUpdate';
import DialogRemove from './DialogRemove';

import styles from './index.css';


  let loadedDeals=[];
class Deals extends Component{

    state={
        name:'',
        price:'',
        food:'',
        foodData:[],
        deals:[],
        snackbar:false,
        errorDialog:false,
        errorMessage:'',
        snackbarMessage:'',
        dealsRef:firebase.database().ref('DEALS'),
        loadingTableProgress:false,
        loadingFormProgress:false,
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
        

        this.state.dealsRef.on('child_added',snap=>{
            loadedDeals.push(snap.val());
            this.setState({
                deals:[...loadedDeals],
                loadingFormProgress:false
            })
        });
        
        this.removeDealsListener();
        this.updateDealsListener();
    }

   removeDealsListener = ()=>{
        let loadedItem = {};

        this.state.dealsRef.on('child_removed',snap=>{
            loadedItem = snap.val();
            this.setState((state)=>{
                let index = state.deals.findIndex((el)=>{
                    return(
                        el.id==loadedItem.id
                    )
                });
                state.deals.splice(index,1);
                loadedDeals.splice(index,1);
                return{
                    loadingTableProgress:false,
                }

            });
        })
    }

    updateDealsListener = ()=>{
        let loadedItem = {};
        this.state.dealsRef.on('child_changed',snap=>{
            loadedItem=snap.val();
            this.setState((state)=>{
                let index = state.deals.findIndex((el)=>{
                    return(
                        el.id==loadedItem.id
                    )
                });
                state.deals[index]={...loadedItem};
                loadedDeals[index]={...loadedItem};
                return{
                    loadingTableProgress:false
                }

            });
        })
    }

    formSubmitHandler = (e)=>{

        e.preventDefault();

        const {name,price,foodData,imagefile} = this.state;
        this.setState({
            loadingFormProgress:true
        })
        const filepath = `images/deals/${uuidv4()}.jpg`;
        const metadata = {contentType:mime.lookup(imagefile.name)};
        let task = firebase.storage().ref().child(filepath).put(imagefile,metadata);
        task
        .then(snapshot => snapshot.ref.getDownloadURL())
        .then(url => {
            const key = this.state.dealsRef.push().key;
            this.state.dealsRef
            .child(key)
            .set({
                id:key,
                name,
                price,
                imageURI:url,
                foodItems:[...foodData]
            }).then(
                ()=>{
                    this.setState({
                        price:'',
                        foodData:[],
                        imagefile:'',
                        loadingFormProgress:false
                    });
                    this.snackbarHandler("Deal was successfully added");
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

    componentWillUnmount(){
        this.state.dealsRef.off();
    }

    render(){
        const {
            name,
            price,
            food,
            foodData,
            deals,
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
                <h2 className={styles.hstyle}>Manage the Deals:</h2>
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
                                
                                <label htmlFor="imagefile" >Choose an image</label>
                                <input 
                                    type="file" 
                                    name="imagefile"
                                    onChange={this.imageChangeHandler}
                                    accept="image/*" 
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
                
                                    <Button 
                                        variant="contained"
                                        type="submit"
                                        size="large"
                                        fullWidth
                                    >
                                        Create Deal
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
                                        <th>Food Items</th>
                                        <th>Image</th>
                                        <th style={{minWidth:"81px"}}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        deals.map((deal,index)=>{
                                            const {id,name,price,foodItems,imageURI} = deal;
                                            return(
                                                <DealsTable
                                                    id={id}
                                                    key={index}
                                                    sr={index+1}
                                                    name={name}
                                                    price={price}
                                                    image={imageURI}
                                                    foodItems={foodItems}
                                                    editClickHandler={
                                                        async (id,name,price,foodItems,image)=>{
                                                            await this.setState({
                                                                dialogUpdateOpen:true,
                                                                editObject:{
                                                                    id,
                                                                    name,
                                                                    price,
                                                                    foodItems,
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


export default Deals;