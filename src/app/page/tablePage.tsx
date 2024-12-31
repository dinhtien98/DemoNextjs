/* eslint-disable @next/next/no-html-link-for-pages */
/* eslint-disable react-hooks/rules-of-hooks */
'use client'
import { getServerSession, Session } from 'next-auth';
import React, { useEffect, useState } from 'react'
import { authOptions } from '../api/auth/[...nextauth]/route';
import { getPage, postPage } from '../components/fetchApi';
import { Button } from 'primereact/button';
import { DataTable, DataTableSelectAllChangeEvent, DataTableSelectionMultipleChangeEvent } from 'primereact/datatable';
import { Column } from 'primereact/column';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { Card } from 'primereact/card';

interface TablePage {
    session: Session;
}

interface Pages {
    id: string;
    code: string;
    name: string;
    parentCode: string;
    level: number;
    url: string;
    hidden: number;
    icon: string;
    sort: number;
    createdTime: Date;
    createdBy: string;
    updatedTime: Date;
    updatedBy: string;
    deletedTime: Date;
    deletedBy: string;
    deletedFlag: number;
    roleName: JSON[];
    actionName: JSON[]
}

interface PageTmp {
    code: string;
    name: string;
    parentCode: string;
    level: number;
    url: string;
    hidden: number;
    icon: string;
    sort: number;
    createdTime: Date;
    createdBy: string;
    updatedTime: Date;
    updatedBy: string;
    deletedTime: Date;
    deletedBy: string;
    deletedFlag: number;
    userName?: string;
    password?: string;
    fullName?: string;
    email?: string;
    avatar?: string;
}

