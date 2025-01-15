/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { formatDate } from '@/_utils/dateUtils';
import { Dropdown } from 'primereact/dropdown';
import SideBar from '@/layouts/sideBar';


export default function tableUser({ session: initialSession }: SessionProp) {
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
        errors,
    } = useUsers(initialSession);
    const rolesProps = roles?.map(role => ({ name: role.name, code: role.code }));

    return (
        <div className="flex w-screen overflow-hidden">
            <div className="flex-none! w-1/5! bg-white"><SideBar session={initialSession} /></div>
            <div className="flex-grow! bg-white">
                <div className="p-2 flex flex-col md:flex-row gap-4 shadow-lg rounded-lg mx-2 ">
                    <div className="p-4 bg-white">
                        <div className="mb-4 flex gap-2">
                            <div className="p-4">
                                <Button
                                    onClick={() => setVisible(true)}
                                    icon="pi pi-plus"
                                    label="Add New User"
                                    className="p-2 p-button-raised p-button-rounded p-button-primary text-green-500 hover:text-green-700"
                                />

                                {(selectedCustomers && selectedCustomers.length > 1) && (
                                    <Button
                                        onClick={() => handleDelete()}
                                        icon="pi pi-minus"
                                        label="Delete User"
                                        className="p-2 p-button-raised p-button-rounded p-button-danger text-red-500 hover:text-red-700"
                                    />
                                )}
                                {selectedCustomers && selectedCustomers.length === 1 && (
                                    <>
                                        <Button
                                            onClick={() => (setIsEdit(!isEdit), setVisible(true))}
                                            icon="pi pi-refresh"
                                            label="Update User"
                                            className="p-2 p-button-raised p-button-rounded p-button-warning text-yellow-400 hover:text-yellow-600"
                                        />
                                        <Button
                                            onClick={() => handleDelete()}
                                            icon="pi pi-minus"
                                            label="Delete User"
                                            className="p-2 p-button-raised p-button-rounded p-button-danger text-red-500 hover:text-red-700"
                                        />
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
                        <div className='custom-width'>
                            <DataTable
                                value={users || []}
                                paginator
                                rows={10}
                                selectionMode="multiple"
                                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                                rowsPerPageOptions={[10, 25, 50]}
                                dataKey="id"
                                totalRecords={users ? users.length : 0}
                                selection={selectedCustomers || []}
                                onSelectionChange={isEdit ? undefined : onSelectionChange}
                                selectAll={selectAll}
                                onSelectAllChange={isEdit ? undefined : onSelectAllChange}
                                rowClassName={(rowData) =>
                                    selectedCustomers?.some((user) => user.id === rowData.id)
                                        ? "bg-blue-100"
                                        : rowData.deletedFlag === 1
                                            ? "bg-red-50"
                                            : rowData.deletedFlag === 0
                                                ? "bg-green-50"
                                                : ""
                                }
                            >
                                <Column selectionMode="multiple" headerStyle={{ width: "3rem" }} />
                                {users &&
                                    users.length > 0 &&
                                    Object.keys(users[0]).map((key, index) => {
                                        if (key === "password") return null;
                                        if (key === "roleCode") {
                                            return (
                                                <Column
                                                    key={`roleCode-${index}`}
                                                    header="RoleCode"
                                                    body={(rowData) => (
                                                        <div className="flex">
                                                            <Dropdown
                                                                value={rowData.roleCode?.[0]?.code}
                                                                options={
                                                                    rowData.roleCode?.map((role: any) => ({
                                                                        label: role.code,
                                                                        value: role.code,
                                                                    })) || []
                                                                }
                                                                optionLabel="label"
                                                                optionValue="value"
                                                                placeholder="RoleCode"
                                                                className="w-full"
                                                            />
                                                        </div>
                                                    )}
                                                    style={{ minWidth: "6rem" }}
                                                />
                                            );
                                        }

                                        if (
                                            [
                                                "createdTime",
                                                "updatedTime",
                                                "deletedTime",
                                                "inDate",
                                                "outDate",
                                                "lastLogin",
                                            ].includes(key)
                                        ) {
                                            return (
                                                <Column
                                                    key={key}
                                                    field={key}
                                                    header={key.charAt(0).toUpperCase() + key.slice(1)}
                                                    body={(rowData) => (
                                                        <>
                                                            {formatDate(rowData[key], "HH:MM")}
                                                            <br />
                                                            {formatDate(rowData[key], "dd-mm-yyyy")}
                                                        </>
                                                    )}
                                                    style={{ minWidth: "8rem", maxWidth: "15rem" }}
                                                />
                                            );
                                        }
                                        if (["createdBy", "updatedBy", "deletedBy"].includes(key)) {
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
                                                    style={{ minWidth: "6rem", maxWidth: "15rem" }}
                                                />
                                            );
                                        }

                                        return (
                                            <Column
                                                key={`column-${key}-${index}`}
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
                    <Dialog
                        header={isEdit ? "Update User" : "Add New User"}
                        visible={visible}
                        style={{ width: "1024px" }}
                        onHide={() => {
                            if (!visible) return;
                            setVisible(false);
                        }}
                        className="p-dialog-default"
                        closable={false}
                    >
                        <div className="p-dialog-content">
                            <div className="flex flex-wrap">
                                <div className="field w-2/6 p-2">
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
                                    {errors.userName && <small className="p-error">{errors.userName}</small>}
                                </div>

                                <div className="field w-2/6 p-2">
                                    <label htmlFor="password">Password</label>
                                    {!isEdit ? (
                                        <InputText
                                            id="password"
                                            type="password"
                                            tooltip="Enter your password"
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
                                    ) : (
                                        <></>
                                    )}
                                    {errors.password && <small className="p-error">{errors.password}</small>}
                                </div>

                                <div className="field w-2/6 p-2">
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
                                                inDate: "",
                                                outDate: "",
                                            })
                                        }
                                        className="p-inputtext p-inputtext-lg"
                                    />
                                    {errors.fullName && <small className="p-error">{errors.fullName}</small>}
                                </div>

                                <div className="field w-2/6 p-2">
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
                                                inDate: "",
                                                outDate: "",
                                            })
                                        }
                                        className="p-inputtext p-inputtext-lg"
                                    />
                                    {errors.email && <small className="p-error">{errors.email}</small>}
                                </div>

                                <div className="field w-2/6 p-2">
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
                                                inDate: "",
                                                outDate: "",
                                            })
                                        }
                                        className="p-inputtext p-inputtext-lg"
                                    />
                                    {errors.avatar && <small className="p-error">{errors.avatar}</small>}
                                </div>

                                <div className="field w-2/6 p-2">
                                    <label htmlFor="roles">Roles</label>
                                    <MultiSelect
                                        id="roles"
                                        value={selectedUserTmp?.roleCode}
                                        onChange={(e: MultiSelectChangeEvent) =>
                                            selectedUserTmp &&
                                            setSelectedUserTmp({
                                                ...selectedUserTmp,
                                                roleCode: e.value,
                                                inDate: "",
                                                outDate: "",
                                            })
                                        }
                                        options={rolesProps}
                                        optionLabel="code"
                                        placeholder="Select Roles"
                                        maxSelectedLabels={3}
                                        className="p-multiselect-lg"
                                        tooltip="Choose Roles"
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
                </div>
            </div>
        </div>
    )
}
