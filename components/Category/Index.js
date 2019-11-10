import React, {Component} from 'react';
import firebase from '../firebase';

import ErrorDialog from '../misc/errordialog/ErrorDialog';
import SnackBar from '../misc/snackbar/Snackbar';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

import CategoryTable from './CategoryTable';
import DialogUpdate from './DialogUpdate';
import DialogRemove from './DialogRemove';

import styles from './index.css';



  let loadedCategories=[];
class Category extends Component{

    state={
        categoryname:'',
        categories:[],
        snackbar:false,
        errorDialog:false,
        errorMessage:'',
        snackbarMessage:'',
        categoryRef:firebase.database().ref('CATEGORIES'),
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
        

        this.state.categoryRef.on('child_added',snap=>{
            this.setState({
                loadingTableProgress:true
            });
            loadedCategories.push(snap.val());
            this.setState({
                categories:[...loadedCategories],
                loadingTableProgress:false
            })
        });


    

        this.removeCategoryListener();
        this.updateCategoryListener();
    }

   removeCategoryListener = ()=>{
        let loadedItem = {};

        this.state.categoryRef.on('child_removed',snap=>{
            loadedItem = snap.val();
            this.setState((state)=>{
                let index = state.categories.findIndex((el)=>{
                    return(
                        el.id==loadedItem.id
                    )
                });
                state.categories.splice(index,1);
                loadedCategories.splice(index,1);
                return{
                    loadingTableProgress:false
                }

            });
        })
    }

    updateCategoryListener = ()=>{
        let loadedItem = {};
        this.state.categoryRef.on('child_changed',snap=>{
            loadedItem=snap.val();
            this.setState((state)=>{
                let index = state.categories.findIndex((el)=>{
                    return(
                        el.id==loadedItem.id
                    )
                });
                state.categories[index]={...loadedItem};
                loadedCategories[index]={...loadedItem};
                return{
                    loadingTableProgress:false
                }

            });
        })
    }

    formSubmitHandler = (e)=>{

        e.preventDefault();

        const {categoryname} = this.state;
    
            const key = this.state.categoryRef.push().key;
            this.state.categoryRef
            .child(key)
            .set({
                id:key,
                name:categoryname,
            }).then(
                ()=>{
                    this.setState({
                        categoryname:'',
                    });
                    this.snackbarHandler("Category Item was successfully added");
                }
            ).catch(
                (err)=>{
                    this.errorDialogHandler();
                }
            );

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

    componentWillUnmount(){
        this.state.categoryRef.off();
    }

    render(){
        const {

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
                <h2 className={styles.hstyle}>Manage the Category:</h2>
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
                                    name="categoryname"
                                    type="text"
                                    value={categoryname}
                                    required
                                    onChange={this.changeHandler}
                                    autoFocus
                                    fullWidth
                                />
                
                                
                                    <Button 
                                        variant="contained"
                                        type="submit"
                                        size="large"
                                        fullWidth
                                    >
                                        Create Category
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
                                        <th style={{minWidth:"81px"}}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        categories.map((category,index)=>{
                                            const {id,name} = category;
                                            return(
                                                <CategoryTable
                                                    id={id}
                                                    key={index}
                                                    sr={index+1}
                                                    name={name}
                                                    editClickHandler={
                                                        async (id,name)=>{
                                                            await this.setState({
                                                                dialogUpdateOpen:true,
                                                                editObject:{
                                                                    id,
                                                                    name,
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


export default Category;