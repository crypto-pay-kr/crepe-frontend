import { Swiper, SwiperSlide } from 'swiper/react'
import './swiper.css'
import './navigation.css'
import './pagination.css'
import { Autoplay, Pagination, Navigation } from 'swiper/modules'

import './styles.css'
import Button from '@/components/ui/button'
import { BannerResponse } from '@/api/banner/types'

export default function Carousel({
  items,
  height,
  pageHidden,
  pagePosition,
}: {
  items?: BannerResponse[]
  height?: number
  pageHidden?: boolean
  pagePosition?: 'bottomRight'
}) {
  return (
    <div style={{ height: `${height ?? 288}px` }}>
      <Swiper
        spaceBetween={30}
        centeredSlides={true}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
          type: 'fraction',
        }}
        modules={[Autoplay, Pagination, Navigation]}
        className={`carousel ${pagePosition ?? ''} ${pageHidden ? 'page-hidden' : ''}`}
      >
        {items?.map(item => (
          <SwiperSlide key={item.id}>
            <div
              style={{
                backgroundImage: `url('${item.imageUrl}')`,
              }}
              className="flex h-full w-full items-end bg-cover bg-center bg-no-repeat p-[13px_20px]"
            >
              {item.redirectUrl && (
                <Button
                  value="바로가기"
                  onClick={() => {
                    window.location.href = item.redirectUrl!
                  }}
                  shadow
                />
              )}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}
