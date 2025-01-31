import Button from '@/components/ui/button';
import NotFound from '@/components/ui/not-found';

import rangeMap from '@/lib/range-map';
import ManufacturerLoader from '@/components/ui/loaders/manufacturer-loader';
import ErrorMessage from '@/components/ui/error-message';
import ManufacturerCard from './card';
import { useRouter } from 'next/router';

interface ManufacturersGridProps {
  limit?: number;
}

const ManufacturersGrid: React.FC<ManufacturersGridProps> = ({
  limit = 10,
}) => {

  const { locale } = useRouter();
  // Uncomment the following lines
  // const { manufacturers, loadMore, isLoadingMore, isLoading, hasMore, error } =
  //   useManufacturers({
  //     language: locale,
  //     limit,
  //   });
  // if (error) return <ErrorMessage message={error.message} />;

  // if (!isLoading && !manufacturers.length) {
  //   return (
  //     <div className="min-h-full px-4 pt-6 pb-8 bg-white lg:p-8">
  //       <NotFound text="text-no-manufacturers" />
  //     </div>
  //   );
  // }

  return (
    // <div className="w-full py-8 mx-auto lg:py-14 xl:py-20">
    //   <div className="grid grid-cols-[repeat(auto-fill,minmax(270px,1fr))] gap-5 lg:gap-7">
    //     {isLoading && !manufacturers.length
    //       ? rangeMap(limit, (i) => (
    //           <ManufacturerLoader key={i} uniqueKey={`manufacturer-${i}`} />
    //         ))
    //       : manufacturers.map((item) => (
    //           <ManufacturerCard key={item.id} item={item} />
    //         ))}
    //   </div>
    //   {hasMore && (
    //     <div className="flex items-center justify-center mt-12 lg:mt-16">
    //       <Button onClick={loadMore} size="big" loading={isLoadingMore}>
    //         {text-explore-more')}
    //       </Button>
    //     </div>
    //   )}
    // </div>
    <div>Need to change</div>
  );
};

export default ManufacturersGrid;
