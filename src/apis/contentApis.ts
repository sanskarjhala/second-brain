import axios from "axios";

// const apiurl = import.meta.env.VITE_API_URL;
const apiurl = "http://localhost:8080"
const endpoints = {
  NewContent: apiurl + "/api/content/add",
  deleteContent: apiurl + "",
  getContentStatus: (id: string) => `${apiurl}/api/content/status/${id}`,
  getAllContent: apiurl + "/api/content/all-content",
};

interface newContentProps {
  link: string;
  type: "youtube" | " twitter" | "article";
  title: string;
}

export const AddContent = async ({ link, type, title }: newContentProps) => {
  try {
    const token = localStorage.getItem("token-brain");
    console.log("FROM ADD CONTENT API" , token)
    // @ts-ignore
    const response = await axios.post(
      endpoints.NewContent,
      { link, title, type },
      { headers: { Authorization: token } },
    );

    return { success: true };
  } catch (error: any) {
    const message = error.response?.data?.message || "Failed to add content";
    return { success: false, message };
  }
};

export const getContentStatus = async (id: string) => {
  const response = await axios.get(endpoints.getContentStatus(id));
  if (response.status !== 200) {
    throw new Error();
  }
  return response.data.status;
};

export const getAllContent = async (token: string) => {
  try {

    const response = await axios.get(endpoints.getAllContent, {
      headers: { Authorization: token},
    });
    console.log("API CALLED : " , response)
    return { success: true, content: response.data.content ?? response.data };
  } catch (error: any) {
    const message = error.response?.data?.message || "Failed to fetch content";
    return { success: false, message, content: [] };
  }
};
