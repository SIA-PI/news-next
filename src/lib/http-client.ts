import axios, { AxiosHeaders } from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
  withCredentials: false,
});

if (typeof window !== "undefined") {
  api.interceptors.request.use(async (config) => {
    const { getSession } = await import("next-auth/react");
    const session = await getSession();
    if (session?.accessToken) {
      const headers = new AxiosHeaders(config.headers);
      headers.set("Authorization", `Bearer ${session.accessToken}`);
      config.headers = headers;
    }
    return config;
  });

  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const { signOut } = await import("next-auth/react");

      if (error.response?.status === 401) {
        await signOut({ redirect: false });
        window.location.href = "/signin";
      }

      return Promise.reject(error);
    },
  );
}
