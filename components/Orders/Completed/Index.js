import React from 'react';

import CompletedTable from './CompletedTable';


const Completed = (props)=>{


        return(
            <table>
                <thead>
                    <tr>
                        <th>Sr#</th>
                        <th>Name</th>
                        <th>Phone</th>
                        <th>Address</th>
                        <th>Delivery Charges</th>
                        <th>Bill</th>
                        <th>Placement at</th>
                        <th>Completion at</th>
                        <th>Rider</th>
                        <th>Order</th>
                        <th style={{minWidth:"81px"}}>Change Status</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        props.completedOrders.map((order,index)=>{
                            const {
                                 orderId,
                                 userName,
                                 phoneNumber, 
                                 address,
                                 deliveryCharges,
                                 totalBill,
                                 timeOfPlacement,
                                 timeOfCompletion,
                                 rider
                                } = order;
                                let riderObject = props.riders.find((el)=>el.id==rider);
                            return(
                                <CompletedTable
                                    sr={index+1}
                                    id={orderId}
                                    name={userName}
                                    phone={phoneNumber}
                                    address={address}
                                    deliveryCharges={deliveryCharges}
                                    totalBill={totalBill}
                                    timeOfPlacement={timeOfPlacement}
                                    timeOfCompletion={timeOfCompletion}
                                    rider={riderObject.name}
                                />
                            )
                        })
                    }
                </tbody>
            </table>
        )
    }


export default Completed;