import dynamic from 'next/dynamic';
const BannerWithSearch = dynamic(
  () => import('@/components/banners/BannerWithSearch')
);
const BannerShort = dynamic(() => import('@/components/banners/banner-short'));
const BannerWithoutSlider = dynamic(
  () => import('@/components/banners/banner-without-slider')
);
const BannerWithPagination = dynamic(
  () => import('@/components/banners/banner-with-pagination')
);
const MAP_BANNER_TO_GROUP: Record<string, any> = {
  classic: BannerWithSearch,
  modern: BannerShort,
  minimal: BannerWithoutSlider,
  standard: BannerWithSearch,
  compact: BannerWithPagination,
  default: BannerWithSearch,
};

const Banner: React.FC<{ layout: string; variables: any }> = ({
  layout,
  variables,
}) => {
  // WILL CHANGE //
  const dummyBannerObj = {
    "__typename": "Type",
    "id": "1",
    "slug": "grocery",
    "name": "Grocery",
    "language": "en",
    "banners": [
      {
        "__typename": "Banner",
        "id": "12",
        "title": "Groceries Delivered in 90 Minute",
        "description": "Get your healthy foods & snacks delivered at your doorsteps all day everyday",
        "image": {
          "__typename": "Attachment",
          "id": "907",
          "original": "https://pickbazarlaravel.s3.ap-southeast-1.amazonaws.com/904/grocery.png",
          "thumbnail": "https://pickbazarlaravel.s3.ap-southeast-1.amazonaws.com/904/conversions/grocery-thumbnail.jpg"
        }
      }
    ],
    "promotional_sliders": [
      {
        "__typename": "Attachment",
        "id": "902",
        "thumbnail": "https://pickbazarlaravel.s3.ap-southeast-1.amazonaws.com/902/conversions/offer-5-thumbnail.jpg",
        "original": "https://pickbazarlaravel.s3.ap-southeast-1.amazonaws.com/902/offer-5.png"
      },
      {
        "__typename": "Attachment",
        "id": "903",
        "thumbnail": "https://pickbazarlaravel.s3.ap-southeast-1.amazonaws.com/903/conversions/offer-4-thumbnail.jpg",
        "original": "https://pickbazarlaravel.s3.ap-southeast-1.amazonaws.com/903/offer-4.png"
      },
      {
        "__typename": "Attachment",
        "id": "904",
        "thumbnail": "https://pickbazarlaravel.s3.ap-southeast-1.amazonaws.com/904/conversions/offer-3-thumbnail.jpg",
        "original": "https://pickbazarlaravel.s3.ap-southeast-1.amazonaws.com/904/offer-3.png"
      },
      {
        "__typename": "Attachment",
        "id": "905",
        "thumbnail": "https://pickbazarlaravel.s3.ap-southeast-1.amazonaws.com/905/conversions/offer-2-thumbnail.jpg",
        "original": "https://pickbazarlaravel.s3.ap-southeast-1.amazonaws.com/905/offer-2.png"
      },
      {
        "__typename": "Attachment",
        "id": "906",
        "thumbnail": "https://pickbazarlaravel.s3.ap-southeast-1.amazonaws.com/906/conversions/offer-1-thumbnail.jpg",
        "original": "https://pickbazarlaravel.s3.ap-southeast-1.amazonaws.com/906/offer-1.png"
      }
    ]
  }

  const Component = MAP_BANNER_TO_GROUP[layout];
  return (
    <Component banners={dummyBannerObj?.banners} layout={layout} slug={dummyBannerObj?.slug} />
  );
};

export default Banner;
