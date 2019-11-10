import React, {Component} from 'react';


import Toolbar from './Toolbar';

class Header extends Component{


    render(){
        return(
            <div className="header">
                <div className="toolbar responsivepadding">
                    <Toolbar />
                </div>
            </div>
        )
    }

}


export default Header;