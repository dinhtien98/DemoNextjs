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
import { loginService } from '@/services/loginService';


export default function Header({ session }: SessionProp) {
  const handleSignOut = async () => {
    try {
      loginService.triggerLogin(0);
      await signOut({ redirect: false });
      window.location.href = '/login';
    } catch (error) {
      console.error('Error during sign out:', error)
    }
  }

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

  return (
    <div className={`header p-2 mr-1`}>
      <Menubar
        start={start}
        end={end}
        className="flex justify-between items-center"
      />
    </div>
  );
}
