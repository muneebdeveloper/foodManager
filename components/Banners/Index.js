import React, {Component} from 'react';
import firebase from '../firebase';
import uuidv4 from 'uuidv4';
import mime from 'mime-types';


import ErrorDialog from '../misc/errordialog/ErrorDialog';
import SnackBar from '../misc/snackbar/Snackbar';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

import BannersTable from './BannersTable';
import DialogUpdate from './DialogUpdate';
import DialogRemove from './DialogRemove';

import styles from './index.css';




class Banners extends Component{

    state={
        clickable:false,
        targetURL:'',
        banners:[],
        snackbar:false,
        errorDialog:false,
        errorMessage:'',
        imagefile:'',
        snackbarMessage:'',
        bannersRef:firebase.database().ref('BANNERS'),
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

    checkboxChangeHandler = (e)=>{
        this.setState({
            clickable:e.target.checked
        })
    }

    imageChangeHandler = (e)=>{
        this.setState({
            imagefile:e.target.files[0]
        })
    }

    componentDidMount(){
        
        let loadedBanners=[];
        this.state.bannersRef.on('child_added',snap=>{
            this.setState({
                loadingTableProgress:true
            });
            loadedBanners.push(snap.val());
            this.setState({
                banners:[...loadedBanners],
                loadingTableProgress:false
            })
        });


    

        this.removeBannersListener(loadedBanners);
        this.updateBannersListener(loadedBanners);
    }

    removeBannersListener = (loadedBanners)=>{
        let loadedItem = {};

        this.state.bannersRef.on('child_removed',snap=>{
            loadedItem = snap.val();
            this.setState((state)=>{
                let index = state.banners.findIndex((el)=>{
                    return(
                        el.id==loadedItem.id
                    )
                });
                state.banners.splice(index,1);
                loadedBanners.splice(index,1);
                return{
                    loadingTableProgress:false
                }

            });
        })
    }

    updateBannersListener = (loadedBanners)=>{
        let loadedItem = {};
        this.state.bannersRef.on('child_changed',snap=>{
            loadedItem=snap.val();
            this.setState((state)=>{
                let index = state.banners.findIndex((el)=>{
                    return(
                        el.id==loadedItem.id
                    )
                });
                state.banners[index]={...loadedItem};
                loadedBanners[index]={...loadedItem};
                return{
                    loadingTableProgress:false
                }

            });
        })
    }

    formSubmitHandler = (e)=>{

        e.preventDefault();

        const {clickable,targetURL,imagefile} = this.state;
        this.setState({
            loadingFormProgress:true
        })
        const filepath = `images/banners/${uuidv4()}.jpg`;
        const metadata = {contentType:mime.lookup(imagefile.name)};
    
        let task = firebase.storage().ref().child(filepath).put(imagefile,metadata);
        task
        .then(snapshot => snapshot.ref.getDownloadURL())
        .then(url => {
            const key = this.state.bannersRef.push().key;
            this.state.bannersRef
            .child(key)
            .set({
                id:key,
                clickable,
                imageURI:url,
                targetURL
            }).then(
                ()=>{
                    this.setState({
                        clickable:false,
                        targetURL:'',
                        loadingFormProgress:false
                    });
                    this.snackbarHandler("Banner was successfully added");
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

    componentWillUnmount(){
        this.state.bannersRef.off();
    }

    render(){
        const {

            clickable,
            targetURL,
            banners,
            imagefile,
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
                <h2 className={styles.hstyle}>Manage the Banners:</h2>
                    <form onSubmit={this.formSubmitHandler}>
                    <div className="formareastyles">
                        {
                            loadingFormProgress ? (
                                <div className="mainLoadingStyle">
                                    <CircularProgress size={70} />
                                </div>
                            ):(
                            <div className="mainFormStyle">

                                <label htmlFor="imagefile" >Choose an image</label>
                                <input 
                                    type="file" 
                                    name="imagefile"
                                    onChange={this.imageChangeHandler}
                                    accept="image/*" 
                                />

                                <div style={{width:"100%"}}>
                                    <FormControlLabel
                                        control={
                                        <Checkbox
                                            checked={clickable}
                                            onChange={this.checkboxChangeHandler}
                                            color="primary"
                                        />
                                        }
                                        label="Clickable"
                                    />
                                </div>

                                <TextField 
                                    label="Target URL"
                                    variant="outlined"
                                    name="targetURL"
                                    type="text"
                                    value={targetURL}
                                    onChange={this.changeHandler}
                                    autoFocus
                                    disabled={!clickable ? true : false}
                                    fullWidth
                                />
                
                                    <Button 
                                        variant="contained"
                                        type="submit"
                                        size="large"
                                        fullWidth
                                        disabled={!imagefile?true:false}
                                    >
                                        Create Banner
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
                                        <th>Clickable</th>
                                        <th>Target URL</th>
                                        <th>Image</th>
                                        <th style={{minWidth:"81px"}}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        banners.map((banner,index)=>{
                                            const {id,clickable,targetURL,imageURI} = banner;
                                            return(
                                                <BannersTable
                                                    id={id}
                                                    key={index}
                                                    sr={index+1}
                                                    clickable={clickable}
                                                    image={imageURI}
                                                    url={targetURL}
                                                    editClickHandler={
                                                        async (id,clickable,targetURL,image)=>{
                                                            await this.setState({
                                                                dialogUpdateOpen:true,
                                                                editObject:{
                                                                    id,
                                                                    clickable,
                                                                    image,
                                                                    targetURL
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


export default Banners;