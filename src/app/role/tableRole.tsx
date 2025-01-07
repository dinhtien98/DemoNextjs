/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @next/next/no-html-link-for-pages */
/* eslint-disable react-hooks/rules-of-hooks */
'use client'
import React from 'react'
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { MultiSelect, MultiSelectChangeEvent } from 'primereact/multiselect';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useRoles } from '@/hooks/useRoles';

export default function tableRole({ session: initialSession }: TableRole) {
    const {
        roles,
        selectedCustomers,
        pages,
        actions,
        selectedRoleTmp,
        setSelectedRoleTmp,
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
    } = useRoles(initialSession);
    const pageProps = pages?.map((page) => ({ name: page.name, code: page.code }));
    const actionProps = actions?.map((action) => ({ name: action.name, code: action.actionCode }));

    return (
        <div className='p-4 m-4 flex flex-col md:flex-row gap-4'>
            <div className='p-4 w-1/6 bg-white shadow-lg rounded-lg'>
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
            <div className='p-4 w-5/6 bg-white shadow-lg rounded-lg'>
                <div className='mb-4 flex gap-2'>
                    <div className='p-4 w-full md:w-4/6'>
                        <Button onClick={() => (setVisible(true))} icon="pi pi-plus" label="Add New Role" className="p-2 p-button-raised p-button-rounded p-button-primary text-green-500 hover:text-green-700" />
                        <Dialog header={isEdit ? 'Update Role' : 'Add New Role'} visible={visible} style={{ width: '1024px' }} onHide={() => { if (!visible) return; setVisible(false); }} className="p-dialog-default" closable={false}>
                            <div className="p-dialog-content">
                                <div className='flex flex-wrap'>
                                    <div className="field w-3/6 p-2">
                                        <label htmlFor="roleCode">Role Code</label>
                                        {!isEdit ? (
                                            <InputText
                                                id="roleCode"
                                                type="text"
                                                tooltip="Enter your RoleCode"
                                                value={selectedRoleTmp?.code || ''}
                                                onChange={(e) => {
                                                    if (selectedRoleTmp) {
                                                        setSelectedRoleTmp({ ...selectedRoleTmp, code: e.target.value });
                                                    }
                                                }}
                                                className="p-inputtext p-inputtext-lg"
                                            />
                                        ) : (
                                            <div className="p-inputtext-lg">{selectedCustomers ? selectedCustomers.map(role => role.code).join(', ') : ''}</div>
                                        )}
                                    </div>

                                    <div className="field w-3/6 p-2">
                                        <label htmlFor="roleName">Role Name</label>
                                        <InputText
                                            id="roleName"
                                            type="text"
                                            tooltip="Enter your Role Name"
                                            value={selectedRoleTmp?.name || ''}
                                            onChange={(e) => {
                                                if (selectedRoleTmp) {
                                                    setSelectedRoleTmp({ ...selectedRoleTmp, name: e.target.value });
                                                }
                                            }}
                                            className="p-inputtext p-inputtext-lg"
                                        />
                                    </div>

                                    <div className="field w-3/6 p-2">
                                        <label htmlFor="pageCode">Pages</label>
                                        <MultiSelect
                                            id="pageCode"
                                            value={selectedRoleTmp?.pageCode}
                                            onChange={(e: MultiSelectChangeEvent) => {
                                                if (selectedRoleTmp) {
                                                    setSelectedRoleTmp({ ...selectedRoleTmp, pageCode: e.value });
                                                }
                                            }}
                                            options={pageProps}
                                            optionLabel="name"
                                            placeholder="Select Pages"
                                            maxSelectedLabels={3}
                                            className="w-full md:w-20rem p-multiselect-lg"
                                            tooltip="Choose Pages"
                                        />
                                    </div>

                                    <div className="field w-3/6 p-2">
                                        <label htmlFor="actionCode">Actions</label>
                                        <MultiSelect
                                            id="actionCode"
                                            value={selectedRoleTmp?.actionCode}
                                            onChange={(e: MultiSelectChangeEvent) => {
                                                if (selectedRoleTmp) {
                                                    setSelectedRoleTmp({ ...selectedRoleTmp, actionCode: e.value });
                                                }
                                            }}
                                            options={actionProps}
                                            optionLabel="name"
                                            placeholder="Select Actions"
                                            maxSelectedLabels={3}
                                            className="w-full md:w-20rem p-multiselect-lg"
                                            tooltip="Choose Actions"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="p-dialog-footer">
                                <Button
                                    className="p-button-text text-red-500"
                                    label="Close"
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
                    <div className="w-full overflow-x-auto">
                        <DataTable
                            value={roles || []}
                            paginator
                            rows={10}
                            selectionMode="multiple"
                            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                            rowsPerPageOptions={[10, 25, 50]}
                            dataKey="id"
                            totalRecords={roles ? roles.length : 0}
                            selection={selectedCustomers || []}
                            onSelectionChange={isEdit ? undefined : onSelectionChange}
                            selectAll={selectAll}
                            onSelectAllChange={isEdit ? undefined : onSelectAllChange}
                            rowClassName={(rowData) =>
                                selectedCustomers?.some((user) => user.id === rowData.id)
                                    ? 'bg-blue-100'
                                    : rowData.deletedFlag === 1
                                        ? 'bg-red-50'
                                        : rowData.deletedFlag === 0
                                            ? 'bg-green-50'
                                            : ''
                            }
                            style={{ width: '100%' }}
                            tableStyle={{ tableLayout: 'auto' }}
                        >
                            <Column selectionMode="multiple" headerStyle={{ width: '3rem' }} />
                            {roles &&
                                roles.length > 0 &&
                                Object.keys(roles[0]).map((key) => (
                                    <Column
                                        key={key}
                                        field={key}
                                        header={key.charAt(0).toUpperCase() + key.slice(1)}
                                        sortable
                                        filter
                                        filterPlaceholder={`Search by ${key}`}
                                        style={{
                                            minWidth: '6rem',
                                            maxWidth: '12rem',
                                            whiteSpace: 'nowrap',
                                        }}
                                    />
                                ))}
                        </DataTable>
                    </div>
                </div>
            </div>
        </div >
    )
}
