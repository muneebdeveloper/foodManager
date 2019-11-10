import React, {Component} from 'react';
import firebase from '../firebase';

import ErrorDialog from '../misc/errordialog/ErrorDialog';
import SnackBar from '../misc/snackbar/Snackbar';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

import TagsTable from './TagsTable';
import DialogUpdate from './DialogUpdate';
import DialogRemove from './DialogRemove';

import styles from './index.css';



  let loadedTags=[];
class Tags extends Component{

    state={
        tagname:'',
        tags:[],
        snackbar:false,
        errorDialog:false,
        errorMessage:'',
        snackbarMessage:'',
        tagsRef:firebase.database().ref('TAGS'),
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
        

        this.state.tagsRef.on('child_added',snap=>{
            this.setState({
                loadingTableProgress:true
            });
            loadedTags.push(snap.val());
            this.setState({
                tags:[...loadedTags],
                loadingTableProgress:false
            })
        });


    

        this.removeTagsListener();
        this.updateTagsListener();
    }

    removeTagsListener = ()=>{
        let loadedItem = {};

        this.state.tagsRef.on('child_removed',snap=>{
            loadedItem = snap.val();
            this.setState((state)=>{
                let index = state.tags.findIndex((el)=>{
                    return(
                        el.id==loadedItem.id
                    )
                });
                state.tags.splice(index,1);
                loadedTags.splice(index,1);
                return{
                    loadingTableProgress:false
                }

            });
        })
    }

    updateTagsListener = ()=>{
        let loadedItem = {};
        this.state.tagsRef.on('child_changed',snap=>{
            loadedItem=snap.val();
            this.setState((state)=>{
                let index = state.tags.findIndex((el)=>{
                    return(
                        el.id==loadedItem.id
                    )
                });
                state.tags[index]={...loadedItem};
                loadedTags[index]={...loadedItem};
                return{
                    loadingTableProgress:false
                }

            });
        })
    }

    formSubmitHandler = (e)=>{

        e.preventDefault();

        const {tagname} = this.state;
    
            const key = this.state.tagsRef.push().key;
            this.state.tagsRef
            .child(key)
            .set({
                id:key,
                name:tagname,
            }).then(
                ()=>{
                    this.setState({
                        tagname:'',
                    });
                    this.snackbarHandler("Tag was successfully added");
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
        this.state.tagsRef.off();
    }

    render(){
        const {

            tagname,
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
                <h2 className={styles.hstyle}>Manage the Tags:</h2>
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
                                    name="tagname"
                                    type="text"
                                    value={tagname}
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
                                        Create a Tag
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
                                        tags.map((category,index)=>{
                                            const {id,name} = category;
                                            return(
                                                <TagsTable
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
                        tags={tags}
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


export default Tags;