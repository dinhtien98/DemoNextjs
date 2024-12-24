'use client';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import React, { useEffect, useState } from 'react';

interface DataItem {
    id: string;
    userName: string;
    password: string;
    firstLogin: string;
    inDate: string;
    outDate: string;
    failCount: string;
    isLocked: boolean;
    lastLogin: string;
    createdtime: string;
    createdby: string;
    updatedtime: string;
    updatedby: string;
    deletedtime: string;
    deletedby: string;
    deletedflag: boolean;
    fullName: string;
    email: string;
    avatar: string;
}

export default function Page() {
    const [data, setData] = useState<DataItem[]>([]);

    const fetchData = async () => {
        try {
            const response = await fetch('http://localhost:5004/api/authUser');
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const result = await response.json();
            setData(result);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const renderColumns = () => {
        if (data.length === 0) return null;

        return Object.keys(data[0]).map((key) => (
            <Column
                key={key}
                field={key}
                header={key.charAt(0).toUpperCase() + key.slice(1)}
                filter
                filterPlaceholder={`Search by ${key}`}
                style={{ minWidth: '6rem' }}
            />
        ));
    };

    return (
        <div className="listUser">
            <DataTable
                value={data}
                paginator
                rows={5}
                rowsPerPageOptions={[5, 10, 25, 50]}
                tableStyle={{ minWidth: '50rem' }}
            >
                {renderColumns()}
            </DataTable>
        </div>
    );
}
