// authUtils.js
export const isAuthenticated = () => {
  const authToken = localStorage.getItem('authToken');
  const userRole = localStorage.getItem('role');
  return authToken && userRole === 'PATIENT';
};

export const getUserData = () => {
  const userData = localStorage.getItem('user');
  return userData ? JSON.parse(userData) : null;
};

export const logout = (navigate, setUser = null) => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');
  localStorage.removeItem('role');
  if (setUser) {
    setUser(null);
  }
  navigate('/login');
};