import React, { ReactNode } from "react";

import { cn } from "../../helper";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: "small" | "large";
  className?: string;
  children?: ReactNode;
  outline?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  className,
  size = "small",
  outline = false,
  ...props
}) => {
  return (
    <button
      className={cn(
        `disabled:opacity-70 disabled:cursor-not-allowed rounded hover:opacity-80 transition w-full bg-[#2F74FD] text-white py-[8px] `,
        size === "small"
          ? " text-[16px] font-medium border-[1px]"
          : " text-[18px] font-semibold border-2",
        outline
          ? "bg-white border-[1px] border-[var(--softBg4)] text-[#4e4e4e]"
          : "bg-[#2F74FD] text-white   ",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
