// src/components/Navbar.jsx
import { Fragment, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { Bars3Icon, XMarkIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { AuthContext } from '../../context/AuthContext';

const publicNavigation = [
  { name: 'Find Ambulance', href: '/find-ambulance' },
  { name: 'Hospitals', href: '/find-hospital' },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function Navbar() {
  const location = useLocation();
  const { user, logout } = useContext(AuthContext);

  return (
    <Disclosure as="nav" className="bg-white shadow">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 justify-between">
              <div className="flex">
                <div className="flex flex-shrink-0 items-center">
                  <Link to="/" className="text-2xl font-bold text-red-600">
                    RMS
                  </Link>
                </div>
                <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                  {publicNavigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={classNames(
                        location.pathname === item.href
                          ? 'border-red-500 text-gray-900'
                          : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                        'inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium'
                      )}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:items-center">
                {user ? (
                  <Menu as="div" className="relative">
                    <Menu.Button className="flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50">
                      <UserCircleIcon className="h-5 w-5 mr-1 text-gray-600" />
                      {user.role === 'hospital' ? user.data.name : user.data.username}
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
                      <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5">
                        {user.role === 'hospital' ? (
                          <>
                            <Menu.Item>
                              {({ active }) => (
                                <Link
                                  to="/hospital/dashboard"
                                  className={classNames(
                                    active ? 'bg-gray-100' : '',
                                    'block px-4 py-2 text-sm text-gray-700'
                                  )}
                                >
                                  Dashboard
                                </Link>
                              )}
                            </Menu.Item>
                          </>
                        ) : (
                          <>
                            <Menu.Item>
                              {({ active }) => (
                                <Link
                                  to="/customer/profile"
                                  className={classNames(
                                    active ? 'bg-gray-100' : '',
                                    'block px-4 py-2 text-sm text-gray-700'
                                  )}
                                >
                                  Profile
                                </Link>
                              )}
                            </Menu.Item>
                            <Menu.Item>
                              {({ active }) => (
                                <Link
                                  to="/customer/bookings"
                                  className={classNames(
                                    active ? 'bg-gray-100' : '',
                                    'block px-4 py-2 text-sm text-gray-700'
                                  )}
                                >
                                  My Bookings
                                </Link>
                              )}
                            </Menu.Item>
                          </>
                        )}
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={logout}
                              className={classNames(
                                active ? 'bg-gray-100' : '',
                                'block w-full text-left px-4 py-2 text-sm text-gray-700'
                              )}
                            >
                              Logout
                            </button>
                          )}
                        </Menu.Item>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                ) : (
                  <>
                    <a
                      href="/customer/login"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mr-4 rounded-md bg-white px-3 py-2 text-sm font-semibold text-blue-600 shadow-sm ring-1 ring-inset ring-blue-600 hover:bg-blue-50"
                    >
                      Customer Login
                    </a>
                    <a
                      href="/hospital/login"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-red-600 shadow-sm ring-1 ring-inset ring-red-600 hover:bg-red-50"
                    >
                      Hospital Login
                    </a>
                  </>
                )}
              </div>
              <div className="-mr-2 flex items-center sm:hidden">
                <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 pb-3 pt-2">
              {publicNavigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as={Link}
                  to={item.href}
                  className={classNames(
                    location.pathname === item.href
                      ? 'border-red-500 bg-red-50 text-red-700'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700',
                    'block border-l-4 py-2 pl-3 pr-4 text-base font-medium'
                  )}
                >
                  {item.name}
                </Disclosure.Button>
              ))}
              <div className="border-t border-gray-200 pt-4 pb-3">
                {user ? (
                  <>
                    <div className="px-4 py-2 text-base font-medium text-gray-900">
                      {user.role === 'hospital' ? user.data.name : user.data.username}
                    </div>
                    {user.role === 'hospital' ? (
                      <Link
                        to="/hospital/dashboard"
                        className="block px-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-100"
                      >
                        Dashboard
                      </Link>
                    ) : (
                      <>
                        <Link
                          to="/customer/profile"
                          className="block px-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-100"
                        >
                          Profile
                        </Link>
                        <Link
                          to="/customer/bookings"
                          className="block px-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-100"
                        >
                          My Bookings
                        </Link>
                      </>
                    )}
                    <button
                      onClick={logout}
                      className="block w-full text-left px-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <a
                      href="/customer/login"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block px-4 py-2 text-base font-medium text-blue-600 hover:bg-gray-100"
                    >
                      Customer Login
                    </a>
                    <a
                      href="/hospital/login"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block px-4 py-2 text-base font-medium text-red-600 hover:bg-gray-100"
                    >
                      Hospital Login
                    </a>
                  </>
                )}
              </div>
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}