import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as loadable from 'react-loadable';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import adminLoading from './components/Loading/adminLoading';
import frontLoading from './components/Loading/frontLoading';
import registerServiceWorker from './registerServiceWorker';

const Front = loadable({
  loader: () => import("./pages/front/index"),
  loading: frontLoading
});

const Admin = loadable({
  loader: () => import("./pages/admin/index"),
  loading: adminLoading
});

const App = (
  <Router>
    <Switch>
      <Route exact={true} path="/" component={Front} />
      <Route exact={true} path="/admin" component={Admin} />
    </Switch>
  </Router>
);

ReactDOM.render(App, document.getElementById("root") as HTMLElement);
registerServiceWorker();
