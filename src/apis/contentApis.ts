import axios from "axios";

const apiurl = import.meta.env.VITE_API_URL;

const endpoints = {
  NewContent: apiurl + "/api/content/add",
  deleteContent: apiurl + "",
  getContentStatus: (id: string) => `${apiurl}/api/content/status/${id}`,
};

interface newContentProps {
  link: string;
  type: "youtube" | " twitter" | "article";
  title: string;
}

export const AddContent = async ({ link, type, title }: newContentProps) => {
  try {
    const response = await axios.post(endpoints.NewContent, {
      link,
      title,
      type,
    });

    if (response.status !== 200) {
      throw new Error();
    }
    return response.status;
  } catch (error: any) {
    return error.message;
  }
};

export const getContentStatus = async (id: string) => {
  const response = await axios.get(endpoints.getContentStatus(id));
  if (response.status !== 200) {
    throw new Error();
  }
  return response.data.status;
};
