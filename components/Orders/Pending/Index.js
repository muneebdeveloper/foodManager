import React  from 'react';

import PendingTable from './PendingTable';

const Pending = (props)=>{

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
                        <th>Order</th>
                        <th style={{minWidth:"81px"}}>Change Status</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        props.pendingOrders.map((order,index)=>{
                            const {
                                 orderId,
                                 userName,
                                 phoneNumber, 
                                 address,
                                 deliveryCharges,
                                 totalBill,
                                 timeOfPlacement
                                } = order;
                            return(
                                <PendingTable
                                    sr={index+1}
                                    id={orderId}
                                    name={userName}
                                    phone={phoneNumber}
                                    address={address}
                                    deliveryCharges={deliveryCharges}
                                    totalBill={totalBill}
                                    timeOfPlacement={timeOfPlacement}
                                />
                            )
                        })
                    }
                </tbody>
            </table>
        )

}

export default Pending;