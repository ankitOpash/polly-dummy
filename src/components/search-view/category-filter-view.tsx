import CheckboxGroup from './checkbox-group';
import { useState, useEffect, useMemo } from 'react';
import Checkbox from '@/components/ui/forms/checkbox/checkbox';
import { useRouter } from 'next/router';
import Scrollbar from '@/components/ui/scrollbar';

import ErrorMessage from '@/components/ui/error-message';
import Spinner from '@/components/ui/loaders/spinner/spinner';

interface Props {
  categories: any[];
}

const CategoryFilterView = ({ categories }: Props) => {


  const router = useRouter();
  const selectedValues = useMemo(
    () =>
      router.query.category ? (router.query.category as string).split(',') : [],
    [router.query.category]
  );
  const [state, setState] = useState<string[]>(() => selectedValues);
  useEffect(() => {
    setState(selectedValues);
  }, [selectedValues]);

  function handleChange(values: string[]) {
    router.push({
      pathname: router.pathname,
      query: {
        ...router.query,
        category: values.join(','),
      },
    });
  }

  return (
    <div className="relative -mb-5 after:absolute after:bottom-0 after:flex after:h-6 after:w-full after:bg-gradient-to-t after:from-white after:left-0 rtl:after:right-0">
      <Scrollbar style={{ maxHeight: '400px' }} className="pb-6">
        <span className="sr-only">Categories</span>
        <div className="grid grid-cols-1 gap-4">
          <CheckboxGroup values={state} onChange={handleChange}>
            {categories.map((plan) => (
              <Checkbox
                key={plan.id}
                label={plan.name}
                name={plan.slug}
                value={plan.slug}
                theme="secondary"
              />
            ))}
          </CheckboxGroup>
        </div>
      </Scrollbar>
    </div>
  );
};

