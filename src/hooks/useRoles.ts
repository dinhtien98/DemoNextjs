import { useEffect, useState } from 'react';
import { getServerSession, Session } from 'next-auth';
import { fetchGetData, fetchPostData, fetchPutData, fetchDeleteData } from '@/services/apis';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { DataTableSelectAllChangeEvent, DataTableSelectionMultipleChangeEvent } from 'primereact/datatable';

export const useRoles = (initialSession: Session | null) => {
    const [session, setSession] = useState<Session | null>(initialSession);
    const [users, setUsers] = useState<Users[] | null>(null);
    const [roles, setRoles] = useState<Roles[] | null>(null);
    const [initialRoles, setInitialRoles] = useState<Roles[] | null>(null);
    const [pages, setPages] = useState<Page[] | null>(null);
    const [actions, setActions] = useState<Action[] | null>(null);
    const [selectAll, setSelectAll] = useState<boolean>(false);
    const [selectedCustomers, setSelectedCustomers] = useState<Roles[] | null>(null);
    const [visible, setVisible] = useState<boolean>(false);
    const [isEdit, setIsEdit] = useState<boolean>(false);
    const [selectedRoleTmp, setSelectedRoleTmp] = useState<RoleTmp>(initialStateRole);
    const [searchValue, setSearchValue] = useState('');

    const endpointPage = 'authPage';
    const endpointRole = 'authRole';
    const endpointAction = 'AuthAction';
    const endpointUser = 'authUser';

    const get_Session = async () => {
        const sessionData = await getServerSession(authOptions);
        setSession(sessionData);
    };

    const get_Role = async () => {
        if (session?.user?.token) {
            const role = await fetchGetData(session.user.token, endpointRole);
            setRoles(role);
            setInitialRoles(role);
        }
    };

    const get_Page = async () => {
        if (session?.user?.token) {
            const page = await fetchGetData(session.user.token, endpointPage);
            setPages(page);
        }
    };

    const get_Action = async () => {
        if (session?.user?.token) {
            const action = await fetchGetData(session.user.token, endpointAction);
            setActions(action);
        }
    };

    const get_User = async () => {
        if (session?.user?.token) {
            const user = await fetchGetData(session.user.token, endpointUser);
            setUsers(user);
        }
    };

    const handleDelete = async () => {
        const ids = selectedCustomers ? selectedCustomers.map(roles => roles.id) : [];
        if (ids.length > 0 && session?.user?.token) {
            for (const id of ids) {
                await fetchDeleteData(session.user.token, endpointRole, id, selectedRoleTmp);
            }
            get_Role();
            setSelectedCustomers([]);
            setSelectAll(false);
        }
    };

    const handleAdd = async () => {
        if (session?.user?.token) {
            await fetchPostData(session.user.token, endpointRole, selectedRoleTmp);
            setVisible(false);
            get_Role();
        }
    };

    const handleUpdate = async () => {
        const id = selectedCustomers ? selectedCustomers.map(roles => roles.id) : [];
        if (session?.user?.token) {
            await fetchPutData(session.user.token, endpointRole, id, selectedRoleTmp);
            setVisible(false);
            get_Role();
        }
    };

    useEffect(() => {
        if (!initialSession) {
            get_Session();
        }
        get_Page();
        get_Role();
        get_Action();
        get_User();
    }, [initialSession]);

    useEffect(() => {
        if (isEdit && selectedCustomers && selectedCustomers.length === 1) {
            const role = selectedCustomers[0];
            setSelectedRoleTmp({ ...role })
        } else {
            setSelectedRoleTmp(initialStateRole);
        }
    }, [selectedCustomers, isEdit]);

    useEffect(() => {
        if (searchValue === '') {
            setRoles(initialRoles);
        } else {
            const filteredRoles = initialRoles?.filter(role =>
                Object.values(role).some(value =>
                    value && value.toString().toLowerCase().includes(searchValue.toLowerCase())
                )
            ) || [];
            setRoles(filteredRoles);
        }
    }, [searchValue, initialRoles]);

    const onSelectionChange = (event: DataTableSelectionMultipleChangeEvent<Roles[]>) => {
        setSelectedCustomers(event.value);
        setSelectAll(event.value.length === roles?.length);
    };

    const onSelectAllChange = (event: DataTableSelectAllChangeEvent) => {
        setSelectAll(event.checked);
        setSelectedCustomers(event.checked ? roles : []);
    };

    return {
        session,
        roles,
        selectedCustomers,
        setSelectedCustomers,
        pages,
        actions,
        selectedRoleTmp,
        setSelectedRoleTmp,
        visible,
        setVisible,
        isEdit,
        setIsEdit,
        selectAll,
        setSelectAll,
        handleDelete,
        handleAdd,
        handleUpdate,
        onSelectionChange,
        onSelectAllChange,
        searchValue,
        setSearchValue,
        users
    };
};

const initialStateRole: RoleTmp = {
    name: '',
    code: '',
    createdTime: new Date(),
    createdBy: '',
    updatedTime: new Date(),
    updatedBy: '',
    deletedTime: new Date(),
    deletedBy: '',
    deletedFlag: 0,
    pageCode: [],
    actionCode: []
};

