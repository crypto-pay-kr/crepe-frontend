const API_BASE_URL = import.meta.env.VITE_API_SERVER_URL || "http://localhost:8080";

export async function createOrder(orderRequest: {
  storeId: number | string;
  orderDetails: { menuId: number; menuCount: number }[];
  currency: string;
}): Promise<string> {
  const token = localStorage.getItem("accessToken");
  const response = await fetch(`${API_BASE_URL}/api/orders/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(orderRequest),
  });

  if (!response.ok) {
    throw new Error(`Order creation failed with status ${response.status}`);
  }
  return response.text();
}


export async function getOrderDetails(orderId: string): Promise<any> {
    const token = localStorage.getItem("accessToken");
    const response = await fetch(`${API_BASE_URL}/api/orders/${orderId}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
  
    if (!response.ok) {
      throw new Error(`Failed to fetch order details with status ${response.status}`);
    }
    return response.json();
  }

  export async function getOrderHistory() {
    const token = localStorage.getItem("accessToken");
    const response = await fetch(`${API_BASE_URL}/api/orders`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
  
    if (!response.ok) {
      throw new Error(`Failed to fetch order details with status ${response.status}`);
    }
    return response.json();
  }