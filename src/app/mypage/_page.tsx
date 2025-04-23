import CallOutlineIcon from '@/assets/common/svg/call-outline-icon'
import MessageOutlineIcon from '@/assets/common/svg/message-outline-icon'
import PaperOutlineIcon from '@/assets/common/svg/paper-outline-icon'
import SettingsIcon from '@/assets/common/svg/settings-icon'
import MyCoinBox from '@/components/content/my-coin-box'
import Button from '@/components/ui/button'
import { Link, useNavigate } from 'react-router-dom'

export default function MyPage() {
  const navigate = useNavigate()

  const iconMenuConfig = [
    {
      link: '/mypage/counselor-history',
      icon: <CallOutlineIcon />,
      name: '상담내역',
    },
    {
      link: '/mypage/counselor-review',
      icon: <MessageOutlineIcon />,
      name: '상담후기',
    },
    {
      link: '/mypage/counselor-inquiry',
      icon: <PaperOutlineIcon />,
      name: '상담문의',
    },
  ]

  return (
    <div className="flex flex-col gap-[10px] bg-gray11">
      {/* User Info Card */}
      <div className="flex flex-col gap-[15px] bg-white px-[20px] py-[38px]">
        <div className="flex flex-col gap-[6px]">
          <div className="flex items-center justify-between">
            <h2>
              <span className="text-[24px] font-bold">로그인 </span>후
              이용해주세요
            </h2>
            <Button
              value="로그인"
              size="fit"
              style={{
                fontSize: '12px',
                fontWeight: '500',
                padding: '3px 15px',
                borderRadius: '30px',
              }}
              onClick={() => {
                navigate('/login')
              }}
            />
          </div>
          <div className="flex items-center gap-[3px] leading-[20px]">
            <Link
              to="profile/edit"
              className="events text-[14px] text-gray-400 pointer-events-none"
            >
              정보수정
            </Link>
            <SettingsIcon />
          </div>
        </div>
        <MyCoinBox coin={undefined} />
        <div className="mt-[5px] flex w-full max-w-[320px] justify-between gap-[15px] self-center px-[15px]">
          {iconMenuConfig.map((menu, index) => (
            <>
              <Link
                to={menu.link}
                className="flex flex-col items-center gap-[10px] pointer-events-none"
              >
                {menu.icon}
                <span className="text-[14px]">{menu.name}</span>
              </Link>
              {index < 2 && <div className="h-[45px] w-[1px] bg-[#70737C38]" />}
            </>
          ))}
        </div>
      </div>

      {/* Menu List */}
      <div className="flex flex-col gap-[30px] bg-white px-[20px] py-[26px] text-[14px]">
        <Link to="/mypage/usage">이용방법</Link>
        <Link to="/mypage/service-center">고객센터</Link>
      </div>
    </div>
  )
}
