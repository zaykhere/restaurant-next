"use client"

import Loading from "@/components/Loading";
import { OrderType } from "@/types/types";
import { API } from "@/utils/axios";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import toast from "react-hot-toast";

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
              <td className="hidden md:block py-6 px-1">Big Burger Menu (2), Veggie Pizza (2), Coca Cola 1L (2)</td>
              <td className="py-6 px-1">On the way (approx. 10min)...</td>
            </tr>
          ))}
          
        </tbody>
      </table>
    </div>
  );
};

export default OrdersPage;
