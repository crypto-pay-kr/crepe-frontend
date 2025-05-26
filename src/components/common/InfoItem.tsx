import React from "react";

interface InfoItemProps {
  text: string;
}

export default function InfoItem({ text }: InfoItemProps) {
  return (
    <div className="flex items-start">
      <div className="w-2 h-2 rounded-full bg-gray-400 mt-2 mr-2"></div>
      <div>{text}</div>
    </div>
  );
}