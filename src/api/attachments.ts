import api from "./axios";

export const uploadAttachment = (file: File) => {
  const formData = new FormData();

  formData.append("file", file, file.name);

  return api.post("/attachments", formData);
};
