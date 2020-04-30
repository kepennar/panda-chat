import React, { FC, ChangeEvent } from "react";
import styles from "./Switch.module.scss";

interface SwitchProps {
  id: string;
  label: string;
  checked: boolean;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}
export const Switch: FC<SwitchProps> = ({
  id,
  label,
  checked,
  onChange,
  disabled,
}) => {
  return (
    <div className={styles.switch}>
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
      />
      <label htmlFor={id}>{label}</label>
    </div>
  );
};
