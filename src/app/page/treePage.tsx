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
        initialStatePage,
        setSelectedID,
        errors,
    } = usePages(initialSession);

    const actionProps = actions?.map((action) => ({ code: action.actionCode }));
    const buildTreeData = (data: any[], level = 0) => {
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
                level,
                className: `level-${level}`,
            });
        });

        data.forEach((item) => {
            if (item.parentCode) {
                const parent = map.get(item.parentCode);
                if (parent) {
                    const childNode = map.get(item.code);
                    childNode.level = parent.level + 1;
                    childNode.className = `level-${childNode.level}`;
                    parent.children.push(childNode);
                }
            } else {
                roots.push(map.get(item.code));
            }
        });

        return roots;
    };

    const treeNodeTemplate = (node: any) => {
        const items = [
            {
                label: 'Add',
                icon: 'pi pi-plus',
                command: () => {
                    setSelectedPageTmp((prev) => ({
                        ...prev,
                        parentCode: node.code,
                        level: (node.level || 0) + 1,
                    }));
                    setIsEdit(false);
                    setVisible(true);
                },
            },
            {
                label: 'Edit',
                icon: 'pi pi-pencil',
                command: () => {
                    setSelectedID(node.id)
                    setSelectedPageTmp((prev) => ({
                        ...prev,
                        code: node.code,
                        name: node.name,
                        parentCode: node.parentCode,
                        level: node.level,
                        url: node.url,
                        hidden: node.hidden,
                        icon: node.icon,
                        sort: node.sort,
                        createdTime: new Date(),
                        createdBy: '',
                        updatedTime: new Date(),
                        updatedBy: '',
                        deletedTime: new Date(),
                        deletedBy: '',
                        deletedFlag: 0,
                        actionCode: node.actionCode
                    }));

                    setIsEdit(true);
                    setVisible(true);
                },
            },
            {
                label: 'Delete',
                icon: 'pi pi-trash',
                command: () => {
                    handleDelete(node.id);
                },
            },
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
                            style={{ position: 'relative' }}
                        />
                    </div>
                </div>
            </div>
        );
    };

    const treeData = buildTreeData(pages || []);

    return (
        <div className="w-full p-2 flex flex-col md:flex-row gap-4 shadow-lg rounded-lg mx-2">
            <div className="p-4 w-full bg-white ">
                <div className="flex gap-2">
                    <div className="p-4 w-full md:w-4/6">
                        <Button
                            onClick={() => (setVisible(true), setSelectedPageTmp(initialStatePage))}
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
                                        {isEdit ? (
                                            <InputText
                                                id="pageCode"
                                                type="text"
                                                tooltip="Enter your Page Code"
                                                value={selectedPageTmp?.code || ''}
                                                disabled
                                                className="p-inputtext p-inputtext-lg"
                                            />
                                        ) : (
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
                                        )}
                                        {errors.code && <small className="p-error">{errors.code}</small>}
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
                                        {errors.name && <small className="p-error">{errors.name}</small>}
                                    </div>

                                    <div className="field w-2/6 p-2">
                                        <label htmlFor="pageParentCode">Page Parent Code</label>
                                        <InputText
                                            id="pageParentCode"
                                            type="text"
                                            tooltip="Enter your Page Parent Code"
                                            value={selectedPageTmp?.parentCode || ''}
                                            disabled
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
                                            disabled
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
                                        {errors.url && <small className="p-error">{errors.url}</small>}
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
                                        {errors.icon && <small className="p-error">{errors.icon}</small>}
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
