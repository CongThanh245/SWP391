import React, { useState, useRef, useEffect } from "react";
import {
  Upload,
  FileText,
  Shield,
  X,
  Plus,
  Eye,
  Trash2,
  Folder,
} from "lucide-react";
import styles from "./MedicalRecordsManager.module.css";
import { uploadFiles, getPatientFiles, deletePatientFile } from "@api/fileApi";
import { useToast } from "@hooks/use-toast";
import ConfirmationDialog from "@components/common/ConfirmationDialog/ConfirmationDialog";

const ATTACHMENT_TYPES = [
  { value: "PRESCRIPTION", displayName: "Đơn thuốc" },
  { value: "TREATMENT_PLAN", displayName: "Phác đồ điều trị" },
  { value: "BLOOD_TEST", displayName: "Kết quả xét nghiệm máu" },
  { value: "HORMONE_TEST", displayName: "Xét nghiệm nội tiết" },
  { value: "ULTRASOUND_RESULT", displayName: "Kết quả siêu âm" },
  { value: "SPERM_ANALYSIS", displayName: "Phân tích tinh dịch đồ" },
  { value: "EMBRYO_REPORT", displayName: "Báo cáo phôi" },
  { value: "CONSENT_FORM", displayName: "Phiếu cam kết" },
  { value: "OTHER", displayName: "Tài liệu khác" },
];

