import {
  authChangesListener,
  AuthCallbackChangedType,
} from "../services/auth.service";
import { useEffect } from "react";

export function useAuthChangedEffect(callback: AuthCallbackChangedType) {
  useEffect(() => {
    authChangesListener.registerOnChanges(callback);
    return () => {
      authChangesListener.unregisterOnChanges(callback);
    };
  }, [callback]);
}
