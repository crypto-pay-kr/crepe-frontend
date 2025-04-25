'use client'

import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, ShoppingBag, User } from "lucide-react";
import Header from "@/components/common/Header";
import BottomNav from "@/components/common/BottomNavigate";
import PeriodFilter from "@/components/report/PeriodFilter";
import TotalSettlement from "@/components/report/TotalSettlement";
import AssetList from "@/components/report/AssetList";
import { CryptoAsset, Period } from "@/constants/report";



export default function SettlementReport(): React.ReactElement {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedPeriod, setSelectedPeriod] = useState<Period>("이번달");

  const periods: Period[] = ["이번달", "지난달", "3개월", "6개월", "12개월"];

  const assets: CryptoAsset[] = [
    {
      name: "리플",
      code: "XRP",
      logo: "/placeholder.svg?height=40&width=40",
      percentage: 15,
      amount: 0.3,
      value: 1000,
    },
    {
      name: "솔라나",
      code: "SOL",
      logo: "/placeholder.svg?height=40&width=40",
      percentage: 15,
      amount: 0.3,
      value: 1000,
    },
    {
      name: "테더",
      code: "USDT",
      logo: "/placeholder.svg?height=40&width=40",
      percentage: 15,
      amount: 0.3,
      value: 1000,
    },
  ];

  const totalValue = assets.reduce((sum, asset) => sum + asset.value, 0);
  const isSeller = location.pathname.includes('/store');
  
  const navItems = [
    {
      icon: <Home className="w-6 h-6" color="white" />,
      label: "홈",
      isActive: false,
      onClick: () => navigate("/home")
    },
    {
      icon: <ShoppingBag className="w-6 h-6" color="white" />,
      label: "쇼핑몰",
      isActive: false,
      onClick: () => navigate("/shop")
    },
    {
      icon: <User className="w-6 h-6" color="white" />,
      label: "마이페이지",
      isActive: true,
      onClick: () => navigate(isSeller ? "/store/my" : "/home/my")
    }
  ];

  return (
    <div className="flex flex-col h-screen">
      <Header title="결산 리포트" />
      
      <PeriodFilter 
        selectedPeriod={selectedPeriod}
        onPeriodChange={setSelectedPeriod}
        periods={periods}
      />
      <TotalSettlement totalValue={totalValue} />
      <AssetList assets={assets} />
      <BottomNav navItems={navItems} />
    </div>
  );
}