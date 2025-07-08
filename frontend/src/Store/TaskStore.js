import { create } from "zustand";
import { axiosInstance } from "../lib/Axios.js";
import toast from "react-hot-toast";

export const useTaskStore = create((set, get) => ({
  tasks: [],
  actions: [],
  isLoading: false,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,

  // Fetch all tasks
  fetchTasks: async () => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get("/task/all");
      set({ tasks: res.data });
    } catch (error) {
      console.error("Error fetching tasks:", error);
      toast.error("Failed to fetch tasks");
    } finally {
      set({ isLoading: false });
    }
  },

  // Fetch actions
  fetchActions: async () => {
    try {
      const res = await axiosInstance.get("/action/last-20");
      set({ actions: res.data });
    } catch (error) {
      console.error("Error fetching actions:", error);
    }
  },

  // Create task
  createTask: async (taskData) => {
    set({ isCreating: true });
    try {
      const res = await axiosInstance.post("/task/create", taskData);
      set((state) => ({
        tasks: [...state.tasks, res.data],
        isCreating: false,
      }));
      toast.success("Task created successfully");
      return res.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create task");
      set({ isCreating: false });
      throw error;
    }
  },

  // Update task
  updateTask: async (taskId, updateData) => {
    set({ isUpdating: true });
    try {
      const res = await axiosInstance.patch(`/task/update/${taskId}`, updateData);
      set((state) => ({
        tasks: state.tasks.map((task) =>
          task._id === taskId ? res.data : task
        ),
        isUpdating: false,
      }));
      toast.success("Task updated successfully");
      return res.data;
    } catch (error) {
      if (error.response?.status === 409) {
        // Conflict detected
        toast.error("Task has been modified by another user");
        throw error;
      }
      toast.error(error.response?.data?.message || "Failed to update task");
      set({ isUpdating: false });
      throw error;
    }
  },

  // Delete task
  deleteTask: async (taskId) => {
    set({ isDeleting: true });
    try {
      await axiosInstance.delete(`/task/delete/${taskId}`);
      set((state) => ({
        tasks: state.tasks.filter((task) => task._id !== taskId),
        isDeleting: false,
      }));
      toast.success("Task deleted successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete task");
      set({ isDeleting: false });
    }
  },

  // Assign task
  assignTask: async (taskId, assigneeId) => {
    try {
      const res = await axiosInstance.post(`/task/assign/${taskId}`, {
        assigneeId,
      });
      set((state) => ({
        tasks: state.tasks.map((task) =>
          task._id === taskId ? res.data : task
        ),
      }));
      toast.success("Task assigned successfully");
      return res.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to assign task");
      throw error;
    }
  },

  // Smart assign task
  smartAssignTask: async (taskId) => {
    try {
      const res = await axiosInstance.post(`/task/smart-assign/${taskId}`);
      set((state) => ({
        tasks: state.tasks.map((task) =>
          task._id === taskId ? res.data : task
        ),
      }));
      toast.success("Task smart-assigned successfully");
      return res.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to smart-assign task");
      throw error;
    }
  },

  // Real-time updates
  addTask: (task) => {
    set((state) => ({
      tasks: [...state.tasks, task],
    }));
  },

  updateTaskInStore: (updatedTask) => {
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task._id === updatedTask._id ? updatedTask : task
      ),
    }));
  },

  removeTask: (taskId) => {
    set((state) => ({
      tasks: state.tasks.filter((task) => task._id !== taskId),
    }));
  },

  addAction: (action) => {
    set((state) => ({
      actions: [action, ...state.actions.slice(0, 19)], // Keep only last 20
    }));
  },

  // Get tasks by status
  getTasksByStatus: (status) => {
    return get().tasks.filter((task) => task.status === status);
  },

  // Get tasks assigned to user
  getTasksByAssignee: (userId) => {
    return get().tasks.filter((task) =>
      task.assignees.some((assignee) => assignee._id === userId)
    );
  },
})); 