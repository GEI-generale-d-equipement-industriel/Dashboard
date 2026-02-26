import React from "react";
import { cn } from "../../utils/utils";

const Avatar = ({ firstName = "", lastName = "", size = "md", className }) => {
  const initials = `${firstName ? firstName[0] : ""}${lastName ? lastName[0] : ""}`;
  
  const sizeClasses = {
    sm: "w-10 h-10 text-sm",
    md: "w-16 h-16 text-lg",
    lg: "w-24 h-24 text-2xl",
    xl: "w-32 h-32 text-3xl",
  };
  
  return (
    <div 
      className={cn(
        "rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center font-semibold text-white uppercase",
        sizeClasses[size],
        className
      )}
    >
      {initials || "?"}
    </div>
  );
};

export default Avatar;