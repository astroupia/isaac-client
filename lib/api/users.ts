import { apiService } from "./base";

export const userService = {
  // Get all users
  getAllUsers: async () => {
    return apiService.get("/users");
  },

  // Get all active users
  getActiveUsers: async () => {
    return apiService.get("/users/active");
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

  // Create a new user
  // Note: This endpoint might not exist in your current API
  // You may need to add POST /users to your NestJS backend
  createUser: async (userData: any) => {
    return apiService.post("/users", userData);
  },

  // Update user by ID
  updateUser: async (id: string, data: any) => {
    return apiService.patch(`/users/${id}`, data);
  },

  // Delete user by ID
  deleteUser: async (id: string) => {
    return apiService.delete(`/users/${id}`);
  },

  // Get user statistics (for admin dashboard)
  getUserStats: async () => {
    return apiService.get("/users/stats");
  },
};
