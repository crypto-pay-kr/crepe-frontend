import React, { useEffect, useState } from 'react'
import Button from '@/components/common/Button';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ApiError } from '@/error/ApiError';
import Header from '@/components/common/Header';
import BottomNav from '@/components/common/BottomNavigate';
import AddressInput from "@/components/coin/AddressInput";
import AddressInstructions from "@/components/coin/AddressInstructions";
import {
  unRegisterAccountAddress,
  isAccountAddressRegistered,
  registerAccountAddress,
  reRegisterAccountAddress,
} from '@/api/coin'

interface LocationState {
  symbol?: string;
  isUser?: boolean;
  useExistingAddress?: boolean;
  address?: string;
  tag?: string;
}

export default function AddCoinAddress() {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    symbol,
  } = location.state as LocationState || {};

  const [address, setAddress] = useState<string>();
  const [tagAddress, setTagAddress] = useState<string>();
  const [existingAddress, setExistingAddress] = useState<boolean>();
  const [addressStatus, setAddressStatus] = useState<'ACTIVE' | 'REGISTERING' | 'NOT_REGISTERED' | 'UNREGISTERED' | 'UNREGISTERED_AND_REGISTERING' | null>(null);
  const [addressInfo, setAddressInfo] = useState<{
    address: string;
    tag?: string;
    addressStatus: string;
  } | null>(null);


  // 입금 주소가 유효한지 확인
  useEffect(() => {
    if (symbol) {
      isAccountAddressRegistered(symbol)
        .then((res) => {
          setAddressStatus(res.addressRegistryStatus);
          setAddressInfo({ address: res.address, tag: res.tag, addressStatus: res.addressRegistryStatus });

          if (res.address) {
            setExistingAddress(true);
          }
        })
        .catch((err) => {
          if (err instanceof ApiError) {
            toast.error(`${err.message}`);
          } else {
            toast.error("등록된 주소를 불러오는 중 오류가 발생했습니다.");
          }
          setAddressStatus("NOT_REGISTERED");
          setAddressInfo(null);
        });
    }
  }, [symbol]);


  const handleDeactivateClick = async () => {
    if (!symbol) return;

    try {
      await unRegisterAccountAddress(symbol);

      const res = await isAccountAddressRegistered(symbol);

      if (res?.addressRegistryStatus) {
        setAddressStatus(res.addressRegistryStatus);
        setAddressInfo({
          address: res.address,
          tag: res.tag,
          addressStatus: res.addressRegistryStatus,
        });
      } else {
        throw new Error("계좌 상태를 불러오지 못했습니다.");
      }
    } catch (e) {
      if (e instanceof ApiError) {
        toast.error(`${e.message}`);
      } else {
        toast.error("등록 해제 요청 중 오류가 발생했습니다.");
      }
    }
  };


  const renderDeactivateButtonText = () => {
    if (addressStatus === 'UNREGISTERED_AND_REGISTERING') return '등록 해제 후 변경 중..';
    if (addressStatus === 'UNREGISTERED') return '등록 해제중..';
    return '등록 해제';
  };

  const handleNext = async () => {
    if (!symbol) {
      toast.error("코인 심볼이 없습니다.");
      return;
    }

    try {
      const payload = {
        currency: symbol,
        address: address!,
        tag: symbol === "XRP" ? tagAddress : undefined,
      };

      if (existingAddress) {
        await reRegisterAccountAddress(payload);
        toast.success("계좌가 재등록되었습니다.");
      } else {
        await registerAccountAddress(payload);
        toast.success("계좌 등록이 완료되었습니다.");
      }

      navigate(`/coin-detail/${symbol}`, { state: { isUser: false } });
    } catch (e: any) {
      if (e instanceof ApiError) {
        toast.error(`${e.message}`);
      } else {
        toast.error("계좌 등록 중 오류가 발생했습니다.");
      }
    }
  };

  const isButtonDisabled =
    !address || (symbol === 'XRP' && (!tagAddress || tagAddress.trim() === ''));

  return (
    <div className="flex h-screen flex-col bg-white">
      <Header title={existingAddress ? '계좌 재등록' : '계좌 등록'} />
      <div className="flex-1 overflow-auto px-6 py-6">
        <div className="mb-8">
            <div className="relative rp-4">
              {(addressStatus === 'ACTIVE' ||
                addressStatus === 'UNREGISTERED_AND_REGISTERING' ||
                addressStatus === 'UNREGISTERED') && (
                <button
                  onClick={handleDeactivateClick}
                  disabled={addressStatus === 'UNREGISTERED'}
                  className="absolute right-4 top-4 min-w-[140px] whitespace-nowrap rounded px-4 py-1 text-sm font-bold text-red-600 hover:bg-red-200 disabled:opacity-50"
                >
                  {renderDeactivateButtonText()}
                </button>
              )}
            </div>


          <div className="mb-8 rounded-lg border border-gray-100 bg-white p-4 shadow-sm">
            <AddressInput
              label={`고객님의 ${symbol} 주소`}
              value={address!}
              onChange={e => setAddress(e.target.value)}
              placeholder={`고객님의 ${symbol} 주소를 입력해주세요.`}
            />

            {symbol === 'XRP' && (
              <AddressInput
                label="고객님의 XRP Tag 주소"
                value={tagAddress!}
                onChange={e => setTagAddress(e.target.value)}
                placeholder="고객님의 XRP 태그를 입력해주세요."
                className="mt-6"
              />
            )}
          </div>

          {addressInfo?.address && (
            <>
              <div className="mb-6">
                <p className="mb-1 text-sm font-medium text-gray-600">
                  등록된 {symbol} 출금 주소
                </p>
                <div className="text-blue-900 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-semibold">
                  {addressInfo.address}
                </div>
              </div>

              {symbol === 'XRP' && (
                <div className="mb-6">
                  <p className="mb-1 text-sm font-medium text-gray-600">
                   등록된 {symbol} 태그 주소
                  </p>
                  <div className="text-blue-900 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-semibold">
                    {addressInfo.tag}
                  </div>
                </div>
              )}
            </>
          )}

          <div className="rounded-lg border border-yellow-100 bg-yellow-50 p-4">
            <h3 className="mb-2 flex items-center text-sm font-medium text-yellow-800">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="mr-1 h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z"
                  clipRule="evenodd"
                />
              </svg>
              안내사항
            </h3>
            <AddressInstructions />
          </div>
        </div>
      </div>

      <div className="bg-white p-5">
        <Button
          text={existingAddress ? '계좌 재등록 요청' : '계좌 등록 요청'}
          onClick={handleNext}
          disabled={isButtonDisabled}
          color={isButtonDisabled ? 'gray' : 'blue'}
          className="w-full rounded-lg py-3 text-lg font-medium shadow-md"
        />
      </div>

      <BottomNav />
    </div>
  )
}