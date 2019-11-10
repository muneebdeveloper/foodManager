import React, {Component} from 'react';
import Meta from './Meta';
import Router from 'next/router';
import NProgress from 'nprogress';

import Header from '../components/Header/Index';

Router.onRouteChangeStart = ()=>{
  NProgress.start();
}

Router.onRouteChangeComplete = ()=>{
  NProgress.done();
}



Router.events.on('routeChangeComplete', () => {
  if (process.env.NODE_ENV !== 'production') {
    const els = document.querySelectorAll('link[href*="/_next/static/css/styles.chunk.css"]');
    const timestamp = new Date().valueOf();
    els[0].href = '/_next/static/css/styles.chunk.css?v=' + timestamp;
  }
})

class Page extends Component{

    render(){

        return(
            <>
                <Meta />
                <div className="container">
                  <Header />
                  {this.props.children}
                </div>
            </>
        );

    }

}

export default Page;