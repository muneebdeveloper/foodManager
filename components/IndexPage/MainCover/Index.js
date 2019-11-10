import React, {Component} from 'react';

import Title from './Title';

import styles from './index.css';

class MainCover extends Component{

    render(){
        return(
            <div className={`${styles.fullCover} gutterbottomsmall`}>
                <div className={styles.contentcenter}>
                    <div className={styles.content}>
                        <Title />
                    </div>
                </div>
            </div>
        );
    }
}

export default MainCover;