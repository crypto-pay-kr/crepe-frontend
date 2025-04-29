export default function Splash() {
  return (
    <div className="h-full flex flex-col">
      <div className="h-full flex flex-col relative bg-white">
        <div className="flex-1 flex flex-col items-center justify-center space-y-4">
          <img src="/crepe-newlogo2.png" alt="Crepe 메인 로고" className="w-65 h-60" />
        </div>
        <div className="absolute bottom-10 left-0 right-0 flex justify-center text-lg text-slate-700">
          <span>편리한 블록체인 토큰결제,</span>
          <span className="text-[#1C355E] font-semibold ml-1">Crepe</span>
        </div>
      </div>
    </div>
  )
}
