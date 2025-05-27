import React from "react";

interface ProductLogoProps {
  imageUrl: string;
}

export function ProductLogo({ imageUrl }: ProductLogoProps) {
  return (
    <img src={imageUrl} alt="은행 로고" className="w-12 h-12 rounded-full" />
  );
}