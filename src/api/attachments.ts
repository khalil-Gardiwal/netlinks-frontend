import api from "../http/axios";

export const uploadAttachment = (file: File) => {
  const formData = new FormData();

  formData.append("file", file, file.name);

  return api.post("/attachments", formData);
};
