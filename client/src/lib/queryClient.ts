import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    console.error(`API Error ${res.status}:`, text);
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  try {
    const authToken = localStorage.getItem('auth_token');
    
    const headers: Record<string, string> = {};
    
    if (data) {
      headers["Content-Type"] = "application/json";
    }
    
    // Use auth token for all API calls
    if (authToken) {
      headers["Authorization"] = `Bearer ${authToken}`;
    }

    // Use relative URLs for same-origin requests
    const apiUrl = url;
    
    console.log("Making API request:", { method, url: apiUrl, headers, data });
    
    const res = await fetch(apiUrl, {
      method,
      headers,
      body: data ? JSON.stringify(data) : undefined,
    });

    console.log("API response:", { status: res.status, ok: res.ok, url: res.url });
    
    await throwIfResNotOk(res);
    return res;
  } catch (error) {
    console.error("API request failed:", error);
    throw error;
  }
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const authToken = localStorage.getItem('auth_token');
    const headers: Record<string, string> = {};
    
    const url = queryKey.join("/") as string;
    
    // Use auth token for all API calls
    if (authToken) {
      headers["Authorization"] = `Bearer ${authToken}`;
    }
    // Use relative URLs for same-origin requests
    const apiUrl = url;
    
    const res = await fetch(apiUrl, {
      headers,
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
