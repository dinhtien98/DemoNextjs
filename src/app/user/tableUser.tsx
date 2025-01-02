/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-html-link-for-pages */
/* eslint-disable react/jsx-no-duplicate-props */
/* eslint-disable react-hooks/rules-of-hooks */
'use client';
import { getServerSession, Session } from 'next-auth';
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import React, { useEffect, useState } from 'react'
import { DataTableSelectionMultipleChangeEvent, DataTableSelectAllChangeEvent } from 'primereact/datatable';
import { deleteUser, getRole, getUser, postUser, putUser } from '../components/fetchApi';
import { authOptions } from '../api/auth/[...nextauth]/route';
import { Button } from 'primereact/button';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { Dialog } from 'primereact/dialog';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { MultiSelect, MultiSelectChangeEvent } from 'primereact/multiselect';

interface TableUser {
    session: Session;
}

interface User {
    id: number;
    userName: string;
    password: string;
    fullName: string;
    email: string;
    firstLogin: number;
    inDate: string;
    outDate: string;
    failCount: number;
    isLocked: number;
    avatar: string;
    lastLogin: Date;
    createdTime: Date;
    createdBy: string;
    updatedTime: Date;
    updatedBy: string;
    deletedTime: Date;
    deletedBy: string;
    deletedFlag: number;
    roleName: JSON[];
}