const MedicalRecordsManager = () => {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("upload");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [fileToDelete, setFileToDelete] = useState(null);
  const fileInputRef = useRef(null);
  const { toast } = useToast();

  const getPatientId = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    return user?.id || null;
  };

  useEffect(() => {
    const fetchFiles = async () => {
      const patientId = getPatientId();
      if (!patientId) {
        toast({
          title: "Lỗi",
          description:
            "Không tìm thấy thông tin bệnh nhân. Vui lòng đăng nhập lại.",
          variant: "destructive",
        });
        return;
      }
      try {
        const files = await getPatientFiles(patientId);
        const mappedFiles = files.map((file) => ({
          id: file.attachment.id,
          fileName: file.attachment.fileName,
          attachmentType: file.attachment.attachmentType,
          fileSize: file.attachment.fileSize,
          uploadDate: file.attachment.uploadedAt,
          hospital: file.attachment.hospital || "N/A",
          url: file.url,
        }));
        setUploadedFiles(mappedFiles);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách file:", error);
        toast({
          title: "Lỗi",
          description: " solemne load danh sách file.",
          variant: "destructive",
        });
      }
    };
    fetchFiles();
  }, []);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files) {
      handleFileSelect(e.target.files);
    }
  };

  const handleFileSelect = (fileList) => {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const newFiles = Array.from(fileList)
      .filter((file) => {
        if (file.size > maxSize) {
          toast({
            title: "Lỗi",
            description: `File ${file.name} vượt quá giới hạn 10MB.`,
            variant: "destructive",
          });
          return false;
        }
        return true;
      })
      .map((file) => ({
        id: `temp-${Date.now()}-${Math.random()}`,
        name: file.name,
        size: file.size,
        file,
        type: file.type,
        attachmentType: "OTHER",
      }));
    setSelectedFiles((prev) => [...prev, ...newFiles]);
  };

  const handleAttachmentTypeChange = (fileId, newType) => {
    setSelectedFiles((prev) =>
      prev.map((file) =>
        file.id === fileId ? { ...file, attachmentType: newType } : file
      )
    );
  };

  const handleSubmit = async () => {
    const patientId = getPatientId();
    if (!patientId) {
      toast({
        title: "Lỗi",
        description:
          "Không tìm thấy thông tin bệnh nhân. Vui lòng đăng nhập lại.",
        variant: "destructive",
      });
      return;
    }
    if (selectedFiles.length === 0) {
      toast({
        title: "Lỗi",
        description: "Vui lòng chọn ít nhất một file để tải lên.",
        variant: "destructive",
      });
      return;
    }
    if (selectedFiles.some((file) => !file.attachmentType)) {
      toast({
        title: "Lỗi",
        description: "Vui lòng chọn loại tài liệu cho tất cả các file.",
        variant: "destructive",
      });
      return;
    }
    setLoading(true);
    try {
      const filesToUpload = selectedFiles.map((file) => ({
        file: file.file,
        attachmentType: file.attachmentType,
      }));
      await uploadFiles(patientId, filesToUpload);
      const updatedFiles = await getPatientFiles(patientId);
      const mappedFiles = updatedFiles.map((file) => ({
        id: file.attachment.id,
        fileName: file.attachment.fileName,
        attachmentType: file.attachment.attachmentType,
        fileSize: file.attachment.fileSize,
        uploadDate: file.attachment.uploadedAt,
        hospital: file.attachment.hospital || "N/A",
        url: file.url,
      }));
      setUploadedFiles(mappedFiles);
      setSelectedFiles([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      toast({
        title: "Thành công",
        description: "File đã được tải lên.",
      });
      setActiveTab("files");
    } catch (error) {
      console.error("Lỗi khi tải lên file:", error);
      toast({
        title: "Lỗi",
        description: "Có lỗi xảy ra khi tải lên file. Vui lòng thử lại.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const removeSelectedFile = (id) => {
    setSelectedFiles(selectedFiles.filter((file) => file.id !== id));
  };

  const deleteUploadedFile = async (id) => {
    const patientId = getPatientId();
    if (!patientId) {
      toast({
        title: "Lỗi",
        description:
          "Không tìm thấy thông tin bệnh nhân. Vui lòng đăng nhập lại.",
        variant: "destructive",
      });
      return;
    }
    setFileToDelete(id);
    setDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!fileToDelete) return;
    setLoading(true);
    try {
      await deletePatientFile(getPatientId(), fileToDelete);
      setUploadedFiles(uploadedFiles.filter((file) => file.id !== fileToDelete));
      toast({
        title: "Thành công",
        description: "File đã được xóa.",
      });
    } catch (error) {
      console.error("Lỗi khi xóa file:", error);
      toast({
        title: "Lỗi",
        description: "Không thể xóa file. Vui lòng thử lại.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setDialogOpen(false);
      setFileToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setDialogOpen(false);
    setFileToDelete(null);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getTypeDisplayName = (type) => {
    const typeObj = ATTACHMENT_TYPES.find((t) => t.value === type);
    return typeObj ? typeObj.displayName : "Tài liệu khác";
  };

  return (
    <div className={styles.container}>
      <ConfirmationDialog
        open={dialogOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Xác nhận xóa"
        content="Bạn có chắc chắn muốn xóa file này không? Hành động này không thể hoàn tác."
        confirmText="Xóa"
        cancelText="Hủy"
      />
      <main className={styles.main}>
        <div className={styles.tabContainer}>
          <button
            className={`${styles.tab} ${
              activeTab === "upload" ? styles.active : ""
            }`}
            onClick={() => setActiveTab("upload")}
          >
            <Upload size={16} />
            Tải lên tài liệu
          </button>
          <button
            className={`${styles.tab} ${
              activeTab === "files" ? styles.active : ""
            }`}
            onClick={() => setActiveTab("files")}
          >
            <FileText size={16} />
            Tài liệu đã tải ({uploadedFiles.length})
          </button>
        </div>

        <div className={styles.tabContent}>
          {activeTab === "upload" && (
            <div className={styles.uploadSection}>
              <div
                className={`${styles.dropZone} ${
                  dragActive ? styles.dragActive : ""
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".pdf"
                  onChange={handleFileInput}
                  className={styles.fileInput}
                  style={{ display: "none" }}
                />
                <div className={styles.dropZoneContent}>
                  <Upload className={styles.uploadIcon} size={24} />
                  <p>Kéo thả file vào đây hoặc click nút bên dưới</p>
                  <p className={styles.supportText}>PDF, tối đa 10MB</p>
                  <button
                    type="button"
                    className={styles.selectButton}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Plus size={16} />
                    Chọn file
                  </button>
                </div>
              </div>

              {selectedFiles.length > 0 && (
                <div className={styles.pendingFileList}>
                  <h3>File đã chọn ({selectedFiles.length})</h3>
                  <div className={styles.pendingFiles}>
                    {selectedFiles.map((file) => (
                      <div key={file.id} className={styles.pendingFileItem}>
                        <div className={styles.fileInfo}>
                          <FileText size={16} />
                          <span className={styles.fileName}>{file.name}</span>
                          <span className={styles.fileSize}>
                            {formatFileSize(file.size)}
                          </span>
                        </div>
                        <div className={styles.attachmentTypeSelect}>
                          <select
                            value={file.attachmentType}
                            onChange={(e) =>
                              handleAttachmentTypeChange(
                                file.id,
                                e.target.value
                              )
                            }
                            className={styles.categorySelect}
                          >
                            <option value="">Chọn loại tài liệu</option>
                            {ATTACHMENT_TYPES.map((type) => (
                              <option key={type.value} value={type.value}>
                                {type.displayName}
                              </option>
                            ))}
                          </select>
                        </div>
                        <button
                          onClick={() => removeSelectedFile(file.id)}
                          className={styles.removeButton}
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className={styles.submitContainer}>
                    <button
                      onClick={handleSubmit}
                      disabled={selectedFiles.length === 0 || loading}
                      className={`${styles.submitButton} ${
                        selectedFiles.length === 0 || loading
                          ? styles.disabled
                          : ""
                      }`}
                    >
                      {loading ? (
                        <>
                          <div className={styles.spinner}></div>
                          Đang tải...
                        </>
                      ) : (
                        <>
                          <Upload size={16} />
                          Tải lên ({selectedFiles.length})
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "files" && (
            <div className={styles.filesSection}>
              {uploadedFiles.length === 0 ? (
                <div className={styles.emptyState}>
                  <FileText size={32} />
                  <p>Chưa có tài liệu nào. Hãy tải lên tài liệu đầu tiên!</p>
                </div>
              ) : (
                <table className={styles.fileTable}>
                  <thead>
                    <tr>
                      <th>Tên file</th>
                      <th>Loại tài liệu</th>
                      <th>Kích thước</th>
                      <th>Ngày tải lên</th>
                      <th>Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {uploadedFiles.map((file) => (
                      <tr key={file.id}>
                        <td>{file.fileName}</td>
                        <td>{getTypeDisplayName(file.attachmentType)}</td>
                        <td>{formatFileSize(file.fileSize)}</td>
                        <td>
                          {new Date(file.uploadDate).toLocaleDateString(
                            "vi-VN"
                          )}
                        </td>
                        <td style={{ display: "flex", justifyItems: "center" }}>
                          <a
                            href={file.url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Eye style={{ margin: "0 10px" }} size={16} />
                          </a>
                          <button onClick={() => deleteUploadedFile(file.id)}>
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default MedicalRecordsManager;