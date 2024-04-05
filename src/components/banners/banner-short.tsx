import { Swiper, SwiperSlide, Navigation } from '@/components/ui/slider';
import { Image } from '@/components/ui/image';
import { productPlaceholder } from '@/lib/placeholders';
import { ArrowNext, ArrowPrev } from '@/components/icons';
import type { Banner } from '@/types';

interface BannerProps {
  banners: Banner[] | undefined;
  layout?: string;
}

const BannerShort: React.FC<BannerProps> = ({ banners }) => {

  return (
    <div className="relative">
      <div className="-z-1 overflow-hidden">
        <div className="relative">
          <Swiper
            id="banner"
            loop={true}
            modules={[Navigation]}
            resizeObserver={true}
            allowTouchMove={false}
            slidesPerView={1}
            navigation={{
              nextEl: '.next',
              prevEl: '.prev',
            }}
          >
            {banners?.map((banner, idx) => (
              <SwiperSlide key={idx}>
                <div className="relative h-full max-h-[240px] w-full md:max-h-[450px]">
                  <Image
                    className="h-full w-full"
                    src={banner.image?.original ?? productPlaceholder}
                    alt={banner.title ?? ''}
                    width={1503}
                    height={450}
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div
            className="prev absolute top-2/4 z-10 -mt-4 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-border-200 border-opacity-70 bg-light text-heading shadow-200 transition-all duration-200 left-4 rtl:right-4 md:-mt-5 md:left-5 rtl:md:right-5"
            role="button"
          >
            <span className="sr-only">Previous</span>

            <ArrowPrev width={18} height={18} />
          </div>
          <div
            className="next absolute top-2/4 z-10 -mt-4 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-border-200 border-opacity-70 bg-light text-heading shadow-200 transition-all duration-200 right-4 rtl:left-4 md:-mt-5 md:right-5 rtl:md:left-5"
            role="button"
          >
            <ArrowNext width={18} height={18} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BannerShort;
