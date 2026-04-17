import { apiClient } from "./apiClient";

export interface AddContentPayload {
  title: string;
  link: string;
  type: string;
}

export class ContentApis {
  aiSearch = async (query: string): Promise<any> => {
    const response = await apiClient.get("/ai-search", {
      params: { q: query },
    });
    console.log(response)
    if (!response) {
      throw Error("ERROR IN AI SEACRH API CALL");
    }
    console.log("--------------------------",response)
    return response;
  };

  GetContentApi = async (): Promise<any> => {
    const response = await apiClient.get("/content");
    if (!response) throw Error;
    return response;
  };

  AddNewContentAPI = async (data: AddContentPayload): Promise<any> => {
    const response = await apiClient.post("/content", data);
    return response;
  };

  DeleteContent = async (contentId: string): Promise<any> => {
    const response = await apiClient.delete("/content", {
      data : {contentId}
    });
    if (!response) {
      throw Error;
    }
  };
}
