import type { User, LoginCredentials } from '../types';
import axios from 'axios';
import { USER_AUTH_URL } from './constant';
export const login = async (credentials: LoginCredentials): Promise<User> => {

  const response = await axios.post<any>(USER_AUTH_URL, credentials);

  if (!response) {
    throw new Error('Invalid credentials');
  }

  const { password, ...usersData } = response.data;

  return {
    ...usersData,
  };
};

export const getCurrentUser = async (): Promise<any | null> => {
  const savedUserToken = localStorage.getItem('token');
  const savedUserId = localStorage.getItem('id');
  if (!savedUserToken && savedUserId) {
    return null;
  }

  try {
    return savedUserId
  } catch (error) {
    return null;
  }
};

export const logout = async (): Promise<void> => {
  localStorage.removeItem('token');
  localStorage.removeItem('id');
};
