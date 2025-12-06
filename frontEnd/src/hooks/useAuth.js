import authStore from "../stores/authStore";

// Custom hook to use the authStore
const useAuthStore = () => {
  return authStore();
};

export default useAuthStore;
