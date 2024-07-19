import { SugarContext } from "../context/SugarContext";
import { useContext } from "react";

export const useSugarContext = () => {
  const context = useContext(SugarContext);
  if (!context) {
    throw new Error(
      "useSugarContext must be used within a SugarContextProvider"
    );
  }
  return context;
};
