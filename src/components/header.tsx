'use client';

import React, { useState, useEffect } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import Link from 'next/link';
import { Menubar } from 'primereact/menubar';
import { signOut } from 'next-auth/react';

interface CustomMenuItem {
  label: string;
  icon: string;
  to: string;
}

export default function Header() {
  const items: CustomMenuItem[] = [
    {
      label: 'Home',
      icon: 'pi pi-home',
      to: '/'
    },
    {
      label: 'Page',
      icon: 'pi pi-file',
      to: '/page'
    },
    {
      label: 'User',
      icon: 'pi pi-user',
      to: '/user'
    },
    {
      label: 'Login',
      icon: 'pi pi-sign-in',
      to: '/login'
    }
  ];

  const handleSignOut = async () => {
    try {
      await signOut({ redirect: false });
      window.location.href = '/login';
    } catch (error) {
      console.error('Error during sign out:', error)
    }
  }
  
  const start = <div>DEMO NEXTJS</div>;

  const end = (
    <div className="flex align-items-center gap-2">
      <InputText placeholder="Search" type="text" className="w-8rem sm:w-auto" />
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
        model={items.map((item) => ({
          label: item.label,
          icon: item.icon,
          command: () => {},
          template: () => (
            <Link href={item.to} passHref>
              <Button className="flex align-items-center p-menuitem-link gap-2 mx-2">
                <i className={item.icon} />
                <span>{item.label}</span>
              </Button>
            </Link>
          ),
        }))}
        start={start}
        end={end}
        className="flex justify-between items-center"
      />
    </div>
  );
}
