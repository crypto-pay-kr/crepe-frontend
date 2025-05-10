import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "@/components/common/Header";
import Button from "@/components/common/Button";
import BottomNav from "@/components/common/BottomNavigate";
import ImageUploader from "@/components/common/ImageUploader";
import Input from "@/components/common/Input";
import { fetchStoreMenuDetail, patchStoreMenu, deleteStoreMenu } from "@/api/store";

interface MenuItemData {
  id?: number;
  name: string;
  price: string;
  image?: File | null;
}

export default function MenuEditPage(): React.ReactElement {
  const navigate = useNavigate();
  const { menuId, storeId } = useParams<{ menuId?: string; storeId?: string }>();

  const [menuItem, setMenuItem] = useState<MenuItemData>({
    name: "",
    price: "",
    image: null,
  });

  // 메뉴 상세 조회
  const fetchMenuDetails = async () => {
    if (!menuId) return;
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        alert("로그인이 필요합니다.");
        navigate("/login");
        return;
      }
      const data = await fetchStoreMenuDetail(token, menuId);
      setMenuItem({
        id: data.menuId,
        name: data.menuName,
        price: data.menuPrice.toString(),
        image: null,
      });
    } catch (err) {
      console.error("메뉴 조회 실패:", err);
      alert("메뉴 조회 중 오류가 발생했습니다.");
    }
  };

  useEffect(() => {
    fetchMenuDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [menuId]);

  // 입력 값 핸들러
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMenuItem({ ...menuItem, name: e.target.value });
  };
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    setMenuItem({ ...menuItem, price: value });
  };
  const handleImageChange = (file: File) => {
    setMenuItem({ ...menuItem, image: file });
  };

  // 메뉴 수정
  const handleUpdate = async () => {
    if (!menuId) {
      alert("메뉴 혹은 가게 ID가 유효하지 않습니다.");
      return;
    }
    if (!menuItem.name.trim() || !menuItem.price.trim()) {
      alert("이름과 가격을 입력해주세요.");
      return;
    }

    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        alert("로그인이 필요합니다.");
        navigate("/login");
        return;
      }
      const formData = new FormData();
      formData.append(
        "menuData",
        new Blob(
          [
            JSON.stringify({
              name: menuItem.name,
              price: parseInt(menuItem.price, 10),
            }),
          ],
          { type: "application/json" }
        )
      );
      if (menuItem.image) {
        formData.append("menuImage", menuItem.image);
      }

      await patchStoreMenu(token, menuId, formData);
      alert("메뉴가 수정되었습니다.");
      navigate(-1);
    } catch (err) {
      console.error("메뉴 수정 실패:", err);
      alert("메뉴 수정 중 오류가 발생했습니다.");
    }
  };

  // 메뉴 삭제
  const handleDelete = async () => {
    if (!menuId) {
      alert("메뉴 ID가 없습니다.");
      return;
    }
    if (!window.confirm("정말 이 메뉴를 삭제하시겠습니까?")) return;
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        alert("로그인이 필요합니다.");
        navigate("/login");
        return;
      }
      await deleteStoreMenu(token, menuId);
      alert("메뉴가 삭제되었습니다.");
      navigate(-1);
    } catch (err) {
      console.error("메뉴 삭제 실패:", err);
      alert("메뉴 삭제 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <Header title="메뉴 수정" />
      <main className="flex-1 p-4 bg-white overflow-auto">
        <div className="mb-4 mt-5">
          <Input
            label="음식명"
            value={menuItem.name}
            onChange={handleNameChange}
            placeholder="음식명을 입력해주세요."
          />
        </div>
        <div className="mb-4">
          <Input
            label="가격"
            value={menuItem.price}
            onChange={handlePriceChange}
            placeholder="가격을 입력해주세요."
            type="text"
          />
        </div>
        <div className="mb-6">
          <ImageUploader
            label="음식 사진"
            previewLabel="선택된 이미지"
            onChange={handleImageChange}
            value={menuItem.image || undefined}
          />
        </div>
        <div className="space-y-3 mt-6">
          <Button
            text="메뉴 삭제"
            onClick={handleDelete}
            className="w-full bg-red-500 text-white py-3 rounded-lg"
          />
          <Button
            text="메뉴 수정"
            onClick={handleUpdate}
            className="w-full bg-[#0a2e65] text-white py-3 rounded-lg"
          />
        </div>
      </main>
      <BottomNav />
    </div>
  );
}