const CategoryFilter: React.FC<{ type?: any }> = ({ type }) => {
  const { query, locale } = useRouter();

  // @ts-ignore
  // const { categories, isLoading, error } = useCategories({
  //   ...(type ? { type } : { type: query.searchType }),
  //   limit: 1000,
  // });

  // WILL CHANGE //
  const categories = [
    {
      "__typename": "Category",
      "children": [
        {
          "__typename": "Category",
          "children": [],
          "id": "2",
          "name": "Fruits",
          "slug": "fruits",
          "language": "en",
          "translated_languages": [
            "en"
          ],
          "details": null,
          "parent_id": "1",
          "products_count": 9,
          "image": {
            "__typename": "Attachment",
            "id": null,
            "original": null,
            "thumbnail": null
          },
          "icon": null,
          "type": null
        },
        {
          "__typename": "Category",
          "children": [],
          "id": "3",
          "name": "Vegetables",
          "slug": "vegetables",
          "language": "en",
          "translated_languages": [
            "en"
          ],
          "details": null,
          "parent_id": "1",
          "products_count": 11,
          "image": {
            "__typename": "Attachment",
            "id": null,
            "original": null,
            "thumbnail": null
          },
          "icon": null,
          "type": null
        }
      ],
      "id": "1",
      "name": "Fruits & Vegetables",
      "slug": "fruits-vegetables",
      "language": "en",
      "translated_languages": [
        "en"
      ],
      "details": null,
      "parent_id": null,
      "products_count": null,
      "image": {
        "__typename": "Attachment",
        "id": null,
        "original": null,
        "thumbnail": null
      },
      "icon": "FruitsVegetable",
      "type": {
        "__typename": "Type",
        "id": "1",
        "name": "Grocery",
        "slug": "grocery"
      }
    },
    {
      "__typename": "Category",
      "children": [
        {
          "__typename": "Category",
          "children": [],
          "id": "5",
          "name": "Fresh Fish",
          "slug": "fresh-fish",
          "language": "en",
          "translated_languages": [
            "en"
          ],
          "details": null,
          "parent_id": "4",
          "products_count": 5,
          "image": {
            "__typename": "Attachment",
            "id": null,
            "original": null,
            "thumbnail": null
          },
          "icon": null,
          "type": null
        },
        {
          "__typename": "Category",
          "children": [],
          "id": "6",
          "name": "Meat",
          "slug": "meat",
          "language": "en",
          "translated_languages": [
            "en"
          ],
          "details": null,
          "parent_id": "4",
          "products_count": 5,
          "image": {
            "__typename": "Attachment",
            "id": null,
            "original": null,
            "thumbnail": null
          },
          "icon": null,
          "type": null
        }
      ],
      "id": "4",
      "name": "Meat & Fish",
      "slug": "meat-fish",
      "language": "en",
      "translated_languages": [
        "en"
      ],
      "details": null,
      "parent_id": null,
      "products_count": null,
      "image": {
        "__typename": "Attachment",
        "id": null,
        "original": null,
        "thumbnail": null
      },
      "icon": "MeatFish",
      "type": {
        "__typename": "Type",
        "id": "1",
        "name": "Grocery",
        "slug": "grocery"
      }
    },
    {
      "__typename": "Category",
      "children": [
        {
          "__typename": "Category",
          "children": [],
          "id": "8",
          "name": "Nuts & Biscuits",
          "slug": "nuts-biscuits",
          "language": "en",
          "translated_languages": [
            "en"
          ],
          "details": null,
          "parent_id": "7",
          "products_count": 20,
          "image": {
            "__typename": "Attachment",
            "id": null,
            "original": null,
            "thumbnail": null
          },
          "icon": null,
          "type": null
        },
        {
          "__typename": "Category",
          "children": [],
          "id": "9",
          "name": "Chocolates",
          "slug": "chocolates",
          "language": "en",
          "translated_languages": [
            "en"
          ],
          "details": null,
          "parent_id": "7",
          "products_count": 12,
          "image": {
            "__typename": "Attachment",
            "id": null,
            "original": null,
            "thumbnail": null
          },
          "icon": null,
          "type": null
        },
        {
          "__typename": "Category",
          "children": [],
          "id": "10",
          "name": "Crisps",
          "slug": "crisps",
          "language": "en",
          "translated_languages": [
            "en"
          ],
          "details": null,
          "parent_id": "7",
          "products_count": 14,
          "image": {
            "__typename": "Attachment",
            "id": null,
            "original": null,
            "thumbnail": null
          },
          "icon": null,
          "type": null
        },
        {
          "__typename": "Category",
          "children": [],
          "id": "11",
          "name": "Noodles & Pasta",
          "slug": "noodles-pasta",
          "language": "en",
          "translated_languages": [
            "en"
          ],
          "details": null,
          "parent_id": "7",
          "products_count": 15,
          "image": {
            "__typename": "Attachment",
            "id": null,
            "original": null,
            "thumbnail": null
          },
          "icon": null,
          "type": null
        },
        {
          "__typename": "Category",
          "children": [],
          "id": "12",
          "name": "Sauce",
          "slug": "sauce",
          "language": "en",
          "translated_languages": [
            "en"
          ],
          "details": null,
          "parent_id": "7",
          "products_count": 7,
          "image": {
            "__typename": "Attachment",
            "id": null,
            "original": null,
            "thumbnail": null
          },
          "icon": null,
          "type": null
        },
        {
          "__typename": "Category",
          "children": [],
          "id": "14",
          "name": "Soup",
          "slug": "soup",
          "language": "en",
          "translated_languages": [
            "en"
          ],
          "details": null,
          "parent_id": "7",
          "products_count": 5,
          "image": {
            "__typename": "Attachment",
            "id": null,
            "original": null,
            "thumbnail": null
          },
          "icon": null,
          "type": null
        }
      ],
      "id": "7",
      "name": "Snacks",
      "slug": "snacks",
      "language": "en",
      "translated_languages": [
        "en"
      ],
      "details": null,
      "parent_id": null,
      "products_count": null,
      "image": {
        "__typename": "Attachment",
        "id": null,
        "original": null,
        "thumbnail": null
      },
      "icon": "Snacks",
      "type": {
        "__typename": "Type",
        "id": "1",
        "name": "Grocery",
        "slug": "grocery"
      }
    },
    {
      "__typename": "Category",
      "children": [
        {
          "__typename": "Category",
          "children": [],
          "id": "15",
          "name": "Cat Food",
          "slug": "cat-food",
          "language": "en",
          "translated_languages": [
            "en"
          ],
          "details": null,
          "parent_id": "13",
          "products_count": 7,
          "image": {
            "__typename": "Attachment",
            "id": null,
            "original": null,
            "thumbnail": null
          },
          "icon": null,
          "type": null
        },
        {
          "__typename": "Category",
          "children": [],
          "id": "16",
          "name": "Dog Food",
          "slug": "dog-food",
          "language": "en",
          "translated_languages": [
            "en"
          ],
          "details": null,
          "parent_id": "13",
          "products_count": 7,
          "image": {
            "__typename": "Attachment",
            "id": null,
            "original": null,
            "thumbnail": null
          },
          "icon": null,
          "type": null
        },
        {
          "__typename": "Category",
          "children": [],
          "id": "17",
          "name": "Accessories",
          "slug": "accessories",
          "language": "en",
          "translated_languages": [
            "en"
          ],
          "details": null,
          "parent_id": "13",
          "products_count": 4,
          "image": {
            "__typename": "Attachment",
            "id": null,
            "original": null,
            "thumbnail": null
          },
          "icon": null,
          "type": null
        }
      ],
      "id": "13",
      "name": "Pet Care",
      "slug": "pet-care",
      "language": "en",
      "translated_languages": [
        "en"
      ],
      "details": null,
      "parent_id": null,
      "products_count": null,
      "image": {
        "__typename": "Attachment",
        "id": null,
        "original": null,
        "thumbnail": null
      },
      "icon": "PetCare",
      "type": {
        "__typename": "Type",
        "id": "1",
        "name": "Grocery",
        "slug": "grocery"
      }
    },
    {
      "__typename": "Category",
      "children": [
        {
          "__typename": "Category",
          "children": [],
          "id": "19",
          "name": "Air Freshner",
          "slug": "air-freshner",
          "language": "en",
          "translated_languages": [
            "en"
          ],
          "details": null,
          "parent_id": "18",
          "products_count": 8,
          "image": {
            "__typename": "Attachment",
            "id": null,
            "original": null,
            "thumbnail": null
          },
          "icon": null,
          "type": null
        },
        {
          "__typename": "Category",
          "children": [],
          "id": "20",
          "name": "Cleaning Products",
          "slug": "cleaning-products",
          "language": "en",
          "translated_languages": [
            "en"
          ],
          "details": null,
          "parent_id": "18",
          "products_count": 7,
          "image": {
            "__typename": "Attachment",
            "id": null,
            "original": null,
            "thumbnail": null
          },
          "icon": null,
          "type": null
        },
        {
          "__typename": "Category",
          "children": [],
          "id": "21",
          "name": "Kitchen Accessories",
          "slug": "kitchen-accessories",
          "language": "en",
          "translated_languages": [
            "en"
          ],
          "details": null,
          "parent_id": "18",
          "products_count": 0,
          "image": {
            "__typename": "Attachment",
            "id": null,
            "original": null,
            "thumbnail": null
          },
          "icon": null,
          "type": null
        },
        {
          "__typename": "Category",
          "children": [],
          "id": "22",
          "name": "Laundry",
          "slug": "laundry",
          "language": "en",
          "translated_languages": [
            "en"
          ],
          "details": null,
          "parent_id": "18",
          "products_count": 7,
          "image": {
            "__typename": "Attachment",
            "id": null,
            "original": null,
            "thumbnail": null
          },
          "icon": null,
          "type": null
        }
      ],
      "id": "18",
      "name": "Home & Cleaning",
      "slug": "home-cleaning",
      "language": "en",
      "translated_languages": [
        "en"
      ],
      "details": null,
      "parent_id": null,
      "products_count": null,
      "image": {
        "__typename": "Attachment",
        "id": null,
        "original": null,
        "thumbnail": null
      },
      "icon": "HomeCleaning",
      "type": {
        "__typename": "Type",
        "id": "1",
        "name": "Grocery",
        "slug": "grocery"
      }
    },
    {
      "__typename": "Category",
      "children": [
        {
          "__typename": "Category",
          "children": [],
          "id": "24",
          "name": "Milk",
          "slug": "milk",
          "language": "en",
          "translated_languages": [
            "en"
          ],
          "details": null,
          "parent_id": "23",
          "products_count": 6,
          "image": {
            "__typename": "Attachment",
            "id": null,
            "original": null,
            "thumbnail": null
          },
          "icon": null,
          "type": null
        },
        {
          "__typename": "Category",
          "children": [],
          "id": "25",
          "name": "Butter",
          "slug": "butter",
          "language": "en",
          "translated_languages": [
            "en"
          ],
          "details": null,
          "parent_id": "23",
          "products_count": 6,
          "image": {
            "__typename": "Attachment",
            "id": null,
            "original": null,
            "thumbnail": null
          },
          "icon": null,
          "type": null
        },
        {
          "__typename": "Category",
          "children": [],
          "id": "26",
          "name": "Egg",
          "slug": "egg",
          "language": "en",
          "translated_languages": [
            "en"
          ],
          "details": null,
          "parent_id": "23",
          "products_count": 6,
          "image": {
            "__typename": "Attachment",
            "id": null,
            "original": null,
            "thumbnail": null
          },
          "icon": null,
          "type": null
        },
        {
          "__typename": "Category",
          "children": [],
          "id": "27",
          "name": "Yogurt",
          "slug": "yogurt",
          "language": "en",
          "translated_languages": [
            "en"
          ],
          "details": null,
          "parent_id": "23",
          "products_count": 6,
          "image": {
            "__typename": "Attachment",
            "id": null,
            "original": null,
            "thumbnail": null
          },
          "icon": null,
          "type": null
        }
      ],
      "id": "23",
      "name": "Dairy",
      "slug": "dairy",
      "language": "en",
      "translated_languages": [
        "en"
      ],
      "details": null,
      "parent_id": null,
      "products_count": null,
      "image": {
        "__typename": "Attachment",
        "id": null,
        "original": null,
        "thumbnail": null
      },
      "icon": "Dairy",
      "type": {
        "__typename": "Type",
        "id": "1",
        "name": "Grocery",
        "slug": "grocery"
      }
    },
    {
      "__typename": "Category",
      "children": [
        {
          "__typename": "Category",
          "children": [],
          "id": "29",
          "name": "Oil",
          "slug": "oil",
          "language": "en",
          "translated_languages": [
            "en"
          ],
          "details": null,
          "parent_id": "28",
          "products_count": 6,
          "image": {
            "__typename": "Attachment",
            "id": null,
            "original": null,
            "thumbnail": null
          },
          "icon": null,
          "type": null
        },
        {
          "__typename": "Category",
          "children": [],
          "id": "30",
          "name": "Rice",
          "slug": "rice",
          "language": "en",
          "translated_languages": [
            "en"
          ],
          "details": null,
          "parent_id": "28",
          "products_count": 6,
          "image": {
            "__typename": "Attachment",
            "id": null,
            "original": null,
            "thumbnail": null
          },
          "icon": null,
          "type": null
        },
        {
          "__typename": "Category",
          "children": [],
          "id": "31",
          "name": "Salt & Sugar",
          "slug": "salt-sugar",
          "language": "en",
          "translated_languages": [
            "en"
          ],
          "details": null,
          "parent_id": "28",
          "products_count": 9,
          "image": {
            "__typename": "Attachment",
            "id": null,
            "original": null,
            "thumbnail": null
          },
          "icon": null,
          "type": null
        },
        {
          "__typename": "Category",
          "children": [],
          "id": "32",
          "name": "Spices",
          "slug": "spices",
          "language": "en",
          "translated_languages": [
            "en"
          ],
          "details": null,
          "parent_id": "28",
          "products_count": 0,
          "image": {
            "__typename": "Attachment",
            "id": null,
            "original": null,
            "thumbnail": null
          },
          "icon": null,
          "type": null
        }
      ],
      "id": "28",
      "name": "Cooking",
      "slug": "cooking",
      "language": "en",
      "translated_languages": [
        "en"
      ],
      "details": null,
      "parent_id": null,
      "products_count": null,
      "image": {
        "__typename": "Attachment",
        "id": null,
        "original": null,
        "thumbnail": null
      },
      "icon": "Cooking",
      "type": {
        "__typename": "Type",
        "id": "1",
        "name": "Grocery",
        "slug": "grocery"
      }
    },
    {
      "__typename": "Category",
      "children": [
        {
          "__typename": "Category",
          "children": [],
          "id": "34",
          "name": "Bread",
          "slug": "bread",
          "language": "en",
          "translated_languages": [
            "en"
          ],
          "details": null,
          "parent_id": "33",
          "products_count": 8,
          "image": {
            "__typename": "Attachment",
            "id": null,
            "original": null,
            "thumbnail": null
          },
          "icon": null,
          "type": null
        },
        {
          "__typename": "Category",
          "children": [],
          "id": "35",
          "name": "Cereal",
          "slug": "cereal",
          "language": "en",
          "translated_languages": [
            "en"
          ],
          "details": null,
          "parent_id": "33",
          "products_count": 4,
          "image": {
            "__typename": "Attachment",
            "id": null,
            "original": null,
            "thumbnail": null
          },
          "icon": null,
          "type": null
        },
        {
          "__typename": "Category",
          "children": [],
          "id": "36",
          "name": "Jam",
          "slug": "jam",
          "language": "en",
          "translated_languages": [
            "en"
          ],
          "details": null,
          "parent_id": "33",
          "products_count": 3,
          "image": {
            "__typename": "Attachment",
            "id": null,
            "original": null,
            "thumbnail": null
          },
          "icon": null,
          "type": null
        }
      ],
      "id": "33",
      "name": "Breakfast",
      "slug": "breakfast",
      "language": "en",
      "translated_languages": [
        "en"
      ],
      "details": null,
      "parent_id": null,
      "products_count": null,
      "image": {
        "__typename": "Attachment",
        "id": null,
        "original": null,
        "thumbnail": null
      },
      "icon": "Breakfast",
      "type": {
        "__typename": "Type",
        "id": "1",
        "name": "Grocery",
        "slug": "grocery"
      }
    },
    {
      "__typename": "Category",
      "children": [
        {
          "__typename": "Category",
          "children": [],
          "id": "38",
          "name": "Coffee",
          "slug": "coffee",
          "language": "en",
          "translated_languages": [
            "en"
          ],
          "details": null,
          "parent_id": "37",
          "products_count": 4,
          "image": {
            "__typename": "Attachment",
            "id": null,
            "original": null,
            "thumbnail": null
          },
          "icon": null,
          "type": null
        },
        {
          "__typename": "Category",
          "children": [],
          "id": "39",
          "name": "Energy Drinks",
          "slug": "energy-drinks",
          "language": "en",
          "translated_languages": [
            "en"
          ],
          "details": null,
          "parent_id": "37",
          "products_count": 4,
          "image": {
            "__typename": "Attachment",
            "id": null,
            "original": null,
            "thumbnail": null
          },
          "icon": null,
          "type": null
        },
        {
          "__typename": "Category",
          "children": [],
          "id": "40",
          "name": "Juice",
          "slug": "juice",
          "language": "en",
          "translated_languages": [
            "en"
          ],
          "details": null,
          "parent_id": "37",
          "products_count": 5,
          "image": {
            "__typename": "Attachment",
            "id": null,
            "original": null,
            "thumbnail": null
          },
          "icon": null,
          "type": null
        },
        {
          "__typename": "Category",
          "children": [],
          "id": "41",
          "name": "Fizzy Drinks",
          "slug": "fizzy-drinks",
          "language": "en",
          "translated_languages": [
            "en"
          ],
          "details": null,
          "parent_id": "37",
          "products_count": 6,
          "image": {
            "__typename": "Attachment",
            "id": null,
            "original": null,
            "thumbnail": null
          },
          "icon": null,
          "type": null
        },
        {
          "__typename": "Category",
          "children": [],
          "id": "42",
          "name": "Tea",
          "slug": "tea",
          "language": "en",
          "translated_languages": [
            "en"
          ],
          "details": null,
          "parent_id": "37",
          "products_count": 5,
          "image": {
            "__typename": "Attachment",
            "id": null,
            "original": null,
            "thumbnail": null
          },
          "icon": null,
          "type": null
        }
      ],
      "id": "37",
      "name": "Beverage",
      "slug": "beverage",
      "language": "en",
      "translated_languages": [
        "en"
      ],
      "details": null,
      "parent_id": null,
      "products_count": null,
      "image": {
        "__typename": "Attachment",
        "id": null,
        "original": null,
        "thumbnail": null
      },
      "icon": "Beverage",
      "type": {
        "__typename": "Type",
        "id": "1",
        "name": "Grocery",
        "slug": "grocery"
      }
    },
    {
      "__typename": "Category",
      "children": [
        {
          "__typename": "Category",
          "children": [],
          "id": "44",
          "name": "Bath",
          "slug": "bath",
          "language": "en",
          "translated_languages": [
            "en"
          ],
          "details": null,
          "parent_id": "43",
          "products_count": 5,
          "image": {
            "__typename": "Attachment",
            "id": null,
            "original": null,
            "thumbnail": null
          },
          "icon": null,
          "type": null
        },
        {
          "__typename": "Category",
          "children": [],
          "id": "45",
          "name": "Cream",
          "slug": "cream",
          "language": "en",
          "translated_languages": [
            "en"
          ],
          "details": null,
          "parent_id": "43",
          "products_count": 4,
          "image": {
            "__typename": "Attachment",
            "id": null,
            "original": null,
            "thumbnail": null
          },
          "icon": null,
          "type": null
        },
        {
          "__typename": "Category",
          "children": [],
          "id": "46",
          "name": "Deodorant",
          "slug": "deodorant",
          "language": "en",
          "translated_languages": [
            "en"
          ],
          "details": null,
          "parent_id": "43",
          "products_count": 5,
          "image": {
            "__typename": "Attachment",
            "id": null,
            "original": null,
            "thumbnail": null
          },
          "icon": null,
          "type": null
        },
        {
          "__typename": "Category",
          "children": [],
          "id": "47",
          "name": "Face Care",
          "slug": "face-care",
          "language": "en",
          "translated_languages": [
            "en"
          ],
          "details": null,
          "parent_id": "43",
          "products_count": 4,
          "image": {
            "__typename": "Attachment",
            "id": null,
            "original": null,
            "thumbnail": null
          },
          "icon": null,
          "type": null
        },
        {
          "__typename": "Category",
          "children": [],
          "id": "48",
          "name": "Oral Care",
          "slug": "oral-care",
          "language": "en",
          "translated_languages": [
            "en"
          ],
          "details": null,
          "parent_id": "43",
          "products_count": 4,
          "image": {
            "__typename": "Attachment",
            "id": null,
            "original": null,
            "thumbnail": null
          },
          "icon": null,
          "type": null
        },
        {
          "__typename": "Category",
          "children": [],
          "id": "49",
          "name": "Shaving Needs",
          "slug": "shaving-needs",
          "language": "en",
          "translated_languages": [
            "en"
          ],
          "details": null,
          "parent_id": "43",
          "products_count": 11,
          "image": {
            "__typename": "Attachment",
            "id": null,
            "original": null,
            "thumbnail": null
          },
          "icon": null,
          "type": null
        }
      ],
      "id": "43",
      "name": "Health & Beauty",
      "slug": "health-beauty",
      "language": "en",
      "translated_languages": [
        "en"
      ],
      "details": null,
      "parent_id": null,
      "products_count": null,
      "image": {
        "__typename": "Attachment",
        "id": null,
        "original": null,
        "thumbnail": null
      },
      "icon": "BeautyHealth",
      "type": {
        "__typename": "Type",
        "id": "1",
        "name": "Grocery",
        "slug": "grocery"
      }
    }
  ]

  // if (error) return <ErrorMessage message={error.message} />;
  // if (isLoading)
  //   return (
  //     <div className="flex w-full items-center justify-center py-5">
  //       <Spinner className="h-6 w-6" simple={true} />
  //     </div>
  //   );
  return <CategoryFilterView categories={categories} />;
};

export default CategoryFilter;
