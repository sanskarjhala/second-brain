import { apiClient } from "./apiClient";

interface SignupPayload {
  emailID: string;
  username: string;
  password: string;
}

interface SigninPayload {
  emailID: string;
  password: string;
}

export class UserApis {
  signupUser = async ({ emailID, username, password }: SignupPayload) => {
    const response = await apiClient.post("/register", {
      emailID,
      username,
      password,
    });

    return response.data;
  };

  signinUser = async ({ emailID, password }: SigninPayload) => {
    const response = await apiClient.post("/login", {
      emailID,
      password,
    });

    if(!response || !response.data.Token){
      throw Error
    }
    const Token = response.data.Token;
    localStorage.setItem("token", Token);
    localStorage.setItem("username", response.data.username);
    localStorage.setItem("isDemo", response.data.isDemo);
    return;
  };

  demoUser = async () => {
    const response = await apiClient.post("/demo");
    if (!response) {
      throw Error;
    }
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("username", response.data.username);
    localStorage.setItem("isDemo", response.data.isDemo);
    return response.data;
  };
}
