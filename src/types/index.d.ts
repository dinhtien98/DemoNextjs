/* eslint-disable @typescript-eslint/no-wrapper-object-types */
interface SessionProp {
    session: Session;
}

interface Pages {
    id: string;
    code: string;
    name: string;
    parentCode: string;
    level: number;
    url: string;
    hidden: number;
    icon: string;
    sort: number;
    createdTime: Date;
    createdBy: string;
    updatedTime: Date;
    updatedBy: string;
    deletedTime: Date;
    deletedBy: string;
    deletedFlag: number;
    actionCode: JSON[]
}

interface PageTmp {
    code: string;
    name: string;
    parentCode: string;
    level: number;
    url: string;
    hidden: number;
    icon: string;
    sort: number;
    createdTime: Date;
    createdBy: string;
    updatedTime: Date;
    updatedBy: string;
    deletedTime: Date;
    deletedBy: string;
    deletedFlag: number;
    userName?: string;
    password?: string;
    fullName?: string;
    email?: string;
    avatar?: string;
    actionCode: JSON[]
}

interface Role {
    id: number;
    name: string;
    code: string;
}

interface Action {
    id: number;
    name: string;
    actionCode: string;
}

interface Roles {
    id: number;
    name: string;
    code: string;
    createdTime: Date;
    createdBy: string;
    updatedTime: Date;
    updatedBy: string;
    deletedTime: Date;
    deletedBy: string;
    deletedFlag: number;
    pageCode: JSON[];
    actionCode: JSON[]
}

interface RoleTmp {
    name: string;
    code: string;
    createdTime: Date;
    createdBy: string;
    updatedTime: Date;
    updatedBy: string;
    deletedTime: Date;
    deletedBy: string;
    deletedFlag: number;
    pageCode: JSON[];
    actionCode: JSON[]
}

interface Page {
    id: number;
    name: string;
    code: string;
}

interface Users {
    id: number;
    userName: string;
    password: string;
    fullName: string;
    email: string;
    firstLogin: number;
    inDate: string;
    outDate: string;
    failCount: number;
    isLocked: number;
    avatar: string;
    lastLogin: Date;
    createdTime: Date;
    createdBy: string;
    updatedTime: Date;
    updatedBy: string;
    deletedTime: Date;
    deletedBy: string;
    deletedFlag: number;
    roleCode: JSON[];
}

interface UserTmp {
    fullName: string;
    email: string;
    avatar: string;
    userName: string;
    password: string;
    firstLogin: number;
    inDate: string;
    outDate: string;
    failCount: number;
    isLocked: number;
    lastLogin: Date;
    createdTime: Date;
    createdBy: string;
    updatedTime: Date;
    updatedBy: string;
    deletedTime: Date;
    deletedBy: string;
    deletedFlag: number;
    roleCode: JSON[];
}

