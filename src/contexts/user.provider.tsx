import React, { FC, useState, useEffect } from "react";
import { useAuthChangedEffect } from "../hooks/useAuthChangedEffect";
import { User } from "../model";
import { UserContext } from "./user.context";
import { initAuth } from "../services/auth.service";

export const UserProvider: FC = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    initAuth();
  }, []);

  useAuthChangedEffect(setUser);

  return (
    <UserContext.Provider
      value={{
        user,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
