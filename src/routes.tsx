import React, { FC, useEffect } from "react";
import { Redirect, Route, Switch, useHistory } from "react-router-dom";
import { LoginPage } from "./pages/auth/Login.page";
import { RegisterPage } from "./pages/auth/Register.page";
import { ChatPage } from "./pages/chat/Chat.page";
import { HomePage } from "./pages/home/Home.page";
import { connectedUser } from "./services/auth.service";

export const Routes: FC = () => {
  const history = useHistory();
  useEffect(() => {
    connectedUser.observe((change) => {
      const user = change.newValue;
      if (user) {
        if (["/login", "/register"].includes(history.location.pathname)) {
          history.push("/home");
        }
      } else {
        history.push("/login");
      }
    });
  }, [history]);

  return (
    <Switch>
      <Route exact path="/login" component={LoginPage} />
      <Route exact path="/register" component={RegisterPage} />
      <Route exact path="/chat/:chatId" component={ChatPage} />
      <Route exact path="/home" component={HomePage} />
      <Redirect to="/home" />
    </Switch>
  );
};
