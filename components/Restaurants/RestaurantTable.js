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
                address,
                openingTime,
                closingTime,
                deliveryCharges,
                editClickHandler,
                removeClickHandler
            } = props;

        return(
            <>
                <tr>
                    <td>{sr}</td>
                    <td>{name}</td>
                    <td>{address}</td>
                    <td>{openingTime}</td>
                    <td>{closingTime}</td>
                    <td>{deliveryCharges}</td>
                    <td style={{textAlign:"center"}}>
                        <IconButton 
                            size="small"
                            onClick={()=>editClickHandler(id,name,address,openingTime,closingTime,deliveryCharges)}
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