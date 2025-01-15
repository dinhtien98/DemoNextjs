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
  const [actions, setActions] = useState<Action[] | null>(null);
  const [selectedPageTmp, setSelectedPageTmp] = useState<PageTmp>(initialStatePage);
  const [searchValue, setSearchValue] = useState('');
  const [seletedID, setSelectedID] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [pagesPermission, setPagesPermission] = useState<Pages[] | null>(null);

  const endpointPage = 'authPage';
  const endpointAction = 'AuthAction';
  const endpointPermissionUser = 'authPermissonUser';

  const get_Session = async () => {
    const sessionData = await getServerSession(authOptions);
    setSession(sessionData);
  };

  const get_Page = async () => {
    if (session?.user?.token) {
      const pages = await fetchGetData(session.user.token, endpointPage);
      setPages(pages);
      setinitialPages(pages);
    }
  };

  const get_Page_permission_user = async () => {
    if (session?.user?.token) {
      const pages = await fetchGetData(session.user.token, endpointPermissionUser);
      setPagesPermission(pages);
    }
  };

  const get_Action = async () => {
    if (session?.user?.token) {
      const actions = await fetchGetData(session.user.token, endpointAction);
      setActions(actions);
    }
  };

  const handleDelete = async (id: string) => {
    if (session?.user?.token) {
      await fetchDeleteData(session.user.token, endpointPage, id, selectedPageTmp);
      get_Page();
      setSelectAll(false);
    }
  };

  const handleAdd = async () => {
    if (session?.user?.token) {
      if (validateFields('add')) {
        await fetchPostData(session.user.token, endpointPage, selectedPageTmp);
        setVisible(false);
        get_Page();
      }
    }
  };

  const handleUpdate = async () => {
    if (session?.user?.token) {
      if (validateFields('update')) {
        await fetchPutData(session.user.token, endpointPage, seletedID, selectedPageTmp);
        setSelectedID('');
        setVisible(false);
        get_Page();
      }
    }
  };

  const validateFields = (key: string) => {
    const newErrors: { [key: string]: string } = {};

    if (key === 'add') {
      const duplicateCode = pages?.some(page => page.code === selectedPageTmp.code);
      if (duplicateCode) {
        newErrors.code = "Page Code already exists.";
      }
      const duplicateUrl = pages?.some(page => page.url === selectedPageTmp.url);
      if (duplicateUrl) {
        newErrors.url = "Page URL already exists.";
      }
    }
    
    if (!selectedPageTmp.code) {
      newErrors.code = "Page Code is required.";
    }

    if (!selectedPageTmp.name) {
      newErrors.name = "Page Name is required.";
    }

    if (!selectedPageTmp.url) {
      newErrors.url = "Page URL is required.";
    }

    if (!selectedPageTmp.icon) {
      newErrors.icon = "Page Icon is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    if (!initialSession) {
      get_Session();
    }
    get_Page();
    get_Action();
    get_Page_permission_user();
  }, [initialSession]);

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
    initialStatePage,
    setSelectedID,
    errors,
    setErrors,
    pagesPermission
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
