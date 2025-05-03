import BottomNav from "@/components/common/BottomNavigate";
import Header from "@/components/common/Header";
import ShopInfo from "@/components/shoppingmall/ShoppingmallInfo";
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Button from "@/components/common/Button";
import { ShoppingCart, ChevronUp } from "lucide-react";
import { getStoreDetail } from "@/api/shop";

function MallDetailPage() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [cartItems, setCartItems] = useState<Array<{id: number; name: string; price: number; quantity: number}>>([]);
    const [showCartPreview, setShowCartPreview] = useState(false);
    const [activeCategory, setActiveCategory] = useState("추천메뉴");
    const [cartExpanded, setCartExpanded] = useState(false);
    const [storeDetail, setStoreDetail] = useState<GetOneStoreDetailResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch store details from API
    useEffect(() => {
        const fetchStoreDetail = async () => {
            try {
                setLoading(true);
                const data = await getStoreDetail(id);
                setStoreDetail(data);
                setLoading(false);
            } catch (err) {
                setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다');
                setLoading(false);
            }
        };

        fetchStoreDetail();
        window.scrollTo(0, 0);
    }, [id]);

    const addToCart = (item) => {
        const existingItem = cartItems.find((cartItem) => cartItem.id === item.id);
        
        // Show cart preview when items are added
        setShowCartPreview(true);

        if (existingItem) {
            setCartItems(
                cartItems.map((cartItem) =>
                    cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem
                )
            );
        } else {
            setCartItems([...cartItems, { ...item, quantity: 1 }]);
        }
    };

    const updateItemQuantity = (itemId, change) => {
        setCartItems(prevItems => 
            prevItems.map(item => {
                if (item.id === itemId) {
                    const newQuantity = Math.max(0, item.quantity + change);
                    return { ...item, quantity: newQuantity };
                }
                return item;
            }).filter(item => item.quantity > 0)
        );

        if (cartItems.length === 0) {
            setShowCartPreview(false);
            setCartExpanded(false);
        }
    };

    // Calculate total items and price
    const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
    const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

    // Handle loading and error states
    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p className="text-lg font-bold text-gray-500">가게 정보를 불러오는 중...</p>
            </div>
        );
    }

    if (error || !storeDetail) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p className="text-lg font-bold text-gray-500">가게를 찾을 수 없습니다.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-gray-50 relative">
            <Header title={storeDetail.storeName} isStore={true} />
            
            <main className="flex-1 overflow-auto pb-16">
                {/* Store Details Section */}
                <div className="bg-white shadow-sm mb-2">
    <div className="relative">
        <img
            src={storeDetail.storeImageUrl || "/store-image.png"}
            alt={`${storeDetail.storeName} 가게사진`}
            className="w-full h-56 object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
            <h2 className="text-white text-xl font-bold">{storeDetail.storeName}</h2>
        </div>
    </div>
    
    <div className="p-4">
        <ShopInfo 
            storeId={Number(id)} 
            likeCount={storeDetail.likeCount}
            coinStatus={storeDetail.coinStatus}
            storeName={storeDetail.storeName}
            storeAddress={storeDetail.storeAddress}
        />
    </div>
