import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../common/Header";
import { Home, ShoppingBag, User } from "lucide-react";
import BottomNav from "../common/BottomNavigate";
import { menuItems } from "@/mocks/stores"; // Import menuItems from stores.ts

export default function ShoppingMallDetail() {
  const navigate = useNavigate();
  const { id } = useParams(); // Retrieve the store ID from the route parameters
  const [cartItems, setCartItems] = useState<
    { id: number; name: string; price: number; quantity: number; storeId: number }[]
  >([]);
  const [showCartButton, setShowCartButton] = useState(false);

  const storeId = parseInt(id || "0", 10);
  const storeDetails = menuItems.find((item) => item.id === storeId);

  if (!storeDetails) {
    return <div>Store not found</div>;
  }

  const goBack = () => {
    navigate(-1);
  };

  const addToCart = (item: { id: number; name: string; price: number }) => {
    const currentStoreId = Number(id); // URL 파라미터에서 가져온 id를 숫자로 변환

    setCartItems((prev) => {
      // 기존 장바구니가 있고, 첫 번째 아이템의 storeId와 현재 storeId가 다르면 무조건 덮어쓰기
      if (prev.length > 0 && prev[0].storeId !== currentStoreId) {
        const newCart = [
          {
            ...item,
            storeId: currentStoreId,
            quantity: 1,
          },
        ];
        localStorage.setItem("cartItems", JSON.stringify(newCart));
        return newCart;
      }

      // 같은 storeId인 경우, 기존 항목 중 같은 item.id가 있는지 검사합니다.
      const existingItemIndex = prev.findIndex(
        (cartItem) => cartItem.id === item.id && cartItem.storeId === currentStoreId
      );

      let updatedCart;
      if (existingItemIndex >= 0) {
        // 이미 있으면 수량 증가
        updatedCart = prev.map((cartItem, idx) =>
          idx === existingItemIndex
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        // 새 항목 추가
        updatedCart = [
          ...prev,
          { ...item, storeId: currentStoreId, quantity: 1 },
        ];
      }
      localStorage.setItem("cartItems", JSON.stringify(updatedCart));
      return updatedCart;
    });

    setShowCartButton(true);
  };

  return (
    <>
      <div className="relative">
        <div className="w-full h-64 relative mb-4">
          <img
            src={storeDetails.image}
            alt={storeDetails.name}
            className="object-cover w-full h-full"
          />
        </div>
        <div className="p-4">
          <h1 className="text-xl font-bold">{storeDetails.name}</h1>
          <p className="text-lg text-blue-600">
            {parseInt(storeDetails.price).toLocaleString()} KRW
          </p>
          <button
            onClick={() =>
              addToCart({
                id: storeDetails.id,
                name: storeDetails.name,
                price: Number(storeDetails.price),
              })
            }
            className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </>
  );
}