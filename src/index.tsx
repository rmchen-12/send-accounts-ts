import * as React from "react";
import * as ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import * as loadable from "react-loadable";
import registerServiceWorker from "./registerServiceWorker";
import frontLoading from "./components/Loading/frontLoading";
import adminLoading from "./components/Loading/adminLoading";

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
    <div>
      <Switch>
        <Route exact={true} path="/" component={Front} />
        <Route exact={true} path="/admin" component={Admin} />
      </Switch>
    </div>
  </Router>
);

ReactDOM.render(App, document.getElementById("root") as HTMLElement);
registerServiceWorker();
