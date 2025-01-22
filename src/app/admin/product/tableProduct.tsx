/* eslint-disable prefer-const */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @next/next/no-html-link-for-pages */
/* eslint-disable react-hooks/rules-of-hooks */
'use client'
import React, { useRef } from 'react'
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { formatDate } from '@/_utils/dateUtils';
import SideBar from '@/layouts/sideBar';
import { useProduct } from '@/hooks/useProduct';
import { OverlayPanel } from 'primereact/overlaypanel';
import { FileUpload } from 'primereact/fileupload';

export default function tableProduct({ session: initialSession }: SessionProp) {
    const op = useRef<OverlayPanel>(null);
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

                                            if (['imageUrl'].includes(key)) {
                                                return (
                                                    <Column
                                                        key={key}
                                                        field={key}
                                                        header={key.charAt(0).toUpperCase() + key.slice(1)}
                                                        body={(rowData) => (
                                                            <>
                                                                <Button className='text-white bg-blue-400 p-2 rounded-lg' type="button" icon="pi pi-image" label="Image" onClick={(e) => op.current && op.current.toggle(e)} />
                                                                <OverlayPanel ref={op} id={`overlay-panel-${rowData.id}`}>
                                                                    <div style={{ display: 'flex', overflowX: 'scroll', gap: '10px' }}>
                                                                        {rowData.imageUrl?.map((image: any, index: any) => (
                                                                            <img
                                                                                key={image.code}
                                                                                src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${image.code}`}
                                                                                alt={`Image ${index}`}
                                                                                style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                                                                            />
                                                                        ))}
                                                                    </div>
                                                                </OverlayPanel>
                                                            </>
                                                        )}
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
            <Dialog header={isEdit ? 'Update Product' : 'Add New Product'} visible={visible} style={{ width: '1024px' }} onHide={() => { if (!visible) return; setVisible(false); }} className="p-dialog-default" closable={false}>
                <div className="p-dialog-content">
                    <div className='flex flex-wrap items-start'>
                        <div className='flex w-1/2 flex-wrap'>
                            <div className="field w-1/2 p-2">
                                <label htmlFor="ProductName">Product Name</label>
                                <InputText
                                    id="productName"
                                    type="text"
                                    value={selectedProductTmp?.productName ?? ''}
                                    onChange={(e) => {
                                        if (selectedProductTmp) {
                                            setSelectedProductTmp({ ...selectedProductTmp, productName: e.target.value, deletedBy: '', deletedTime: new Date(), updatedBy: '', updatedTime: new Date() });
                                        }
                                    }}
                                    className="p-inputtext p-inputtext-lg"
                                />
                            </div>

                            <div className="field w-1/2 p-2">
                                <label htmlFor="description">Description</label>
                                <InputText
                                    id="description"
                                    type="text"
                                    value={selectedProductTmp?.description ?? ''}
                                    onChange={(e) => {
                                        if (selectedProductTmp) {
                                            setSelectedProductTmp({ ...selectedProductTmp, description: e.target.value, deletedBy: '', deletedTime: new Date(), updatedBy: '', updatedTime: new Date() });
                                        }
                                    }}
                                    className="p-inputtext p-inputtext-lg"
                                />
                            </div>

                            <div className="field w-1/2 p-2">
                                <label htmlFor="price">Price</label>
                                <InputText
                                    id="price"
                                    type="number"
                                    value={(selectedProductTmp?.price ?? 0).toString()}
                                    onChange={(e) => {
                                        if (selectedProductTmp) {
                                            setSelectedProductTmp({ ...selectedProductTmp, price: Number(e.target.value), deletedBy: '', deletedTime: new Date(), updatedBy: '', updatedTime: new Date() });
                                        }
                                    }}
                                    className="p-inputtext p-inputtext-lg"
                                />
                            </div>

                            <div className="field w-1/2 p-2">
                                <label htmlFor="stockQuantity">StockQuantity</label>
                                <InputText
                                    id="stockQuantity"
                                    type="number"
                                    value={(selectedProductTmp?.stockQuantity ?? 0).toString()}
                                    onChange={(e) => {
                                        if (selectedProductTmp) {
                                            setSelectedProductTmp({ ...selectedProductTmp, stockQuantity: Number(e.target.value), deletedBy: '', deletedTime: new Date(), updatedBy: '', updatedTime: new Date() });
                                        }
                                    }}
                                    className="p-inputtext p-inputtext-lg"
                                />
                            </div>

                            <div className="field w-1/2 p-2">
                                <label htmlFor="category">Category</label>
                                <InputText
                                    id="category"
                                    type="number"
                                    value={(selectedProductTmp?.category ?? 0).toString()}
                                    onChange={(e) => {
                                        if (selectedProductTmp) {
                                            setSelectedProductTmp({ ...selectedProductTmp, category: Number(e.target.value), deletedBy: '', deletedTime: new Date(), updatedBy: '', updatedTime: new Date() });
                                        }
                                    }}
                                    className="p-inputtext p-inputtext-lg"
                                />
                            </div>

                            <div className="field w-1/2 p-2">
                                <label htmlFor="supplier">Supplier</label>
                                <InputText
                                    id="supplier"
                                    type="text"
                                    value={selectedProductTmp?.supplier ?? 0}
                                    onChange={(e) => {
                                        if (selectedProductTmp) {
                                            setSelectedProductTmp({ ...selectedProductTmp, supplier: e.target.value, deletedBy: '', deletedTime: new Date(), updatedBy: '', updatedTime: new Date() });
                                        }
                                    }}
                                    className="p-inputtext p-inputtext-lg"
                                />
                            </div>

                            <div className="field w-1/2 p-2">
                                <label htmlFor="discount">Discount</label>
                                <InputText
                                    id="discount"
                                    type="number"
                                    value={(selectedProductTmp?.discount ?? 0).toString()}
                                    onChange={(e) => {
                                        if (selectedProductTmp) {
                                            setSelectedProductTmp({ ...selectedProductTmp, discount: Number(e.target.value), deletedBy: '', deletedTime: new Date(), updatedBy: '', updatedTime: new Date() });
                                        }
                                    }}
                                    className="p-inputtext p-inputtext-lg"
                                />
                            </div>
                        </div>
                        <div className='flex w-1/2 flex-wrap'>
                            <div className="field w-full p-2">
                                <label htmlFor="image">Image</label>
                                <FileUpload
                                    name="image"
                                    url={'http://localhost:5004/api/UploadImage/images'}
                                    multiple
                                    accept="image/*"
                                    mode="advanced"
                                    auto
                                    customUpload
                                    uploadHandler={async (event) => {
                                        try {
                                            const formData = new FormData();
                                            for (let file of event.files) {
                                                formData.append('images', file);
                                            }
                                            const response = await fetch('http://localhost:5004/api/UploadImage/images', {
                                                method: 'POST',
                                                body: formData,
                                                headers: {
                                                    'Authorization': `Bearer ${initialSession.user?.token}`,
                                                },
                                            });
                                            if (!response.ok) {
                                                throw new Error('Failed to upload images');
                                            }
                                            const data = await response.json();
                                            if (selectedProductTmp) {
                                                setSelectedProductTmp({
                                                    ...selectedProductTmp,
                                                    imageUrl: data.uploadedUrls,
                                                    deletedBy: '',
                                                    deletedTime: new Date(),
                                                    updatedBy: '',
                                                    updatedTime: new Date(),
                                                });
                                            }
                                        } catch (error) {
                                            if (error instanceof Error) {
                                                console.error('Upload failed:', error.message);
                                            } else {
                                                console.error('Upload failed:', error);
                                            }
                                        }
                                    }}
                                    emptyTemplate={<p className="m-0">Drag and drop image to here to upload.</p>}
                                />
                            </div>
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
