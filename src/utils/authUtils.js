export const logout = (navigate, setUser = null) => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');
  localStorage.removeItem('role');
  if (setUser) {
    setUser(null);
  }
  navigate('/login');
};