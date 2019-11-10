import React, {Component} from 'react';
import firebase from '../firebase';
import uuidv4 from 'uuidv4';
import mime from 'mime-types';

import ErrorDialog from '../misc/errordialog/ErrorDialog';
import SnackBar from '../misc/snackbar/Snackbar';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import RidersTable from './RidersTable';
import DialogUpdate from './DialogUpdate';
import DialogRemove from './DialogRemove';

import styles from './index.css';


let loadedRiders=[];

class Riders extends Component{

    state={
        name:'',
        phone:'',
        riders:[],
        imagefile:'',
        snackbar:false,
        errorDialog:false,
        errorMessage:'',
        snackbarMessage:'',
        ridersRef:firebase.database().ref('RIDERS'),
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
        

        this.state.ridersRef.on('child_added',snap=>{
            loadedRiders.push(snap.val());
            this.setState({
                riders:[...loadedRiders],
                loadingFormProgress:false
            })
        });
        
        this.removeRidersListener();
        this.updateRidersListener();
    }

   removeRidersListener = ()=>{
        let loadedItem = {};

        this.state.ridersRef.on('child_removed',snap=>{
            loadedItem = snap.val();
            this.setState((state)=>{
                let index = state.riders.findIndex((el)=>{
                    return(
                        el.id==loadedItem.id
                    )
                });
                state.riders.splice(index,1);
                loadedRiders.splice(index,1);
                return{
                    loadingTableProgress:false,
                }

            });
        })
    }

    updateRidersListener = ()=>{
        let loadedItem = {};
        this.state.ridersRef.on('child_changed',snap=>{
            loadedItem=snap.val();
            this.setState((state)=>{
                let index = state.riders.findIndex((el)=>{
                    return(
                        el.id==loadedItem.id
                    )
                });
                state.riders[index]={...loadedItem};
                loadedRiders[index]={...loadedItem};
                return{
                    loadingTableProgress:false
                }

            });
        })
    }

    formSubmitHandler = (e)=>{

        e.preventDefault();

        const {name,phone,imagefile} = this.state;
        this.setState({
            loadingFormProgress:true
        })
        const filepath = `images/riders/${uuidv4()}.jpg`;
        const metadata = {contentType:mime.lookup(imagefile.name)};
        let task = firebase.storage().ref().child(filepath).put(imagefile,metadata);
        task
        .then(snapshot => snapshot.ref.getDownloadURL())
        .then(url => {
            const key = this.state.ridersRef.push().key;
            this.state.ridersRef
            .child(key)
            .set({
                id:key,
                name,
                phone,
                imageURI:url,
            }).then(
                ()=>{
                    this.setState({
                        name:'',
                        phone:'',
                        imagefile:'',
                        loadingFormProgress:false
                    });
                    this.snackbarHandler("Rider was successfully added");
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
        this.state.ridersRef.off();
    }

    render(){
        const {
            name,
            phone,
            riders,
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
                <h2 className={styles.hstyle}>Manage the riders:</h2>
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
                                    label="Phone"
                                    variant="outlined"
                                    name="phone"
                                    type="text"
                                    value={phone}
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
                
                                    <Button 
                                        variant="contained"
                                        type="submit"
                                        size="large"
                                        fullWidth
                                    >
                                        Create Rider
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
                                        <th>Phone</th>
                                        <th>Image</th>
                                        <th style={{minWidth:"81px"}}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        riders.map((rider,index)=>{
                                            const {id,name,phone,imageURI} = rider;
                                            return(
                                                <RidersTable
                                                    id={id}
                                                    key={index}
                                                    sr={index+1}
                                                    name={name}
                                                    phone={phone}
                                                    image={imageURI}
                                                    editClickHandler={
                                                        async (id,name,phone,image)=>{
                                                            await this.setState({
                                                                dialogUpdateOpen:true,
                                                                editObject:{
                                                                    id,
                                                                    name,
                                                                    phone,
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


export default Riders;