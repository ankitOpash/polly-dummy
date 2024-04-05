import { ArrowNextIcon } from '@/components/icons/arrow-next';


import Link from './link';

const ListMenu = ({ dept, data, hasSubMenu, menuIndex }: any) => {
  ('menu');
  return (
    <li className="relative">
      <Link
        href={data.path}
        className="flex items-center justify-between py-2 pl-5 rtl:pr-5 xl:pl-7 rtl:xl:pr-7 pr-3 rtl:pl-3 xl:pr-3.5 rtl:xl:pl-3.5 transition-colors hover:text-accent"
      >
        {data.label}
        {data.subMenu && (
          <span className="text-sm mt-0.5 shrink-0">
            <ArrowNextIcon className="ml-1.5 rtl:mr-1.5 w-3.5" />
          </span>
        )}
      </Link>
      {hasSubMenu && (
        <SubMenu dept={dept} data={data.subMenu} menuIndex={menuIndex} />
      )}
    </li>
  );
};

const SubMenu: React.FC<any> = ({ dept, data, menuIndex }) => {
  dept = dept + 1;
  return (
    <ul className="subMenuChild border border-gray-200 bg-white absolute z-0 right-full rtl:left-full 2xl:right-auto rtl:2xl:left-auto 2xl:left-full rtl:2xl:right-full opacity-0 invisible top-4 w-56 py-3 shadow-md">
      {data?.map((menu: any, index: number) => {
        const menuName: string = `sidebar-submenu-${dept}-${menuIndex}-${index}`;

        return (
          <ListMenu
            dept={dept}
            data={menu}
            hasSubMenu={menu.subMenu}
            menuName={menuName}
            key={menuName}
            menuIndex={index}
          />
        );
      })}
    </ul>
  );
};

export default ListMenu;
