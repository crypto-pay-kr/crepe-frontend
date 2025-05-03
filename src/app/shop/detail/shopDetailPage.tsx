import BottomNav from "@/components/common/BottomNavigate";
import Header from "@/components/common/Header";
import ShopInfo from "@/components/shoppingmall/ShoppingmallInfo";
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { stores, menuItems } from "@/mocks/stores";
import Button from "@/components/common/Button";
import { ShoppingCart, ChevronUp } from "lucide-react";
import { fetchStoreDetail } from "@/api/shop";


function MallDetailPage() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    // store: API에서 내려오는 값을 그대로 저장 (storeName, storeAddress, storeImageUrl, menuList 등)
    const [store, setStore] = useState<{
        storeName: string;
        storeAddress: string;
        storeImageUrl: string;
        likeCount: number;
        coinStatus: any[];
        menuList: {
            menuId: number;
            menuName: string;
            menuPrice: number;
            menuImage: string;
        }[];
    } | null>(null);

    // 장바구니 (로컬 스토리지와 동기화)
    const [cartItems, setCartItems] = useState<{ id: number; name: string; price: number; quantity: number }[]>([]);
    const [showCartPreview, setShowCartPreview] = useState(false);
    const [cartExpanded, setCartExpanded] = useState(false);

    // 페이지 마운트 시 화면 상단으로 스크롤
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // 컴포넌트 마운트 시 이전 장바구니 로드
    useEffect(() => {
        const savedCart = localStorage.getItem("cartItems");
        if (savedCart) {
            setCartItems(JSON.parse(savedCart));
        }
    }, []);

    // cartItems가 변경될 때 마다 로컬 스토리지에 저장
    useEffect(() => {
        localStorage.setItem("cartItems", JSON.stringify(cartItems));
    }, [cartItems]);

    // 가게 상세 정보 가져오기
    useEffect(() => {
        const loadStoreDetail = async () => {
            try {
                if (!id) return;
                const data = await fetchStoreDetail(Number(id));
                setStore({
                    storeName: data.storeName,
                    storeAddress: data.storeAddress,
                    storeImageUrl: data.storeImageUrl,
                    likeCount: data.likeCount,
                    coinStatus: data.coinStatus || [],
                    menuList: data.menuList || [],
                });
            } catch (error) {
                console.error("Failed to fetch store details:", error);
            }
        };

        loadStoreDetail();
    }, [id]);

    // 장바구니에 메뉴 추가
    const addToCart = (item: { menuId: number; menuName: string; menuPrice: number; menuImage: string }) => {
        const existingItem = cartItems.find((cartItem) => cartItem.id === item.menuId);
        setShowCartPreview(true); // 장바구니 미리보기 표시

        if (existingItem) {
            setCartItems((prev) =>
                prev.map((cartItem) =>
                    cartItem.id === item.menuId
                        ? { ...cartItem, quantity: cartItem.quantity + 1 }
                        : cartItem
                )
            );
        } else {
            setCartItems((prev) => [
                ...prev,
                {
                    id: item.menuId,
                    name: item.menuName,
                    price: item.menuPrice,
                    image: item.menuImage, // menuImage 추가
                    quantity: 1,
                },
            ]);
        }
    };


    // 장바구니 수량 변경
    const updateItemQuantity = (itemId: number, change: number) => {
        setCartItems((prev) =>
            prev
                .map((item) => {
                    if (item.id === itemId) {
                        const newQuantity = Math.max(0, item.quantity + change);
                        return { ...item, quantity: newQuantity };
                    }
                    return item;
                })
                .filter((item) => item.quantity > 0)
        );

        // 장바구니가 비면 프리뷰, 펼침 옵션 해제
        if (cartItems.length === 0) {
            setShowCartPreview(false);
            setCartExpanded(false);
        }
    };

    // store가 없으면 로딩/에러 처리
    if (!store) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p className="text-lg font-bold text-gray-500">
                    가게를 찾을 수 없습니다.
                </p>
            </div>
        );
    }

    // 총 아이템 개수, 총 가격
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <div className="flex flex-col h-full bg-gray-50 relative">
            <Header title={store.storeName} isStore />

            <main className="flex-1 overflow-auto pb-16">
                {/* 가게 정보 섹션 */}
                <div className="bg-white shadow-sm mb-2">
                    <div className="relative">
                        <img
                            src={store.storeImageUrl || "/store-image.png"}
                            alt={store.storeName}
                            className="w-full h-56 object-cover"
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                            <h2 className="text-white text-xl font-bold">{store.storeName}</h2>
                            <p className="text-white text-sm">{store.storeAddress}</p>
                        </div>
                    </div>
                    <div className="p-4">
                        <p className="text-gray-500">좋아요: {store.likeCount}</p>
                    </div>
                </div>

                {/* 메뉴 리스트 렌더링 */}
                <div className="bg-white pb-4">
                    <div className="divide-y divide-gray-100 px-5">
                        {store.menuList.map((item) => (
                            <div key={item.menuId} className="py-4">
                                <div className="flex justify-between">
                                    <div className="flex-1 pr-4">
                                        <h3 className="font-bold text-gray-900">{item.menuName}</h3>
                                        <div className="mt-2 font-bold text-gray-900">{item.menuPrice.toLocaleString()} KRW</div>
                                    </div>
                                    <div className="relative">
                                        <div className="h-24 w-24 rounded-lg overflow-hidden bg-gray-100">
                                            <img src={item.menuImage} alt={item.menuName} className="h-full w-full object-cover" />
                                        </div>
                                        <button
                                            onClick={() =>
                                                addToCart({
                                                    menuId: item.menuId,
                                                    menuName: item.menuName,
                                                    menuPrice: item.menuPrice,
                                                    menuImage: item.menuImage, // menuImage 전달
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

            <BottomNav />
            {/* 장바구니 미리보기 - 메인 콘텐츠보다 좁게 설정 */}
            {cartItems.length > 0 && (
                <div className="fixed bottom-16 left-0 right-0 z-20 flex justify-center">
                    <div className="bg-white border-t border-gray-200 shadow-lg rounded-t-lg max-w-[28%] w-[28%] mx-auto">
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
                                                        e.stopPropagation(); // 이벤트 버블링 방지
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
                                                        e.stopPropagation(); // 이벤트 버블링 방지
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
                                    onClick={() => {
                                        localStorage.setItem("cartItems", JSON.stringify(cartItems));
                                        navigate("/mall/store/cart");
                                    }}
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