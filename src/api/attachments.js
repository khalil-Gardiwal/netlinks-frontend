import api from "./axios";

export const uploadAttachment = (file) => {
  const formData = new FormData();

  formData.append("file", file, file.name);

  return api.post("/attachments", formData);
};


