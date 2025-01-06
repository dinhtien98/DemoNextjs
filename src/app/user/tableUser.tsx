/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @next/next/no-html-link-for-pages */
/* eslint-disable react-hooks/rules-of-hooks */
'use client';
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import React from 'react'
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { MultiSelect, MultiSelectChangeEvent } from 'primereact/multiselect';
import { useUsers } from '@/hooks/useUsers';


export default function tableUser({ session: initialSession }: TableUser) {
    const {
        users,
        selectedCustomers,
        roles,
        selectedUserTmp,
        setSelectedUserTmp,
        visible,
        setVisible,
        isEdit,
        setIsEdit,
        selectAll,
        handleDelete,
        handleAdd,
        handleUpdate,
        onSelectionChange,
        onSelectAllChange,
        setSearchValue,
        searchValue,
    } = useUsers(initialSession);
    const rolesProps = roles?.map(role => ({ name: role.name, code: role.code }));

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
                        <Dialog
                            header={isEdit ? "Update User" : "Add New User"}
                            visible={visible}
                            style={{ width: "450px" }}
                            onHide={() => {
                                if (!visible) return;
                                setVisible(false);
                            }}
                            className="p-dialog-default"
                            closable={false}
                        >
                            <div className="p-dialog-content">
                                <div className="field">
                                    <label htmlFor="userName">User Name</label>
                                    {!isEdit ? (
                                        <InputText
                                            id="userName"
                                            type="text"
                                            tooltip="Enter your User Name"
                                            value={selectedUserTmp?.userName || ""}
                                            onChange={(e) =>
                                                selectedUserTmp &&
                                                setSelectedUserTmp({
                                                    ...selectedUserTmp,
                                                    userName: e.target.value,
                                                })
                                            }
                                            className="p-inputtext p-inputtext-lg"
                                        />
                                    ) : (
                                        <div className="p-inputtext-lg">
                                            {selectedCustomers
                                                ? selectedCustomers.map((user) => user.userName).join(", ")
                                                : ""}
                                        </div>
                                    )}
                                </div>

                                <div className="field">
                                    <label htmlFor="password">Password</label>
                                    <InputText
                                        id="password"
                                        type="password"
                                        tooltip="Enter your Password"
                                        value={selectedUserTmp?.password || ""}
                                        onChange={(e) =>
                                            selectedUserTmp &&
                                            setSelectedUserTmp({
                                                ...selectedUserTmp,
                                                password: e.target.value,
                                            })
                                        }
                                        className="p-inputtext p-inputtext-lg"
                                    />
                                </div>

                                <div className="field">
                                    <label htmlFor="fullName">Full Name</label>
                                    <InputText
                                        id="fullName"
                                        type="text"
                                        tooltip="Enter your Full Name"
                                        value={selectedUserTmp?.fullName || ""}
                                        onChange={(e) =>
                                            selectedUserTmp &&
                                            setSelectedUserTmp({
                                                ...selectedUserTmp,
                                                fullName: e.target.value,
                                            })
                                        }
                                        className="p-inputtext p-inputtext-lg"
                                    />
                                </div>

                                <div className="field">
                                    <label htmlFor="email">Email</label>
                                    <InputText
                                        id="email"
                                        type="text"
                                        tooltip="Enter your Email"
                                        value={selectedUserTmp?.email || ""}
                                        onChange={(e) =>
                                            selectedUserTmp &&
                                            setSelectedUserTmp({
                                                ...selectedUserTmp,
                                                email: e.target.value,
                                            })
                                        }
                                        className="p-inputtext p-inputtext-lg"
                                    />
                                </div>

                                <div className="field">
                                    <label htmlFor="avatar">Avatar</label>
                                    <InputText
                                        id="avatar"
                                        type="text"
                                        tooltip="Enter your Avatar"
                                        value={selectedUserTmp?.avatar || ""}
                                        onChange={(e) =>
                                            selectedUserTmp &&
                                            setSelectedUserTmp({
                                                ...selectedUserTmp,
                                                avatar: e.target.value,
                                            })
                                        }
                                        className="p-inputtext p-inputtext-lg"
                                    />
                                </div>

                                <div className="field">
                                    <label htmlFor="roles">Roles</label>
                                    <MultiSelect
                                        id="roles"
                                        value={selectedUserTmp?.roleCode}
                                        onChange={(e: MultiSelectChangeEvent) =>
                                            selectedUserTmp &&
                                            setSelectedUserTmp({ ...selectedUserTmp, roleCode: e.value })
                                        }
                                        options={rolesProps}
                                        optionLabel="name"
                                        placeholder="Select Roles"
                                        maxSelectedLabels={3}
                                        className="p-multiselect-lg"
                                        tooltip="Choose Roles"
                                    />
                                </div>
                            </div>

                            <div className="p-dialog-footer">
                                <Button
                                    className="p-button-text text-red-500"
                                    label="Cancel"
                                    icon="pi pi-times"
                                    onClick={() => {
                                        setIsEdit(false);
                                        setVisible(false);
                                    }}
                                />
                                <Button
                                    className="p-button-text text-green-500"
                                    label="Save"
                                    icon="pi pi-check"
                                    onClick={() => {
                                        isEdit ? handleUpdate() : handleAdd();
                                        setIsEdit(false);
                                    }}
                                />
                            </div>
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
                            <InputText
                                className="border border-0.7 border-solid"
                                placeholder="Search..."
                                value={searchValue}
                                onChange={(e) => setSearchValue(e.target.value)}
                            />
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
