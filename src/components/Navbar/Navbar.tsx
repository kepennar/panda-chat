import React, { FC, useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../../contexts/user.context";
import { logout } from "../../services/auth.service";
import { Avatar } from "../Avatar";

export const Navbar: FC = () => {
  const { user } = useContext(UserContext);

  return (
    <nav className="bg-black p-2 flex items-center justify-between flex-wrap w-auto h-18 fixed top-0 w-full">
      <div className="flex items-center flex-shrink-0 text-white mr-6">
        <Link to={user ? "/home" : "/login"}>
          <h1 className="text-center text-white">PANDA CHAT</h1>
        </Link>
      </div>
      <div className="block flex-grow flex justify-end items-center w-auto">
        {user && (
          <div className="flex items-center space-x-4">
            <Avatar user={user} size="small" />
            <button
              onClick={() => logout()}
              className="bg-transparent  text-blue-700 font-semibold hover:text-white py-1 px-2 border rounded border-white hover:border-gray-600 hover:border-transparent "
            >
              <svg viewBox="0 0 529.286 529.286" height="24px" width="24px">
                <path
                  fill="white"
                  d="M358.099 74.604S330.002 61.96 330.002 91.5s27.837 49.363 28.19 49.3c49.147 32.081 81.629 87.559 81.629 150.629 0 97.746-78.016 177.269-175.177 179.7-97.161-2.431-175.177-81.954-175.177-179.7 0-63.071 32.483-118.547 81.629-150.629.353.063 28.189-19.761 28.189-49.3s-28.097-16.896-28.097-16.896C88.7 111.958 31.31 194.983 31.31 291.429c0 129.865 104.053 235.413 233.334 237.857 129.281-2.445 233.332-107.992 233.332-237.857.001-96.446-57.389-179.471-139.877-216.825z"
                />
                <path
                  fill="white"
                  d="M266.278 0c-26.143 0-34.312 19.141-34.312 26.627v234.318c0 7.487 8.17 26.627 34.312 26.627 26.143 0 31.045-19.141 31.045-26.627V26.627C297.322 19.14 292.421 0 266.278 0z"
                />
              </svg>
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};
