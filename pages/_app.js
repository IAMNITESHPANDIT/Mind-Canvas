import React, { useState } from "react";
import Layout from "@components/Layout";
import Provider from "@app/Provider";

function MyApp({ Component, pageProps }) {
 
  return (
    <Provider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </Provider>
  );
}

export default MyApp;
