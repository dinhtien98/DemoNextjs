/* eslint-disable react-hooks/rules-of-hooks */
'use client';
import { getServerSession, Session } from 'next-auth';
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import React, { useEffect, useState } from 'react'
import { getUser } from '../components/fetchApi';
import { authOptions } from '../api/auth/[...nextauth]/route';

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

    return (
        <div className='p-2 m-2 flex'>
            <div className='p-2 w-30% w-full'>
                panel 1
            </div>
            <div className='p-2 w-70% w-full'>
                <div>
                    panel 2
                </div>
                <div>
                    <DataTable value={users || []} paginator rows={10} selection={users || []} selectionMode="multiple"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        rowsPerPageOptions={[10, 25, 50]} dataKey="id">
                        {users && users.length > 0 && Object.keys(users[0]).map((key) => (
                            <Column key={key} field={key} header={key.charAt(0).toUpperCase() + key.slice(1)} sortable filter filterPlaceholder={`Search by ${key}`} style={{ minWidth: '14rem' }} />
                        ))}
                    </DataTable>
                </div>
            </div>
        </div>
    )
}
