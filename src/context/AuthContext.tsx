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
      // Prevent double processing in React Strict Mode
      if (sessionStorage.getItem('auth_callback_processing')) {
        return;
      }
      sessionStorage.setItem('auth_callback_processing', 'true');

      try {
        const user = await userManager.signinRedirectCallback();
        setUser(user);
        sessionStorage.removeItem('auth_callback_processing');

        // Provision user in Divergent Flow database
        try {
          const apiUrl = import.meta.env.VITE_API_URL;
          const response = await fetch(`${apiUrl}/api/user/provision-oidc`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${user.access_token}`,
            },
            body: JSON.stringify({
              sub: user.profile.sub,
              email: user.profile.email,
              email_verified: user.profile.email_verified,
              preferred_username: user.profile.preferred_username,
              name: user.profile.name,
              given_name: user.profile.given_name,
              family_name: user.profile.family_name,
            }),
          });

          if (!response.ok) {
            console.error('Failed to provision user:', await response.text());
          } else {
            const provisionedUser = await response.json();
            console.log('User provisioned:', provisionedUser);
            // Store the Divergent Flow user ID for use in captures
            sessionStorage.setItem('df_user_id', provisionedUser.id);
          }
        } catch (provisionError) {
          console.error('Error provisioning user:', provisionError);
          // Don't block login if provisioning fails
        }

        window.history.replaceState({}, document.title, '/');
      } catch (error) {
        console.error('Signin callback error:', error);
        sessionStorage.removeItem('auth_callback_processing');
        
        // If state already consumed (e.g., from hot-reload), check if user is already logged in
        const existingUser = await userManager.getUser();
        if (existingUser && !existingUser.expired) {
          setUser(existingUser);
          window.history.replaceState({}, document.title, '/');
        }
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
    userManager.signinRedirect();
  };

  const logout = () => {
    userManager.signoutRedirect();
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};