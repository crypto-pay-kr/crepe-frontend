import { useNavigate } from "react-router-dom";
interface BottomNavigationProps {
    activeTab: "home" | "shopping" | "mypage";
}

export default function BottomNavigation({ activeTab }: BottomNavigationProps) {
    const navigate = useNavigate();

    return (
        <div className="h-16 bg-[#0a2158] flex items-center justify-around text-white">
            <button
                className={`flex flex-col items-center justify-center w-1/3 ${activeTab === "home" ? "opacity-100" : "opacity-70"}`}
                onClick={() => console.log("홈으로 이동")}
            >
                <span className="text-xs mt-1 text-white">홈</span>
            </button>

            <button
                className={`flex flex-col items-center justify-center w-1/3 ${activeTab === "shopping" ? "opacity-100" : "opacity-70"}`}
                onClick={() => console.log("쇼핑으로 이동")}
            >
                <span className="text-xs mt-1 text-white">쇼핑몰</span>
            </button>

            <button
                className={`flex flex-col items-center justify-center w-1/3 ${activeTab === "mypage" ? "opacity-100" : "opacity-70"}`}
                onClick={() => navigate("/mypage")}
            >
                <span className="text-xs mt-1 text-white">마이페이지</span>
            </button>
        </div>
    );
}