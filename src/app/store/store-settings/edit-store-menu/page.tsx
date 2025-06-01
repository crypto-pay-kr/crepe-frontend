import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "@/components/common/Header";
import Button from "@/components/common/Button";
import BottomNav from "@/components/common/BottomNavigate";
import ImageUploader from "@/components/common/ImageUploader";
import Input from "@/components/common/Input";
import { toast } from "react-toastify";
import { ApiError } from "@/error/ApiError";
import {
  fetchStoreMenuDetail,
  patchStoreMenu,
  deleteStoreMenu,
} from "@/api/store";

interface MenuItemData {
  id?: number;
  name: string;
  price: string;
  imageFile?: File | null;
  imageUrl?: string;
}

export default function MenuEditPage(): React.ReactElement {
  const navigate = useNavigate();
  const { menuId } = useParams<{ menuId?: string }>();

  const [menuItem, setMenuItem] = useState<MenuItemData>({
    name: "",
    price: "",
    imageFile: null,
    imageUrl: "",
  });

  // 메뉴 상세 조회
  const fetchMenuDetails = async () => {
    if (!menuId) return;
    try {
      const token = sessionStorage.getItem("accessToken");
      if (!token) {
        toast.error("로그인이 필요합니다.");
        navigate("/login");
        return;
      }
      const data = await fetchStoreMenuDetail(menuId);
      setMenuItem({
        id: data.menuId,
        name: data.menuName,
        price: data.menuPrice.toString(),
        imageUrl: data.menuImage || "",
        imageFile: null,
      });
    } catch (err) {
      if (err instanceof ApiError) {
        toast.error(`${err.message}`);
      } else {
        toast.error("메뉴 조회 중 오류가 발생했습니다.");
      }
    }
  };
  useEffect(() => {
    fetchMenuDetails();
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
    setMenuItem({ ...menuItem, imageFile: file });
  };

  // 메뉴 수정
  const handleUpdate = async () => {
    if (!menuId) {
      toast.error("메뉴 혹은 가게 ID가 유효하지 않습니다.");
      return;
    }
    if (!menuItem.name.trim() || !menuItem.price.trim()) {
      toast.error("이름과 가격을 입력해주세요.");
      return;
    }

    try {
      const token = sessionStorage.getItem("accessToken");
      if (!token) {
        toast.error("로그인이 필요합니다.");
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

      if (menuItem.imageFile) {
        formData.append("menuImage", menuItem.imageFile);
      } else if (menuItem.imageUrl) {
        const res = await fetch(menuItem.imageUrl);
        const blob = await res.blob();
        formData.append("menuImage", blob, "existing_image.jpg");
      }

      await patchStoreMenu(menuId, formData);
      toast.success("메뉴가 수정되었습니다.");
      navigate(-1);
    } catch (err) {
      if (err instanceof ApiError) {
        toast.error(`${err.message}`); // ApiError의 메시지를 toast로 표시
      } else {
        toast.error("메뉴 수정 중 오류가 발생했습니다."); // 일반 오류 처리
      }
    }
  };


  // 메뉴 삭제
  const handleDelete = async () => {
    if (!menuId) {
      toast.error("메뉴 ID가 없습니다.");
      return;
    }
    if (!window.confirm("정말 이 메뉴를 삭제하시겠습니까?")) return;

    try {
      const token = sessionStorage.getItem("accessToken");
      if (!token) {
        toast.error("로그인이 필요합니다.");
        navigate("/login");
        return;
      }
      await deleteStoreMenu(menuId);
      toast.success("메뉴가 삭제되었습니다.");
      navigate(-1);
    } catch (err) {
      if (err instanceof ApiError) {
        toast.error(`${err.message}`); // ApiError의 메시지를 toast로 표시
      } else {
        toast.error("메뉴 삭제 중 오류가 발생했습니다."); // 일반 오류 처리
      }
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
            // 새 파일이 있다면 File 객체, 없으면 undefined -> 내부적으로 기존 URL만 미리보기
            value={menuItem.imageFile || undefined}
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