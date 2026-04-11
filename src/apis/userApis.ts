import axios from "axios";

// const apiurl = import.meta.env.VITE_API_URL;
const apiurl = "http://localhost:8080"

const endpoints = {
  SignupUrl: apiurl + "/api/user/register",
  LoginUrl: apiurl + "/api/user/login",
  GetUserProfile: apiurl + "/api/user/get-user-profile",
};

export const Signup = async (
  username: string,
  password: string,
): Promise<{ success: boolean; message?: string }> => {
  try {
    // @ts-ignore
    const response = await axios.post(endpoints.SignupUrl, {
      username,
      password,
    });

    return { success: true };
  } catch (error: any) {
    const message = error.response?.data?.message || "Signup failed";
    return { success: false, message };
  }
};

export const Login = async (
  username: string,
  password: string,
): Promise<{ success: boolean; token?: string; message?: string }> => {
  try {
    const response = await axios.post(endpoints.LoginUrl, {
      username,
      password,
    });

    return { success: true, token: response.data.token };
  } catch (error: any) {
    const message =
      error.response?.data?.message || "Invalid username or password";
    return { success: false, message };
  }
};

export const GetUserProfile = async (token: string) => {
  try {
    const response = await axios.get(endpoints.GetUserProfile, {
      headers: { Authorization: token },
    });

    return { success: true, data: response.data };
  } catch (error: any) {
    const status = error.response?.status;
    if (status === 401) {
      return { success: false, status: 401 };
    }
    return { success: false, status };
  }
};
