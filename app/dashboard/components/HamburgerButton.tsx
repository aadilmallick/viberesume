"use client";

import React from "react";

type HamburgerButtonProps = {
  isOpen: boolean;
  onClick?: () => void;
  ariaLabel?: string;
  className?: string;
};

const HamburgerButton: React.FC<HamburgerButtonProps> = ({
  isOpen,
  onClick,
  ariaLabel = "Open menu",
  className = "",
}) => {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      aria-expanded={isOpen}
      aria-controls="menu"
      onClick={onClick}
      className={`relative w-10 h-10 flex flex-col justify-center items-center focus:outline-none ${className}`}
    >
      <span
        className={`block w-7 h-0.5 bg-current transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-y-2 rotate-45" : ""
        }`}
      />
      <span
        className={`block w-7 h-0.5 bg-current my-1 transition-opacity duration-300 ease-in-out ${
          isOpen ? "opacity-0" : "opacity-100"
        }`}
      />
      <span
        className={`block w-7 h-0.5 bg-current transition-transform duration-300 ease-in-out ${
          isOpen ? "-translate-y-2 -rotate-45" : ""
        }`}
      />
    </button>
  );
};

export default HamburgerButton;
