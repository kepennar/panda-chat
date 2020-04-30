import classnames from "classnames";
import React, { FC, useState, MouseEvent, useRef } from "react";
import { useClickAway } from "react-use";

export const Dropdown: FC = ({ children }) => {
  const ref = useRef(null);
  useClickAway(ref, () => {
    setDisplayed(false);
  });

  const [displayed, setDisplayed] = useState(false);

  const handleClickButton = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setDisplayed(!displayed);
  };
  return (
    <div className="relative">
      <button
        onClick={handleClickButton}
        className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow"
      >
        <svg viewBox="0 0 16 16" height="16px" width="16px">
          <g
            fill="black"
            style={{ transform: "rotate(90deg) translateY(-16px)" }}
          >
            <path
              fillRule="evenodd"
              d="M8 6.667a1.333 1.333 0 1 1 0 2.666 1.333 1.333 0 0 1 0-2.666zm4.667 0a1.333 1.333 0 1 1 0 2.666 1.333 1.333 0 0 1 0-2.666zm-9.334 0a1.333 1.333 0 1 1 0 2.666 1.333 1.333 0 0 1 0-2.666z"
            ></path>
          </g>
        </svg>
      </button>
      <div
        ref={ref}
        className={classnames(
          "absolute right-0 mt-1 py-2 w-48 bg-white rounded-lg shadow-xl border-2 z-50",
          {
            hidden: !displayed,
          }
        )}
      >
        {children}
      </div>
    </div>
  );
};
