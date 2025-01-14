/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from 'react';
import { fetchGetDataByID, fetchPutData } from '@/services/apis';
import { Session } from 'next-auth';

export function useUserData(session: Session | null) {
    const [selectedUserTmp, setSelectedUserTmp] = useState<UserTmp | null>(null);
    const endpointUser = 'authUser';

    const fetchData = async () => {
        if (session?.user?.token) {
            try {
                const user = await fetchGetDataByID(session.user.token, endpointUser, session.user.id ?? '');

                if (user && typeof user === 'object' && user.id) {
                    let parsedRoleCode = user.roleCode;
                    if (typeof user.roleCode === 'string') {
                        try {
                            parsedRoleCode = JSON.parse(user.roleCode);
                        } catch (error) {
                            console.warn('Error parsing roleCode:', error);
                        }
                    }

                    const tempUser = {
                        ...user,
                        password: '',
                        createdTime: new Date().toISOString(),
                        createdBy: '',
                        updatedTime: new Date().toISOString(),
                        updatedBy: '',
                        deletedTime: new Date().toISOString(),
                        deletedBy: '',
                        roleCode: parsedRoleCode,
                    };
                    setSelectedUserTmp(tempUser);
                } else {
                    console.warn('Unexpected user data format:', user);
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        } else {
            console.warn('No session token available.');
        }
    };

    const handleUpdate = async (_firstLogin: number) => {
        if (session?.user?.token && selectedUserTmp) {
            try {
                const updatedUserTmp = {
                    ...selectedUserTmp,
                    firstLogin: _firstLogin,
                    inDate: _firstLogin === 1 ? new Date().toISOString() : selectedUserTmp.inDate,
                    outDate: _firstLogin === 0 ? new Date().toISOString() : selectedUserTmp.outDate,
                    lastLogin: _firstLogin === 0 ? new Date().toISOString() : selectedUserTmp.lastLogin,
                };

                await fetchPutData(session.user.token, endpointUser, session.user.id ?? '', updatedUserTmp);
            } catch (error) {
                console.error('Error updating user data:', error);
            }
        } else {
            console.warn('No session token available or no user data.');
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return { selectedUserTmp, handleUpdate };
}
