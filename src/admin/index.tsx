import React from 'react';
import { render } from 'react-dom';
import * as loadable from "react-loadable";


import adminLoading from "src/components/Loading/adminLoading";

const Admin = loadable({
  loader: () => import("./admin"),
  loading: adminLoading
});

const Root = () => <Admin />;

render(<Root />, document.getElementById('root'));
