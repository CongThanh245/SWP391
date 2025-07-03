import apiClient from "./axiosConfig";

export const uploadFiles = async (patientId, filesWithTypes) => {
  const formData = new FormData();

  // Duyệt qua từng file và gửi file cùng attachmentType tương ứng
  filesWithTypes.forEach((item) => {
    formData.append("files", item.file); // Thêm file
    formData.append("attachmentTypes", item.attachmentType); // Thêm attachmentType dưới dạng chuỗi
  });

  try {
    const response = await apiClient.post(
      `/patients/${patientId}/files/upload`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error uploading files:", error.message);
    throw error;
  }
};
export const getPatientFiles = async (patientId) => {
  if (!patientId) {
    throw new Error("patientId is required");
  }
  try {
    const response = await apiClient.get(`/patients/${patientId}/files`);
    return response.data;
  } catch (error) {
    console.error("Error fetching patient files:", error.message);
    throw error;
  }
};
