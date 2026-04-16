import { apiClient } from "./apiClient";

export class ResumeApis {
  getAllResumes = async (): Promise<any> => {
    const response = await apiClient.get("/resume");
    return response;
  };

  getSingleResume = async (resumeId: string): Promise<any> => {
    const response = await apiClient(`/resume/${resumeId}`);
    return response;
  };

  analyzeResume = async (formData: FormData): Promise<any> => {
    const response = await apiClient.post("/resume/analyze", formData);
    return response;
  };

  sendChatMessage = async (resumeId: string, message: string): Promise<any> => {
    const response = await apiClient.post(`/resume/${resumeId}/chat`, {
      data: { message: message },
    });
    return response;
  };

  deleteResume = async (resumeId: string): Promise<any> => {
    const response = await apiClient.delete(`/resume/${resumeId}`);
    return response;
  };
}
