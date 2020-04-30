import classnames from "classnames";
import React, { FC, FormEvent, useState } from "react";
import { AuthFormContainer } from "./AuthFormContainer";
import { registerWithEmailPassword } from "../../services/auth.service";

export const RegisterPage: FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState();
  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
    if (!email || !displayName || !password) {
      return;
    }

    try {
      await registerWithEmailPassword({ email, displayName }, password);
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
          htmlFor="email"
        >
          Email
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
          type="email"
          placeholder="Email"
        />
      </div>
      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="username"
        >
          Username
        </label>
        <input
          value={displayName}
          onChange={(event) => setDisplayName(event.target.value)}
          className={classnames(
            "shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline",
            {
              "text-gray-700": !submitted || displayName,
              "border-red-500": submitted && !displayName,
            }
          )}
          id="displayName"
          type="text"
          placeholder="Username"
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
          className={classnames(
            "shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline",
            {
              "text-gray-700": !submitted || password,
              "border-red-500": submitted && !password,
            }
          )}
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
      <div className="flex justify-end">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="submit"
        >
          Register
        </button>
      </div>
    </AuthFormContainer>
  );
};
