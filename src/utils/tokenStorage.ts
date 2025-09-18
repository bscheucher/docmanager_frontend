export const tokenStorage = {
  getAccessToken: (): string | null => {
    try {
      return localStorage.getItem('accessToken');
    } catch (error) {
      console.error('Error getting access token:', error);
      return null;
    }
  },
  
  getRefreshToken: (): string | null => {
    try {
      return localStorage.getItem('refreshToken');
    } catch (error) {
      console.error('Error getting refresh token:', error);
      return null;
    }
  },
  
  setTokens: (accessToken: string, refreshToken: string): void => {
    try {
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
    } catch (error) {
      console.error('Error storing tokens:', error);
    }
  },
  
  clearTokens: (): void => {
    try {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    } catch (error) {
      console.error('Error clearing tokens:', error);
    }
  },
  
  hasValidTokens: (): boolean => {
    try {
      const token = localStorage.getItem('accessToken');
      const refreshToken = localStorage.getItem('refreshToken');
      return !!(token && refreshToken);
    } catch (error) {
      console.error('Error checking tokens:', error);
      return false;
    }
  }
};