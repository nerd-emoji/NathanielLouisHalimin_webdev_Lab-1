import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_BASE || "http://localhost:8000",
});

// Fungsi untuk mengambil buku
export const getAllBooks = async () => {
  try {
    const response = await API.get("/basic/");
    return response.data;
  } catch (error) {
    // tampilkan body response agar terlihat stacktrace/html dari server
    console.error("Error mengambil data buku:", error.response?.data || error.message || error);
    throw error;
  }
};

// Fungsi untuk menambahkan buku baru
export const createBook = async (bookData) => {
  try {
    // jika FormData, biarkan axios mengatur Content-Type (jangan set manual)
    const response = await API.post("/basic/", bookData);
    return response.data;
  } catch (error) {
    console.error("Error menambahkan buku:", error.response?.data || error.message || error);
    throw error;
  }
};

// Fungsi untuk mengupdate buku
export const updateBook = async (id, bookData) => {
  try {
    if (bookData instanceof FormData) {
      // banyak backend (terutama DRF jika dikonfigurasi) menerima multipart pada PATCH lebih baik
      const response = await API.patch(`/basic/${id}/`, bookData);
      return response.data;
    } else {
      const response = await API.put(`/basic/${id}/`, bookData);
      return response.data;
    }
  } catch (error) {
    console.error("Error mengupdate buku:", error.response?.data || error.message || error);
    throw error;
  }
};

// fungsi untuk hapus buku
export const deleteBook = async (id) => {
  try {
    await API.delete(`/basic/${id}/`);
  } catch (error) {
    console.error("Error menghapus buku:", error.response?.data || error.message || error);
    throw error;
  }
};

