import { useEffect, useState } from 'react';
import { getServerSession, Session } from 'next-auth';
import { fetchGetData, fetchPostData, fetchPutData, fetchDeleteData } from '@/services/apis';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { DataTableSelectAllChangeEvent, DataTableSelectionMultipleChangeEvent } from 'primereact/datatable';

export const useUsers = (initialSession: Session | null) => {
  const [session, setSession] = useState<Session | null>(initialSession);
  const [users, setUsers] = useState<Users[] | null>(null);
  const [initialUsers, setInitialUsers] = useState<Users[] | null>(null);
  const [selectAll, setSelectAll] = useState<boolean>(false);
  const [selectedCustomers, setSelectedCustomers] = useState<Users[] | null>(null);
  const [visible, setVisible] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [roles, setRoles] = useState<Role[] | null>(null);
  const [selectedUserTmp, setSelectedUserTmp] = useState<UserTmp>(initialStateUser);
  const [searchValue, setSearchValue] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const endpointUser = 'authUser';
  const endpointRole = 'authRole';

  const get_Session = async () => {
    const sessionData = await getServerSession(authOptions);
    setSession(sessionData);
  };

  const get_User = async () => {
    if (session?.user?.token) {
      const user = await fetchGetData(session.user.token, endpointUser);
      setUsers(user);
      setInitialUsers(user);
    }
  };

  const get_Role = async () => {
    if (session?.user?.token) {
      const role = await fetchGetData(session.user.token, endpointRole);
      setRoles(role);
    }
  };

  const handleDelete = async () => {
    const ids = selectedCustomers ? selectedCustomers.map(user => user.id) : [];
    if (ids.length > 0 && session?.user?.token) {
      for (const id of ids) {
        await fetchDeleteData(session.user.token, endpointUser, id, selectedUserTmp);
      }
      get_User();
      setSelectedCustomers([]);
      setSelectAll(false);
    }
  };

  const handleAdd = async () => {
    if (session?.user?.token) {
      if (validateFields('add')) {
        await fetchPostData(session.user.token, endpointUser, selectedUserTmp);
        setVisible(false);
        get_User();
      }
    }
  };

  const handleUpdate = async () => {
    const id = selectedCustomers ? selectedCustomers.map(user => user.id) : [];
    if (validateFields('update')) {
    if (session?.user?.token) {
      await fetchPutData(session.user.token, endpointUser, id, selectedUserTmp);
      setVisible(false);
      get_User();
    }}
  };

  const validateFields = (key: string) => {
    const newErrors: { [key: string]: string } = {};

    if (key === 'add') {
      const duplicateCode = users?.some(user => user.userName === selectedUserTmp.userName);
      if (duplicateCode) {
        newErrors.userName = "userName already exists.";
      }
      if (!selectedUserTmp.password) {
        newErrors.password = "password is required.";
      }
    }

    if (!selectedUserTmp.userName) {
      newErrors.userName = "userName is required.";
    }

    

    if (!selectedUserTmp.fullName) {
      newErrors.fullName = "fullName is required.";
    }

    if (!selectedUserTmp.email) {
      newErrors.email = "email is required.";
    }

    if (!selectedUserTmp.avatar) {
      newErrors.avatar = "avatar is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    if (!initialSession) {
      get_Session();
    }
    get_User();
    get_Role();
  }, [initialSession]);

  useEffect(() => {
    if (isEdit && selectedCustomers && selectedCustomers.length === 1) {
      const user = selectedCustomers[0];
      setSelectedUserTmp(
        {
          ...user, password: '',
          lastLogin: new Date(),
          createdTime: new Date(),
          createdBy: '',
          updatedTime: new Date(),
          updatedBy: '',
          deletedTime: new Date(),
          deletedBy: '',
          deletedFlag: 0,
        });
    } else {
      setSelectedUserTmp(initialStateUser);
    }
  }, [selectedCustomers, isEdit]);

  useEffect(() => {
    if (searchValue === '') {
      setUsers(initialUsers);
    } else {
      const filteredUsers = initialUsers?.filter(user =>
        Object.values(user).some(value =>
          value && value.toString().toLowerCase().includes(searchValue.toLowerCase())
        )
      ) || [];
      setUsers(filteredUsers);
    }
  }, [searchValue, initialUsers]);

  const onSelectionChange = (event: DataTableSelectionMultipleChangeEvent<Users[]>) => {
    setSelectedCustomers(event.value);
    setSelectAll(event.value.length === users?.length);
  };

  const onSelectAllChange = (event: DataTableSelectAllChangeEvent) => {
    setSelectAll(event.checked);
    setSelectedCustomers(event.checked ? users : []);
  };

  return {
    session,
    users,
    selectedCustomers,
    setSelectedCustomers,
    roles,
    selectedUserTmp,
    setSelectedUserTmp,
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
    errors,
  };
};

const initialStateUser: UserTmp = {
  fullName: '',
  email: '',
  avatar: '',
  userName: '',
  password: '',
  firstLogin: 0,
  inDate: '',
  outDate: '',
  failCount: 0,
  isLocked: 0,
  lastLogin: new Date(),
  createdTime: new Date(),
  createdBy: '',
  updatedTime: new Date(),
  updatedBy: '',
  deletedTime: new Date(),
  deletedBy: '',
  deletedFlag: 0,
  roleCode: []
};
