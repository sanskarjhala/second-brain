import axios from "axios";

const apiurl = import.meta.env.VITE_API_URL;

const endpoints = {
  SignupUrl: apiurl + "/api/user/register",
  LoginUrl: apiurl + "/api/user/login",
  GetUserProfile: apiurl + "/api/user/get-user-profile",
};

interface LoginResponse {
  token?: string;
}

export const Signup = async (username: string, password: string) => {
  try {
    const response = await axios.post(endpoints.SignupUrl, {
      username,
      password,
    });

    if (response.status !== 200) {
      throw new Error();
    }
    return response.status;
  } catch (error: any) {
    return error.message;
  }
};

export const Login = async (
  username: string,
  password: string,
): Promise<LoginResponse> => {
  try {
    const response = await axios.post(endpoints.LoginUrl, {
      username,
      password,
    });

    return response.data.token;
  } catch (error: any) {
    return error.response.status;
  }
};

export const GetUserProfile = async () => {
  try {
    const token = localStorage.getItem("token-brain");
    const response = await axios.get(endpoints.GetUserProfile, {
      headers: {
        Authorization: token,
      },
    });

    if (response.status !== 404) {
      throw new Error(`${response.status}`);
    }
    return response;
  } catch (error: any) {
    return error.response.status;
  }
};
