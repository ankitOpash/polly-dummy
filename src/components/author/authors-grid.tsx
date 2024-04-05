import Button from '@/components/ui/button';
import NotFound from '@/components/ui/not-found';
import rangeMap from '@/lib/range-map';
import AuthorLoader from '@/components/ui/loaders/author-loader';
import AuthorCard from '@/components/ui/author-card';
import ErrorMessage from '@/components/ui/error-message';

interface AuthorsGridProps {
  limit?: number;
}
const AuthorsGrid: React.FC<AuthorsGridProps> = ({
  limit = 10,
}) => {
  // const { authors, loadMore, isLoadingMore, isLoading, hasMore, error } =
  //   useAuthors({
  //     limit,
  //   });
  // if (error) return <ErrorMessage message={error.message} />;

  // if (!isLoading && !authors.length) {
  //   return (
  //     <div className="min-h-full bg-white px-4 pt-6 pb-8 lg:p-8">
  //       <NotFound text="text-no-authors" />
  //     </div>
  //   );
  // }

  return (
    <div className="mx-auto w-full py-8 lg:py-14 xl:py-20">
      <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-4 lg:gap-7">
        {/* {isLoading && !authors.length
          ? rangeMap(limit, (i) => (
              <AuthorLoader key={i} uniqueKey={`author-${i}`} />
            ))
          : authors.map((item) => <AuthorCard key={item.id} item={item} />)} */}
      </div>
      {/* {hasMore && (
        <div className="mt-12 flex items-center justify-center lg:mt-16">
          <Button onClick={loadMore} size="big" loading={isLoadingMore}>
            "Explore More"
          </Button>
        </div>
      )} */}

      Need to Change
    </div>
  );
};

export default AuthorsGrid;
