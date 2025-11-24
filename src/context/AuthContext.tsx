import React, { createContext, useEffect, useState } from 'react';
import { User, UserManager, WebStorageStateStore } from 'oidc-client-ts';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export { AuthContext };

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userManager] = useState(() => new UserManager({
    authority: import.meta.env.VITE_OIDC_ISSUER_URL,
    client_id: import.meta.env.VITE_OIDC_CLIENT_ID,
    redirect_uri: import.meta.env.VITE_OIDC_REDIRECT_URI,
    post_logout_redirect_uri: import.meta.env.VITE_OIDC_POST_LOGOUT_REDIRECT_URI,
    scope: import.meta.env.VITE_OIDC_SCOPES,
    response_type: 'code',
    userStore: new WebStorageStateStore({ store: window.localStorage }),
  }));

  useEffect(() => {
    const checkUser = async () => {
      try {
        const currentUser = await userManager.getUser();
        setUser(currentUser);
      } catch (error) {
        console.error('Error getting user:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkUser();

    // Handle signin redirect callback
    const handleSigninCallback = async () => {
      try {
        const user = await userManager.signinRedirectCallback();
        setUser(user);
        window.history.replaceState({}, document.title, window.location.pathname);
      } catch (error) {
        console.error('Signin callback error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (window.location.pathname === '/auth/callback') {
      handleSigninCallback();
    }
  }, [userManager]);

  const login = () => {
    console.log('login() called, initiating signinRedirect...');
    console.log('UserManager config:', {
      authority: import.meta.env.VITE_OIDC_ISSUER_URL,
      client_id: import.meta.env.VITE_OIDC_CLIENT_ID,
      redirect_uri: import.meta.env.VITE_OIDC_REDIRECT_URI,
    });
    userManager.signinRedirect().catch((error) => {
      console.error('signinRedirect error:', error);
    });
  };

  const logout = () => {
    console.log('logout() called, initiating signoutRedirect...');
    userManager.signoutRedirect();
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};