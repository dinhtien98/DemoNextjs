/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @next/next/no-html-link-for-pages */
/* eslint-disable react-hooks/rules-of-hooks */
'use client';

import React from 'react';
import { Button } from 'primereact/button';
import { Tree } from 'primereact/tree';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { SpeedDial } from 'primereact/speeddial';
import { usePages } from '@/hooks/usePages';
import { MultiSelect, MultiSelectChangeEvent } from 'primereact/multiselect';

export default function treePage({ session: initialSession }: SessionProp) {
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
        handleAdd,
        handleUpdate,
        handleDelete,
    } = usePages(initialSession);

    const actionProps = actions?.map((action) => ({ code: action.actionCode }));
    const buildTreeData = (data: any[]) => {
        if (!Array.isArray(data)) {
            console.error('Invalid data: Expected an array, but got:', data);
            return [];
        }

        const map = new Map();
        const roots: any[] = [];

        data.forEach((item) => {
            map.set(item.code, {
                ...item,
                key: item.code,
                label: item.name,
                children: [],
            });
        });

        data.forEach((item) => {
            if (item.parentCode) {
                const parent = map.get(item.parentCode);
                if (parent) {
                    parent.children.push(map.get(item.code));
                }
            } else {
                roots.push(map.get(item.code));
            }
        });

        return roots;
    };

    const treeNodeTemplate = (node: any) => {
        const items = [
            { label: 'Add', icon: 'pi pi-plus', command: () => setVisible(true) },
            { label: 'Edit', icon: 'pi pi-pencil', command: () => (setVisible(true), setIsEdit(true)) },
            { label: 'Delete', icon: 'pi pi-trash', command: () => handleDelete },
        ];

        return (
            <div className="card items-center">
                <div>
                    <div className="tree-item flex w-full items-center">
                        <span className="node-label">{node.label}</span>
                        <SpeedDial
                            model={items}
                            direction="right"
                            transitionDelay={80}
                            showIcon="pi pi-ellipsis-v"
                            hideIcon="pi pi-times"
                            buttonClassName="p-button-outlined"
                            style={{ position: "relative" }}
                        />
                    </div>
                </div>
            </div>
        );
    };


    const treeData = buildTreeData(pages || []);

    return (
        <div className="p-4 m-4 flex flex-col md:flex-row gap-4">
            <div className="p-4 w-1/6 bg-white shadow-lg rounded-lg">
                <div className="font-bold">
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

            <div className="p-4 w-5/6 bg-white shadow-lg rounded-lg">
                <div className="mb-4 flex gap-2">
                    <div className="p-4 w-full md:w-4/6">
                        <Button
                            onClick={() => setVisible(true)}
                            icon="pi pi-plus"
                            label="Add New Page"
                            className="p-2 p-button-raised p-button-rounded p-button-primary text-green-500 hover:text-green-700"
                        />
                        <Dialog
                            header={isEdit ? 'Update Page' : 'Add New Page'}
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
                                <div className="flex flex-wrap">
                                    <div className="field w-2/6 p-2">
                                        <label htmlFor="pageCode">Page Code</label>
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
                    </div>
                </div>
                <div className="tree-container">
                    <Tree
                        value={treeData}
                        filter
                        filterPlaceholder="Search..."
                        className="tree-container"
                        nodeTemplate={treeNodeTemplate}
                    />
                </div>
            </div>
        </div>
    );
}
