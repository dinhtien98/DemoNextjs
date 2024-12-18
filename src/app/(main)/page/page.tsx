'use client';
import React, { useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';



export default function page() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:5004/api/authPage');
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const result = await response.json();
            setData(result);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);
    return (
        <div className="card">
            <DataTable value={data} paginator rows={5} rowsPerPageOptions={[5, 10, 25, 50]} tableStyle={{ minWidth: '50rem' }}>
            <Column field="id" header="ID" filter filterPlaceholder="Search by id" style={{ minWidth: '4rem' }} />
                        <Column field="code" header="Code" filter filterPlaceholder="Search by code" style={{ minWidth: '6rem' }} />
                        <Column field="name" header="Name" filter filterPlaceholder="Search by name" style={{ minWidth: '12rem' }} />
                        <Column field="parentcode" header="Parent Code" filter filterPlaceholder="Search by ParentCode" style={{ minWidth: '6rem' }} />
                        <Column field="level" header="Level" filter filterPlaceholder="Search by Level" style={{ minWidth: '4rem' }} />
                        <Column field="url" header="URL" filter filterPlaceholder="Search by URL" style={{ minWidth: '12rem' }} />
                        <Column field="hidden" header="Hidden" filter filterPlaceholder="Search by Hidden" style={{ minWidth: '4rem' }} />
                        <Column field="icon" header="Icon" filter filterPlaceholder="Search by Icon" style={{ minWidth: '4rem' }} />
                        <Column field="sort" header="Sort" filter filterPlaceholder="Search by Sort" style={{ minWidth: '4rem' }} />
                        <Column field="createdtime" header="Created Time" filter dataType="date" style={{ minWidth: '12rem' }} />
                        <Column field="createdby" header="Created By" filter filterPlaceholder="Search by CreatedBy" style={{ minWidth: '12rem' }} />
                        <Column field="updatedtime" header="Updated Time" filter dataType="date" style={{ minWidth: '12rem' }} />
                        <Column field="updatedby" header="Updated By" filter filterPlaceholder="Search by UpdatedBy" style={{ minWidth: '12rem' }} />
                        <Column field="deletedtime" header="Deleted Time" filter dataType="date" style={{ minWidth: '12rem' }} />
                        <Column field="deletedby" header="Deleted By" filter filterPlaceholder="Search by DeletedBy" style={{ minWidth: '12rem' }} />
                        <Column field="deletedflag" header="Deleted Flag" filter filterPlaceholder="Search by DeletedFlag" style={{ minWidth: '4rem' }} />
            </DataTable>
        </div>
    );
}
        