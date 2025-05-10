import React, { useState, useEffect, useRef } from 'react';
import { Camera, RefreshCw, X, Check, AlertCircle } from 'lucide-react';

export interface CameraComponentProps {
  /** 촬영 버튼 클릭 시, 캡처한 이미지 dataURL을 부모로 전달합니다. */
  onCapture?: (imageData: string) => void;
}

export default function CameraComponent({ onCapture }: CameraComponentProps) {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const [error, setError] = useState<string | null>(null);
  const [isSubjectDetected, setIsSubjectDetected] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const startCamera = async () => {
    try {
      if (stream) stream.getTracks().forEach(t => t.stop());
      const media = await navigator.mediaDevices.getUserMedia({
        video: { facingMode, width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false
      });
      setStream(media);
      setError(null);
      if (videoRef.current) videoRef.current.srcObject = media;
      // 실제 subject 감지 알고리즘에 따라 setIsSubjectDetected를 업데이트하세요.
    } catch {
      setError('카메라 접근에 실패했습니다. 권한을 확인해주세요.');
    }
  };

  // 예시: 2초마다 감지 상태를 토글 (실제 detection 로직으로 대체하세요)
  useEffect(() => {
    const interval = setInterval(() => {
      setIsSubjectDetected(prev => !prev);
    }, 2000);
    return () => clearInterval(interval);
  }, []);



  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(t => t.stop());
      setStream(null);
    }
  };

  const flipCamera = () => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
  };
    
  const handleCapture = () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    setIsCapturing(true);
    
    // 애니메이션 효과를 위한 타임아웃
    setTimeout(() => {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      if (!video || !canvas) return;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = canvas.toDataURL('image/png');
        if (onCapture) {
          onCapture(imageData);
        }
      }
      
      setIsCapturing(false);
    }, 300);
  };

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, [facingMode]);

  return (
    <div className="relative w-full h-full bg-black overflow-hidden rounded-xl shadow-lg">
      {/* 카메라 비디오 */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full h-full object-cover"
      />
      
      {/* 숨겨진 캔버스 */}
      <canvas ref={canvasRef} className="hidden" />
      
      {/* 카메라 프레임 - 인식 상태에 따라 테두리 색상 변경 */}
      <div className={`
        absolute inset-0 m-auto w-80 h-52 border-4 rounded-lg pointer-events-none
        ${isSubjectDetected ? 'border-green-400' : 'border-white'}
        ${isCapturing ? 'scale-95 opacity-0' : 'scale-100 opacity-100'}
      `}>
        {/* 코너 데코레이션 */}
        <div className="absolute -top-1 -left-1 w-5 h-5 border-t-2 border-l-2 rounded-tl-md border-current"></div>
        <div className="absolute -top-1 -right-1 w-5 h-5 border-t-2 border-r-2 rounded-tr-md border-current"></div>
        <div className="absolute -bottom-1 -left-1 w-5 h-5 border-b-2 border-l-2 rounded-bl-md border-current"></div>
        <div className="absolute -bottom-1 -right-1 w-5 h-5 border-b-2 border-r-2 rounded-br-md border-current"></div>
      </div>
      
      {/* 인식 상태 표시 */}
      {isSubjectDetected && (
        <div className="absolute top-3 left-1/2 transform -translate-x-1/2 bg-green-500 bg-opacity-90 text-white px-3 py-1 rounded-full text-xs flex items-center space-x-1 shadow-md">
          <Check size={14} />
          <span>신분증 인식됨</span>
        </div>
      )}
      
      {/* 카메라 컨트롤 */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center items-center space-x-6">
        {/* 카메라 전환 버튼 */}
        <button 
          onClick={flipCamera} 
          className="bg-gray-800 bg-opacity-60 p-3 rounded-full text-white hover:bg-opacity-80 transition-all focus:outline-none shadow-lg"
        >
          <RefreshCw size={20} />
        </button>
        
        {/* 촬영 버튼 */}
        <button 
          onClick={handleCapture} 
          disabled={!isSubjectDetected}
          className={`
            relative p-1 rounded-full focus:outline-none transform transition-all
            ${isSubjectDetected 
              ? 'bg-white hover:bg-opacity-80 scale-100' 
              : 'bg-gray-400 scale-95 cursor-not-allowed'}
          `}
        >
          <div className="w-14 h-14 rounded-full border-4 border-current flex items-center justify-center">
            <Camera size={24} className={isSubjectDetected ? 'text-black' : 'text-gray-600'} />
          </div>
        </button>
      </div>
      
      {/* 에러 표시 */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-500 bg-opacity-75 text-white p-4 rounded-xl">
          <div className="flex flex-col items-center space-y-2">
            <AlertCircle size={32} />
            <p className="text-center">{error}</p>
          </div>
        </div>
      )}
      
      {/* 플래시 효과 */}
      {isCapturing && (
        <div className="absolute inset-0 bg-white animate-flash"></div>
      )}
    </div>
  );
}