import { useState } from "react";
import { useAuthContext } from "./useAuthContext";

export const useLogin = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const { dispatch } = useAuthContext();

  const login = async (email, password) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        //save user to local storage
        localStorage.setItem(
          "user",
          JSON.stringify({ ...data.user, token: data.token })
        );

        //update auth context
        dispatch({
          type: "LOGIN",
          payload: { ...data.user, token: data.token },
        });

        setIsLoading(false);
        setError(null);
      } else {
        setError(data.error);
        setIsLoading(false);
      }
    } catch (error) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return { login, isLoading, error };
};
