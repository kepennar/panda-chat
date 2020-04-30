import React from "react";
import { Routes } from "./routes";

import "./styles/styles.css";
import { UserProvider } from "./contexts/user.provider";
import { Navbar } from "./components/Navbar";
import { BrowserRouter } from "react-router-dom";

function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <Navbar />
        <div className="mt-20 mx-2">
          <Routes />
        </div>
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;
