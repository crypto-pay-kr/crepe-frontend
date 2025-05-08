import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BottomNav from "@/components/common/BottomNavigate";
import Header from "@/components/common/Header";
import ShopInfo from "@/components/shoppingmall/ShoppingmallInfo";
import Button from "@/components/common/Button";
import { ShoppingCart, ChevronUp } from "lucide-react";
import { CartItem } from "@/types/cart";
import { getStoreDetail } from "@/api/shop";
import { GetOneStoreDetailResponse, StoreDetail } from "@/types/store";

function MallDetailPage() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [showCartPreview, setShowCartPreview] = useState(false);
    const [cartExpanded, setCartExpanded] = useState(false);
    const [activeCategory, setActiveCategory] = useState("추천메뉴");
    const [storeDetail, setStoreDetail] = useState<GetOneStoreDetailResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const savedCart = localStorage.getItem("cartItems");
        if (savedCart) {
            setCartItems(JSON.parse(savedCart));
        }
    }, []);

    // 1) 가게 상세 정보 API 호출
    useEffect(() => {
        const fetchStoreDetail = async () => {
            try {
                setLoading(true);
                if (!id) throw new Error("가게 ID가 유효하지 않습니다.");

                const data: StoreDetail = await getStoreDetail(id);

                const mappedData: GetOneStoreDetailResponse = {
                    likeCount: data.likeCount,
                    storeName: data.storeName,
                    storeAddress: data.storeAddress,
                    storeImageUrl: data.storeImageUrl,
                    coinStatus: data.coinStatus,
                    menuList: data.menuList,
                };

                setStoreDetail(mappedData);
            } catch (err) {
                setError(err instanceof Error ? err.message : "알 수 없는 오류");
            } finally {
                setLoading(false);
            }
        };

        fetchStoreDetail();
        window.scrollTo(0, 0);
    }, [id]);

    // 2) 장바구니에 상품 추가
    const addToCart = (item: Omit<CartItem, "storeId" | "quantity">) => {
        const storeId = Number(id); // URL 파라미터에서 가져온 id를 숫자로 변환

        setShowCartPreview(true);

        setCartItems((prev) => {
            // 이미 같은 storeId, 같은 item.id를 가진 아이템이 있는지 검사
            const existingItem = prev.find(
                (cartItem) => cartItem.id === item.id && cartItem.storeId === storeId
            );

            if (existingItem) {
                // 이미 있으면 수량만 +1
                const updatedCart = prev.map((cartItem) =>
                    cartItem.id === item.id && cartItem.storeId === storeId
                        ? { ...cartItem, quantity: cartItem.quantity + 1 }
                        : cartItem
                );
                localStorage.setItem("cartItems", JSON.stringify(updatedCart));
                return updatedCart;
            } else {
                // 새 아이템
                const newCart = [
                    ...prev,
                    {
                        ...item,
                        storeId: storeId, // 가게 ID 추가
                        quantity: 1,      // 새 상품이므로 수량은 1
                    },
                ];
                localStorage.setItem("cartItems", JSON.stringify(newCart));
                return newCart;
            }
        });
    };

    // 3) 장바구니 아이템 수량 업데이트
    const updateItemQuantity = (itemId: number, change: number) => {
        setCartItems((prevItems) =>
            prevItems
                .map((item) => {
                    if (item.id === itemId) {
                        const newQuantity = Math.max(0, item.quantity + change);
                        return { ...item, quantity: newQuantity };
                    }
                    return item;
                })
                .filter((item) => item.quantity > 0) // 수량이 0인 아이템 제거
        );

        if (cartItems.length === 0) {
            setShowCartPreview(false);
            setCartExpanded(false);
        }
    };

    // 4) 장바구니 총합 계산
    const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
    const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

    // 5) 로딩 및 에러 처리
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

    // 6) 렌더링
    return (
        <div className="flex flex-col h-full bg-gray-50 relative">
            <Header title={storeDetail.storeName} isStore={true} />

            <main className="flex-1 overflow-auto pb-16">
                {/* 가게 정보 */}
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

                {/* 메뉴 목록 */}
                <div className="bg-white pb-4">
                    <div className="divide-y divide-gray-100 px-5">
                        {storeDetail.menuList.map((item) => (
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
                                            onClick={() =>
                                                addToCart({
                                                    id: item.menuId,
                                                    name: item.menuName,
                                                    price: item.menuPrice,
                                                    image: item.menuImage,
                                                })
                                            }
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

            {/* 하단 네비게이션 */}
            <BottomNav />

            {/* 장바구니 미리보기 */}
            {cartItems.length > 0 && (
                <div className="fixed bottom-16 left-0 right-0 z-20 flex justify-center">
                    <div className="bg-white border-t border-gray-200 shadow-lg rounded-t-lg w-full max-w-md mx-auto">
                        {/* 장바구니 헤더 */}
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
                                <ChevronUp
                                    className={`h-5 w-5 text-gray-500 transition-transform ${
                                        cartExpanded ? "rotate-180" : ""
                                    }`}
                                />
                            </div>
                        </div>

                        {/* 장바구니 상세 */}
                        <div
                            className={`transition-all duration-300 ${
                                cartExpanded ? "max-h-48 overflow-y-auto" : "max-h-0 overflow-hidden"
                            }`}
                        >
                            <div className="px-5 pb-2">
                                <div className="bg-gray-50 rounded-lg p-3 mb-3">
                                    {cartItems.map((item) => (
                                        <div
                                            key={item.id}
                                            className="flex justify-between items-center py-2"
                                        >
                                            <div className="flex-1">
                                                <p className="font-medium text-gray-900">
                                                    {item.name}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    {item.price.toLocaleString()} KRW
                                                </p>
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
                                        localStorage.setItem("cartItems", JSON.stringify([]));
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