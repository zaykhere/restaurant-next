"use client"

import Loading from "@/components/Loading";
import { OrderType } from "@/types/types";
import { API } from "@/utils/axios";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import toast from "react-hot-toast";
import Image from "next/image";

const OrdersPage = () => {
  const {isLoading, error, data} = useQuery({
    queryKey: ["orders"],
    queryFn: () => {
      return API.get('/orders')
    }  
  })

  let orders = data?.data as OrderType[];

  if(isLoading) return <Loading />

  if(error) {
    toast.error(error.message);

    return null;
  }

  const isAdmin = true;

  return (
    <div className="p-4 lg:px-20 xl:px-40">
      <table className="w-full border-separate border-spacing-3">
        <thead>
          <tr className="text-left">
            <th className="hidden md:block">Order ID</th>
            <th>Date</th>
            <th>Price</th>
            <th className="hidden md:block">Products</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {orders?.map((order) => (
            <tr className="text-sm md:text-base odd:bg-gray-100" key={order.id}>
              <td className="hidden md:block py-6 px-1">{order.id}</td>
              <td className="py-6 px-1">{new Date(order.createdAt).toDateString()}</td>
              <td className="py-6 px-1">{order.price}</td>
              <td className="hidden md:block py-6 px-1">
                {order.products?.[0]?.title}
              </td>
              {isAdmin ? (
                <td>
                  <form className="flex items-center justify-center gap-4">
                    <input placeholder={order.status} className="p-2 ring-1 ring-red-100 rounded-md" />
                    <button className="bg-red-400 p-2 rounded-full">
                      <Image src="/edit.png" alt="Edit status" width={20} height={20} />
                    </button>
                  </form>
                </td>
              ) : (
                <td className="py-6 px-1">{order.status}</td>
              )}
              
            </tr>
          ))}
          
        </tbody>
      </table>
    </div>
  );
};

export default OrdersPage;
