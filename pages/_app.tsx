import React from 'react';
import App, { AppInitialProps, AppContext } from 'next/app';

import { gameWrapper } from '../redux/gameSlice';

class MyApp extends App<AppInitialProps> {
  static getInitialProps = async ({ Component, ctx }: AppContext) => {
    // ctx.store.dispatch({ type: 'TOE', payload: 'was set in _app' });

    return {
      pageProps: {
        // Call page-level getInitialProps
        ...(Component.getInitialProps
          ? await Component.getInitialProps(ctx)
          : {}),
        // Some custom thing for all pages
        // pathname: ctx.pathname,
      },
    };
  };

  render() {
    const { Component, pageProps } = this.props;

    return <Component {...pageProps} />;
  }
}

export default gameWrapper.withRedux(MyApp);
