import React, { Fragment } from 'react';

import AppHead from '../components/AppHead';

import { container } from '../theme';

const Container = ({ children }: { children?: any }) => (
  <Fragment>
    <div className="container">
      <AppHead />
      {children}
    </div>
    <style jsx>{`
      .container {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        margin: auto;
        min-height: 100vh;
        max-width: ${container.maxWidth};
      }
    `}</style>
  </Fragment>
);

export default Container;
