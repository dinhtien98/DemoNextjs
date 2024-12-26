'use client';
import React, { useEffect, useState } from 'react';
import { getServerSession } from "next-auth";
import { Splitter, SplitterPanel } from "primereact/splitter";
import { fetchPage, fetchRole, fetchUser } from '@/app/components/fetchApi';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

interface Session {
  user?: {
    fullName?: string;
    token?: string;
  };
}

interface User {
  id: number;
  userName: string;
  fullName: string;
  email: string;
  avatar: string;
  islocked: boolean;
}

interface Page {
  id: number;
  name: string;
  code: string;
}

interface Role {
  id: number;
  name: string;
  code: string;
}

interface DashboardProps {
  session: Session;
}


export default function Dashboard({ session: initialSession }: DashboardProps) {
  const [session, setSession] = useState<Session | null>(initialSession);
  const [users, setUsers] = useState<User[] | null>(null);
  const [pages, setPages] = useState<Page[] | null>(null);
  const [roles, setRoles] = useState<Role[] | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedPage, setSelectedPage] = useState<Page | null>(null);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [panelContent, setPanelContent] = useState<string>('list_users');
  const [panelDetails, setPanelDetails] = useState<string>('');

  async function fetch_Session() {
    const sessionData: Session | null = await getServerSession(authOptions);
    setSession(sessionData);
  }

  const fetch_User = async () => {
    try {
      if (session?.user?.token) {
        const user = await fetchUser(session.user.token);
        setUsers(user);
      } else {
        console.error('User token is undefined');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  const fetch_Page = async () => {
    try {
      if (session?.user?.token) {
        const page = await fetchPage(session.user.token);
        setPages(page);
      } else {
        console.error('User token is undefined');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  const fetch_Role = async () => {
    try {
      if (session?.user?.token) {
        const role = await fetchRole(session.user.token);
        setRoles(role);
      } else {
        console.error('User token is undefined');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleAdd = () => { };
  const handleUpdate = () => { }
  const handleDelete = () => { }

  useEffect(() => {
    if (!initialSession) {
      fetch_Session();
    }
    fetch_User();
    fetch_Page();
    fetch_Role();
  }, []);
  return (
    <Splitter style={{ height: '300px' }}>
      <SplitterPanel className="flex align-items-center justify-content-center" size={20} minSize={10}>
        <div className="menu">
          <div className="menu-item">
            <span>Login by: {session?.user?.fullName}</span>
          </div>
          <div className="menu-item" onClick={() => (setPanelContent('list_users'), setPanelDetails(''))}>
            Users
          </div>
          <div className="menu-item" onClick={() => (setPanelContent('list_pages'), setPanelDetails(''))}>
            Pages
          </div>
          <div className="menu-item" onClick={() => (setPanelContent('list_roles'), setPanelDetails(''))}>
            Roles
          </div>
        </div>
      </SplitterPanel>
      <SplitterPanel size={80}>
        <Splitter layout="vertical">
          <SplitterPanel className="flex align-items-center justify-content-center" size={15}>
            <button onClick={() => handleAdd()}><span className="pi pi-plus-circle"> Add</span></button>
          </SplitterPanel>
          <SplitterPanel size={85}>
            <Splitter>
              <SplitterPanel className="flex align-items-center justify-content-center" size={20}>
                <div className="card flex justify-content-center w-full max-w-full">
                  <div className="menu w-full max-w-full">
                    {panelContent === 'list_users' && users && users.map((user) => (
                      <div key={user.id} className="menu-item flex justify-content-between w-full max-w-full" onClick={() => {
                        setSelectedUser(user);
                        setPanelDetails('user_details');
                      }}>
                        <span>{user.userName}</span>
                        <div className='w-full max-w-full flex justify-content-end button-panel'>
                          <button className='mx-1' onClick={() => handleUpdate()}><span className="pi pi-user-edit"></span></button>
                          <button className='mx-1' onClick={() => handleDelete()}><span className="pi pi-times-circle"></span></button>
                        </div>
                      </div>
                    ))}
                    {panelContent === 'list_pages' && pages && pages.map((page) => (
                      <div key={page.id} className="menu-item flex justify-content-between w-full max-w-full" onClick={() => {
                        setSelectedPage(page);
                        setPanelDetails('page_details');
                      }}>
                        {page.name}
                        <div className='w-full max-w-full flex justify-content-end button-panel'>
                          <button className='mx-1' onClick={() => handleUpdate()}><span className="pi pi-user-edit"></span></button>
                          <button className='mx-1' onClick={() => handleDelete()}><span className="pi pi-times-circle"></span></button>
                        </div>
                      </div>
                    ))}
                    {panelContent === 'list_roles' && roles && roles.map((role) => (
                      <div key={role.id} className="menu-item flex justify-content-between w-full max-w-full" onClick={() => {
                        setSelectedRole(role);
                        setPanelDetails('role_details');
                      }}>
                        {role.name}
                        <div className='w-full max-w-full flex justify-content-end button-panel'>
                          <button className='mx-1' onClick={() => handleUpdate()}><span className="pi pi-user-edit"></span></button>
                          <button className='mx-1' onClick={() => handleDelete()}><span className="pi pi-times-circle"></span></button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
          </SplitterPanel>
          <SplitterPanel className="flex align-items-center justify-content-center" size={80}>
            {panelDetails === 'user_details' && selectedUser && (
              <div>
                <h2>User Details</h2>
                <p>Full Name: {selectedUser.fullName}</p>
                <p>Email: {selectedUser.email}</p>
              </div>
            )}
            {panelDetails === 'page_details' && selectedPage && (
              <div>
                <h2>Page Details</h2>
                <p>Name: {selectedPage.name}</p>
                <p>Code: {selectedPage.code}</p>
              </div>
            )}
            {panelDetails === 'role_details' && selectedRole && (
              <div>
                <h2>Role Details</h2>
                <p>Name: {selectedRole.name}</p>
                <p>Code: {selectedRole.code}</p>
              </div>
            )}
          </SplitterPanel>
        </Splitter>
      </SplitterPanel>
    </Splitter>
      </SplitterPanel >
    </Splitter >
  );
}
