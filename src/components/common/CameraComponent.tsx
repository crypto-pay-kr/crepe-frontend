import React, { useState, useEffect, useRef } from 'react';
import { Camera, Video, X, Check, AlertCircle } from 'lucide-react';
import Button from '@/components/common/Button';

export interface CameraComponentProps {
  /** 촬영 버튼 클릭 시, 캡처한 이미지 dataURL을 부모로 전달합니다. */
  onCapture?: (imageData: string) => void;
}

export default function CameraComponent({ onCapture }: CameraComponentProps) {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const [error, setError] = useState<string | null>(null);
  const [detectionSensitivity] = useState<number>(30);
  // subject 감지 여부 (실제 detection 로직에 맞게 교체하세요)
  const [isSubjectDetected, setIsSubjectDetected] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const detectionIntervalRef = useRef<number | null>(null);

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

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(t => t.stop());
      setStream(null);
    }
  };

  // manual capture 기능
  const handleCapture = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
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
  };

  // 예시: 2초마다 감지 상태를 토글 (실제 detection 로직으로 대체하세요)
  useEffect(() => {
    const interval = setInterval(() => {
      setIsSubjectDetected(prev => !prev);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
      if (detectionIntervalRef.current) clearInterval(detectionIntervalRef.current);
    };
  }, [facingMode]);

  return (
    <div className="relative w-full aspect-video bg-black overflow-hidden rounded-lg">
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-500 bg-opacity-75 text-white p-4">
          {error}
        </div>
      )}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full h-full object-contain"
      />
      <canvas ref={canvasRef} className="hidden" />
      <div
        ref={frameRef}
        className={`absolute inset-0 m-auto w-3/5 h-3/5 border-4 rounded-lg pointer-events-none ${
          isSubjectDetected
            ? 'border-green-500 bg-green-100 bg-opacity-10'
            : 'border-white bg-red-100 bg-opacity-10'
        }`}
      />
      {/* 촬영 버튼은 그대로 유지 */}
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2">
        <button onClick={handleCapture} className="focus:outline-none">
          <img src="/camera.png" alt="촬영 버튼" className="w-8 h-8" />
        </button>
      </div>
    </div>
  );
}