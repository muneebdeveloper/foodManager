import React from 'react';
import Link from 'next/link';

import styles from './ServiceContent.css';

const ServiceContent = (props)=>{

    const {title,image,link} = props;

    return(
        
        <Link href={link}>
            <a>
                <div className={styles.maindiv}>
                            <img className={styles.imgstyle} src={`images/${image}`} />
                            <div className={styles.content}>
                                <h2 className={styles.hstyle}>{title.toUpperCase()}</h2>
                            </div>
                </div>
            </a>
        </Link>
    );
}

export default ServiceContent;