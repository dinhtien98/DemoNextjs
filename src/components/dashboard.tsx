/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useEffect, useState } from 'react';
import { getServerSession } from "next-auth";
import { Splitter, SplitterPanel } from "primereact/splitter";
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { MultiSelect, MultiSelectChangeEvent } from 'primereact/multiselect';
import { deleteUser, getPage, getRole, getUser, postUser } from '@/app/components/fetchApi';

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
  isLocked: number;
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

interface UserProps {
  fullName: string;
  email: string;
  avatar: string;
  userName: string;
  password: string;
  firstLogin: number;
  inDate: string;
  outDate: string;
  failCount: number;
  isLocked: number;
  lastLogin: Date;
  createdTime: Date;
  createdBy: string;
  updatedTime: Date;
  updatedBy: string;
  deletedTime: Date;
  deletedBy: string;
  deletedFlag: number;
  roleCode: JSON[];
}


export default function Dashboard({ session: initialSession }: DashboardProps) {
  const [session, setSession] = useState<Session | null>(initialSession);
  const [users, setUsers] = useState<User[] | null>(null);
  const [pages, setPages] = useState<Page[] | null>(null);
  const [roles, setRoles] = useState<Role[] | null>(null);
  const [visible, setVisible] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedPage, setSelectedPage] = useState<Page | null>(null);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [panelContent, setPanelContent] = useState<string>('list_users');
  const [panelDetails, setPanelDetails] = useState<string>('');
  const [selectedUserProps, setSelectedUserProps] = useState<UserProps>({
    fullName: '',
    email: '',
    avatar: '',
    userName: '',
    password: '',
    firstLogin: 0,
    inDate: '',
    outDate: '',
    failCount: 0,
    isLocked: 0,
    lastLogin: new Date(),
    createdTime: new Date(),
    createdBy: '',
    updatedTime: new Date(),
    updatedBy: '',
    deletedTime: new Date(),
    deletedBy: '',
    deletedFlag: 0,
    roleCode: []
  });
  const rolesProps = roles?.map((role) => ({ name: role.name, code: role.code }));

  async function fetch_Session() {
    const sessionData: Session | null = await getServerSession(authOptions);
    setSession(sessionData);
  }

  const get_User = async () => {
    try {
      if (session?.user?.token) {
        const user = await getUser(session.user.token);
        setUsers(user);
      } else {
        console.error('User token is undefined');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  const get_Page = async () => {
    try {
      if (session?.user?.token) {
        const page = await getPage(session.user.token);
        setPages(page);
      } else {
        console.error('User token is undefined');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  const get_Role = async () => {
    try {
      if (session?.user?.token) {
        const role = await getRole(session.user.token);
        setRoles(role);
      } else {
        console.error('User token is undefined');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const headerPanelAdd = panelContent === 'list_users' ? 'Add new user' :
    panelContent === 'list_pages' ? 'Add new page' :
      panelContent === 'list_roles' ? 'Add new role' : '';

  const handleAdd = async () => {
    if (panelContent === 'list_users') {
      try {
        if (session?.user?.token) {
          const res = await postUser(session.user.token, selectedUserProps);
          if (res) {
            console.log('res', res);
            setVisible(false);
            get_User();
          } else {
            console.error('Error fetching data:', res);
          }
        } else {
          console.error('User token is undefined');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    } else if (panelContent === 'list_pages') {

    } else if (panelContent === 'list_roles') {

    }
  };

  const handleDelete = async (id: any) => {
    if (panelContent === 'list_users') {
      try {
        if (session?.user?.token) {
          const res = await deleteUser(session.user.token, id, selectedUserProps);
          if (res) {
            console.log('res', res);
            get_User();
          } else {
            console.error('Error fetching data:', res);
          }
        } else {
          console.error('User token is undefined');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    } else if (panelContent === 'list_pages') {

    } else if (panelContent === 'list_roles') {

    }
  }
  const handleUpdate = (id: any) => { }


  useEffect(() => {
    if (!initialSession) {
      fetch_Session();
    }
    get_User();
    get_Page();
    get_Role();
  }, []);
  return (
    <Splitter >
      <SplitterPanel className="flex align-items-center justify-content-center p-2" size={20} minSize={10}>
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
          <SplitterPanel className="flex align-items-center justify-content-center p-2" size={15}>
            <button onClick={() => setVisible(true)}>
              <div className='flex button-panel'>
                <span className="pi pi-plus-circle"></span>
                <div className='mx-1'>
                  {panelContent === 'list_users' && 'Add new user'}
                  {panelContent === 'list_pages' && 'Add new page'}
                  {panelContent === 'list_roles' && 'Add new role'}
                </div>
              </div>
            </button>

            <Dialog header={headerPanelAdd} visible={visible} style={{ width: '70vw' }} onHide={() => { if (!visible) return; setVisible(false); }}>
              <Card className="md:w-25rem">
                <div className="card flex flex-wrap justify-content-center gap-2">
                  <InputText type="text" placeholder="UserName" tooltip="Enter your UserName" value={selectedUserProps?.userName || ''} onChange={(e) => {
                    if (selectedUserProps) {
                      setSelectedUserProps({ ...selectedUserProps, userName: e.target.value });
                    }
                  }} />
                  <InputText type="password" placeholder="Password" tooltip="Enter your Password" value={selectedUserProps?.password || ''} onChange={(e) => {
                    if (selectedUserProps) {
                      setSelectedUserProps({ ...selectedUserProps, password: e.target.value });
                    }
                  }} />
                  <InputText type="text" placeholder="FullName" tooltip="Enter your FullName" value={selectedUserProps?.fullName || ''} onChange={(e) => {
                    if (selectedUserProps) {
                      setSelectedUserProps({ ...selectedUserProps, fullName: e.target.value });
                    }
                  }} />
                  <InputText type="text" placeholder="Email" tooltip="Enter your Email" value={selectedUserProps?.email || ''} onChange={(e) => {
                    if (selectedUserProps) {
                      setSelectedUserProps({ ...selectedUserProps, email: e.target.value });
                    }
                  }} />
                  <InputText type="text" placeholder="Avatar" tooltip="Enter your Avatar" value={selectedUserProps?.avatar || ''} onChange={(e) => {
                    if (selectedUserProps) {
                      setSelectedUserProps({ ...selectedUserProps, avatar: e.target.value });
                    }
                  }} />
                  <div className="card flex justify-content-center">
                    <MultiSelect value={selectedUserProps?.roleCode} onChange={(e: MultiSelectChangeEvent) => {
                      if (selectedUserProps) {
                        setSelectedUserProps({ ...selectedUserProps, roleCode: e.value });
                      }
                    }} options={rolesProps} optionLabel="name"
                      placeholder="Select Roles" maxSelectedLabels={3} className="w-full md:w-20rem" tooltip="Choose Roles" />
                  </div>
                </div>
              </Card>
              <Button className='w-full my-2 button-panel' label="Save" onClick={handleAdd} />
            </Dialog>
          </SplitterPanel>
          <SplitterPanel size={85}>
            <Splitter>
              <SplitterPanel className="flex align-items-center justify-content-center p-2" size={20}>
                <div className="card flex justify-content-center w-full max-w-full">
                  <div className="menu w-full max-w-full">
                    {panelContent === 'list_users' && users && users.map((user) => (
                      <div key={user.id} className="menu-item flex justify-content-between w-full max-w-full" onClick={() => {
                        setSelectedUser(user);
                        setPanelDetails('user_details');
                      }}>
                        <span>{user.userName}</span>
                        <div className='w-full max-w-full flex justify-content-end button-panel'>
                          <button className='mx-1' onClick={() => setIsEdit(!isEdit)}><span className="pi pi-user-edit"></span></button>
                          <button className='mx-1' onClick={() => handleDelete(user.id)}><span className="pi pi-times-circle"></span></button>
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
                          <button className='mx-1' onClick={() => setIsEdit(true)}><span className="pi pi-user-edit"></span></button>
                          <button className='mx-1' onClick={() => handleDelete(page.id)}><span className="pi pi-times-circle"></span></button>
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
                          <button className='mx-1' onClick={() => setIsEdit(true)}><span className="pi pi-user-edit"></span></button>
                          <button className='mx-1' onClick={() => handleDelete(role.id)}><span className="pi pi-times-circle"></span></button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </SplitterPanel>
              <SplitterPanel className="flex align-items-center justify-content-center p-2" size={80}>
                {panelDetails === 'user_details' && selectedUser && (
                  <div>
                    <h2>{isEdit ? 'User Edit' : 'User Details'}</h2>
                    {isEdit ? (
                      <>
                        <InputText type="text" tooltip="Enter your FullName" value={selectedUser.fullName} onChange={(e) => setSelectedUser({ ...selectedUser, fullName: e.target.value })} />
                        <InputText type="text" tooltip="Enter your Email" value={selectedUser.email} onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })} />
                        <InputText type="text" tooltip="Enter your Avatar" value={selectedUser.avatar} onChange={(e) => setSelectedUser({ ...selectedUser, avatar: e.target.value })} />
                        <div>
                          <label>Is Locked:</label>
                          <label className='mx-2'>
                            <input type="radio" value="0" checked={selectedUser.isLocked === 0} onChange={() => setSelectedUser({ ...selectedUser, isLocked: 0 })} />
                            False
                          </label>
                          <label className='mx-2'>
                            <input type="radio" value="1" checked={selectedUser.isLocked === 1} onChange={() => setSelectedUser({ ...selectedUser, isLocked: 1 })} />
                            True
                          </label>
                        </div>
                        <button onClick={() => (handleUpdate(selectedUser.id), setIsEdit(false))}>Save</button>
                      </>
                    ) : (
                      <>
                        <p>UserName: {selectedUser.userName}</p>
                        <p>Full Name: {selectedUser.fullName}</p>
                        <p>Email: {selectedUser.email}</p>
                        <p>Avatar: {selectedUser.avatar}</p>
                        <p>Is Locked: {selectedUser.isLocked === 1 ? 'True' : 'False'}</p>
                      </>
                    )}
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
