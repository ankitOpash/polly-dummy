import type { NextPageWithLayout } from '@/types';
import { useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { scroller } from 'react-scroll';
import HomeLayout from '@/components/layouts/_home';
import { useWindowSize } from '@/lib/use-window-size';


const CartCounterButton = dynamic(
  () => import('@/components/cart/cart-counter-button'),
  { ssr: false }
);
const Classic = dynamic(() => import('@/components/layouts/classic'));
const Standard = dynamic(() => import('@/components/layouts/standard'));
const Modern = dynamic(() => import('@/components/layouts/modern'));
const Minimal = dynamic(() => import('@/components/layouts/minimal'));
const Compact = dynamic(() => import('@/components/layouts/compact'));

const MAP_LAYOUT_TO_GROUP: Record<string, any> = {
  classic: Classic,
  modern: Modern,
  standard: Standard,
  minimal: Minimal,
  compact: Compact,
  default: Classic,
};
const Home: NextPageWithLayout = ({ variables, layout }) => {

  const tempVar = {
    "products": {
      "type": "grocery",
      "language": "en",
      "limit": 30
    },
    "popularProducts": {
      "type_slug": "grocery",
      "limit": 10
    },
    "categories": {
      "type": "grocery",
      "limit": 1000,
      "parent": null,
      "language": "en"
    },
    "types": {
      "type": "grocery"
    }
  }
  const tempLayout = "classic"

  const { query } = useRouter();
  const { width } = useWindowSize();

  useEffect(() => {
    if (query.text || query.category) {
      scroller.scrollTo('grid', {
        smooth: true,
        offset: -110,
      });
    }
  }, [query.text, query.category]);

  const Component = MAP_LAYOUT_TO_GROUP[tempLayout];
  return (
    <>
      <Component variables={tempVar} />
      {!['compact', 'minimal'].includes(tempLayout) && width > 1023 && (
        <CartCounterButton />
      )}
    </>
  );
};

Home.getLayout = function getLayout(page) {
  return <HomeLayout layout={page.props.layout}>{page}</HomeLayout>;
};

export default Home;
