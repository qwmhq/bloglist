import axios from "axios";
const baseUrl = "/api/blogs";

let token = null;

const setToken = (newToken) => {
  token = `Bearer ${newToken}`;
};

const clearToken = () => {
  token = null;
};

const getAll = async () => {
  const response = await axios.get(baseUrl);
  return response.data;
};

const get = async (id) => {
  const response = await axios.get(`${baseUrl}/${id}`);
  return response.data;
}

const create = async (newObject) => {
  const config = {
    headers: { Authorization: token },
  };

  const response = await axios.post(baseUrl, newObject, config);
  return response.data;
};

const update = async (id, updatedObject) => {
  const config = {
    headers: { Authorization: token },
  };
  await axios.put(`${baseUrl}/${id}`, updatedObject, config);
};

const remove = async (id) => {
  const config = {
    headers: { Authorization: token },
  };
  await axios.delete(`${baseUrl}/${id}`, config);
};

const addComment = async (id, comment) => {
  const config = {
    headers: { Authorization: token },
  };
  const response = await axios.post(`${baseUrl}/${id}/comments`, { comment }, config);
  return response.data;
};

const getComments = async (id) => {
  const config = {
    headers: { Authorization: token },
  };
  const response = await axios.get(`${baseUrl}/${id}/comments`, config);
  return response.data;
}

export default { get, getAll, create, update, remove, addComment, getComments, setToken, clearToken };
