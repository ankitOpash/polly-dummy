import React from 'react';
import { Image } from '@/components/ui/image';
import All from '../../assets/img/categories/all.jpg';
import sofa from '../../assets/img/categories/sofa.jpg';
import chair from '../../assets/img/categories/chair.jpg';
import swivels from '../../assets/img/categories/swivels.jpg';
import chaise from '../../assets/img/categories/chaise.jpg';
import { Swiper, SwiperSlide, Navigation } from '@/components/ui/slider';
import { ArrowNext, ArrowPrev } from '../icons';
import { categories } from '@/lib/constants/categories';
import { useRouter } from 'next/router';

const CategoryCards = () => {
  const router = useRouter();

  const breakpoints = {
    320: {
      slidesPerView: 2,
      spaceBetween: 0,
    },
    580: {
      slidesPerView: 4,
      spaceBetween: 16,
    },
    1024: {
      slidesPerView: 5,
      spaceBetween: 16,
    },
    1920: {
      slidesPerView: 5,
      spaceBetween: 10,
    },
  };

  const onCategoryClick = (slug: any) => {
    const { pathname, query } = router;
    router.push(
      {
        pathname,
        query: { ...query, category: slug },
      },
      undefined,
      {
        scroll: false,
      }
    );
  };

  return (
    <div className="bg-light px-6 py-5 md:p-8">
      <div className="mx-auto w-full xl:w-3/4">
        {/* ALL PRODUCT SLIDER */}
        <div className="relative">
          <Swiper
            id="projectSummary"
            breakpoints={breakpoints}
            modules={[Navigation]}
            navigation={{
              nextEl: '.next',
              prevEl: '.prev',
            }}
          >
            <SwiperSlide>
              <div
                className="transform cursor-pointer rounded border-2 pb-3 pt-2 duration-200 hover:border-[#00A698]"
                onClick={() => onCategoryClick('seating')}
              >
                <Image className="w-full" src={All} alt="all" />
                <h6 className="mt-2 text-center text-sm	">All Products</h6>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div
                className="transform cursor-pointer rounded border-2 pb-3 pt-2 duration-200 hover:border-[#00A698]"
                onClick={() => onCategoryClick('sofa')}
              >
                <Image className="w-full" src={sofa} alt="all" />
                <h6 className="mt-2 text-center text-sm	">Sofas</h6>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div
                className="transform cursor-pointer rounded border-2 pb-3 pt-2 duration-200 hover:border-[#00A698]"
                onClick={() => onCategoryClick('chair')}
              >
                <Image className="w-full" src={chair} alt="sofa" />
                <h6 className="mt-2 text-center text-sm	">Chair</h6>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div
                className="transform cursor-pointer rounded border-2 pb-3 pt-2 duration-200 hover:border-[#00A698]"
                onClick={() => onCategoryClick('swivel')}
              >
                <Image className="w-full" src={swivels} alt="swivels" />
                <h6 className="mt-2 text-center text-sm	">Swivels</h6>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div
                className="transform cursor-pointer rounded border-2 pb-3 pt-2 duration-200 hover:border-[#00A698]"
                onClick={() => onCategoryClick('chaise')}
              >
                <Image className="w-full" src={chaise} alt="chaise" />
                <h6 className="mt-2 text-center text-sm	">Chaise</h6>
              </div>
            </SwiperSlide>
          </Swiper>

          <div
            className="prev absolute top-2/4 z-10 -mt-4 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-border-200 border-opacity-70 bg-light text-heading shadow-xl transition-all duration-200 hover:border-accent hover:bg-accent hover:text-light ltr:-left-4 rtl:-right-4 md:-mt-5 md:h-9 md:w-9"
            role="button"
          >
            <span className="sr-only">Previous</span>
            <ArrowPrev width={18} height={18} />
          </div>
          <div
            className="next absolute right-0 top-2/4 z-10 -mt-4 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-border-200 border-opacity-70 bg-light text-heading shadow-xl transition-all duration-200 hover:border-accent hover:bg-accent hover:text-light ltr:-right-4 rtl:-left-4 md:-mt-5 md:h-9 md:w-9"
            role="button"
          >
            <span className="sr-only">Next</span>
            <ArrowNext width={18} height={18} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryCards;
