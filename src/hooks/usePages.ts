/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from 'react';
import { getServerSession, Session } from 'next-auth';
import { fetchGetData, fetchPostData, fetchPutData, fetchDeleteData } from '@/services/apis';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { DataTableSelectAllChangeEvent, DataTableSelectionMultipleChangeEvent } from 'primereact/datatable';

export const usePages = (initialSession: Session | null) => {
  const [session, setSession] = useState<Session | null>(initialSession);
  const [pages, setPages] = useState<Pages[] | null>(null);
  const [initialPages, setinitialPages] = useState<Pages[] | null>(null);
  const [selectAll, setSelectAll] = useState<boolean>(false);
  const [selectedCustomers, setSelectedCustomers] = useState<Pages[] | null>(null);
  const [visible, setVisible] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [roles, setRoles] = useState<Role[] | null>(null);
  const [actions, setActions] = useState<Action[] | null>(null);
  const [selectedPageTmp, setSelectedPageTmp] = useState<PageTmp>(initialStatePage);
  const [searchValue, setSearchValue] = useState('');

  const endpointPage = 'authPage';
  const endpointRole = 'authRole';
  const endpointAction = 'AuthAction';

  const get_Session = async () => {
    const sessionData = await getServerSession(authOptions);
    setSession(sessionData);
  };

  const get_Page = async () => {
    if (session?.user?.token) {
      const page = await fetchGetData(session.user.token, endpointPage);
      setPages(page);
      setinitialPages(page);
    }
  };

  const get_Role = async () => {
    if (session?.user?.token) {
      const role = await fetchGetData(session.user.token, endpointRole);
      setRoles(role);
    }
  };

  const get_Action = async () => {
    if (session?.user?.token) {
      const action = await fetchGetData(session.user.token, endpointAction);
      setActions(action);
    }
  };

  const handleDelete = async () => {
    const ids = selectedCustomers ? selectedCustomers.map(pages => pages.id) : [];
    if (ids.length > 0 && session?.user?.token) {
      for (const id of ids) {
        await fetchDeleteData(session.user.token, endpointPage, id, selectedPageTmp);
      }
      get_Page();
      setSelectedCustomers([]);
      setSelectAll(false);
    }
  };

  const handleAdd = async () => {
    if (session?.user?.token) {
      await fetchPostData(session.user.token, endpointPage, selectedPageTmp);
      setVisible(false);
      get_Page();
    }
  };

  const handleUpdate = async () => {
    const id = selectedCustomers ? selectedCustomers.map(pages => pages.id) : [];
    if (session?.user?.token) {
      await fetchPutData(session.user.token, endpointPage, id, selectedPageTmp);
      setVisible(false);
      get_Page();
    }
  };

  useEffect(() => {
    if (!initialSession) {
      get_Session();
    }
    get_Page();
    get_Role();
    get_Action();
  }, [initialSession]);

  useEffect(() => {
    if (isEdit && selectedCustomers && selectedCustomers.length === 1) {
      const page = selectedCustomers[0];
      setSelectedPageTmp({ ...page, createdTime: new Date(), updatedTime: new Date(), updatedBy: '', deletedBy: '', deletedTime: new Date(),});
    } else {
      setSelectedPageTmp(initialStatePage);
    }
  }, [selectedCustomers, isEdit]);

  useEffect(() => {
    if (searchValue === '') {
      setPages(initialPages);
    } else {
      const filteredPages = initialPages?.filter(pages =>
        Object.values(pages).some(value =>
          value && value.toString().toLowerCase().includes(searchValue.toLowerCase())
        )
      ) || [];
      setPages(filteredPages);
    }
  }, [searchValue, initialPages]);

  const onSelectionChange = (event: DataTableSelectionMultipleChangeEvent<Pages[]>) => {
    setSelectedCustomers(event.value);
    setSelectAll(event.value.length === pages?.length);
  };

  const onSelectAllChange = (event: DataTableSelectAllChangeEvent) => {
    setSelectAll(event.checked);
    setSelectedCustomers(event.checked ? pages : []);
  };

  return {
    session,
    pages,
    selectedCustomers,
    setSelectedCustomers,
    actions,
    selectedPageTmp,
    setSelectedPageTmp,
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
  };
};

const initialStatePage: PageTmp = {
  code: '',
  name: '',
  parentCode: '',
  level: 0,
  url: '',
  hidden: 0,
  icon: '',
  sort: 0,
  createdTime: new Date(),
  createdBy: '',
  updatedTime: new Date(),
  updatedBy: '',
  deletedTime: new Date(),
  deletedBy: '',
  deletedFlag: 0,
  actionCode: []
};
