/* eslint-disable @next/next/no-html-link-for-pages */
'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';

export default function SideBar() {
  const [visible, setVisible] = useState(false);
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  const isLoginPage = pathname === "/login";
 

  return (
    <>
      {!isLoginPage &&
        <div
          className={`p-4 bg-white shadow-lg rounded-lg fixed top-0 left-0 z-10 transition-transform transform ${visible ? 'translate-x-0' : '-translate-x-full'
            } md:translate-x-0 md:static md:w-1/6 h-full`}
        >
          <div className="font-bold mb-4">
            <a
              href="/"
              className={`text-black hover:text-blue-700 ${isActive('/') ? 'text-blue-700' : ''
                }`}
              onClick={() => setVisible(false)}
            >
              <i className="pi pi-home mr-2"></i>Dashboard
            </a>
          </div>
          <ul className="menu text-lg font-bold">
            <li className="menu-item p-2">
              <a
                href="/user"
                className={`text-black hover:text-blue-700 ${isActive('/user') ? 'text-blue-700' : ''
                  }`}
                onClick={() => setVisible(false)}
              >
                <i className="pi pi-user mr-2"></i>User
              </a>
            </li>
            <li className="menu-item p-2">
              <a
                href="/page"
                className={`text-black hover:text-blue-700 ${isActive('/page') ? 'text-blue-700' : ''
                  }`}
                onClick={() => setVisible(false)}
              >
                <i className="pi pi-file mr-2"></i>Page
              </a>
            </li>
            <li className="menu-item p-2">
              <a
                href="/role"
                className={`text-black hover:text-blue-700 ${isActive('/role') ? 'text-blue-700' : ''
                  }`}
                onClick={() => setVisible(false)}
              >
                <i className="pi pi-users mr-2"></i>Role
              </a>
            </li>
          </ul>
        </div>
      }
    </>
  );
}
