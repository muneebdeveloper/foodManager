import React, { Component }  from 'react';

import OngoingTable from './OngoingTable';


const Ongoing = (props)=>{


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
                        <th>Placement time</th>
                        <th>Rider</th>
                        <th>Order</th>
                        <th style={{minWidth:"81px"}}>Change Status</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        props.ongoingOrders.map((order,index)=>{
                            const {
                                 orderId,
                                 userName,
                                 phoneNumber, 
                                 address,
                                 deliveryCharges,
                                 totalBill,
                                 timeOfPlacement,
                                 rider
                                } = order;
                                let riderObject = props.riders.find((el)=>el.id==rider);
                            return(
                                <OngoingTable
                                    sr={index+1}
                                    id={orderId}
                                    name={userName}
                                    phone={phoneNumber}
                                    address={address}
                                    deliveryCharges={deliveryCharges}
                                    totalBill={totalBill}
                                    timeOfPlacement={timeOfPlacement}
                                    rider={riderObject.name}
                                />
                            )
                        })
                    }
                </tbody>
            </table>
        )

    }
    

export default Ongoing;