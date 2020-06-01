import Head from 'next/head';
import React from 'react';

const DefaultHead = () => (
  <Head>
    <title>Next Sudoku</title>
    <meta
      name="description"
      content="Jouez gratuitement au sudoku sur votre PC ou smartphone. Fonctionne sans accès réseau après installation."
    ></meta>
    <link rel="icon" href="/favicon.ico" />
    <link rel="manifest" href="/static/manifest.json" />
  </Head>
);

export default DefaultHead;
