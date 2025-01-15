/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { formatDate } from '@/_utils/dateUtils';
import { Dropdown } from 'primereact/dropdown';
import SideBar from '@/layouts/sideBar';

export default function tableRole({ session: initialSession }: SessionProp) {
    const {
        roles,
        selectedCustomers,
        pages,
        users,
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
    const pageProps = pages?.map((page) => ({ code: page.code }));
    const actionProps = actions?.map((action) => ({ code: action.actionCode }));

    return (
        <div className="flex w-screen overflow-hidden">
            <div className="flex-none! w-1/5! bg-white"><SideBar session={initialSession} /></div>
            <div className="flex-grow! bg-white">
                <div className="p-2 flex flex-col md:flex-row gap-4 shadow-lg rounded-lg mx-2 ">
                    <div className="p-4 bg-white">
                        <div className="mb-4 flex gap-2">
                            <div className="p-4">
                                <Button onClick={() => (setVisible(true))} icon="pi pi-plus" label="Add New Role" className="p-2 p-button-raised p-button-rounded p-button-primary text-green-500 hover:text-green-700" />
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
                            <div className="p-4">
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
                            <div className="custom-width">
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
                                        selectedCustomers?.some((roles) => roles.id === rowData.id)
                                            ? 'bg-blue-100'
                                            : rowData.deletedFlag === 1
                                                ? 'bg-red-50'
                                                : rowData.deletedFlag === 0
                                                    ? 'bg-green-50'
                                                    : ''
                                    }
                                >
                                    <Column selectionMode="multiple" headerStyle={{ width: '3rem' }} />
                                    {roles &&
                                        roles.length > 0 &&
                                        Object.keys(roles[0]).map((key) => {
                                            if (key === "pageCode") {
                                                return (
                                                    <Column
                                                        key={key}
                                                        header="PageCode"
                                                        body={(rowData) => (
                                                            <div className="flex">
                                                                <Dropdown
                                                                    value={rowData.pageCode?.[0]?.code}
                                                                    options={rowData.pageCode?.map((role: any) => ({
                                                                        label: role.code,
                                                                        value: role.code
                                                                    })) || []}
                                                                    optionLabel="label"
                                                                    optionValue="value"
                                                                    placeholder="PageCode"
                                                                    className="w-full"
                                                                />
                                                            </div>
                                                        )}
                                                        style={{ minWidth: '6rem' }}
                                                    />
                                                );
                                            }

                                            if (key === 'actionCode') {
                                                return (
                                                    <Column
                                                        key={key}
                                                        header="Actions"
                                                        body={(rowData) => (
                                                            <div className="flex">
                                                                {actions &&
                                                                    actions.length > 0 &&
                                                                    actions.map((action) => (
                                                                        <div
                                                                            key={action.actionCode}
                                                                            className="mx-1 justify-center flex items-center"
                                                                        >
                                                                            {rowData.actionCode?.some(
                                                                                (ac: { code: string }) => ac.code === action.actionCode
                                                                            ) ? (
                                                                                <div className="border border-0.7 border-solid p-1 mx-1 rounded-full flex items-center justify-center" style={{ width: '16px', height: '16px' }}>
                                                                                    <i className="pi pi-check text-green-500 pi-sm" style={{ fontSize: '12px', lineHeight: '16px' }} />
                                                                                </div>
                                                                            ) : (
                                                                                <div className="border border-0.7 border-solid p-1 mx-1 rounded-full flex items-center justify-center" style={{ width: '16px', height: '16px' }}>
                                                                                    <i className="pi pi-times text-red-500 pi-sm" style={{ fontSize: '12px', lineHeight: '16px' }} />
                                                                                </div>
                                                                            )}
                                                                            {action.actionCode === 'V' && <i className="pi pi-eye text-blue-500 mx-1" />}
                                                                            {action.actionCode === 'A' && <i className="pi pi-plus text-green-500 mx-1" />}
                                                                            {action.actionCode === 'E' && <i className="pi pi-pen-to-square text-yellow-500 mx-1" />}
                                                                            {action.actionCode === 'D' && <i className="pi pi-trash text-red-500 mx-1" />}
                                                                        </div>
                                                                    ))}
                                                            </div>
                                                        )}
                                                        style={{ minWidth: '6rem' }}
                                                    />
                                                );
                                            }

                                            if (['createdTime', 'updatedTime', 'deletedTime'].includes(key)) {
                                                return (
                                                    <Column
                                                        key={key}
                                                        field={key}
                                                        header={key.charAt(0).toUpperCase() + key.slice(1)}
                                                        body={(rowData) => (
                                                            <>
                                                                {formatDate(rowData[key], 'HH:MM')}
                                                                <br />
                                                                {formatDate(rowData[key], 'dd-mm-yyyy')}
                                                            </>
                                                        )}
                                                        style={{ minWidth: '6rem', maxWidth: '15rem' }}
                                                    />
                                                );
                                            }

                                            if (['createdBy', 'updatedBy', 'deletedBy'].includes(key)) {
                                                return (
                                                    <Column
                                                        key={key}
                                                        field={key}
                                                        header={key.charAt(0).toUpperCase() + key.slice(1)}
                                                        body={(rowData) => {
                                                            const user = users?.find((u) => u.id == rowData[key]);
                                                            return (
                                                                <div className="flex items-center">
                                                                    {user ? (
                                                                        <span>{user.userName}</span>
                                                                    ) : (
                                                                        <span className="text-gray-500">Unknown</span>
                                                                    )}
                                                                </div>
                                                            );
                                                        }}
                                                        style={{ minWidth: '6rem', maxWidth: '15rem' }}
                                                    />
                                                );
                                            }

                                            return (
                                                <Column
                                                    key={key}
                                                    field={key}
                                                    header={key.charAt(0).toUpperCase() + key.slice(1)}
                                                    sortable
                                                    filter
                                                    filterPlaceholder={`Search by ${key}`}
                                                    style={{
                                                        minWidth: "8rem",
                                                        maxWidth: "15rem",
                                                        wordWrap: "break-word",
                                                        whiteSpace: "normal",
                                                    }}
                                                />
                                            );
                                        })}
                                </DataTable>
                            </div>
                        </div>
                    </div>
                </div >
            </div>
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
                                    value={selectedRoleTmp?.code ?? ''}
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
                                value={selectedRoleTmp?.name ?? ''}
                                onChange={(e) => {
                                    if (selectedRoleTmp) {
                                        setSelectedRoleTmp({ ...selectedRoleTmp, name: e.target.value, deletedBy: '', deletedTime: new Date(), updatedBy: '', updatedTime: new Date() });
                                    }
                                }}
                                className="p-inputtext p-inputtext-lg"
                            />
                        </div>

                        <div className="field w-3/6 p-2">
                            <label htmlFor="pageCode">Pages</label>
                            <MultiSelect
                                id="pageCode"
                                value={selectedRoleTmp?.pageCode ?? []}
                                onChange={(e: MultiSelectChangeEvent) => {
                                    if (selectedRoleTmp) {
                                        setSelectedRoleTmp({ ...selectedRoleTmp, pageCode: e.value, deletedBy: '', deletedTime: new Date(), updatedBy: '', updatedTime: new Date() });
                                    }
                                }}
                                options={pageProps}
                                optionLabel="code"
                                placeholder="Select Pages"
                                maxSelectedLabels={3}
                                className="w-full md:w-20rem p-multiselect-lg"
                                tooltip="Choose Pages"
                                selectedItemsLabel="Selected Page"
                            />
                        </div>

                        <div className="field w-3/6 p-2">
                            <label htmlFor="actionCode">Actions</label>
                            <MultiSelect
                                id="actionCode"
                                value={selectedRoleTmp?.actionCode ?? []}
                                onChange={(e: MultiSelectChangeEvent) => {
                                    if (selectedRoleTmp) {
                                        setSelectedRoleTmp({ ...selectedRoleTmp, actionCode: e.value, deletedBy: '', deletedTime: new Date(), updatedBy: '', updatedTime: new Date() });
                                    }
                                }}
                                options={actionProps}
                                optionLabel="code"
                                placeholder="Select Actions"
                                maxSelectedLabels={3}
                                className="w-full md:w-20rem p-multiselect-lg"
                                tooltip="Choose Actions"
                                selectedItemsLabel="Selected Actions"
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
        </div>
    )
}
