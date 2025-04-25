export default function Splash() {
  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center">
          <img src="/crepe_newlogo.png" alt="우리 로고" className="mr-2 w-52 h-60" />
        <div className="absolute bottom-10 flex items-center">
          <span>편리한 블록체인 토큰결제, </span>
          <span className="text-[#0a5ca8]"> Crepe</span>
        </div>
      </div>
    </div>
  )
}
