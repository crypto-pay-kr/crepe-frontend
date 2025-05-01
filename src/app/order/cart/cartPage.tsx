import Header from "@/components/common/Header";
import { useNavigate, useParams } from "react-router-dom";
import { stores } from "@/mocks/stores";
import ShopInfo from "@/components/shoppingmall/ShoppingmallInfo";
import BottomNav from "@/components/common/BottomNavigate";
import CartItemList from "@/components/order/CartItemList";
import { useCartItems } from "@/hooks/useCartItems";
import CartSummary from "@/components/order/CartSummary";
import AddMoreItemsButton from "@/components/order/AddMoreItemButton";

export default function CartPage() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    
    const storeId = id ? parseInt(id) : 1; // 기본값 설정
    const store = stores.find((store) => store.id === storeId);
    
    const { items, increaseQuantity, decreaseQuantity, calculateTotalPrice } = useCartItems();
    
    return (
        <div className="flex flex-col h-screen bg-gray-50">
            {/* 헤더를 일반 흐름에 배치 (fixed 없음) */}
            <Header title="장바구니" isStore={false} />
            
            {/* 스크롤 가능한 메인 콘텐츠 영역 */}
            <div className="flex-1 overflow-y-auto">
                <div className="p-5">
                    {/* 상점 정보 카드 */}
                    <div className="mb-6 bg-white rounded-xl shadow-sm overflow-hidden">
                        <ShopInfo storeId={storeId} />
                    </div>
                    
                    {/* 장바구니 섹션 */}
                    <div className="bg-white rounded-xl shadow-sm p-5 mb-6">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-3">
                            주문 상품 목록
                        </h2>
                        
                        {/* 장바구니 아이템 목록 */}
                        <div className="space-y-5">
                            <CartItemList 
                                items={items} 
                                onIncrease={increaseQuantity} 
                                onDecrease={decreaseQuantity} 
                            />
                        </div>
                        
                        {/* 더 담으러 가기 버튼 */}
                        <div className="mt-6 pt-4 border-t border-gray-100">
                            <AddMoreItemsButton onClick={() => navigate("/shopping/store")} />
                        </div>
                    </div>
                    
                    {/* 결제 정보 카드 */}
                    <div className="bg-white rounded-xl shadow-sm p-5 mb-12">
                        <CartSummary 
                            totalPrice={calculateTotalPrice()} 
                            onCheckoutClick={() => navigate("/mall/store/order")} 
                        />
                    </div>
                </div>
            </div>
            
            {/* 바텀 네비게이션은 하단에 배치 (fixed 없음) */}
            <BottomNav />
        </div>
    );
}