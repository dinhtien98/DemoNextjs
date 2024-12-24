'use client';
import React, { useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { getCookie } from '../../components/get-Cookie';

interface DataItem {
    id: string;
    code: string;
    name: string;
    parentcode: string;
    level: string;
    url: string;
    hidden: boolean;
    icon: string;
    sort: number;
    createdtime: string;
    createdby: string;
    updatedtime: string;
    updatedby: string;
    deletedtime: string;
    deletedby: string;
    deletedflag: boolean;
}




export default function Page() {
    const [data, setData] = useState<DataItem[]>([]);

    const fetchData = async () => {
        try {
            const token = getCookie('next-auth.session-token'); 
            const resolvedToken = await token;
            const decodedData = resolvedToken?.value ? decodeURIComponent(resolvedToken.value) : '';
            const parsedData = JSON.parse(decodedData);
            const res = parsedData.token;
            if (!res) {
                throw new Error('No token found in cookies');
            }
    
            const response = await fetch('http://localhost:5004/api/authPage', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${res}`, 
                },
            });
    
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
        <div className="listPage">
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