export default function tablePage({ session: initialSession }: TablePage) {
    const [session, setSession] = useState<Session | null>(initialSession);
    const [pages, setPages] = useState<Pages[] | null>(null);
    const [visible, setVisible] = useState<boolean>(false);
    const [initialPages, setinitialPages] = useState<Pages[] | null>(null);
    const [selectAll, setSelectAll] = useState<boolean>(false);
    const [selectedCustomers, setSelectedCustomers] = useState<Pages[] | null>(null);
    const [selectedPageTmp, setSelectedPageTmp] = useState<PageTmp>({
        code: '',
        name: '',
        parentCode: '',
        level: 0,
        url: '',
        hidden: 0,
        icon: '',
        sort: 0,
        createdTime: new Date(),
        createdBy: '',
        updatedTime: new Date(),
        updatedBy: '',
        deletedTime: new Date(),
        deletedBy: '',
        deletedFlag: 0,
    });


    async function fetch_Session() {
        const sessionData: Session | null = await getServerSession(authOptions);
        setSession(sessionData);
    }

    const get_Page = async () => {
        try {
            if (session?.user?.token) {
                const res = await getPage(session.user.token);
                setPages(res);
                setinitialPages(res);
            } else {
                console.error('User token is undefined');
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleAdd = async () => {
        try {
            if (session?.user?.token) {
                const res = await postPage(session.user.token, selectedPageTmp);
                if (res) {
                    setVisible(false);
                    get_Page();
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

    useEffect(() => {
        if (!initialSession) {
            fetch_Session();
        }
        get_Page();
    }, [])

    const onSelectionChange = (event: DataTableSelectionMultipleChangeEvent<Pages[]>) => {
        const value = event.value;
        const totalRecords = pages ? pages.length : 0;

        setSelectedCustomers(value as unknown as Pages[]);
        setSelectAll((value as unknown as Pages[]).length === totalRecords);
    };
    const onSelectAllChange = (event: DataTableSelectAllChangeEvent) => {
        const selectAll = event.checked;

        if (selectAll && pages) {
            setSelectAll(true);
            setSelectedCustomers(pages);
        } else {
            setSelectAll(false);
            setSelectedCustomers([]);
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
                        <a href="/user" className="text-black hover:text-blue-700">
                            <i className="pi pi-user mr-2"></i>User
                        </a>
                    </li>
                    <li className="menu-item p-2">
                        <a href="/page" className="text-blue-700">
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
                    <div className="p-4 w-full md:w-4/6">
                        <Button onClick={() => setVisible(true)} icon="pi pi-plus" label="Add New Page" className="p-2 p-button-raised p-button-rounded p-button-primary text-green-500 hover:text-green-700" />
                        <Dialog header='Add New Page' visible={visible} style={{ width: '50vw' }} onHide={() => { if (!visible) return; setVisible(false); }} className="custom-dialog">
                            <Card className="md:w-25rem">
                                <div className="card flex flex-wrap justify-content-center gap-4 p-4" style={{ background: "#f9f9f9", borderRadius: "8px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}>
                                    <div className="p-inputgroup" style={{ width: "100%", maxWidth: "400px" }}>
                                        <span className="p-inputgroup-addon">
                                            <i className="pi pi-key"></i>
                                        </span>
                                        <InputText
                                            type="text"
                                            placeholder="Page Code"
                                            tooltip="Enter your Page Code"
                                            value={selectedPageTmp?.code || ''}
                                            onChange={(e) => {
                                                if (selectedPageTmp) {
                                                    setSelectedPageTmp({ ...selectedPageTmp, code: e.target.value });
                                                }
                                            }}
                                            className="p-inputtext-lg mx-1"
                                            style={{ borderRadius: "0 5px 5px 0" }}
                                        />
                                    </div>

                                    <div className="p-inputgroup" style={{ width: "100%", maxWidth: "400px" }}>
                                        <span className="p-inputgroup-addon">
                                            <i className="pi pi-tag"></i>
                                        </span>
                                        <InputText
                                            type="text"
                                            placeholder="Page Name"
                                            tooltip="Enter your Page Name"
                                            value={selectedPageTmp?.name || ''}
                                            onChange={(e) => {
                                                if (selectedPageTmp) {
                                                    setSelectedPageTmp({ ...selectedPageTmp, name: e.target.value });
                                                }
                                            }}
                                            className="p-inputtext-lg mx-1"
                                            style={{ borderRadius: "0 5px 5px 0" }}
                                        />
                                    </div>

                                    <div className="p-inputgroup" style={{ width: "100%", maxWidth: "400px" }}>
                                        <span className="p-inputgroup-addon">
                                            <i className="pi pi-folder"></i>
                                        </span>
                                        <InputText
                                            type="text"
                                            placeholder="Page Parent Code"
                                            tooltip="Enter your Page Parent Code"
                                            value={selectedPageTmp?.parentCode || ''}
                                            onChange={(e) => {
                                                if (selectedPageTmp) {
                                                    setSelectedPageTmp({ ...selectedPageTmp, parentCode: e.target.value });
                                                }
                                            }}
                                            className="p-inputtext-lg mx-1"
                                            style={{ borderRadius: "0 5px 5px 0" }}
                                        />
                                    </div>

                                    <div className="p-inputgroup" style={{ width: "100%", maxWidth: "400px" }}>
                                        <span className="p-inputgroup-addon">
                                            <i className="pi pi-sitemap"></i>
                                        </span>
                                        <InputText
                                            type="number"
                                            placeholder="Page Level"
                                            tooltip="Enter your Page Level"
                                            value={selectedPageTmp?.level?.toString() || ''}
                                            onChange={(e) => {
                                                if (selectedPageTmp) {
                                                    setSelectedPageTmp({ ...selectedPageTmp, level: parseInt(e.target.value) });
                                                }
                                            }}
                                            className="p-inputtext-lg mx-1"
                                            style={{ borderRadius: "0 5px 5px 0" }}
                                        />
                                    </div>

                                    <div className="p-inputgroup" style={{ width: "100%", maxWidth: "400px" }}>
                                        <span className="p-inputgroup-addon">
                                            <i className="pi pi-link"></i>
                                        </span>
                                        <InputText
                                            type="text"
                                            placeholder="Page URL"
                                            tooltip="Enter your Page URL"
                                            value={selectedPageTmp?.url || ''}
                                            onChange={(e) => {
                                                if (selectedPageTmp) {
                                                    setSelectedPageTmp({ ...selectedPageTmp, url: e.target.value });
                                                }
                                            }}
                                            className="p-inputtext-lg mx-1"
                                            style={{ borderRadius: "0 5px 5px 0" }}
                                        />
                                    </div>

                                    <div className="p-inputgroup" style={{ width: "100%", maxWidth: "400px" }}>
                                        <span className="p-inputgroup-addon">
                                            <i className="pi pi-star"></i>
                                        </span>
                                        <InputText
                                            type="text"
                                            placeholder="Page Icon"
                                            tooltip="Enter your Page Icon"
                                            value={selectedPageTmp?.icon || ''}
                                            onChange={(e) => {
                                                if (selectedPageTmp) {
                                                    setSelectedPageTmp({ ...selectedPageTmp, icon: e.target.value });
                                                }
                                            }}
                                            className="p-inputtext-lg mx-1"
                                            style={{ borderRadius: "0 5px 5px 0" }}
                                        />
                                    </div>
                                </div>

                                <Button className='w-full my-2 button-panel text-green-500 hover:text-green-700 p-button-lg' label="Save" onClick={handleAdd} />
                            </Card>
                        </Dialog>
                        {(selectedCustomers && selectedCustomers.length > 1) && (
                            <Button icon="pi pi-minus" label="Delete Page" className="p-2 p-button-raised p-button-rounded p-button-danger text-red-500 hover:text-red-700" />
                        )}
                        {selectedCustomers && selectedCustomers.length === 1 && (
                            <>
                                <Button icon="pi pi-refresh" label="Update Page" className="p-2 p-button-raised p-button-rounded p-button-warning text-yellow-400 hover:text-yellow-600" />
                                <Button icon="pi pi-minus" label="Delete Page" className="p-2 p-button-raised p-button-rounded p-button-danger text-red-500 hover:text-red-700" />
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
                                const filteredPages = initialPages?.filter(page =>
                                    Object.values(page).some(value =>
                                        value && value.toString().toLowerCase().includes(searchValue)
                                    )
                                );
                                setPages(filteredPages || initialPages);
                            }} />
                        </div>
                    </div>
                </div>
                <div>
                    <DataTable value={pages || []} paginator rows={10} selectionMode="multiple"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        rowsPerPageOptions={[10, 25, 50]} dataKey="id"
                        selection={selectedCustomers || []} onSelectionChange={onSelectionChange} selectAll={selectAll} onSelectAllChange={onSelectAllChange}
                        rowClassName={(rowData) => rowData.deletedFlag === 1 ? 'bg-red-100' : rowData.deletedFlag === 0 ? 'bg-green-100' : ''}>
                        <Column selectionMode="multiple" headerStyle={{ width: '3rem' }} />
                        {pages && pages.length > 0 && Object.keys(pages[0]).map((key) => (
                            <Column key={key} field={key} header={key.charAt(0).toUpperCase() + key.slice(1)} sortable filter filterPlaceholder={`Search by ${key}`} style={{ minWidth: '14rem' }} />
                        ))}
                    </DataTable>
                </div>
            </div>
        </div>
    )
}
