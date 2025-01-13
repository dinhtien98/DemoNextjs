/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'
import React from 'react';
import { useUserData } from '@/hooks/useUserData';

export default function Dashboard({ session }: SessionProp) {
    const selectedUserTmp = useUserData(session, '1');
    return (
        <div>dashboard</div>
    );
}
