import { apiClient } from "./apiClient";

export class ResumeApis {
  getAllResumes = async (): Promise<any> => {
    const response = await apiClient.get("/resume");
    console.log("------------------------- RESUME API ----------------")
    console.log(response)
    return response;
  };

  getSingleResume = async (resumeId: string): Promise<any> => {
    const response = await apiClient(`/resume/${resumeId}`);
    return response.data;
  };

  analyzeResume = async (formData: FormData): Promise<any> => {
    const response = await apiClient.post("/resume/analyze", formData);
    return response;
  };

  sendChatMessage = async (resumeId: string, message: string): Promise<any> => {
    console.log(message)
    const response = await apiClient.post(`/resume/${resumeId}/chat`, {
      message,
    });
    return response.data;
  };

  deleteResume = async (resumeId: string): Promise<any> => {
    const response = await apiClient.delete(`/resume/${resumeId}`);
    return response;
  };
}
