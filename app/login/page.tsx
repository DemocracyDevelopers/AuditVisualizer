"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import Image from "next/image";

const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // Fake Login Logic
    if (username === "admin" && password === "password") {
      // navigate to dashboard page
      router.push("/dashboard");
    } else {
      alert("Wrong username or password.");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <form
        onSubmit={handleLogin}
        className="flex flex-col w-80 space-y-4 items-center"
      >
        <Image src="/logo.png" alt="Logo" width={120} height={120} />

        <h2 className="text-2xl font-semibold text-center">
          Welcome to AuditVisualizer
        </h2>

        <div className="w-full">
          <label htmlFor="username" className="block text-sm font-medium">
            Username:
          </label>
          <Input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="w-full">
          <label htmlFor="password" className="block text-sm font-medium">
            Password:
          </label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <Button type="submit" variant="default" className="w-full">
          Login
        </Button>
        <Button type="submit" variant="secondary" className="w-full">
          Register
        </Button>
      </form>
    </div>
  );
};

export default Login;
