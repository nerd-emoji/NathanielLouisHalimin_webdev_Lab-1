import axios from 'axios';
const API_URL = 'http://localhost:8000/basic/';

export const getAllBooks = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        console.error('Error fetching books:', error);
        throw error;
    }
};

export const createBook = async (bookData) => {
    try {
        const response = await axios.post(API_URL, bookData);
        return response.data;
    }catch (error) {
        console.error('Error creating book:', error);
        throw error;
    }
};

export const updateBook = async (Id, bookData) => {
    try {
        const response = await axios.put(`${API_URL}${Id}/`, bookData);
        return response.data;
    } catch (error) {
        console.error('Error updating book:', error);
        throw error;
    }
};
export const deleteBook = async (Id) => {
    try {
        await axios.delete(`${API_URL}${Id}/`);
    } catch (error) {
        console.error('Error deleting book:', error);
        throw error;
    }
};