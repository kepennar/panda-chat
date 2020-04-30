import React, { FC, useCallback } from "react";
import { Route, Switch, useHistory, Redirect } from "react-router-dom";
import { useAuthChangedEffect } from "./hooks/useAuthChangedEffect";
import { User } from "./model";
import { LoginPage } from "./pages/auth/Login.page";
import { RegisterPage } from "./pages/auth/Register.page";
import { HomePage } from "./pages/home/Home.page";
import { ChatPage } from "./pages/chat/Chat.page";

export const Routes: FC = () => {
  const history = useHistory();
  const redirectOnAuthChange = useCallback(
    (user: User | null) => {
      if (user) {
        if (["/login", "/register"].includes(history.location.pathname)) {
          history.push("/home");
        }
      } else {
        history.push("/login");
      }
    },
    [history]
  );
  useAuthChangedEffect(redirectOnAuthChange);

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
