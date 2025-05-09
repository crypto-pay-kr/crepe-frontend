import React, { useState, useEffect, useRef } from 'react';
import { Camera, Video, X, Check, AlertCircle } from 'lucide-react';

export interface CameraComponentProps {
  /** 프레임 안에 피사체가 감지되면 호출됩니다 */
  onDetected?: () => void;
}


export default function CameraComponent({ onDetected }: CameraComponentProps) {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const [error, setError] = useState<string | null>(null);
  const [isSubjectDetected, setIsSubjectDetected] = useState<boolean>(false);
  const [detectionSensitivity, setDetectionSensitivity] = useState<number>(30);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const detectionIntervalRef = useRef<number | null>(null);

  const startCamera = async () => {
    try {
      if (stream) stream.getTracks().forEach(t => t.stop());
      const media = await navigator.mediaDevices.getUserMedia({
        video: { facingMode, width:{ ideal:1280 }, height:{ ideal:720 } },
        audio: false
      });
      setStream(media);
      setError(null);
      if (videoRef.current) videoRef.current.srcObject = media;
      startDetection();
    } catch {
      setError('카메라 접근에 실패했습니다. 권한을 확인해주세요.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(t => t.stop());
      setStream(null);
      setIsSubjectDetected(false);
    }
  };

  const startDetection = () => {
    if (detectionIntervalRef.current) clearInterval(detectionIntervalRef.current);
    detectionIntervalRef.current = window.setInterval(() => {
      const v = videoRef.current, c = canvasRef.current, f = frameRef.current;
      if (!v||!c||!f||v.readyState!==4) return;
      const ctx = c.getContext('2d', { willReadFrequently: true }); if(!ctx) return;
      c.width=v.videoWidth; c.height=v.videoHeight;
      ctx.drawImage(v,0,0,c.width,c.height);
      const fw=c.width*0.6, fh=c.height*0.6, x=(c.width-fw)/2, y=(c.height-fh)/2;
      const data=ctx.getImageData(x,y,fw,fh).data;
      let pc=0, cc=0;
      for(let i=0;i<data.length;i+=16){const b=(data[i]+data[i+1]+data[i+2])/3; pc++; if(b>40&&b<215) cc++;}
      setIsSubjectDetected((cc/pc)*100>detectionSensitivity);
    }, 200) as unknown as number;
  };

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
      if (detectionIntervalRef.current) clearInterval(detectionIntervalRef.current);
    };
  }, [facingMode]);

    // 감지 상태가 true로 바뀌면 onDetected 호출
    useEffect(() => {
        if (isSubjectDetected && onDetected) {
          onDetected();
        }
      }, [isSubjectDetected, onDetected]);

  return (
    <div className="relative w-full aspect-video bg-black overflow-hidden rounded-lg">
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-500 bg-opacity-75 text-white p-4">
          {error}
        </div>
      )}
      <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
      <canvas ref={canvasRef} className="hidden" />
      <div 
        ref={frameRef}
        className={`absolute inset-0 m-auto w-3/5 h-3/5 border-4 rounded-lg pointer-events-none
          ${isSubjectDetected 
            ? 'border-green-500 bg-green-100 bg-opacity-10' 
            : 'border-white bg-red-100 bg-opacity-10'}`}
      >
        <div className="absolute top-2 left-2 flex items-center bg-black bg-opacity-50 px-2 py-1 rounded text-white text-sm">
          {isSubjectDetected 
            ? <><Check className="text-green-500 mr-1" size={16}/>피사체 감지됨</> 
            : <><AlertCircle className="text-yellow-500 mr-1" size={16}/>프레임 안에 피사체를 위치시키세요</>}
        </div>
      </div>
      {/* 카메라 전환 버튼 등 필요시 추가 */}
    </div>
  );
}