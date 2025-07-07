import { useState, useEffect } from "react";
import { getPatientFiles } from "@api/fileApi";

const usePatientFiles = (patientId) => {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchFiles = async () => {
      if (!patientId) {
        setErrorMessage("Không tìm thấy thông tin bệnh nhân.");
        return;
      }
      try {
        const files = await getPatientFiles(patientId);
        setUploadedFiles(
          files.map((file) => ({
            id: file.attachment.id,
            name: file.attachment.displayName || file.attachment.fileName, // Prefer displayName for user-friendly name
            url: file.url,
            type: file.attachment.fileType.toLowerCase() === "pdf" 
              ? "application/pdf" 
              : file.attachment.fileType.toLowerCase().startsWith("image") 
                ? `image/${file.attachment.fileType.toLowerCase()}` 
                : "application/octet-stream", // Map fileType to MIME type
          }))
        );
        setErrorMessage("");
      } catch (err) {
        console.error("Error fetching patient files:", err);
        setErrorMessage("Không thể tải danh sách tài liệu.");
      }
    };
    fetchFiles();
  }, [patientId]);

  return {
    uploadedFiles,
    fileErrorMessage: errorMessage,
    setFileErrorMessage: setErrorMessage,
  };
};

export default usePatientFiles;