import React, { FC, FormEvent } from "react";

interface AuthFormContainerProps {
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}
export const AuthFormContainer: FC<AuthFormContainerProps> = ({
  onSubmit,
  children,
}) => {
  return (
    <div className="w-full max-w-sm m-auto">
      <form
        onSubmit={onSubmit}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
      >
        {children}
      </form>
    </div>
  );
};
