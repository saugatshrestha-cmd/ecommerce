import { createContext, useContext, useEffect } from "react";
import type { ReactNode } from "react";
import { useAuthUser } from "@/hooks/useAuth";
import type { User } from "@/types/authTypes";
import { toast } from 'sonner';

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const {
    data: user,
    isLoading,
    isError,
    refetch,
  } = useAuthUser();

  const isAuthenticated = !!user && !isError;

  useEffect(() => {
    const interval = setInterval(() => {
      if (isAuthenticated) {
        refetch()
          .then(({ error }) => {
            if (error?.response?.status === 401) {
              toast.error("Your session has expired. Please log in again.");
            }
          })
          .catch((err) => {
            if (err.response?.status === 401) {
              toast.error("Your session has expired. Please log in again.");
            } else {
              console.error("Unexpected error in session check:", err);
            }
          });
      }
    }, 15 * 60 * 1000); 

    return () => clearInterval(interval);
  }, [isAuthenticated, refetch]);

  return (
    <AuthContext.Provider
      value={{
        user: user ?? null,
        isAuthenticated,
        isLoading,
        isError,
        refetch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error("useAuthContext must be used within AuthProvider");
  return context;
};
