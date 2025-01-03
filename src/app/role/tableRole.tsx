/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @next/next/no-html-link-for-pages */
/* eslint-disable react-hooks/rules-of-hooks */
'use client'
import { getServerSession, Session } from 'next-auth';
import React, { useEffect, useState } from 'react'
import { authOptions } from '../api/auth/[...nextauth]/route';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { MultiSelect, MultiSelectChangeEvent } from 'primereact/multiselect';
import { DataTable, DataTableSelectAllChangeEvent, DataTableSelectionMultipleChangeEvent } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { deleteRole, getAction, getPage, getRole, postRole, putRole } from '../components/fetchApi';


interface TableRole {
    session: Session;
}

interface Role {
    id: number;
    name: string;
    code: string;
    createdTime: Date;
    createdBy: string;
    updatedTime: Date;
    updatedBy: string;
    deletedTime: Date;
    deletedBy: string;
    deletedFlag: number;
}

interface RoleTmp {
    name: string;
    code: string;
    createdTime: Date;
    createdBy: string;
    updatedTime: Date;
    updatedBy: string;
    deletedTime: Date;
    deletedBy: string;
    deletedFlag: number;
    pageCode: JSON[];
    actionCode: JSON[]
}

interface Action {
    id: number;
    name: string;
    actionCode: string;
}

interface Page {
    id: number;
    name: string;
    code: string;
}


