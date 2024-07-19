import { createContext, useReducer, useEffect } from "react";

export const SugarContext = createContext();

export const sugarReducer = (state, action) => {
  switch (action.type) {
    case "SET_SUGARS":
      return {
        sugars: action.payload,
      };

    case "CREATE_SUGAR":
      return {
        sugars: [action.payload, ...state.sugars],
      };

    case "DELETE_SUGAR":
      return {
        sugars: state.sugars.filter(
          (sugar) => sugar._id !== action.payload._id
        ),
      };
    default:
      return state;
  }
};

export const SugarContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(sugarReducer, {
    sugars: null,
  });

  useEffect(() => {
    dispatch({ type: "SET_SUGARS", payload: [{}, {}] });
  }, []);

  return (
    <SugarContext.Provider value={{ ...state, dispatch }}>
      {children}
    </SugarContext.Provider>
  );
};
