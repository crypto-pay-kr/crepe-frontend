import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import Header from "@/components/common/Header";
import Button from "@/components/common/Button";
import BottomNav from "@/components/common/BottomNavigate";
import ImageUploader from "@/components/common/ImageUploader";
import Input from "@/components/common/Input";
import { storeMenuAdd } from "@/api/store";

interface MenuItemData {
  id?: string;
  name: string;
  price: string;
  image?: File | null;
}

const BASE_URL = import.meta.env.VITE_API_SERVER_URL;

export default function MenuAddPage(): React.ReactElement {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams<{ id?: string }>();

  const isAddMode = location.pathname === "/store/menu/add";
  const isEditMode = location.pathname === "/store/menu/edit" || location.pathname.startsWith("/store/menu/edit/");

  const [menuItem, setMenuItem] = useState<MenuItemData>({
    name: "",
    price: "",
    image: null,
  });

  useEffect(() => {
    if (isEditMode && id) {
      // 실제 구현에서는 API 호출로 데이터를 가져옵니다
      setMenuItem({
        id: id,
        name: "불고기 버거",
        price: "8000",
        image: null,
      });
    }
  }, [isEditMode, id]);

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

  const handleSubmit = async () => {
    if (!menuItem.name.trim()) {
      alert("음식명을 입력해주세요.");
      return;
    }

    if (!menuItem.price.trim()) {
      alert("가격을 입력해주세요.");
      return;
    }

    if (!menuItem.image) {
      alert("음식 사진을 업로드해주세요.");
      return;
    }

    try {
      const token = sessionStorage.getItem("accessToken");
      if (!token) {
        alert("로그인 정보가 없습니다. 다시 로그인해주세요.");
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
              price: menuItem.price,
            }),
          ],
          { type: "application/json" }
        )
      );
      formData.append("menuImage", menuItem.image);

      const response = await storeMenuAdd(formData);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "메뉴 등록에 실패했습니다.");
      }

      alert(isAddMode ? "메뉴가 추가되었습니다." : "메뉴가 수정되었습니다.");
      navigate(-1);
    } catch (err) {
      console.error("메뉴 등록 실패:", err);
      alert("메뉴 등록 중 오류가 발생했습니다.");
    }
  };

  const handleDelete = async () => {
    if (window.confirm("정말로 이 메뉴를 삭제하시겠습니까?")) {
      try {
        const token = sessionStorage.getItem("accessToken");
        if (!token) {
          alert("로그인 정보가 없습니다. 다시 로그인해주세요.");
          navigate("/login");
          return;
        }

        const response = await fetch(`${BASE_URL}/store/menu/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText || "메뉴 삭제에 실패했습니다.");
        }

        alert("메뉴가 삭제되었습니다.");
        navigate(-1);
      } catch (err) {
        console.error("메뉴 삭제 실패:", err);
        alert("메뉴 삭제 중 오류가 발생했습니다.");
      }
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <Header title={isAddMode ? "메뉴 추가" : "메뉴 수정"} />

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
            label="음식사진 업로드"
            previewLabel="선택된 이미지"
            onChange={handleImageChange}
            value={menuItem.image}
          />
        </div>

        <div className="space-y-3 mt-6">
          {isEditMode && (
            <Button text="삭제하기" onClick={handleDelete} className="w-full bg-red-500 text-white py-3 rounded-lg"></Button>
          )}
          <Button
            text={isAddMode ? "추가하기" : "수정하기"}
            onClick={handleSubmit}
            className="w-full bg-[#0a2e65] text-white py-3 rounded-lg"
          />
        </div>
      </main>

      <BottomNav />
    </div>
  );
}