</div>
                
                {/* Menu Categories */}
                <div className="bg-white sticky top-0 z-10 shadow-sm">
                    <div className="overflow-x-auto">
                        <div className="flex border-b border-gray-200">
                            <button 
                                className={`px-5 py-3 text-sm font-medium relative transition-all ${
                                    activeCategory === "전체" 
                                        ? "text-[#002169] font-semibold" 
                                        : "text-gray-500"
                                }`}
                                onClick={() => setActiveCategory("전체")}
                            >
                                전체
                                {activeCategory === "전체" && (
                                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#002169] rounded-t-full"></span>
                                )}
                            </button>
                            
                            <button
                                className={`px-5 py-3 text-sm font-medium relative transition-all ${
                                    activeCategory === "추천메뉴"
                                        ? "text-[#002169] font-semibold"
                                        : "text-gray-500"
                                }`}
                                onClick={() => setActiveCategory("추천메뉴")}
                            >
                                추천메뉴
                                {activeCategory === "추천메뉴" && (
                                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#002169] rounded-t-full"></span>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
                
                {/* Menu Items */}
                <div className="bg-white pb-4">
                    <div className="divide-y divide-gray-100 px-5">
                        {storeDetail.menuList && (activeCategory === "전체" ? storeDetail.menuList : 
                            storeDetail.menuList).map((item) => (
                            <div key={item.menuId} className="py-4">
                                <div className="flex justify-between">
                                    <div className="flex-1 pr-4">
                                        <h3 className="font-bold text-gray-900">{item.menuName}</h3>
                                        <p className="text-sm text-gray-500 mt-1">
                                            {"신선한 재료로 만든 특별한 메뉴입니다"}
                                        </p>
                                        <div className="mt-2 font-bold text-gray-900">
                                            {item.menuPrice.toLocaleString()} KRW
                                        </div>
                                    </div>
                                    
                                    <div className="relative">
                                        <div className="h-24 w-24 rounded-lg overflow-hidden bg-gray-100">
                                            <img 
                                                src={item.menuImage || "/store-image.png"} 
                                                alt={item.menuName} 
                                                className="h-full w-full object-cover"
                                            />
                                        </div>
                                        <button 
                                            onClick={() => addToCart({
                                                id: item.menuId,
                                                name: item.menuName,
                                                price: item.menuPrice
                                            })}
                                            className="absolute -bottom-2 -right-2 bg-[#002169] rounded-full p-2 shadow-md hover:bg-[#001d5a]"
                                        >
                                            <svg 
                                                width="16" 
                                                height="16" 
                                                viewBox="0 0 24 24" 
                                                fill="none" 
                                                stroke="white" 
                                                strokeWidth="2" 
                                                strokeLinecap="round" 
                                                strokeLinejoin="round"
                                            >
                                                <line x1="12" y1="5" x2="12" y2="19"></line>
                                                <line x1="5" y1="12" x2="19" y2="12"></line>
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
            
            {/* 하단 영역 - 바텀 네비게이션 */}
            <BottomNav />
            
            {/* 장바구니 미리보기 */}
                                    {cartItems.length > 0 && (
                <div className="fixed bottom-16 left-0 right-0 z-20 flex justify-center">
                    <div className="bg-white border-t border-gray-200 shadow-lg rounded-t-lg w-full max-w-md mx-auto">
                        {/* Cart Header - 항상 보이는 영역 */}
                        <div 
                            className="py-3 px-5 flex items-center justify-between cursor-pointer"
                            onClick={() => setCartExpanded(!cartExpanded)}
                        >
                            <div className="flex items-center">
                                <div className="bg-[#002169] rounded-full p-2 mr-3">
                                    <ShoppingCart className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <span className="text-sm font-bold text-gray-900">
                                        {totalItems}개 항목
                                    </span>
                                    <p className="text-xs text-gray-500">탭하여 장바구니 상세보기</p>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <span className="font-bold text-lg mr-2">
                                    {totalPrice.toLocaleString()} KRW
                                </span>
                                <ChevronUp className={`h-5 w-5 text-gray-500 transition-transform ${cartExpanded ? 'rotate-180' : ''}`} />
                            </div>
                        </div>
                        
                        {/* 확장 가능한 장바구니 상세 정보 */}
                        <div className={`transition-all duration-300 ${cartExpanded ? 'max-h-48 overflow-y-auto' : 'max-h-0 overflow-hidden'}`}>
                            <div className="px-5 pb-2">
                                <div className="bg-gray-50 rounded-lg p-3 mb-3">
                                    {cartItems.map((item) => (
                                        <div key={item.id} className="flex justify-between items-center py-2">
                                            <div className="flex-1">
                                                <p className="font-medium text-gray-900">{item.name}</p>
                                                <p className="text-sm text-gray-500">{item.price.toLocaleString()} KRW</p>
                                            </div>
                                            <div className="flex items-center">
                                                <button 
                                                    onClick={(e) => {
                                                        e.stopPropagation(); 
                                                        updateItemQuantity(item.id, -1);
                                                    }}
                                                    className="w-8 h-8 flex items-center justify-center text-gray-500 bg-white rounded-full border border-gray-200"
                                                >
                                                    -
                                                </button>
                                                <span className="w-8 text-center font-medium">
                                                    {item.quantity}
                                                </span>
                                                <button 
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        updateItemQuantity(item.id, 1);
                                                    }}
                                                    className="w-8 h-8 flex items-center justify-center text-gray-500 bg-white rounded-full border border-gray-200"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        
                        {/* 장바구니 액션 버튼 */}
                        <div className="px-5 py-3 border-t border-gray-100">
                            <div className="flex justify-center gap-3">
                                <Button
                                    text="취소하기"
                                    onClick={() => {
                                        setCartItems([]);
                                        setShowCartPreview(false);
                                        setCartExpanded(false);
                                    }}
                                    className="w-1/2 py-3 rounded-lg font-medium bg-gray-100 text-gray-700 border border-gray-200"
                                />
                                <Button
                                    text="주문하기"
                                    onClick={() => navigate("/mall/store/cart")}
                                    className="w-1/2 py-3 rounded-lg font-medium bg-[#002169] text-white shadow-sm"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default MallDetailPage;