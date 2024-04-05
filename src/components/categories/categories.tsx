import React from 'react';
import Scrollbar from '@/components/ui/scrollbar';
import TreeMenu from '@/components/ui/tree-menu';
import { isMobile } from 'react-device-detect';
import { categories } from "../../lib/constants/categories"
interface CategoriesProps {
  layout: string;
  variables: any;
  className?: string;
}
export default function Categories({
  layout,
  className,
  variables,
}: CategoriesProps) {

  return (
    <aside
      className={`hidden h-full bg-light lg:sticky lg:top-22 xl:block xl:w-72 ${className}`}
    >
      {!isMobile && (
        <div className="max-h-full grow overflow-hidden">
          <Scrollbar
            className="max-h-screen w-full"
            style={{ height: 'calc(100vh - 5.35rem)' }}
          >
            <div className="px-5">
              <TreeMenu items={categories} className="xl:py-8" />
            </div>

          </Scrollbar>
        </div>
      )}

      {isMobile && (
        <div className="max-h-full grow overflow-hidden">
          <div className="px-5">
            <TreeMenu items={categories} className="xl:py-8" />
          </div>

        </div>
      )}
    </aside>
  );
}
