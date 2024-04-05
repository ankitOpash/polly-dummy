import type { GetStaticProps } from 'next';

import Link from '@/components/ui/link';

export default function NotFoundPage() {


  return (
    <div className="grid min-h-screen place-items-center p-4 sm:p-8">
      <div className="text-center">
        <p className="2xl: mb-4 text-sm uppercase tracking-widest text-body-dark sm:mb-5">
          Error code: 404
        </p>
        <h1 className="mb-5 text-2xl font-bold leading-normal text-bolder sm:text-3xl">
          Oops! Looks like this isn&apos;t a page
        </h1>

        <div className="mb-11">
          {/* <Image src={noResult} alt='Error code: 404' /> */}
        </div>
        <Link
          href='/'
          className="inline-flex items-center text-bolder underline hover:text-body-dark hover:no-underline focus:outline-none sm:text-base"
        >
          Take me home
        </Link>
      </div>
    </div>
  );
}