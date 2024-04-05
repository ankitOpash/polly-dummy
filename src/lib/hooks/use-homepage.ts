
export default function useHomepage() {

  // const { types } = useTypes({
  //   limit: TYPES_PER_PAGE,
  // });

  // WILL CHANGE //
  const types = [
    {
      "__typename": "Type",
      "id": "1",
      "name": "Grocery",
      "slug": "grocery",
      "language": "en",
      "icon": "FruitsVegetable",
      "banners": [
        {
          "__typename": "Banner",
          "id": "12",
          "title": "Groceries Delivered in 90 Minute",
          "image": {
            "__typename": "Attachment",
            "id": "907",
            "original": "https://pickbazarlaravel.s3.ap-southeast-1.amazonaws.com/904/grocery.png",
            "thumbnail": "https://pickbazarlaravel.s3.ap-southeast-1.amazonaws.com/904/conversions/grocery-thumbnail.jpg"
          }
        }
      ],
      "settings": {
        "__typename": "TypeSettings",
        "isHome": true,
        "layoutType": "classic",
        "productCard": "neon"
      }
    },
    {
      "__typename": "Type",
      "id": "2",
      "name": "Bakery",
      "slug": "bakery",
      "language": "en",
      "icon": "Bakery",
      "banners": [
        {
          "__typename": "Banner",
          "id": "13",
          "title": "Get Your Bakery Items Delivered",
          "image": {
            "__typename": "Attachment",
            "id": "908",
            "original": "https://pickbazarlaravel.s3.ap-southeast-1.amazonaws.com/905/bakery.jpg",
            "thumbnail": "https://pickbazarlaravel.s3.ap-southeast-1.amazonaws.com/905/conversions/bakery-thumbnail.jpg"
          }
        }
      ],
      "settings": {
        "__typename": "TypeSettings",
        "isHome": false,
        "layoutType": "standard",
        "productCard": "argon"
      }
    },
    {
      "__typename": "Type",
      "id": "3",
      "name": "Makeup",
      "slug": "makeup",
      "language": "en",
      "icon": "FacialCare",
      "banners": [
        {
          "__typename": "Banner",
          "id": "14",
          "title": "Branded & imported makeups",
          "image": {
            "__typename": "Attachment",
            "id": "909",
            "original": "https://pickbazarlaravel.s3.ap-southeast-1.amazonaws.com/906/makeup.png",
            "thumbnail": "https://pickbazarlaravel.s3.ap-southeast-1.amazonaws.com/906/conversions/makeup-thumbnail.jpg"
          }
        }
      ],
      "settings": {
        "__typename": "TypeSettings",
        "isHome": false,
        "layoutType": "classic",
        "productCard": "helium"
      }
    },
    {
      "__typename": "Type",
      "id": "4",
      "name": "Bags",
      "slug": "bags",
      "language": "en",
      "icon": "Handbag",
      "banners": [
        {
          "__typename": "Banner",
          "id": "15",
          "title": "Exclusive Branded bags",
          "image": {
            "__typename": "Attachment",
            "id": "910",
            "original": "https://pickbazarlaravel.s3.ap-southeast-1.amazonaws.com/907/bags.png",
            "thumbnail": "https://pickbazarlaravel.s3.ap-southeast-1.amazonaws.com/907/conversions/bags-thumbnail.jpg"
          }
        }
      ],
      "settings": {
        "__typename": "TypeSettings",
        "isHome": false,
        "layoutType": "classic",
        "productCard": "helium"
      }
    },
    {
      "__typename": "Type",
      "id": "5",
      "name": "Clothing",
      "slug": "clothing",
      "language": "en",
      "icon": "DressIcon",
      "banners": [
        {
          "__typename": "Banner",
          "id": "16",
          "title": "Shop your designer dresses",
          "image": {
            "__typename": "Attachment",
            "id": "911",
            "original": "https://pickbazarlaravel.s3.ap-southeast-1.amazonaws.com/908/cloths.png",
            "thumbnail": "https://pickbazarlaravel.s3.ap-southeast-1.amazonaws.com/908/conversions/cloths-thumbnail.jpg"
          }
        }
      ],
      "settings": {
        "__typename": "TypeSettings",
        "isHome": false,
        "layoutType": "classic",
        "productCard": "xenon"
      }
    },
    {
      "__typename": "Type",
      "id": "6",
      "name": "Furniture",
      "slug": "furniture",
      "language": "en",
      "icon": "FurnitureIcon",
      "banners": [
        {
          "__typename": "Banner",
          "id": "18",
          "title": "Exclusive furniture on cheap price",
          "image": {
            "__typename": "Attachment",
            "id": "922",
            "original": "https://pickbazarlaravel.s3.ap-southeast-1.amazonaws.com/922/furniture-banner-1.jpg",
            "thumbnail": "https://pickbazarlaravel.s3.ap-southeast-1.amazonaws.com/922/conversions/furniture-banner-1-thumbnail.jpg"
          }
        },
        {
          "__typename": "Banner",
          "id": "19",
          "title": "Furniter 2",
          "image": {
            "__typename": "Attachment",
            "id": "923",
            "original": "https://pickbazarlaravel.s3.ap-southeast-1.amazonaws.com/923/furniture-banner-2.jpg",
            "thumbnail": "https://pickbazarlaravel.s3.ap-southeast-1.amazonaws.com/923/conversions/furniture-banner-2-thumbnail.jpg"
          }
        }
      ],
      "settings": {
        "__typename": "TypeSettings",
        "isHome": false,
        "layoutType": "modern",
        "productCard": "krypton"
      }
    },
    {
      "__typename": "Type",
      "id": "7",
      "name": "Daily Needs",
      "slug": "daily-needs",
      "language": "en",
      "icon": "FruitsVegetable",
      "banners": [
        {
          "__typename": "Banner",
          "id": "23",
          "title": "You Deserve To Eat Fresh",
          "image": {
            "__typename": "Attachment",
            "id": "1344",
            "original": "https://pickbazarlaravel.s3.ap-southeast-1.amazonaws.com/1344/shutterstock_389040853-%281%29.jpg",
            "thumbnail": "https://pickbazarlaravel.s3.ap-southeast-1.amazonaws.com/1344/conversions/shutterstock_389040853-%281%29-thumbnail.jpg"
          }
        }
      ],
      "settings": {
        "__typename": "TypeSettings",
        "isHome": false,
        "layoutType": "minimal",
        "productCard": "neon"
      }
    },
    {
      "__typename": "Type",
      "id": "8",
      "name": "Books",
      "slug": "books",
      "language": "en",
      "icon": "BookIcon",
      "banners": [
        {
          "__typename": "Banner",
          "id": "26",
          "title": "book banner",
          "image": {
            "__typename": "Attachment",
            "id": "1376",
            "original": "https://pickbazarlaravel.s3.ap-southeast-1.amazonaws.com/1376/Cover.png",
            "thumbnail": "https://pickbazarlaravel.s3.ap-southeast-1.amazonaws.com/1376/conversions/Cover-thumbnail.jpg"
          }
        }
      ],
      "settings": {
        "__typename": "TypeSettings",
        "isHome": false,
        "layoutType": "compact",
        "productCard": "radon"
      }
    }
  ]
  if (!types) {
    return {
      homePage: {
        slug: '',
      },
    };
  }
  return {
    homePage: types.find((type:any) => type?.settings?.isHome) ?? types[0],
  };
}
