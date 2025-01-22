/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from 'react';
import { getServerSession, Session } from 'next-auth';
import { fetchGetData, fetchPostData, fetchPutData, fetchDeleteData } from '@/services/apis';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { DataTableSelectAllChangeEvent, DataTableSelectionMultipleChangeEvent } from 'primereact/datatable';

export const useProduct = (initialSession: Session | null) => {
    const [session, setSession] = useState<Session | null>(initialSession);
    const [product, setProduct] = useState<Product[] | null>(null);
    const [users, setUsers] = useState<Users[] | null>(null);
    const [initialProduct, setInitialProduct] = useState<Product[] | null>(null);
    const [selectAll, setSelectAll] = useState<boolean>(false);
    const [selectedCustomers, setSelectedCustomers] = useState<Product[] | null>(null);
    const [visible, setVisible] = useState<boolean>(false);
    const [isEdit, setIsEdit] = useState<boolean>(false);
    const [selectedProductTmp, setSelectedProductTmp] = useState<ProductTmp>(initialStateProduct);
    const [searchValue, setSearchValue] = useState('');

    const endpointProduct = 'AuthProduct';
    const endpointUser = 'authUser';

    const get_Session = async () => {
        const sessionData = await getServerSession(authOptions);
        setSession(sessionData);
    };

    const get_Product = async () => {
        if (session?.user?.token) {
            const res = await fetchGetData(session.user.token, endpointProduct);
            setProduct(res);
            setInitialProduct(res);
        }
    };

    const get_User = async () => {
        if (session?.user?.token) {
            const user = await fetchGetData(session.user.token, endpointUser);
            setUsers(user);
        }
    };

    const handleDelete = async () => {
        const ids = selectedCustomers ? selectedCustomers.map(product => product.id) : [];
        if (ids.length > 0 && session?.user?.token) {
            for (const id of ids) {
                await fetchDeleteData(session.user.token, endpointProduct, id, selectedProductTmp);
            }
            get_Product();
            setSelectedCustomers([]);
            setSelectAll(false);
        }
    };

    const handleAdd = async () => {
        if (session?.user?.token) {
            await fetchPostData(session.user.token, endpointProduct, selectedProductTmp);
            setVisible(false);
            get_Product();
        }
    };

    const handleUpdate = async () => {
        const id = selectedCustomers ? selectedCustomers.map(product => product.id) : [];
        if (session?.user?.token) {
            await fetchPutData(session.user.token, endpointProduct, id, selectedProductTmp);
            setVisible(false);
            get_Product();
        }
    };

    useEffect(() => {
        if (!initialSession) {
            get_Session();
        }
        get_Product();
        get_User();
    }, [initialSession]);

    useEffect(() => {
        if (isEdit && selectedCustomers && selectedCustomers.length === 1) {
            const product = selectedCustomers[0];
            setSelectedProductTmp({ ...product })
        } else {
            setSelectedProductTmp(initialStateProduct);
        }
    }, [selectedCustomers, isEdit]);

    useEffect(() => {
        if (searchValue === '') {
            setProduct(initialProduct);
        } else {
            const filteredProducts = initialProduct?.filter(product =>
                Object.values(product).some(value =>
                    value && value.toString().toLowerCase().includes(searchValue.toLowerCase())
                )
            ) || [];
            setProduct(filteredProducts);
        }
    }, [searchValue, initialProduct]);

    const onSelectionChange = (event: DataTableSelectionMultipleChangeEvent<Product[]>) => {
        setSelectedCustomers(event.value);
        setSelectAll(event.value.length === product?.length);
    };

    const onSelectAllChange = (event: DataTableSelectAllChangeEvent) => {
        setSelectAll(event.checked);
        setSelectedCustomers(event.checked ? product : []);
    };

    return {
        session,
        selectedCustomers,
        setSelectedCustomers,
        product,
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
        users,
        setSelectedProductTmp,
        selectedProductTmp
    };
};

const initialStateProduct: ProductTmp = {
    productName: '',
    description: '',
    price: 0,
    stockQuantity: 0,
    category: 0,
    supplier: '',
    discount: 0,
    createdTime: new Date(),
    createdBy: '',
    updatedTime: new Date(),
    updatedBy: '',
    deletedTime: new Date(),
    deletedBy: '',
    deletedFlag: 0,
    imageUrl: []
};

