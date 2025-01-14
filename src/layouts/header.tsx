/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-unused-vars */

'use client';

import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import Link from 'next/link';
import { Menubar } from 'primereact/menubar';
import { signOut } from 'next-auth/react';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { useUserData } from '@/hooks/useUserData';


export default function Header({ session }: SessionProp) {
  const { selectedUserTmp, handleUpdate } = useUserData(session);

  useEffect(() => {
  }, [selectedUserTmp]);

  const handleSignOut = async () => {
    try {
      updateUserToNotFirstLogin();
      await signOut({ redirect: false });
      window.location.href = '/login';
    } catch (error) {
      console.error('Error during sign out:', error)
    }
  }

  const updateUserToNotFirstLogin = () => {
    handleUpdate(0);
  };


  const start = <Link href="/" passHref><div className='text-black hover:text-blue-900 font-bold text-xl'>DEMO NEXTJS</div></Link>;

  const end = (
    <div className="flex align-items-center gap-2">
      <Button type="button" className="p-link layout-topbar-button">
        <i className="pi pi-user"></i>
      </Button>
      <Button type="button" className="p-link layout-topbar-button" onClick={handleSignOut}>
        <i className="pi pi-sign-out"></i>
      </Button>
    </div>
  );

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className={`header p-2 mr-1 ${scrolled ? 'sticky-header' : ''}`}>
      <Menubar
        start={start}
        end={end}
        className="flex justify-between items-center"
      />
    </div>
  );
}
