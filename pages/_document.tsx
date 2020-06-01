import React from 'react';
import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html lang="fr">
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>

        <style jsx>{`
          body {
            padding: 0;
            margin: 0;
            font-family: Helvetica Neue, sans-serif;
            font-size: 16px;
          }
        `}</style>
      </Html>
    );
  }
}

export default MyDocument;
