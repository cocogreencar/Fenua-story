export const ADMIN_KEY = "admin_authenticated";

export const isAdminAuthenticated = () => {
  return sessionStorage.getItem(ADMIN_KEY) === "true";
};

export const loginAdmin = (password) => {
  if (password === import.meta.env.VITE_ADMIN_PASSWORD) {
    sessionStorage.setItem(ADMIN_KEY, "true");
    return true;
  }
  return false;
};

export const logoutAdmin = () => {
  sessionStorage.removeItem(ADMIN_KEY);
};
