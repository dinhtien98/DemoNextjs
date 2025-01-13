import { useState, useEffect } from 'react';
import { fetchGetDataByID, fetchPutData } from '@/services/apis';
import { Session } from 'next-auth';

export function useUserData(session: Session | null, login: string) {
    const [selectedUserTmp, setSelectedUserTmp] = useState<UserTmp>();
    const endpointUser = 'authUser';

    const fetchData = async () => {
        if (session?.user?.token) {
            try {
                const user = await fetchGetDataByID(session.user.token, endpointUser, session.user.id ?? '');

                if (user && typeof user === "object" && user.id) {
                    let parsedRoleCode = user.roleCode;
                    if (typeof user.roleCode === 'string') {
                        try {
                            parsedRoleCode = JSON.parse(user.roleCode);
                        } catch (error) {
                            console.warn("Error parsing roleCode:", error);
                        }
                    }

                    if(login === '1'){
                        const tempUser = {
                            ...user,
                            firstLogin: 1,
                            inDate: new Date().toISOString(),
                            outDate: '',
                            lastLogin: new Date().toISOString(),
                            password: '',
                            roleCode: parsedRoleCode,
                        };
                        setSelectedUserTmp(tempUser);
                    }
                    if(login === '0'){
                        const tempUser = {
                            ...user,
                            firstLogin: 0,
                            inDate: '',
                            outDate: new Date().toISOString(),
                            lastLogin: new Date().toISOString(),
                            password: '',
                            roleCode: parsedRoleCode,
                        };
                        setSelectedUserTmp(tempUser);
                    }
                    
                    
                } else {
                    console.warn("Unexpected user data format:", user);
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        } else {
            console.warn("No session token available.");
        }
    };

    const handleUpdate = async () => {
        if (session?.user?.token && selectedUserTmp) {
            try {
                await fetchPutData(session.user.token, endpointUser, session.user.id ?? '', selectedUserTmp);
            } catch (error) {
                console.error("Error updating user data:", error);
            }
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (selectedUserTmp) {
            handleUpdate();
        }
    }, [selectedUserTmp]);

    return selectedUserTmp;
}
