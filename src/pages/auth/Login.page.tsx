import classnames from "classnames";
import React, { FC, FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import {
  googleSignIn,
  signInWithEmailAndPassword,
} from "../../services/auth.service";
import { AuthFormContainer } from "./AuthFormContainer";

export const LoginPage: FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setSubmitted(true);
    if (!email || !password) {
      return;
    }
    try {
      await signInWithEmailAndPassword(email, password);
    } catch (error) {
      setErrorMessage(error.message);
    }
  };
  const handleGoogleSigIn = async () => {
    try {
      await googleSignIn();
    } catch (error) {
      setErrorMessage(error.message);
    }
  };
  return (
    <AuthFormContainer onSubmit={handleSubmit}>
      <p className="text-red-500 text-xs italic">{errorMessage}</p>
      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="username"
        >
          Username
        </label>
        <input
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${classnames(
            {
              "text-gray-700": !submitted || email,
              "border-red-500": submitted && !email,
            }
          )}`}
          id="email"
          type="text"
          placeholder="Email"
        />
      </div>
      <div className="mb-6">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="password"
        >
          Password
        </label>
        <input
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline ${classnames(
            {
              "text-gray-700": !submitted || password,
              "border-red-500": submitted && !password,
            }
          )}`}
          id="password"
          type="password"
          placeholder="******************"
        />
        {submitted && !password && (
          <p className="text-red-500 text-xs italic">
            Please choose a password.
          </p>
        )}
      </div>
      <div className="mb-4">
        <button
          className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="submit"
        >
          Sign In
        </button>
      </div>
      <div className="">
        <button
          onClick={handleGoogleSigIn}
          className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="button"
        >
          Sign In with Google
        </button>
      </div>
      <p className="text-center my-3">
        Don't have an account?
        <Link to="register" className="text-blue-500 hover:text-blue-600">
          Sign up here
        </Link>
        <br />
        <Link to="passwordReset" className="text-blue-500 hover:text-blue-600">
          Forgot Password?
        </Link>
      </p>
    </AuthFormContainer>
  );
};
