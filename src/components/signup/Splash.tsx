export default function Splash() {
  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold text-[#0a5ca8] mb-40">Crepe</h1>
        <div className="absolute bottom-10 flex items-center">
          <img src="/crepe-logo.png" alt="우리 로고" className="mr-2 w-4 h-4" />
          <span>Crepe : 편리한 블록체인 토큰결제</span>
        </div>
      </div>
    </div>
  )
}