interface UserTmp {
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

interface Role {
    id: number;
    name: string;
    code: string;
}
export default function tableUser({ session: initialSession }: TableUser) {
    const [session, setSession] = useState<Session | null>(initialSession);
    const [users, setUsers] = useState<User[] | null>(null);
    const [initialUsers, setinitialUsers] = useState<User[] | null>(null);
    const [selectAll, setSelectAll] = useState<boolean>(false);
    const [selectedCustomers, setSelectedCustomers] = useState<User[] | null>(null);
    const [visible, setVisible] = useState<boolean>(false);
    const [isEdit, setIsEdit] = useState<boolean>(false);
    const [roles, setRoles] = useState<Role[] | null>(null);
    const rolesProps = roles?.map((role) => ({ name: role.name, code: role.code }));
    const [selectedUserTmp, setSelectedUserTmp] = useState<UserTmp>({
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

    async function fetch_Session() {
        const sessionData: Session | null = await getServerSession(authOptions);
        setSession(sessionData);
    }

    const get_User = async () => {
        try {
            if (session?.user?.token) {
                const user = await getUser(session.user.token);
                setUsers(user);
                setinitialUsers(user);
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

    const handleDelete = async () => {
        const ids = selectedCustomers ? selectedCustomers.map(user => user.id) : [];
        if (ids.length > 0) {
            try {
                if (session?.user?.token) {
                    for (const id of ids) {
                        const res = await deleteUser(session.user.token, id, selectedUserTmp);
                        if (res) {
                            console.log('Deleted user with id:', id);
                        } else {
                            console.error('Error deleting user with id:', id, res);
                        }
                    }
                    get_User();
                    setSelectedCustomers([]);
                    setSelectAll(false);
                } else {
                    console.error('User token is undefined');
                }
            } catch (error) {
                console.error('Error deleting users:', error);
            }
        } else {
            console.error('No users selected for deletion');
        }
    }

    useEffect(() => {
        if (!initialSession) {
            fetch_Session();
        }
        get_User();
        get_Role();
    }, [])

    useEffect(() => {
        setData();
    }, [selectedCustomers, isEdit])
    
    const setData = () => {
        if (isEdit && selectedCustomers && selectedCustomers.length === 1) {
            const user = selectedCustomers[0];
            setSelectedUserTmp({
                fullName: user.fullName,
                email: user.email,
                avatar: user.avatar,
                userName: user.userName,
                password: '',
                firstLogin: user.firstLogin,
                inDate: user.inDate,
                outDate: user.outDate,
                failCount: user.failCount,
                isLocked: user.isLocked,
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
        } else {
            setSelectedUserTmp({
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
        }
    };
    const onSelectionChange = (event: DataTableSelectionMultipleChangeEvent<User[]>) => {
        const value = event.value;
        const totalRecords = users ? users.length : 0;

        setSelectedCustomers(value as unknown as User[]);
        setSelectAll((value as unknown as User[]).length === totalRecords);
    };
    const onSelectAllChange = (event: DataTableSelectAllChangeEvent) => {
        const selectAll = event.checked;

        if (selectAll && users) {
            setSelectAll(true);
            setSelectedCustomers(users);
        } else {
            setSelectAll(false);
            setSelectedCustomers([]);
        }
    };

    const handleAdd = async () => {
        try {
            if (session?.user?.token) {
                const res = await postUser(session.user.token, selectedUserTmp);
                if (res) {
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
    };

    const handleUpdate = async () => {
        const id = selectedCustomers ? selectedCustomers.map(user => user.id) : [];
        try {
            if (session?.user?.token) {
                const res = await putUser(session.user.token, id, selectedUserTmp);
                if (res) {
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
    };

    return (
        <div className='p-4 m-4 flex flex-col md:flex-row gap-4'>
            <div className='p-4 w-full md:w-1/6 bg-white shadow-lg rounded-lg'>
                <div className='font-bold'>
                    <a href="/" className="text-black hover:text-blue-700">
                        <i className="pi pi-home mr-2"></i>Dashboard
                    </a>
                </div>
                <ul className="menu p-4 text-lg font-bold">
                    <li className="menu-item p-2">
                        <a href="/user" className="text-blue-700">
                            <i className="pi pi-user mr-2"></i>User
                        </a>
                    </li>
                    <li className="menu-item p-2">
                        <a href="/page" className="text-black hover:text-blue-700">
                            <i className="pi pi-file mr-2"></i>Page
                        </a>
                    </li>
                    <li className="menu-item p-2">
                        <a href="/role" className="text-black hover:text-blue-700">
                            <i className="pi pi-users mr-2"></i>Role
                        </a>
                    </li>
                </ul>
            </div>
            <div className='p-4 w-full md:w-5/6 bg-white shadow-lg rounded-lg'>
                <div className='mb-4 flex gap-2'>
                    <div className='p-4 w-full md:w-4/6'>
                        <Button onClick={() => (setVisible(true))} icon="pi pi-plus" label="Add New User" className="p-2 p-button-raised p-button-rounded p-button-primary text-green-500 hover:text-green-700" />
                        <Dialog header={isEdit ? 'Update User' : 'Add New User'} visible={visible} style={{ width: '50vw' }} onHide={() => { if (!visible) return; setVisible(false); }} className="custom-dialog" closable={false}>
                            <Card className="md:w-25rem">
                                <div className="card flex flex-wrap justify-content-center gap-4 p-4">
                                    <div className="p-inputgroup">
                                        <span className="p-inputgroup-addon mx-1">
                                            <i className="pi pi-user"></i>
                                        </span>
                                        {!isEdit ? (
                                            <InputText type="text" placeholder="UserName" tooltip="Enter your UserName" value={selectedUserTmp?.userName || ''} onChange={(e) => {
                                                if (selectedUserTmp) {
                                                    setSelectedUserTmp({ ...selectedUserTmp, userName: e.target.value });
                                                }
                                            }} className="p-inputtext-lg" />
                                        ) : (
                                            <div className="p-inputtext-lg">{selectedCustomers ? selectedCustomers.map(user => user.userName).join(', ') : ''}</div>
                                        )}
                                    </div>
                                    <div className="p-inputgroup">
                                        <span className="p-inputgroup-addon mx-1">
                                            <i className="pi pi-lock"></i>
                                        </span>
                                        <InputText type="password" placeholder="Password" tooltip="Enter your Password" value={selectedUserTmp?.password || ''} onChange={(e) => {
                                            if (selectedUserTmp) {
                                                setSelectedUserTmp({ ...selectedUserTmp, password: e.target.value });
                                            }
                                        }} className="p-inputtext-lg" />
                                    </div>
                                    <div className="p-inputgroup">
                                        <span className="p-inputgroup-addon mx-1">
                                            <i className="pi pi-id-card"></i>
                                        </span>
                                        <InputText type="text" placeholder="FullName" tooltip="Enter your FullName" value={selectedUserTmp?.fullName || ''} onChange={(e) => {
                                            if (selectedUserTmp) {
                                                setSelectedUserTmp({ ...selectedUserTmp, fullName: e.target.value });
                                            }
                                        }} className="p-inputtext-lg" />
                                    </div>
                                    <div className="p-inputgroup">
                                        <span className="p-inputgroup-addon mx-1">
                                            <i className="pi pi-envelope"></i>
                                        </span>
                                        <InputText type="text" placeholder="Email" tooltip="Enter your Email" value={selectedUserTmp?.email || ''} onChange={(e) => {
                                            if (selectedUserTmp) {
                                                setSelectedUserTmp({ ...selectedUserTmp, email: e.target.value });
                                            }
                                        }} className="p-inputtext-lg" />
                                    </div>
                                    <div className="p-inputgroup">
                                        <span className="p-inputgroup-addon mx-1">
                                            <i className="pi pi-image"></i>
                                        </span>
                                        <InputText type="text" placeholder="Avatar" tooltip="Enter your Avatar" value={selectedUserTmp?.avatar || ''} onChange={(e) => {
                                            if (selectedUserTmp) {
                                                setSelectedUserTmp({ ...selectedUserTmp, avatar: e.target.value });
                                            }
                                        }} className="p-inputtext-lg" />
                                    </div>
                                    <div className="card flex justify-content-center w-full">
                                        <MultiSelect value={selectedUserTmp?.roleCode} onChange={(e: MultiSelectChangeEvent) => {
                                            if (selectedUserTmp) {
                                                setSelectedUserTmp({ ...selectedUserTmp, roleCode: e.value });
                                            }
                                        }} options={rolesProps} optionLabel="name"
                                            placeholder="Select Roles" maxSelectedLabels={3} className="w-full md:w-20rem p-multiselect-lg" tooltip="Choose Roles" />
                                    </div>
                                </div>
                                <div className='flex justify-content-center gap-4 p-4'>
                                    <Button className='w-full my-2 button-panel text-red-500 hover:text-red-700 p-button-lg' label="Close" onClick={() => (setIsEdit(false), setVisible(false))} />
                                    <Button className='w-full my-2 button-panel text-green-500 hover:text-green-700 p-button-lg' label="Save" onClick={() => { isEdit ? handleUpdate() : handleAdd(); setIsEdit(false); }} />
                                </div>
                            </Card>
                        </Dialog>
                        {(selectedCustomers && selectedCustomers.length > 1) && (
                            <Button onClick={() => handleDelete()} icon="pi pi-minus" label="Delete User" className="p-2 p-button-raised p-button-rounded p-button-danger text-red-500 hover:text-red-700" />
                        )}
                        {selectedCustomers && selectedCustomers.length === 1 && (
                            <>
                                <Button onClick={() => (setIsEdit(!isEdit), setVisible(true))} icon="pi pi-refresh" label="Update User" className="p-2 p-button-raised p-button-rounded p-button-warning text-yellow-400 hover:text-yellow-600" />
                                <Button onClick={() => handleDelete()} icon="pi pi-minus" label="Delete User" className="p-2 p-button-raised p-button-rounded p-button-danger text-red-500 hover:text-red-700" />
                            </>
                        )}
                    </div>
                    <div className="p-4 w-full md:w-2/6">
                        <div className="p-inputgroup">
                            <span className="p-inputgroup-addon bg-blue-500 text-white rounded-l-md">
                                <i className="pi pi-search"></i>
                            </span>
                            <InputText className='border border-0.7 border-solid' placeholder="Search..." onChange={(e) => {
                                const searchValue = e.target.value.toLowerCase();
                                const filteredUsers = initialUsers?.filter(user =>
                                    Object.values(user).some(value =>
                                        value && value.toString().toLowerCase().includes(searchValue)
                                    )
                                );
                                setUsers(filteredUsers || initialUsers);
                            }} />
                        </div>
                    </div>
                </div>
                <div>
                    <DataTable value={users || []} paginator rows={10} selectionMode="multiple"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        rowsPerPageOptions={[10, 25, 50]} dataKey="id" totalRecords={users ? users.length : 0}
                        selection={selectedCustomers || []} onSelectionChange={isEdit ? undefined : onSelectionChange} selectAll={selectAll} onSelectAllChange={isEdit ? undefined : onSelectAllChange}
                        rowClassName={(rowData) => selectedCustomers?.some(user => user.id === rowData.id) ? 'bg-blue-100' : rowData.deletedFlag === 1 ? 'bg-red-50' : rowData.deletedFlag === 0 ? 'bg-green-50' : ''}>
                        <Column selectionMode="multiple" headerStyle={{ width: '3rem' }} />
                        {users && users.length > 0 && Object.keys(users[0]).map((key) => (
                            <Column key={key} field={key} header={key.charAt(0).toUpperCase() + key.slice(1)} sortable filter filterPlaceholder={`Search by ${key}`} style={{ minWidth: '4rem' }} />
                        ))}
                    </DataTable>
                </div>
            </div>
        </div >
    )
}
