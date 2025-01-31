import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { siteSettings } from '@/config/site';
import Avatar from '@/components/ui/avatar';
import { useRouter } from 'next/router';

import cn from 'classnames';
import { avatarPlaceholder } from '@/lib/placeholders';
import { UserOutlinedIcon } from '@/components/icons/user-outlined';

const AuthorizedMenu: React.FC<{ minimal?: boolean }> = ({ minimal }) => {
  // const { mutate: logout } = useLogout();
  // const { me } = useUser();
  const router = useRouter();


  function handleClick(path: string) {
    router.push(path);
  }

  return (
    <Menu
      as="div"
      className="relative inline-block text-left rtl:text-right"
    >
      <Menu.Button className="flex items-center focus:outline-0">
        {minimal ? (
          <UserOutlinedIcon className="h-5 w-5" />
        ) : (
          <Avatar
            // src={me?.profile?.avatar?.thumbnail ?? avatarPlaceholder}
            src={avatarPlaceholder}
            title="user name"
            className="h-10 w-10"
          />
        )}
        <span className="sr-only">user avatar</span>
      </Menu.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items
          as="ul"
          className={cn(
            'absolute mt-1 w-48 rounded bg-white pb-4 shadow-700 focus:outline-none right-0 origin-top-right rtl:left-0 rtl:origin-top-left',
            {
              '!mt-2': minimal,
            }
          )}
        >
          <Menu.Item>
            <li className="flex w-full items-center justify-between bg-accent-500 px-6 py-4 text-xs font-semibold capitalize text-light focus:outline-none text-left rtl:text-right">
              <span>Points</span>
              {/* <span>{me?.wallet?.available_points ?? 0}</span> */}
              <span>0</span>
            </li>
          </Menu.Item>
          {siteSettings.authorizedLinks.map(({ href, label }) => (
            <Menu.Item key={`${href}${label}`}>
              {({ active }) => (
                <li>
                  <button
                    onClick={() => handleClick(href)}
                    className={cn(
                      'block w-full py-2.5 px-6 text-sm font-semibold capitalize text-heading transition duration-200 hover:text-accent focus:outline-0 text-left rtl:text-right',
                      active ? 'text-accent' : 'text-heading'
                    )}
                  >
                    {label}
                  </button>
                </li>
              )}
            </Menu.Item>
          ))}
          <Menu.Item>
            <li>
              <button
                onClick={() => { }}
                className={cn(
                  'block w-full py-2.5 px-6 text-sm font-semibold capitalize text-heading transition duration-200 hover:text-accent focus:outline-0 text-left rtl:text-right'
                )}
              >
                Logout
              </button>
            </li>
          </Menu.Item>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default AuthorizedMenu;
