/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @next/next/no-html-link-for-pages */
/* eslint-disable react-hooks/rules-of-hooks */
'use client'
import React from 'react'
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { MultiSelect } from 'primereact/multiselect';
import { MultiSelectChangeEvent } from 'primereact/multiselect';
import { usePages } from '@/hooks/usePages';


export default function tablePage({ session: initialSession }: TablePage) {
    const {
        pages,
        selectedCustomers,
        actions,
        selectedPageTmp,
        setSelectedPageTmp,
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
    } = usePages(initialSession);
    const actionProps = actions?.map((action) => ({ code: action.actionCode }));
    console.log(selectedPageTmp)
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
            <div className='p-4 w-5/6 bg-white shadow-lg rounded-lg'>
                <div className='mb-4 flex gap-2'>
                    <div className="p-4 w-full md:w-4/6">
                        <Button onClick={() => setVisible(true)} icon="pi pi-plus" label="Add New Page" className="p-2 p-button-raised p-button-rounded p-button-primary text-green-500 hover:text-green-700" />
                        <Dialog
                            header={isEdit ? "Update Page" : "Add New Page"}
                            visible={visible}
                            style={{ width: '1024px' }}
                            onHide={() => {
                                if (!visible) return;
                                setVisible(false);
                            }}
                            className="p-dialog-default"
                            closable={false}
                        >
                            <div className="p-dialog-content">
                                <div className='flex flex-wrap'>
                                    <div className="field w-2/6 p-2">
                                        <label htmlFor="pageCode">Page Code</label>
                                        {!isEdit ? (
                                            <InputText
                                                id="pageCode"
                                                type="text"
                                                tooltip="Enter your Page Code"
                                                value={selectedPageTmp?.code || ''}
                                                onChange={(e) => {
                                                    if (selectedPageTmp) {
                                                        setSelectedPageTmp({ ...selectedPageTmp, code: e.target.value });
                                                    }
                                                }}
                                                className="p-inputtext p-inputtext-lg"
                                            />
                                        ) : (
                                            <div className="p-inputtext-lg">
                                                {selectedCustomers ? selectedCustomers.map(page => page.code).join(', ') : ''}
                                            </div>
                                        )}
                                    </div>

                                    <div className="field w-2/6 p-2">
                                        <label htmlFor="pageName">Page Name</label>
                                        <InputText
                                            id="pageName"
                                            type="text"
                                            tooltip="Enter your Page Name"
                                            value={selectedPageTmp?.name || ''}
                                            onChange={(e) => {
                                                if (selectedPageTmp) {
                                                    setSelectedPageTmp({ ...selectedPageTmp, name: e.target.value });
                                                }
                                            }}
                                            className="p-inputtext p-inputtext-lg"
                                        />
                                    </div>

                                    <div className="field w-2/6 p-2">
                                        <label htmlFor="pageParentCode">Page Parent Code</label>
                                        <InputText
                                            id="pageParentCode"
                                            type="text"
                                            tooltip="Enter your Page Parent Code"
                                            value={selectedPageTmp?.parentCode || ''}
                                            onChange={(e) => {
                                                if (selectedPageTmp) {
                                                    setSelectedPageTmp({ ...selectedPageTmp, parentCode: e.target.value });
                                                }
                                            }}
                                            className="p-inputtext p-inputtext-lg"
                                        />
                                    </div>

                                    <div className="field w-2/6 p-2">
                                        <label htmlFor="pageLevel">Page Level</label>
                                        <InputText
                                            id="pageLevel"
                                            type="number"
                                            tooltip="Enter your Page Level"
                                            value={selectedPageTmp?.level?.toString() || ''}
                                            onChange={(e) => {
                                                if (selectedPageTmp) {
                                                    setSelectedPageTmp({ ...selectedPageTmp, level: parseInt(e.target.value) });
                                                }
                                            }}
                                            className="p-inputtext p-inputtext-lg"
                                        />
                                    </div>

                                    <div className="field w-2/6 p-2">
                                        <label htmlFor="pageURL">Page URL</label>
                                        <InputText
                                            id="pageURL"
                                            type="text"
                                            tooltip="Enter your Page URL"
                                            value={selectedPageTmp?.url || ''}
                                            onChange={(e) => {
                                                if (selectedPageTmp) {
                                                    setSelectedPageTmp({ ...selectedPageTmp, url: e.target.value });
                                                }
                                            }}
                                            className="p-inputtext p-inputtext-lg"
                                        />
                                    </div>

                                    <div className="field w-2/6 p-2">
                                        <label htmlFor="pageIcon">Page Icon</label>
                                        <InputText
                                            id="pageIcon"
                                            type="text"
                                            tooltip="Enter your Page Icon"
                                            value={selectedPageTmp?.icon || ''}
                                            onChange={(e) => {
                                                if (selectedPageTmp) {
                                                    setSelectedPageTmp({ ...selectedPageTmp, icon: e.target.value });
                                                }
                                            }}
                                            className="p-inputtext p-inputtext-lg"
                                        />
                                    </div>

                                    <div className="field w-2/6 p-2">
                                        <label htmlFor="actions">Actions</label>
                                        <MultiSelect
                                            id="actions"
                                            value={selectedPageTmp?.actionCode}
                                            onChange={(e: MultiSelectChangeEvent) => {
                                                if (selectedPageTmp) {
                                                    setSelectedPageTmp({ ...selectedPageTmp, actionCode: e.value });
                                                }
                                            }}
                                            options={actionProps}
                                            optionLabel="code"
                                            placeholder="Select Actions"
                                            maxSelectedLabels={4}
                                            className="p-multiselect-lg"
                                            tooltip="Choose Actions"
                                            selectedItemsLabel="Selected Actions"
                                        />
                                    </div>
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
                            <Button icon="pi pi-minus" label="Delete Page" className="p-2 p-button-raised p-button-rounded p-button-danger text-red-500 hover:text-red-700" />
                        )}
                        {selectedCustomers && selectedCustomers.length === 1 && (
                            <>
                                <Button onClick={() => (setIsEdit(!isEdit), setVisible(true))} icon="pi pi-refresh" label="Update Page" className="p-2 p-button-raised p-button-rounded p-button-warning text-yellow-400 hover:text-yellow-600" />
                                <Button onClick={() => handleDelete()} icon="pi pi-minus" label="Delete Page" className="p-2 p-button-raised p-button-rounded p-button-danger text-red-500 hover:text-red-700" />
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
                            value={pages || []}
                            paginator
                            rows={10}
                            selectionMode="multiple"
                            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                            rowsPerPageOptions={[10, 25, 50]}
                            dataKey="id"
                            selection={selectedCustomers || []}
                            onSelectionChange={isEdit ? undefined : onSelectionChange}
                            selectAll={selectAll}
                            onSelectAllChange={isEdit ? undefined : onSelectAllChange}
                            rowClassName={(rowData) =>
                                selectedCustomers?.some((pages) => pages.id === rowData.id)
                                    ? 'bg-blue-100'
                                    : rowData.deletedFlag === 1
                                        ? 'bg-red-50'
                                        : rowData.deletedFlag === 0
                                            ? 'bg-green-50'
                                            : ''
                            }
                            style={{ width: '100%' }} // Ensure the table takes 100% of the container
                            tableStyle={{ tableLayout: 'auto' }}
                        >
                            <Column selectionMode="multiple" headerStyle={{ width: '3rem' }} />

                            {pages &&
                                pages.length > 0 &&
                                Object.keys(pages[0]).map((key) => {
                                    const allowedColumns = [
                                        'id',
                                        'code',
                                        'name',
                                        'parentCode',
                                        'level',
                                        'url',
                                        'hidden',
                                        'icon',
                                        'actionCode',
                                    ];

                                    if (!allowedColumns.includes(key)) {
                                        return null;
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
                                                                        (ac: { code: string }) =>
                                                                            ac.code === action.actionCode
                                                                    ) ? (
                                                                        <div className="border border-0.7 border-solid p-1 mx-1 rounded-lg">
                                                                            <i className="pi pi-check text-green-500" />
                                                                        </div>
                                                                    ) : (
                                                                        <div className="border border-0.7 border-solid p-1 mx-1 rounded-lg">
                                                                            <i className="pi pi-times text-red-500" />
                                                                        </div>
                                                                    )}
                                                                    {action.actionCode}
                                                                </div>
                                                            ))}
                                                    </div>
                                                )}
                                                style={{ minWidth: '6rem' }}
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
                                            style={{ minWidth: '6rem', maxWidth: '15rem' }}
                                        />
                                    );
                                })}
                        </DataTable>
                    </div>
                </div>
            </div>
        </div>
    )
}
