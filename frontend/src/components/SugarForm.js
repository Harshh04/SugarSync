import { useState } from "react";
import { useSugarContext } from "../hooks/useSugarContext";
import { useAuthContext } from "../hooks/useAuthContext";
import HbA1cAndGraph from "./GetA1c";

const SugarForm = () => {
  const { dispatch } = useSugarContext();

  const [sugarlvl, setSugarlvl] = useState("");
  const [meal, setMeal] = useState("");
  const [notes, setNotes] = useState("");

  const [error, setError] = useState(null);
  const [emptyFields, setEmptyFields] = useState([]);

  const { user } = useAuthContext();
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setError("You must be logged in");
      return;
    }

    const newSugar = { sugarlvl, meal, notes };

    const response = await fetch("/api/sugars", {
      method: "POST",
      body: JSON.stringify(newSugar),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      setError(data.error);
      setEmptyFields(data.emptyFields);
    }

    if (response.ok) {
      setSugarlvl("");
      setMeal("");
      setNotes("");
      setError(null);
      setEmptyFields([]);
      console.log("new sugar log added:", data);
      dispatch({ type: "CREATE_SUGAR", payload: data });
    }

    window.location.reload();
  };

  return (
    <div>
      <form className="create" onSubmit={handleSubmit}>
        <h3>Add a New Sugar Log</h3>
        <label>Sugar Level</label>
        <input
          type="number"
          value={sugarlvl}
          onChange={(e) => setSugarlvl(e.target.value)}
          className={`${emptyFields.includes("sugarlvl") ? "error" : ""}`}
        />
        <label>Meal</label>
        <input
          type="text"
          value={meal}
          onChange={(e) => setMeal(e.target.value)}
          className={`${emptyFields.includes("meal") ? "error" : ""}`}
        />
        <label>Notes</label>
        <input
          type="text"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
        <div>
          <button>Submit</button>
        </div>

        {error && <div className="error">{error}</div>}
      </form>
      <HbA1cAndGraph />
    </div>
  );
};

export default SugarForm;
