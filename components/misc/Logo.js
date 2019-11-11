import React from 'react';
import Link from 'next/link';

import styles from './Logo.css';

const Logo = ()=>{

    return(
        <h2 className={styles.logoH2}>
            <Link href="/">
                <a className={styles.logoa}>
                    Food
                    <strong className={styles.logostrong}>Bag</strong>
                </a>
            </Link>
        </h2>
    );

}

export default Logo;