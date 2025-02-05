/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from 'react';
import { getServerSession, Session } from 'next-auth';
import { fetchGetData, fetchPostData, fetchPutData, fetchDeleteData, fetchPostImageData } from '@/services/apis';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { DataTableSelectAllChangeEvent, DataTableSelectionMultipleChangeEvent } from 'primereact/datatable';
import { confirmDialog } from 'primereact/confirmdialog';
import { on } from 'events';

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
    const [selectedImages, setSelectedImages] = useState<File[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const [imageToDelete, setImageToDelete] = useState<any | null>(null);

    const endpointProduct = 'AuthProduct';
    const endpointUser = 'authUser';
    const endpointUploadImage = 'UploadImage/images';
    const endpointDeleteImage = 'UploadImage/delete-image';

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

    const handleDeleteImage = async () => {
        if (!imageToDelete) {
            console.error('imageToDelete is null or undefined');
            return;
        }

        if (session?.user?.token) {
            await fetchPostData(session.user.token, endpointDeleteImage, imageToDelete.code);
        }
        setImageToDelete(null);
    };

    const showDeleteConfirm = () => {
        confirmDialog({
            message: "Bạn có chắc chắn muốn xóa hình ảnh này?",
            header: "Xác nhận xóa",
            icon: "pi pi-exclamation-triangle",
            defaultFocus: 'accept',
            accept: () => handleDeleteImage(),
            reject: () => setImageToDelete(null),
        });
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

    useEffect(() => {
        if (!imageToDelete) {
            return;
        }
        showDeleteConfirm();
    }, [imageToDelete]);

    const handleSave = async () => {
        try {
            setIsUploading(false);
            let newUploadedUrls = [];

            if (selectedImages.length > 0) {
                const formData = new FormData();
                selectedImages.forEach(file => formData.append("images", file));
                if (session?.user?.token) {
                    const response = await fetchPostImageData(session.user.token, endpointUploadImage, formData);
                    const data = await response.json();
                    newUploadedUrls = data.uploadedUrls;
                }
            }

            setSelectedProductTmp((prev) => ({
                ...prev,
                imageUrl: [
                    ...(prev.imageUrl || []).filter((img: any, index) => img?.code !== null || index !== 0),
                    ...newUploadedUrls
                ],
                deletedBy: '', deletedTime: new Date(), updatedBy: '', updatedTime: new Date()
            }));
            setSelectedImages([]);
            setVisible(false);
        } catch (error) {
            console.error("Error while saving product:", error);
        } finally {
            setIsUploading(false);
        }

        setIsUploading(true);
    };

    useEffect(() => {
        if(!visible){
            selectedCustomers && setSelectedCustomers([]);
        }
        
    }, [visible]);

    useEffect(() => {
        if (isUploading) {
            if (isEdit) {
                handleUpdate();
            } else {
                handleAdd();
            }
            setIsEdit(false);
        }
    }, [isUploading]);

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
        selectedProductTmp,
        handleDeleteImage,
        showDeleteConfirm,
        setSelectedImages,
        selectedImages,
        setImageToDelete,
        imageToDelete,
        handleSave,
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

