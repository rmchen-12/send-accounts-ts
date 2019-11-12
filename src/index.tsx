import * as React from "react";
import * as ReactDOM from "react-dom";
import * as loadable from "react-loadable";

import frontLoading from "./components/Loading/frontLoading";
import registerServiceWorker from "./registerServiceWorker";

const Front = loadable({
  loader: () => import("./pages/front/index"),
  loading: frontLoading
});

const App = <Front />;

ReactDOM.render(App, document.getElementById("root") as HTMLElement);
registerServiceWorker();
