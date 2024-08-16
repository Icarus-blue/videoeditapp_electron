/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
import axios, { AxiosInstance } from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

// Create an axios instance
const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

// Add a request interceptor to include the token in all requests
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['x-auth-token'] = token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const api = {
  signup: async (username: string, email: string, password: string): Promise<string> => {
    
    const { data } = await axiosInstance.post('/signup', { username, email, password });
    const { status } = data;
    return status;
  },

  login: async (email: string, password: string): Promise<string> => {
    
    const { data } = await axiosInstance.post('/login', { email, password });
    const { token } = data;
    console.log(token);
    
    localStorage.setItem('token', token);
    return token;
  },

  logout: (): void => {
    localStorage.removeItem('token');
  },

  uploadVideo: async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('video', file);    
    const { data } = await axiosInstance.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return data.filename;
  },

  processVideo: async (prompt: string, filename: string): Promise<any> => {
    const { data } = await axiosInstance.post('/process', { prompt, filename });
    return data;
  },

  downloadVideo: (filename: string): Promise<void> => 
    new Promise((resolve) => {
      const token = localStorage.getItem('token');
      const link = document.createElement('a');
      link.href = `http://localhost:3000/api/download/${filename}?token=${token}`;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(resolve, 1000); // Wait for 1 second before resolving
    })
};

export const handleVideoProcessing = async (file: File, prompt: string) => {
  try {
    const filename = await api.uploadVideo(file);
    
    const result = await api.processVideo(prompt, filename);
    
    if (result.outputPaths && result.outputPaths.length > 0) {
      result.outputPaths.forEach((fileName: string) => {
        if (fileName) {
          // api.downloadVideo(fileName);
        }
      });
    }

    return result;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

// New function to check if user is authenticated
export const isAuthenticated = (): boolean => !!localStorage.getItem('token');