/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */
'use client';

import { fetchGetData } from '@/services/apis';
import { Session } from 'next-auth';
import { Button } from 'primereact/button';
import { DataView } from 'primereact/dataview';
import { Dialog } from 'primereact/dialog';
import React, { useEffect, useState } from 'react';

export default function HomePage({ session: initialSession }: SessionProp) {
    const [session, setSession] = useState<Session>(initialSession);
    const [visible, setVisible] = useState<boolean>(false);
    const [products, setProducts] = useState<Product[]>([]);
    const [cart, setCart] = useState<{ [productId: string]: { product: Product; quantity: number } }>({});
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [showCart, setShowCart] = useState<boolean>(false);
    const [cartQuantity, setCartQuantity] = useState<number>(0);

    useEffect(() => {
        const getProducts = async () => {
            setLoading(true);
            setError(null);
            if (session?.user?.token) {
                try {
                    const res = await fetchGetData(session.user.token, 'AuthProduct');
                    setProducts(res);
                } catch (err) {
                    setError('Failed to fetch products.');
                } finally {
                    setLoading(false);
                }
            }
        };
        getProducts();
    }, [session]);

    const addToCart = (product: Product) => {
        setCart((prevCart) => {
            const newCart = { ...prevCart };
            if (newCart[product.id]) {
                newCart[product.id].quantity += 1;
            } else {
                newCart[product.id] = { product, quantity: 1 };
            }
            const totalQuantity = Object.values(newCart).reduce((total, item) => total + item.quantity, 0);
            setCartQuantity(totalQuantity);
            return newCart;
        });
    };

    const updateQuantity = (productId: string, newQuantity: number) => {
        setCart((prevCart) => {
            const newCart = { ...prevCart };
            if (newQuantity < 1) {
                delete newCart[productId];
            } else {
                newCart[productId].quantity = newQuantity;
            }
            const totalQuantity = Object.values(newCart).reduce((total, item) => total + item.quantity, 0);
            setCartQuantity(totalQuantity);
            return newCart;
        });
    };

    const removeFromCart = (productId: string) => {
        const updatedCart = { ...cart };
        delete updatedCart[productId]; 
        setCart(updatedCart);
      };
      

    const calculateTotal = () => {
        return Object.values(cart).reduce((total, item) => total + item.product.price * item.quantity, 0);
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const gridItem = (product: Product) => {
        return (
            <div
                className="col-12 sm:col-6 lg:col-4 xl:col-3 p-2 hover:border hover:border-solid hover:border-gray-300 hover:shadow-md rounded-lg m-1"
                key={product.id}
            >
                <div
                    className="border-1 surface-border surface-card border-round shadow-2"
                    onClick={() => {
                        setSelectedProduct(product);
                        setVisible(true);
                    }}
                >
                    <div className="relative">
                        <img
                            className="w-48 shadow-2 border-round"
                            src="https://www.sachbaokhang.vn/uploads/files/2023/05/01/van-1.jpg"
                            alt={product.productName}
                        />
                        <Button
                            icon="pi pi-shopping-cart"
                            className="p-button-rounded border border-solid shadow-md text-red-500 absolute bottom-2 right-0 bg-gray-100"
                            onClick={(e) => {
                                e.stopPropagation();
                                addToCart(product);
                            }}
                        ></Button>
                    </div>
                    <div className="text-2xl font-bold">{product.productName}</div>
                    <div>
                        {product.discount > 0 && (
                            <div className="text-base font-semibold line-through text-gray-500">
                                ${product.price.toFixed(2)}
                            </div>
                        )}
                        <div className='flex space-x-2'>
                            {product.discount > 0 && (
                                <div className="text-xl font-semibold text-red-500">
                                    -{product.discount}%
                                </div>
                            )}
                            <div className={`text-xl font-semibold ${product.discount > 0 ? 'text-red-500' : ''}`}>
                                ${product.discount > 0
                                    ? (product.price * (1 - product.discount / 100)).toFixed(2)
                                    : product.price.toFixed(2)
                                }
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        );
    };

    return (
        <div className="relative flex gap-4">
            <div className={`card p-4`}>
                {loading ? (
                    <div>Loading...</div>
                ) : error ? (
                    <div>{error}</div>
                ) : (
                    <DataView value={products} layout="grid" itemTemplate={gridItem} rows={9} />
                )}
            </div>

            {showCart && (
                <div className="card min-w-80 h-screen relative">
                    <div className="fixed py-2 top-1/2 right-4 transform -translate-y-1/2 border border-solid border-gray-300 bg-green-50 shadow-md rounded-lg min-w-80">
                        <div>
                            <Button
                                icon="pi pi-times"
                                className="p-button-rounded p-button-danger"
                                onClick={() => setShowCart(false)}
                            />
                        </div>
                        <div className="px-4">
                            <h2 className="mb-3 text-2xl font-bold">
                                <i className="pi pi-shopping-cart mr-2 text-3xl"></i>Cart
                            </h2>
                            <div className='max-h-80 overflow-auto'>
                                {Object.entries(cart).length === 0 ? (
                                    <div>Your cart is empty</div>
                                ) : (
                                    Object.entries(cart).map(([productId, { product, quantity }]) => (
                                        <div
                                            key={productId}
                                            className="mb-3 flex justify-between items-center border border-solid border-gray-300 shadow-md rounded-lg p-2 relative"
                                        >
                                            <Button
                                                icon="pi pi-times"
                                                className="absolute top-2 right-2 p-button-rounded p-button-text"
                                                onClick={() => removeFromCart(productId)}
                                            />
                                            <div className="block">
                                                <div className="text-2xl font-bold whitespace-nowrap">{product.productName}</div>
                                                <div className="flex justify-center items-center">
                                                    <div>
                                                        <div className="whitespace-nowrap">Price: ${product.price}</div>
                                                        <div className="flex justify-center items-center">
                                                            <div>Quantity: </div>
                                                            <div className="flex items-center gap-2">
                                                                <Button
                                                                    icon="pi pi-minus"
                                                                    onClick={() => updateQuantity(productId, quantity - 1)}
                                                                    className="p-button-rounded p-button-outlined"
                                                                />
                                                                <span>{quantity}</span>
                                                                <Button
                                                                    icon="pi pi-plus"
                                                                    onClick={() => updateQuantity(productId, quantity + 1)}
                                                                    className="p-button-rounded p-button-outlined"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="whitespace-nowrap">Total: ${product.price * quantity}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                            <div className="mt-3 text-xl font-bold text-red-600">
                                <strong>Total: ${calculateTotal()}</strong>
                            </div>
                            <Button
                                label="Payment"
                                onClick={() => alert("Thanh toán")}
                                className="mt-4 p-button-success border border-solid bg-green-400 text-red-500 shadow-md rounded-lg p-2"
                            />
                        </div>
                    </div>
                </div>
            )}

            <div className="h-screen fixed right-4 z-10 flex flex-col items-center justify-center space-y-2">
                {!showCart && (
                    <>
                        <div
                            className="flex flex-col items-center justify-center border border-solid bg-gray-700 text-white shadow-md rounded-lg p-3 cursor-pointer max-w-14 min-w-14"
                            onClick={() => setShowCart(!showCart)}
                        >
                            <span className="cart-icon">
                                <i className="pi pi-shopping-cart"></i>
                                {cartQuantity > 0 && (
                                    <span className="cart-quantity">{cartQuantity}</span>
                                )}
                            </span>
                            <span>Cart</span>
                        </div>
                        <div
                            className="flex flex-col items-center justify-center border border-solid bg-gray-700 text-white shadow-md rounded-lg p-3 cursor-pointer max-w-14 min-w-14"
                            onClick={() => scrollToTop()}
                        >
                            <span><i className="pi pi-arrow-up"></i></span>
                            <span className="block">On</span>
                            <span className="block">Top</span>
                        </div>
                    </>
                )}
            </div>

            <Dialog
                header="Product Detail"
                visible={visible}
                style={{ width: '50vw' }}
                onHide={() => setVisible(false)}
            >
                {selectedProduct ? (
                    <div className="p-2 border border-solid border-gray-300 rounded-lg">
                        <div className='flex space-x-2'>
                            <img
                                className="w-64 shadow-2 border-round"
                                src="https://www.sachbaokhang.vn/uploads/files/2023/05/01/van-1.jpg"
                                alt={selectedProduct.productName}
                            />
                            <div>
                                <div className="text-xl font-bold mt-3">{selectedProduct.productName}</div>
                                <div className="text-xl">Description: {selectedProduct.description}</div>
                            </div>
                        </div>
                        <div className='flex justify-between'>
                            <div>
                                {selectedProduct.discount > 0 && (
                                    <div className="text-base font-semibold line-through text-gray-500">
                                        ${selectedProduct.price.toFixed(2)}
                                    </div>
                                )}
                                <div className='flex space-x-2'>
                                    {selectedProduct.discount > 0 && (
                                        <div className="text-xl font-semibold text-red-500">
                                            -{selectedProduct.discount}%
                                        </div>
                                    )}
                                    <div className={`text-xl font-semibold ${selectedProduct.discount > 0 ? 'text-red-500' : ''}`}>
                                        ${selectedProduct.discount > 0
                                            ? (selectedProduct.price * (1 - selectedProduct.discount / 100)).toFixed(2)
                                            : selectedProduct.price.toFixed(2)
                                        }
                                    </div>
                                </div>
                            </div>
                            <div>
                                <Button
                                    label="Add to Cart"
                                    icon="pi pi-shopping-cart"
                                    className="p-button-rounded p-button-success text-red-500 border border-solid p-2 border-red-500"
                                    onClick={() => (addToCart(selectedProduct), setVisible(false))}
                                />
                            </div>
                        </div>
                    </div>
                ) : (
                    <p>No product selected.</p>
                )}
            </Dialog>
        </div>
    );
}
