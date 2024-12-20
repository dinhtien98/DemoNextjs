'use client';

import React, { useState } from "react";
import { InputText } from "primereact/inputtext";
import { FloatLabel } from "primereact/floatlabel";
import { Password } from "primereact/password";

export default function LoginPage() {
  const [userName, setUserName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    try {
      const response = await fetch("http://localhost:5004/api/authLogin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'Accept': 'application/json',
        },
        body: JSON.stringify({ userName, password }),
      });
      console.log("response:", response);
      if (!response.ok) {
        const errorData = await response.text();
        let errorMessage = "Login failed";
        try {
          const parsedError = JSON.parse(errorData);
          errorMessage = parsedError.message || errorMessage;
        } catch {
          errorMessage = errorData || errorMessage;
        }
        throw new Error(errorMessage);
      }
  
      const data = await response.json();
  
      if (!data.token) {
        throw new Error("Invalid token received");
      }
  
      // Set cookie and redirect to the homepage
      document.cookie = `sessionToken=${data.token}; path=/; secure; HttpOnly;`;
      
      setError(null);
      window.location.href = "/";
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error("Login error:", err.message);
        setError(err.message);
      } else {
        console.error("Unexpected login error:", err);
        setError("An unexpected error occurred.");
      }
    }
  };
  
  
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
        {error && (
          <div className="text-red-500 text-sm my-2">{error}</div>
        )}
        <div className="flex justify-center">
          <button
            className="p-button p-component p-button-outlined"
            onClick={handleLogin}
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}
