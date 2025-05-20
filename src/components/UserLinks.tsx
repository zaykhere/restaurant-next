"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const UserLinks = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  function logout() {
    localStorage.removeItem("token");
    window.location.href="/";
  }

  const renderLink = () => {
    return isLoggedIn ? (
      <div>
        <Link href="/orders">Orders</Link>
        <span onClick={logout} className="ml-4 cursor-pointer">Logout</span>
      </div>
      
    ) : (
      <Link href="/login">Login</Link>
    );
  };

  return <div>{renderLink()}</div>;
};

export default UserLinks;
