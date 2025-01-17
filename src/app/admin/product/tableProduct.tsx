/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @next/next/no-html-link-for-pages */
/* eslint-disable react-hooks/rules-of-hooks */
'use client'
import React from 'react'
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { formatDate } from '@/_utils/dateUtils';
import SideBar from '@/layouts/sideBar';
import { useProduct } from '@/hooks/useProduct';

export default function tableProduct({ session: initialSession }: SessionProp) {
    const {
        product,
        selectedCustomers,
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
        users,
        selectedProductTmp,
        setSelectedProductTmp
    } = useProduct(initialSession);

    return (
        <div className="flex w-screen overflow-hidden">
            <div className="flex-none! w-1/4! bg-white"><SideBar session={initialSession} /></div>
            <div className="flex-grow! bg-white">
                <div className="p-2 flex flex-col md:flex-row gap-4 shadow-lg rounded-lg mx-2 ">
                    <div className="p-4 bg-white">
                        <div className="mb-4 flex gap-2">
                            <div className="p-4">
                                <Button onClick={() => (setVisible(true))} icon="pi pi-plus" label="Add New Product" className="p-2 p-button-raised p-button-rounded p-button-primary text-green-500 hover:text-green-700" />
                                {(selectedCustomers && selectedCustomers.length > 1) && (
                                    <Button onClick={() => handleDelete()} icon="pi pi-minus" label="Delete Product" className="p-2 p-button-raised p-button-rounded p-button-danger text-red-500 hover:text-red-700" />
                                )}
                                {selectedCustomers && selectedCustomers.length === 1 && (
                                    <>
                                        <Button onClick={() => (setIsEdit(!isEdit), setVisible(true))} icon="pi pi-refresh" label="Update Product" className="p-2 p-button-raised p-button-rounded p-button-warning text-yellow-400 hover:text-yellow-600" />
                                        <Button onClick={() => handleDelete()} icon="pi pi-minus" label="Delete Product" className="p-2 p-button-raised p-button-rounded p-button-danger text-red-500 hover:text-red-700" />
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
                                    value={product || []}
                                    paginator
                                    rows={10}
                                    selectionMode="multiple"
                                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                                    rowsPerPageOptions={[10, 25, 50]}
                                    dataKey="id"
                                    totalRecords={product ? product.length : 0}
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
                                    {product &&
                                        product.length > 0 &&
                                        Object.keys(product[0]).map((key) => {
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
                            <label htmlFor="ProductName">Product Name</label>
                            <InputText
                                id="productName"
                                type="text"
                                tooltip="Enter your ProductName"
                                value={selectedProductTmp?.productName ?? ''}
                                onChange={(e) => {
                                    if (selectedProductTmp) {
                                        setSelectedProductTmp({ ...selectedProductTmp, productName: e.target.value, deletedBy: '', deletedTime: new Date(), updatedBy: '', updatedTime: new Date() });
                                    }
                                }}
                                className="p-inputtext p-inputtext-lg"
                            />
                        </div>

                        <div className="field w-3/6 p-2">
                            <label htmlFor="description">Description</label>
                            <InputText
                                id="description"
                                type="text"
                                tooltip="Enter your description"
                                value={selectedProductTmp?.description ?? ''}
                                onChange={(e) => {
                                    if (selectedProductTmp) {
                                        setSelectedProductTmp({ ...selectedProductTmp, description: e.target.value, deletedBy: '', deletedTime: new Date(), updatedBy: '', updatedTime: new Date() });
                                    }
                                }}
                                className="p-inputtext p-inputtext-lg"
                            />
                        </div>

                        <div className="field w-3/6 p-2">
                            <label htmlFor="price">Price</label>
                            <InputText
                                id="price"
                                type="number"
                                tooltip="Enter your price"
                                value={(selectedProductTmp?.price ?? 0).toString()}
                                onChange={(e) => {
                                    if (selectedProductTmp) {
                                        setSelectedProductTmp({ ...selectedProductTmp, price: Number(e.target.value), deletedBy: '', deletedTime: new Date(), updatedBy: '', updatedTime: new Date() });
                                    }
                                }}
                                className="p-inputtext p-inputtext-lg"
                            />
                        </div>

                        <div className="field w-3/6 p-2">
                            <label htmlFor="stockQuantity">StockQuantity</label>
                            <InputText
                                id="stockQuantity"
                                type="number"
                                tooltip="Enter your stockQuantity"
                                value={(selectedProductTmp?.stockQuantity ?? 0).toString()}
                                onChange={(e) => {
                                    if (selectedProductTmp) {
                                        setSelectedProductTmp({ ...selectedProductTmp, stockQuantity: Number(e.target.value), deletedBy: '', deletedTime: new Date(), updatedBy: '', updatedTime: new Date() });
                                    }
                                }}
                                className="p-inputtext p-inputtext-lg"
                            />
                        </div>

                        <div className="field w-3/6 p-2">
                            <label htmlFor="category">Category</label>
                            <InputText
                                id="category"
                                type="number"
                                tooltip="Enter your category"
                                value={(selectedProductTmp?.category ?? 0).toString()}
                                onChange={(e) => {
                                    if (selectedProductTmp) {
                                        setSelectedProductTmp({ ...selectedProductTmp, category: Number(e.target.value), deletedBy: '', deletedTime: new Date(), updatedBy: '', updatedTime: new Date() });
                                    }
                                }}
                                className="p-inputtext p-inputtext-lg"
                            />
                        </div>

                        <div className="field w-3/6 p-2">
                            <label htmlFor="supplier">Supplier</label>
                            <InputText
                                id="supplier"
                                type="text"
                                tooltip="Enter your supplier"
                                value={selectedProductTmp?.supplier ?? 0}
                                onChange={(e) => {
                                    if (selectedProductTmp) {
                                        setSelectedProductTmp({ ...selectedProductTmp, supplier: e.target.value, deletedBy: '', deletedTime: new Date(), updatedBy: '', updatedTime: new Date() });
                                    }
                                }}
                                className="p-inputtext p-inputtext-lg"
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
