import { useAuthContext } from "./useAuthContext";
import { useSugarContext } from "./useSugarContext";

export const useLogout = () => {
  const { dispatch } = useAuthContext();
  const { dispatch: sugarDispatch } = useSugarContext();
  const logout = () => {
    localStorage.removeItem("user");

    dispatch({ type: "LOGOUT" });

    sugarDispatch({ type: "SET_SUGARS", payload: null }); 
  };

  return { logout };
};
