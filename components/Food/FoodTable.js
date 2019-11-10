import React,{useState} from 'react';

import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Delete from '@material-ui/icons/Delete';
import Edit from '@material-ui/icons/Edit';
import Cancel from '@material-ui/icons/Cancel';

import styles from './index.css';

const FoodTable = (props)=>{

        const [dialogView,setDialogView] = useState(false);

        const {
                id,
                sr,
                name,
                category,
                price,
                image,
                editClickHandler,
                removeClickHandler
            } = props;

        return(
            <>
            <tr>
                <td>{sr}</td>
                <td>{name}</td>
                <td>{category}</td>
                <td>{price}</td>
                <td style={{textAlign:"center"}}>
                    <Button
                        size="small"
                        variant="contained"
                        onClick={()=>setDialogView(true)}
                    >
                        View
                    </Button>
                </td>
                <td style={{textAlign:"center"}}>
                    <IconButton 
                        size="small"
                        onClick={()=>editClickHandler(id,name,price,category,image)}
                    >
                        <Edit className={styles.edit} />
                    </IconButton>
    
                    <IconButton 
                        size="small"
                        onClick={()=>removeClickHandler(id)}
                    >
                        <Delete className={styles.delete} />
                    </IconButton>
                                  
                </td>
             </tr>

             <Dialog open={dialogView} onClose={()=>setDialogView(false)}>

                <div className="dialogTitleStyle">
                    <h2 className={styles.edithstyle}>Image</h2>
                    <IconButton onClick={()=>setDialogView(false)}>
                            <Cancel className={styles.delete} />
                    </IconButton>
                </div>

                <DialogContent>
                    <img src={image} style={{width:"100%",objectFit:"cover"}} />
                </DialogContent>

            </Dialog>

             </>
        );
    
}

export default FoodTable;