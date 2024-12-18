'use client';
import React, { useState } from "react";
import { InputText } from "primereact/inputtext";
import { FloatLabel } from "primereact/floatlabel";
import { Password } from 'primereact/password';

export default function LoginPage() {
  const [userName, setUserName] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  return (
    <div className="flex justify-center">
      <div className="m-4 w-full max-w-md">
        <div className="card flex justify-content-center my-6">
          <FloatLabel className="w-full">
            <InputText
              className="border border-1 border-solid rounded-lg w-full h-10 box-border"
              id="username"
              value={userName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUserName(e.target.value)}
            />
            <label htmlFor="username">Username</label>
          </FloatLabel>
        </div>
        <div className="card flex justify-content-center my-6">
          <FloatLabel className="w-full">
            <Password
              className="border border-1 border-solid rounded-lg w-full h-10 box-border"
              inputId="password"
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
            />
            <label htmlFor="password">Password</label>
          </FloatLabel>
        </div>
      </div>
    </div>
  );
}
