'use client';
import React, { FormEvent, useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { getCookie } from '../../components/get-Cookie';
import { Checkbox, CheckboxChangeEvent } from 'primereact/checkbox';

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

interface Role {
    name: string;
    code: string;
}

interface Action {
    name: string;
    actionCode: string;
}

export default function Page() {
    const [showAddPage, setShowAddPage] = useState(false);

    //get all roles
    const [roles, setRoles] = useState<Role[]>([]);
    const [selectedRoles, setSelectedRoles] = useState<Role[]>([]);
    const fetchRoles = async () => {
        try {
            const token = getCookie('next-auth.session-token');
            const resolvedToken = await token;
            const decodedData = resolvedToken?.value ? decodeURIComponent(resolvedToken.value) : '';
            const parsedData = JSON.parse(decodedData);
            const res = parsedData.token;
            if (!res) {
                throw new Error('No token found in cookies');
            }

            const response = await fetch('http://localhost:5004/api/authRole', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${res}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch roles');
            }

            const result = await response.json();
            setRoles(result);
        } catch (error) {
            console.error('Error fetching roles:', error);
        }
    };

    const onRoleChange = (e: CheckboxChangeEvent) => {
        let _selectedRoles = [...selectedRoles];

        if (e.checked)
            _selectedRoles.push(e.value);
        else
            _selectedRoles = _selectedRoles.filter(role => role.code !== e.value.code);

        setSelectedRoles(_selectedRoles);
    };

    //get all actions
    const [actions, setActions] = useState<Action[]>([]);
    const [selectedActions, setSelectedActions] = useState<Action[]>([]);
    const fetchAction = async () => {
        try {
            const token = getCookie('next-auth.session-token');
            const resolvedToken = await token;
            const decodedData = resolvedToken?.value ? decodeURIComponent(resolvedToken.value) : '';
            const parsedData = JSON.parse(decodedData);
            const res = parsedData.token;
            if (!res) {
                throw new Error('No token found in cookies');
            }

            const response = await fetch('http://localhost:5004/api/authAction', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${res}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch roles');
            }

            const result = await response.json();
            setActions(result);
        } catch (error) {
            console.error('Error fetching roles:', error);
        }
    };

    const onActionChange = (e: CheckboxChangeEvent) => {
        let _selectedActions = [...selectedActions];

        if (e.checked)
            _selectedActions.push(e.value);
        else
            _selectedActions = _selectedActions.filter(action => action.actionCode !== e.value.actionCode);

        setSelectedActions(_selectedActions);
    };

    //get all pages
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

    //add new page
    const [error, setError] = useState<string | null>(null)
    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        try {
            const token = getCookie('next-auth.session-token');
            const resolvedToken = await token;
            const decodedData = resolvedToken?.value ? decodeURIComponent(resolvedToken.value) : '';
            const parsedData = JSON.parse(decodedData);
            const res = parsedData.token;
            if (!res) {
                throw new Error('No token found in cookies');
            }
            const newPage = {
                code: formData.get('code') || '',
                name: formData.get('name') || '',
                parentCode: formData.get('parentCode') || '',
                level: parseInt(formData.get('level') as string, 10) || 0,
                url: formData.get('url') || '',
                hidden: formData.get('hidden') === 'true' ? 1 : 0,
                icon: formData.get('icon') || '',
                sort: parseInt(formData.get('sort') as string, 10) || 0,
                createdTime: new Date().toISOString(),
                createdBy: '',
                updatedTime: new Date().toISOString(),
                updatedBy: '',
                deletedBy: '',
                deletedFlag: 0,
                deletedTime: new Date().toISOString(),
                roleCode: selectedRoles.map(role => ({ code: role.code })),
                actionCode: selectedActions.map(action => ({ code: action.actionCode }))
            };
            const response = await fetch('http://localhost:5004/api/authPage', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${res}`,
                },
                body: JSON.stringify(newPage),
            });

            if (!response.ok) {
                throw new Error('Failed to add new page');
            }
            setError("add new page successfully");
            fetchData();
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            setError('An error occurred during adding new page');
        }
    }

    useEffect(() => {
        fetchData();
        fetchRoles();
        fetchAction();
    }, []);

    const renderColumns = () => {
        if (data.length === 0) return null;

        return [
            ...Object.keys(data[0]).map((key) => (
                <Column
                    key={key}
                    field={key}
                    header={key.charAt(0).toUpperCase() + key.slice(1)}
                    filter
                    filterPlaceholder={`Search by ${key}`}
                    style={{ minWidth: '6rem' }}
                />
            )),
            <Column
                key="actions"
                header="Actions"
                body={(rowData) => (
                    <div>
                        <button className="p-button p-component p-button-text" onClick={() => handleDelete(rowData.id)}>Delete</button>
                    </div>
                )}
                style={{ minWidth: '8rem' }}
            />
        ];
    };

    const handleDelete = async (id: string) => {
        try {
            const token = getCookie('next-auth.session-token');
            const resolvedToken = await token;
            const decodedData = resolvedToken?.value ? decodeURIComponent(resolvedToken.value) : '';
            const parsedData = JSON.parse(decodedData);
            const res = parsedData.token;
            if (!res) {
                throw new Error('No token found in cookies');
            }

            const response = await fetch(`http://localhost:5004/api/authPage?id=${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${res}`,
                },
                body: JSON.stringify({
                    code: "",
                    name: "",
                    parentCode: "",
                    level: 0,
                    url: "",
                    hidden: 0,
                    icon: "",
                    sort: 0,
                    createdTime: new Date().toISOString(),
                    createdBy: "",
                    updatedTime: new Date().toISOString(),
                    updatedBy: "",
                    deletedBy: "",
                    deletedFlag: 0,
                    deletedTime: new Date().toISOString(),
                    roleCode: [{ code: "" }],
                    actionCode: [{ code: "" }]
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to delete page');
            }

            setError("Page deleted successfully");
            fetchData();
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            setError('An error occurred during deleting the page');
        }
    };

    return (
        <>
            <div className='m-3'>
                <h1>Page</h1>
            </div>
            <div className='m-3'>
                <button
                    onClick={() => setShowAddPage(!showAddPage)}
                    className="group relative flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Add Page
                </button>
            </div>
            {showAddPage && (
                <div className='m-3 p-1'>
                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        {error && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                                {error}
                            </div>
                        )}
                        <div className="rounded-md shadow-sm -space-y-px">
                            <div>
                                <label htmlFor="code" className="sr-only">
                                    code
                                </label>
                                <input
                                    id="code"
                                    name="code"
                                    type="text"
                                    required
                                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                    placeholder="code"
                                />
                            </div>
                            <div>
                                <label htmlFor="name" className="sr-only">
                                    name
                                </label>
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    required
                                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                    placeholder="name"
                                />
                            </div>
                            <div>
                                <label htmlFor="parentCode" className="sr-only">
                                    parentCode
                                </label>
                                <input
                                    id="parentCode"
                                    name="parentCode"
                                    type="text"
                                    required
                                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                    placeholder="parentCode"
                                />
                            </div>
                            <div>
                                <label htmlFor="level" className="sr-only">
                                    level
                                </label>
                                <input
                                    id="level"
                                    name="level"
                                    type="text"
                                    required
                                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                    placeholder="level"
                                />
                            </div>
                            <div>
                                <label htmlFor="url" className="sr-only">
                                    url
                                </label>
                                <input
                                    id="url"
                                    name="url"
                                    type="text"
                                    required
                                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                    placeholder="url"
                                />
                            </div>
                            <div>
                                <label htmlFor="hidden" className="sr-only">
                                    hidden
                                </label>
                                <input
                                    id="hidden"
                                    name="hidden"
                                    type="text"
                                    required
                                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                    placeholder="hidden"
                                />
                            </div>
                            <div>
                                <label htmlFor="icon" className="sr-only">
                                    icon
                                </label>
                                <input
                                    id="icon"
                                    name="icon"
                                    type="text"
                                    required
                                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                    placeholder="icon"
                                />
                            </div>
                            <div>
                                <label htmlFor="sort" className="sr-only">
                                    sort
                                </label>
                                <input
                                    id="sort"
                                    name="sort"
                                    type="text"
                                    required
                                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                    placeholder="sort"
                                />
                            </div>
                            <div className="flex flex-column gap-3 my-2 p-1">
                                <label>Choose roles:</label>
                                {roles.map((role) => {
                                    return (
                                        <div key={role.code} className="card flex justify-content-center">
                                            <Checkbox inputId={role.code} name="role" value={role} onChange={onRoleChange} checked={selectedRoles.some((item) => item.code === role.code)} />
                                            <label htmlFor={role.code} className="ml-2">
                                                {role.name}
                                            </label>
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="flex flex-column gap-3 my-2 p-1">
                                <label>Choose action:</label>
                                {actions.map((action) => {
                                    return (
                                        <div key={action.actionCode} className="card flex justify-content-center">
                                            <Checkbox inputId={action.actionCode} name="action" value={action} onChange={onActionChange} checked={selectedActions.some((item) => item.actionCode === action.actionCode)} />
                                            <label htmlFor={action.actionCode} className="ml-2">
                                                {action.name}
                                            </label>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                add page
                            </button>
                        </div>
                    </form>
                </div>
            )}
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
        </>
    );
}
