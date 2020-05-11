import "mobx-react-lite/batchingForReactDom";
import React from "react";
import ReactDOM from "react-dom";
import { configure } from "mobx";
import App from "./App";
import "./config/firebase.config";
import { initDb } from "./config/firebase.config";
import * as serviceWorker from "./serviceWorker";
import { initAuth } from "./services/auth.service";

configure({ enforceActions: "always" });
initAuth();

async function run() {
  await initDb();
  return ReactDOM.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    document.getElementById("root")
  );
}

run();
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
