import classnames from "classnames";
import React, { FC } from "react";
import { User } from "../../model";
import md5 from "md5-hex";

interface AvatarProps {
  user: User;
  displayYou?: boolean;
  size?: "normal" | "small";
}

function avatarPhotoUrl(user: User) {
  return user.photoURL || `https://www.gravatar.com/avatar/${md5(user.email)}`;
}
export const Avatar: FC<AvatarProps> = ({
  user,
  displayYou = false,
  size = "normal",
}) => {
  return (
    <div
      className={classnames(
        "flex items-center rounded-full bg-white border border-gray-200",
        {
          "pr-4": size === "normal",
          "h-10": size === "normal",
          "pr-2": size === "small",
          "h-6": size === "small",
        }
      )}
    >
      <img
        className={classnames("rounded-full h-full bg-cover", {
          "w-10": size === "normal",
          "w-6": size === "small",
        })}
        src={avatarPhotoUrl(user)}
        alt="avatar"
      />
      <div className="ml-3 text-sm">
        {displayYou ? "You" : user.displayName}
      </div>
    </div>
  );
};
