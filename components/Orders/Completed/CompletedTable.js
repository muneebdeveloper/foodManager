import React from 'react';

import Button from '@material-ui/core/Button';

const CompletedTable = (props)=>{

    const { 
            id,
            sr,
            name,
            phone,
            address,
            deliveryCharges,
            totalBill,
            timeOfPlacement,
            timeOfCompletion,
            rider
        } = props;

    return(
        <tr>
            <td>{sr}</td>
            <td>{name}</td>
            <td>{phone}</td>
            <td>{address}</td>
            <td>{deliveryCharges}</td>
            <td>{totalBill}</td>
            <td>{timeOfPlacement}</td>
            <td>{timeOfCompletion}</td>
            <td>{rider}</td>
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
                <Button
                    size="small"
                    variant="contained"
                    onClick={()=>setDialogView(true)}
                >
                    Discard
                </Button>
            </td>
        </tr>
    )
}

export default CompletedTable;