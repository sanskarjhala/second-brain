import { apiClient } from "./apiClient";

export const serverwakeup = async () => {
  const response = await apiClient("/health");
  if (!response) {
    throw Error;
  }
};