export default function tableRole({ session: initialSession }: TableRole) {
    const [session, setSession] = useState<Session | null>(initialSession);
    const [roles, setRoles] = useState<Role[] | null>(null);
    const [initialRoles, setinitialRoles] = useState<Role[] | null>(null);
    const [selectAll, setSelectAll] = useState<boolean>(false);
    const [selectedCustomers, setSelectedCustomers] = useState<Role[] | null>(null);
    const [visible, setVisible] = useState<boolean>(false);
    const [isEdit, setIsEdit] = useState<boolean>(false);
    const [pages, setPages] = useState<Page[] | null>(null);
    const pageProps = pages?.map((page) => ({ name: page.name, code: page.code }));
    const [action, setAction] = useState<Action[] | null>(null);
    const actionProps = action?.map((action) => ({ name: action.name, code: action.actionCode }));
    const [selectedRoleTmp, setSelectedRoleTmp] = useState<RoleTmp>({
        name: '',
        code: '',
        createdTime: new Date(),
        createdBy: '',
        updatedTime: new Date(),
        updatedBy: '',
        deletedTime: new Date(),
        deletedBy: '',
        deletedFlag: 0,
        pageCode: [],
        actionCode: []
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
                setinitialRoles(role);
            } else {
                console.error('User token is undefined');
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const get_Action = async () => {
        try {
            if (session?.user?.token) {
                const action = await getAction(session.user.token);
                setAction(action);
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
        get_Role();
        get_Action();
        get_Page();
    }, [])

    useEffect(() => {
        setData();
    }, [selectedCustomers, isEdit])

    const setData = () => {
        if (isEdit && selectedCustomers && selectedCustomers.length === 1) {
            const role = selectedCustomers[0];
            setSelectedRoleTmp({
                code: role.code,
                name: role.name,
                createdTime: new Date(),
                createdBy: '',
                updatedTime: new Date(),
                updatedBy: '',
                deletedTime: new Date(),
                deletedBy: '',
                deletedFlag: 0,
                pageCode: [],
                actionCode: []
            });
        } else {
            setSelectedRoleTmp({
                code: '',
                name: '',
                createdTime: new Date(),
                createdBy: '',
                updatedTime: new Date(),
                updatedBy: '',
                deletedTime: new Date(),
                deletedBy: '',
                deletedFlag: 0,
                pageCode: [],
                actionCode: []
            });
        }
    };

    const handleAdd = async () => {
            try {
                if (session?.user?.token) {
                    const res = await postRole(session.user.token, selectedRoleTmp);
                    if (res) {
                        setVisible(false);
                        get_Role();
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
                    const res = await putRole(session.user.token, id, selectedRoleTmp);
                    if (res) {
                        setVisible(false);
                        get_Role();
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
    
        const handleDelete = async () => {
            const ids = selectedCustomers ? selectedCustomers.map(page => page.id) : [];
            if (ids.length > 0) {
                try {
                    if (session?.user?.token) {
                        for (const id of ids) {
                            const res = await deleteRole(session.user.token, id, selectedRoleTmp);
                            if (res) {
                                console.log('Deleted user with id:', id);
                            } else {
                                console.error('Error deleting user with id:', id, res);
                            }
                        }
                        get_Role();
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

    const onSelectionChange = (event: DataTableSelectionMultipleChangeEvent<Role[]>) => {
        const value = event.value;
        const totalRecords = pages ? pages.length : 0;

        setSelectedCustomers(value as unknown as Role[]);
        setSelectAll((value as unknown as Role[]).length === totalRecords);
    };
    const onSelectAllChange = (event: DataTableSelectAllChangeEvent) => {
        const selectAll = event.checked;

        if (selectAll && roles) {
            setSelectAll(true);
            setSelectedCustomers(roles);
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
                        <a href="/page" className="text-black hover:text-blue-700">
                            <i className="pi pi-file mr-2"></i>Page
                        </a>
                    </li>
                    <li className="menu-item p-2">
                        <a href="/role" className="text-blue-700">
                            <i className="pi pi-users mr-2"></i>Role
                        </a>
                    </li>
                </ul>
            </div>
            <div className='p-4 w-full md:w-5/6 bg-white shadow-lg rounded-lg'>
                <div className='mb-4 flex gap-2'>
                    <div className='p-4 w-full md:w-4/6'>
                        <Button onClick={() => (setVisible(true))} icon="pi pi-plus" label="Add New Role" className="p-2 p-button-raised p-button-rounded p-button-primary text-green-500 hover:text-green-700" />
                        <Dialog header={isEdit ? 'Update Role' : 'Add New Role'} visible={visible} style={{ width: '50vw' }} onHide={() => { if (!visible) return; setVisible(false); }} className="custom-dialog" closable={false}>
                            <Card className="md:w-25rem">
                                <div className="card flex flex-wrap justify-content-center gap-4 p-4">
                                    <div className="p-inputgroup">
                                        <span className="p-inputgroup-addon mx-1">
                                            <i className="pi pi-user"></i>
                                        </span>
                                        {!isEdit ? (
                                            <InputText type="text" placeholder="RoleCode" tooltip="Enter your RoleCode" value={selectedRoleTmp?.code || ''} onChange={(e) => {
                                                if (selectedRoleTmp) {
                                                    setSelectedRoleTmp({ ...selectedRoleTmp, code: e.target.value });
                                                }
                                            }} className="p-inputtext-lg" />
                                        ) : (
                                            <div className="p-inputtext-lg">{selectedCustomers ? selectedCustomers.map(role => role.code).join(', ') : ''}</div>
                                        )}
                                    </div>
                                    <div className="p-inputgroup">
                                        <span className="p-inputgroup-addon mx-1">
                                            <i className="pi pi-lock"></i>
                                        </span>
                                        <InputText type="text" placeholder="RoleName" tooltip="Enter your RoleName" value={selectedRoleTmp?.name || ''} onChange={(e) => {
                                            if (selectedRoleTmp) {
                                                setSelectedRoleTmp({ ...selectedRoleTmp, name: e.target.value });
                                            }
                                        }} className="p-inputtext-lg" />
                                    </div>
                                    <div className="card flex justify-content-center w-full">
                                        <MultiSelect value={selectedRoleTmp?.pageCode} onChange={(e: MultiSelectChangeEvent) => {
                                            if (selectedRoleTmp) {
                                                setSelectedRoleTmp({ ...selectedRoleTmp, pageCode: e.value });
                                            }
                                        }} options={pageProps} optionLabel="name"
                                            placeholder="Select Roles" maxSelectedLabels={3} className="w-full md:w-20rem p-multiselect-lg" tooltip="Choose Roles" />
                                    </div>
                                    <div className="card flex justify-content-center w-full">
                                        <MultiSelect value={selectedRoleTmp?.actionCode} onChange={(e: MultiSelectChangeEvent) => {
                                            if (selectedRoleTmp) {
                                                setSelectedRoleTmp({ ...selectedRoleTmp, actionCode: e.value });
                                            }
                                        }} options={actionProps} optionLabel="name"
                                            placeholder="Select Action" maxSelectedLabels={3} className="w-full md:w-20rem p-multiselect-lg" tooltip="Choose Action" />
                                    </div>
                                </div>
                                <div className='flex justify-content-center gap-4 p-4'>
                                    <Button className='w-full my-2 button-panel text-red-500 hover:text-red-700 p-button-lg' label="Close" onClick={() => (setIsEdit(false), setVisible(false))} />
                                    <Button className='w-full my-2 button-panel text-green-500 hover:text-green-700 p-button-lg' label="Save" onClick={() => { isEdit ? handleUpdate() : handleAdd(); setIsEdit(false); }} />
                                </div>
                            </Card>
                        </Dialog>
                        {(selectedCustomers && selectedCustomers.length > 1) && (
                            <Button onClick={() => handleDelete()} icon="pi pi-minus" label="Delete Role" className="p-2 p-button-raised p-button-rounded p-button-danger text-red-500 hover:text-red-700" />
                        )}
                        {selectedCustomers && selectedCustomers.length === 1 && (
                            <>
                                <Button onClick={() => (setIsEdit(!isEdit), setVisible(true))} icon="pi pi-refresh" label="Update Role" className="p-2 p-button-raised p-button-rounded p-button-warning text-yellow-400 hover:text-yellow-600" />
                                <Button onClick={() => handleDelete()} icon="pi pi-minus" label="Delete Role" className="p-2 p-button-raised p-button-rounded p-button-danger text-red-500 hover:text-red-700" />
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
                                const filteredUsers = initialRoles?.filter(role =>
                                    Object.values(role).some(value =>
                                        value && value.toString().toLowerCase().includes(searchValue)
                                    )
                                );
                                setRoles(filteredUsers || initialRoles);
                            }} />
                        </div>
                    </div>
                </div>
                <div>
                    <DataTable value={roles || []} paginator rows={10} selectionMode="multiple"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        rowsPerPageOptions={[10, 25, 50]} dataKey="id" totalRecords={roles ? roles.length : 0}
                        selection={selectedCustomers || []} onSelectionChange={isEdit ? undefined : onSelectionChange} selectAll={selectAll} onSelectAllChange={isEdit ? undefined : onSelectAllChange}
                        rowClassName={(rowData) => selectedCustomers?.some(user => user.id === rowData.id) ? 'bg-blue-100' : rowData.deletedFlag === 1 ? 'bg-red-50' : rowData.deletedFlag === 0 ? 'bg-green-50' : ''}>
                        <Column selectionMode="multiple" headerStyle={{ width: '3rem' }} />
                        {roles && roles.length > 0 && Object.keys(roles[0]).map((key) => (
                            <Column key={key} field={key} header={key.charAt(0).toUpperCase() + key.slice(1)} sortable filter filterPlaceholder={`Search by ${key}`} style={{ minWidth: '4rem' }} />
                        ))}
                    </DataTable>
                </div>
            </div>
        </div >
    )
}
