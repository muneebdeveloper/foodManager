import React from 'react';

import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import CheckCircle from '@material-ui/icons/CheckCircle';
import CancelIcon from '@material-ui/icons/Cancel';

import styles from './Snackbar.css';


const SnackBar = (props)=>{
    const {snackbarValue,snackbarClose,failed} = props;
    return(
        <Snackbar 
            anchorOrigin={{
                vertical:'bottom',
                horizontal:'right'
            }}
            open={snackbarValue}
            onClose={snackbarClose}
            autoHideDuration={2000}
        >
            <SnackbarContent 
                className={failed?styles.failed:styles.success}
                message={
                    <span className={styles.message}>
                    {
                        failed ? 
                        (<CancelIcon className={styles.marginright} />):
                        (<CheckCircle className={styles.marginright} />)
                    }
                    {props.children}
                    </span>
                }
                action={[
                    <IconButton key="close" className={styles.iconcolor} onClick={snackbarClose}>
                        <CloseIcon />
                    </IconButton>
                ]}
            />
        </Snackbar>
    )
}

export default SnackBar;