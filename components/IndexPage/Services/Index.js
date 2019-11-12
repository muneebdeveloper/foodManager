import React from 'react';

import ServiceContent from './ServiceContent';

import styles from '../index.css';
import styles2 from './index.css';

const servicesData = [
    {
        title:"Banners",
        image:"banner.jpg",
        link:"/banner"
    },
    {
        title:"Restaurants",
        image:"restaurants.jpg",
        link:"/restaurant"
    },
    {
        title:"Food",
        image:"food.jpg",
        link:"/food"
    },
    {
        title:"Offers",
        image:"offers.jpg",
        link:"/offers"
    },
    {
        title:"deals",
        image:"deals.jpg",
        link:"/deals"
    },
    {
        title:"Tags",
        image:"tags.jpg",
        link:"/tags"
    },
    {
        title:"Shopping",
        image:"shopping.jpg",
        link:"/shopping"
    },
    {
        title:"Riders",
        image:"riders.jpg",
        link:"/riders"
    },
    {
        title:"Orders",
        image:"orders.jpg",
        link:"/orders"
    },
    {
        title:"Report",
        image:"report.jpg",
        link:"/report"
    }
];

const Services = ()=>{

    return(
        <section className={`${styles.maincover} responsivepadding gutterbottomsmall`}>
            <h2 className={styles.hstyle}>Data <strong>Management</strong></h2>
            <div className={styles2.content}>
                {
                    servicesData.map((service,index)=>{
                        const {title,image,link} = service;
                        return(
                            <ServiceContent 
                                key={index}
                                title={title}
                                image={image}
                                link={link}
                            />
                        );
                    })
                }
            </div>
        </section>
    );
}

export default Services;