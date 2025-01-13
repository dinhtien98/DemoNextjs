
'use client';

import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import Link from 'next/link';
import { Menubar } from 'primereact/menubar';
import { signOut } from 'next-auth/react';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';


export default function Header() {
  
  const handleSignOut = async () => {
    try {
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
