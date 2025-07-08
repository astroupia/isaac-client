import { apiService } from './base';

export const userService = {
  // Get all users
  getAllUsers: async () => {
    return apiService.get('/users');
  },

  // Get all active users
  getActiveUsers: async () => {
    return apiService.get('/users/active');
  },

  // Get users by role
  getUsersByRole: async (role: string) => {
    return apiService.get(`/users/role/${role}`);
  },

  // Get users by department
  getUsersByDepartment: async (department: string) => {
    return apiService.get(`/users/department/${department}`);
  },

  // Get user by ID
  getUserById: async (id: string) => {
    return apiService.get(`/users/${id}`);
  },

  // Get user by email
  getUserByEmail: async (email: string) => {
    return apiService.get(`/users/email/${email}`);
  },

  // Update user by ID
  updateUser: async (id: string, data: any) => {
    return apiService.patch(`/users/${id}`, data);
  },
}; 