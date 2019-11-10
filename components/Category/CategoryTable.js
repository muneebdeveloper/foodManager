import React from 'react';

import IconButton from '@material-ui/core/IconButton';
import Delete from '@material-ui/icons/Delete';
import Edit from '@material-ui/icons/Edit';

import styles from './index.css';

const CategoryTable = (props)=>{


        const {
                id,
                sr,
                name,
                editClickHandler,
                removeClickHandler
            } = props;

        return(
            <>
                <tr>
                    <td>{sr}</td>
                    <td>{name}</td>
                    <td style={{textAlign:"center"}}>
                        <IconButton 
                            size="small"
                            onClick={()=>editClickHandler(id,name)}
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
             </>
        );
    
}

export default CategoryTable;