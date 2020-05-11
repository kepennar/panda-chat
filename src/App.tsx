import React from "react";
import { Routes } from "./routes";

import "./styles/styles.css";
import { Navbar } from "./components/Navbar";
import { BrowserRouter } from "react-router-dom";
import { connectedUser } from "./services/auth.service";

function App() {
  return (
    <BrowserRouter>
      <Navbar userBox={connectedUser} />
      <div className="mt-20 mx-2">
        <Routes />
      </div>
    </BrowserRouter>
  );
}

export default App;
