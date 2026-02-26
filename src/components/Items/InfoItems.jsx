import React from "react";
import { cn } from "../../utils/utils";


const InfoItem = ({ label, value, className }) => {
  return (
    <div className={cn("space-y-2", className)}>
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <div className="text-base font-normal text-gray-900">{value || "-"}</div>
    </div>
  );
};
  
export default InfoItem;