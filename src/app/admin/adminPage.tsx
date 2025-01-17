'use client'
import React, { useEffect } from 'react';
import { useUserData } from '@/hooks/useUserData';
import { loginService } from '@/services/loginService';
import SideBar from '@/layouts/sideBar';

export default function AdminPage({ session : initialSession }: SessionProp) {
    const { selectedUserTmp, handleUpdate } = useUserData(initialSession);

    useEffect(() => {
        const loginSubscription = loginService.onLogin().subscribe({
            next: ({ param }) => {
                console.log('Login event received with param:', param);
                if (selectedUserTmp && handleUpdate) {
                    handleUpdate(param);
                    console.log('User data updated for first login');
                }
            },
            error: (err) => {
                console.error('Error in login subscription:', err);
            },
        });

        return () => {
            loginSubscription.unsubscribe();
        };
    }, [selectedUserTmp, handleUpdate]);

    return (
        <div className="flex w-screen overflow-hidden">
            <div className="flex-none! w-1/5! bg-white"><SideBar session={initialSession} /></div>
            <div className="flex-grow! bg-white">
                <div>dashboard</div>
            </div>
        </div>
    );
}
