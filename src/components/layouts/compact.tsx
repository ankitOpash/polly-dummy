import SectionBlock from '@/components/ui/section-block';
import FilterBar from './filter-bar';
import Categories from '@/components/categories/categories';
import CallToAction from '@/components/cta/call-to-action';
import GroupProducts from '@/components/products/group-products';
import PopularProductsGrid from '@/components/products/popular-products';
import TopAuthorsGrid from '@/components/author/top-authors-grid';
import Banner from '@/components/banners/banner';
import TopManufacturersGrid from '@/components/manufacturer/top-manufacturers-grid';

import type { HomePageProps } from '@/types';
import ProductGridHome from '@/components/products/grids/home';
import BestSellingProductsGrid from '@/components/products/best-selling-products';

export default function CompactLayout({ variables }: HomePageProps) {

  return (
    <div className="flex flex-1 flex-col bg-white">
      <FilterBar className="lg:hidden" variables={variables.categories} />
      <main className="mt-6 block w-full xl:overflow-hidden">
        <SectionBlock>
          <Banner layout="compact" variables={variables.types} />
        </SectionBlock>
        <BestSellingProductsGrid variables={variables?.bestSellingProducts} />
        <PopularProductsGrid variables={variables.popularProducts} />
        <Categories layout="compact" variables={variables.categories} />
        <GroupProducts />
        <SectionBlock title={'New Arrival Books'}>
          <ProductGridHome
            column="five"
            variables={{
              ...variables.products,
              sortedBy: 'DESC',
              orderBy: 'created_at',
            }}
          />
        </SectionBlock>
        <TopAuthorsGrid />
        <TopManufacturersGrid />
        <CallToAction />
      </main>
    </div>
  );
}
