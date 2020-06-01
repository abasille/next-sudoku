import React from 'react';

const AppMain = ({ children }: { children?: any }) => (
  <main>
    {children}
    <style jsx>{`
      main {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
        flex: 1;
        padding: 0 0.5rem;
        width: 100%;
      }
    `}</style>
  </main>
);

export default AppMain;
