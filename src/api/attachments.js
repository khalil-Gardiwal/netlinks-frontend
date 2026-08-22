import api from "./axios";

export const uploadAttachment = (file) => {
  const formData = new FormData();

  formData.append("file", file, file.name);

  return api.post("/attachments", formData);
};

export const getAttachment = (id) => {
  return api.get(`/attachments/${id}`);
};

export const claimAttachment = (id) => {
  return api.post(`/attachments/${id}/claim`);
};

export const deleteAttachment = (id) => {
  return api.delete(`/attachments/${id}`);
};

export const getAttachmentFileUrl = (id) => {
  return `${api.defaults.baseURL}/attachments/${id}/file`;
};
