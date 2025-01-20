/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */
'use client'
import { fetchGetData } from '@/services/apis';
import { Session } from 'next-auth';
import { Button } from 'primereact/button';
import { DataView } from 'primereact/dataview';
import { Dialog } from 'primereact/dialog';
import { Tag } from 'primereact/tag';
import React, { useEffect, useState } from 'react';

export default function HomePage({ session: initialSession }: SessionProp) {
    const [session, setSession] = useState<Session>(initialSession);
    const [visible, setVisible] = useState<boolean>(false);
    const [products, setProducts] = useState<Product[]>([]);
    const [cart, setCart] = useState<{ [productId: string]: { product: Product, quantity: number } }>({});
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    const endpointProduct = 'AuthProduct';
    const get_Product = async () => {
        setLoading(true);
        setError(null);
        if (session?.user?.token) {
            try {
                const res = await fetchGetData(session.user.token, endpointProduct);
                setProducts(res);
            } catch (err) {
                setError('Failed to fetch products.');
            } finally {
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        get_Product();
    }, [session]);

    const getStockStatus = (quantity: number) => {
        if (quantity > 1000) return 'INSTOCK';
        if (quantity > 0) return 'LOWSTOCK';
        return 'OUTOFSTOCK';
    };

    const getSeverity = (status: string) => {
        switch (status) {
            case 'INSTOCK':
                return 'success';
            case 'LOWSTOCK':
                return 'warning';
            case 'OUTOFSTOCK':
                return 'danger';
            default:
                return null;
        }
    };

    const gridItem = (product: Product) => {
        const stockStatus = getStockStatus(product.stockQuantity);

        return (
            <div className="col-12 sm:col-6 lg:col-4 xl:col-3 p-2 border border-solid border-gray-300 shadow-md rounded-lg m-1 min-w-64" key={product.id}>
                <div className="p-4 border-1 surface-border surface-card border-round shadow-2">
                    <div className="flex flex-wrap align-items-center justify-between gap-2">
                        <div className="flex align-items-center gap-2">
                            <div className='align-items-center'><i className="pi pi-tag"></i></div>
                            <span className="font-semibold">{product.category}</span>
                        </div>
                        <Tag value={stockStatus} severity={getSeverity(stockStatus)}></Tag>
                    </div>
                    <div className="flex-column align-items-center gap-3 py-5" onClick={() => { setSelectedProduct(product); setVisible(true); }}>
                        <div className='flex align-items-center justify-center'>
                            <img
                                className="w-16 shadow-2 border-round"
                                src="https://www.sachbaokhang.vn/uploads/files/2023/05/01/van-1.jpg"
                                alt={product.productName}
                            />
                        </div>
                        <div className="flex align-items-center justify-center text-2xl font-bold">{product.productName}</div>
                    </div>
                    <div className="flex align-items-center justify-between">
                        <span className="text-2xl font-semibold">${product.price}</span>
                        <Button
                            icon="pi pi-shopping-cart"
                            className="p-button-rounded border border-solid border-green-600 shadow-md rounded-lg"
                            disabled={stockStatus === 'OUTOFSTOCK'}
                            onClick={() => addToCart(product)}
                        ></Button>
                    </div>
                </div>
            </div>
        );
    };

    const itemTemplate = (product: Product) => {
        if (!product) return;
        return gridItem(product);
    };

    const addToCart = (product: Product) => {
        setCart((prevCart) => {
            const newCart = { ...prevCart };
            if (newCart[product.id]) {
                newCart[product.id].quantity += 1;
            } else {
                newCart[product.id] = { product, quantity: 1 };
            }
            return newCart;
        });
    };

    const updateQuantity = (productId: string, newQuantity: number) => {
        if (newQuantity < 1) {
            setCart((prevCart) => {
                const newCart = { ...prevCart };
                delete newCart[productId];
                return newCart;
            });
        } else {
            setCart((prevCart) => {
                const newCart = { ...prevCart };
                if (newCart[productId]) {
                    newCart[productId].quantity = newQuantity;
                }
                return newCart;
            });
        }
    };

    const calculateTotal = () => {
        return Object.values(cart).reduce((total, item) => total + item.product.price * item.quantity, 0);
    };

    const footerContent = (
        <div className='flex justify-end'>
            <Button
                className="p-button-rounded border border-solid border-green-600 bg-green-100 shadow-md rounded-lg p-2"
                onClick={() => {
                    if (selectedProduct) {
                        addToCart(selectedProduct);
                        setVisible(false);
                    }
                }}
            >
                <i className='pi pi-shopping-cart mr-1'></i>Add to Cart
            </Button>
        </div>
    );

    return (
        <div className="flex gap-4">
            <div className={`card lg:w-3/4 p-4`}>
                {loading ? (
                    <div>Loading...</div>
                ) : error ? (
                    <div>{error}</div>
                ) : (
                    <DataView
                        value={products}
                        layout="grid"
                        itemTemplate={itemTemplate}
                        paginator
                        rows={9}
                    />
                )}
            </div>
            <div className={`card lg:w-1/4 p-4 border border-solid border-gray-300 bg-green-50 shadow-md rounded-lg m-1`}>
                <div className="d-flex flex-column">
                    <div>
                        <h2 className="mb-3 text-2xl font-bold"><i className='pi pi-shopping-cart mr-2 text-2xl'></i>Cart</h2>
                        {Object.entries(cart).length === 0 ? (
                            <div>Your cart is empty</div>
                        ) : (
                            Object.entries(cart).map(([productId, { product, quantity }]) => (
                                <div key={productId} className="mb-3 d-flex justify-content-between align-items-center border border-solid border-gray-300 shadow-md rounded-lg p-2">
                                    <div>
                                        <div className='text-2xl font-bold'>{product.productName}</div>
                                        <div className="text-muted">Price: ${product.price}</div>
                                    </div>
                                    <div className="d-flex align-items-center gap-2">
                                        <Button
                                            icon="pi pi-minus"
                                            onClick={() => updateQuantity(productId, quantity - 1)}
                                            disabled={quantity <= 0}
                                            className="p-button-rounded p-button-outlined"
                                        />
                                        <span>{quantity}</span>
                                        <Button
                                            icon="pi pi-plus"
                                            onClick={() => updateQuantity(productId, quantity + 1)}
                                            className="p-button-rounded p-button-outlined"
                                        />
                                    </div>
                                    <div className="ms-3">${product.price * quantity}</div>
                                </div>
                            ))
                        )}
                    </div>
                    <div>
                        <div className="mt-3 text-xl font-bold text-red-600">
                            <strong>Total: ${calculateTotal()}</strong>
                        </div>
                        <div className='flex justify-center m-2'>
                            <Button
                                label="Payment"
                                onClick={() => alert('Thanh toán')}
                                className="mt-4 p-button-success border border-solid border-gray-300 bg-green-400 shadow-md rounded-lg py-2 px-4"
                            />
                        </div>
                    </div>
                </div>
            </div>
            <Dialog header="Product Detail" visible={visible} style={{ width: '50vw' }} onHide={() => setVisible(false)} footer={footerContent}>
                {selectedProduct ? (
                    <div className="p-4 border-1 surface-border surface-card border-round shadow-2">
                        <div className="flex flex-wrap align-items-center justify-between gap-2">
                            <div className="flex align-items-center gap-2">
                                <div className='align-items-center'><i className="pi pi-tag"></i></div>
                                <span className="font-semibold">{selectedProduct.category}</span>
                            </div>
                            <Tag value={getStockStatus(selectedProduct.stockQuantity)} severity={getSeverity(getStockStatus(selectedProduct.stockQuantity))}></Tag>
                        </div>
                        <div className="flex flex-column align-items-center gap-3 py-5">
                            <div className='flex items-center justify-center'>
                                <img
                                    className="w-16 h-24 shadow-2 border-round"
                                    src="https://www.sachbaokhang.vn/uploads/files/2023/05/01/van-1.jpg"
                                    alt={selectedProduct.productName}
                                />
                            </div>
                            <div className='w-full border border-solid border-gray-300 rounded-lg p-2'>
                                <div className="text-xl font-bold text-wrap text-break">Name: {selectedProduct.productName}</div>
                                <div className="text-wrap text-break"><span className='text-xl font-bold '>Description: </span>{selectedProduct.description}</div>
                            </div>
                        </div>
                        <div className="flex align-items-center justify-between">
                            <span className="text-2xl font-semibold">${selectedProduct.price}</span>
                        </div>
                    </div>
                ) : (
                    <p>No product selected.</p>
                )}
            </Dialog>
        </div>
    );
}
