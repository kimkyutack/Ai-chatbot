import { useState, useCallback } from "react";

export interface UploadedFile {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  preview?: string;
}

interface UseFileUploadReturn {
  uploadedFiles: UploadedFile[];
  uploadFile: (file: File) => Promise<UploadedFile>;
  removeFile: (fileId: string) => void;
  clearFiles: () => void;
  isUploading: boolean;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "text/plain",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export const useFileUpload = (): UseFileUploadReturn => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const uploadFile = useCallback(async (file: File): Promise<UploadedFile> => {
    // 파일 크기 검증
    if (file.size > MAX_FILE_SIZE) {
      throw new Error("파일 크기가 10MB를 초과합니다.");
    }

    // 파일 타입 검증
    if (!ALLOWED_TYPES.includes(file.type)) {
      throw new Error("지원하지 않는 파일 형식입니다.");
    }

    setIsUploading(true);

    try {
      // 파일을 Data URL로 변환
      const url = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const uploadedFile: UploadedFile = {
        id: Date.now().toString(),
        name: file.name,
        type: file.type,
        size: file.size,
        url,
        preview: file.type.startsWith("image/") ? url : undefined,
      };

      setUploadedFiles((prev) => [...prev, uploadedFile]);
      return uploadedFile;
    } catch (error) {
      console.error("파일 업로드 오류:", error);
      throw error;
    } finally {
      setIsUploading(false);
    }
  }, []);

  const removeFile = useCallback((fileId: string) => {
    setUploadedFiles((prev) => prev.filter((file) => file.id !== fileId));
  }, []);

  const clearFiles = useCallback(() => {
    setUploadedFiles([]);
  }, []);

  return {
    uploadedFiles,
    uploadFile,
    removeFile,
    clearFiles,
    isUploading,
  };
};
