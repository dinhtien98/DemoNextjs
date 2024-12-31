/* eslint-disable react/jsx-no-duplicate-props */
/* eslint-disable react-hooks/rules-of-hooks */
'use client';
import { getServerSession, Session } from 'next-auth';
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import React, { useEffect, useState } from 'react'
import { DataTableSelectionMultipleChangeEvent, DataTableSelectAllChangeEvent } from 'primereact/datatable';
import { getUser } from '../components/fetchApi';
import { authOptions } from '../api/auth/[...nextauth]/route';
import { Button } from 'primereact/button';
import 'primereact/resources/themes/saga-blue/theme.css'; 
import 'primereact/resources/primereact.min.css';  
import 'primeicons/primeicons.css';

interface TableUser {
    session: Session;
}

interface User {
    id: number;
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

export default function tableUser({ session: initialSession }: TableUser) {
    const [session, setSession] = useState<Session | null>(initialSession);
    const [users, setUsers] = useState<User[] | null>(null);
    const [selectAll, setSelectAll] = useState<boolean>(false);
    const [selectedCustomers, setSelectedCustomers] = useState<User[] | null>(null);

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

    useEffect(() => {
        if (!initialSession) {
            fetch_Session();
        }
        get_User();
    }, [])

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

    return (
        <div className='p-4 m-4 flex flex-col md:flex-row gap-4'>
            <div className='p-4 w-full md:w-1/6 bg-white shadow-lg rounded-lg'>
                <ul className="menu p-4 text-lg font-bold">
                    <li className="menu-item p-2">
                        <a href="/user" className="text-black hover:text-blue-700">User</a>
                    </li>
                    <li className="menu-item p-2">
                        <a href="/page" className="text-black hover:text-blue-700">Page</a>
                    </li>
                    <li className="menu-item p-2">
                        <a href="/role" className="text-black hover:text-blue-700">Role</a>
                    </li>
                </ul>
            </div>
            <div className='p-4 w-full md:w-5/6 bg-white shadow-lg rounded-lg'>
                <div className='mb-4 flex gap-2'>
                    {!selectAll && (!selectedCustomers || selectedCustomers.length === 0) && (
                        <Button icon="pi pi-plus" label="Add New User" className="p-1 p-button-raised p-button-rounded p-button-primary hover:text-green-700" />
                    )}
                    {(selectedCustomers && selectedCustomers.length > 1) && (
                        <Button icon="pi pi-minus" label="Delete User" className="p-1 p-button-raised p-button-rounded p-button-danger hover:text-red-700" />
                    )}
                    {selectedCustomers && selectedCustomers.length === 1 && (
                        <>
                            <Button icon="pi pi-refresh" label="Update User" className="p-1 p-button-raised p-button-rounded p-button-warning hover:text-yellow-500" />
                            <Button icon="pi pi-minus" label="Delete User" className="p-1 p-button-raised p-button-rounded p-button-danger hover:text-red-700" />
                        </>
                    )}
                </div>
                <div>
                    <DataTable value={users || []} paginator rows={10} selectionMode="multiple"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        rowsPerPageOptions={[10, 25, 50]} dataKey="id"
                        selection={selectedCustomers || []} onSelectionChange={onSelectionChange} selectAll={selectAll} onSelectAllChange={onSelectAllChange}>
                        <Column selectionMode="multiple" headerStyle={{ width: '3rem' }} />
                        {users && users.length > 0 && Object.keys(users[0]).map((key) => (
                            <Column key={key} field={key} header={key.charAt(0).toUpperCase() + key.slice(1)} sortable filter filterPlaceholder={`Search by ${key}`} style={{ minWidth: '14rem' }} />
                        ))}
                    </DataTable>
                </div>
            </div>
        </div>
    )
}
