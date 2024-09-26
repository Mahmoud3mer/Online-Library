// src/services/orderService.ts
import axios from "axios";
import { apiUrl } from "../utils/apiUrl";

const API_URL = `${apiUrl}/orders/admin`;

export const fetchAllOrders = async (page: number, limit: number) => {
  const tokens = localStorage.getItem("token");
  try {
    const response = await axios.get(API_URL, {
      params: { page, limit },
      headers: {
        token: tokens,
      },
    });

    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error("Error fetching orders");
  }
};
