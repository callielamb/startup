// AuthState.js
export const AuthState = {
    Unknown: 'UNKNOWN',
    Authenticated: 'AUTHENTICATED',
    Unauthenticated: 'UNAUTHENTICATED',
  };

export const checkAuth = () => {
    const token = localStorage.getItem('authToken');
    return token ? AuthState.Authenticated : AuthState.Unauthenticated;
};