import { useEffect } from "react";
import { useSugarContext } from "../hooks/useSugarContext";
import { useAuthContext } from "../hooks/useAuthContext";
import { useState } from "react";

//components
import SugarDetails from "../components/SugarDetails";
import SugarForm from "../components/SugarForm";

const Home = () => {
  const { sugars, dispatch } = useSugarContext();
  const { user } = useAuthContext();

  const [timeframe, setTimeframe] = useState("all"); // 'week', 'month', 'all'

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`/api/sugars?timeframe=${timeframe}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      const data = await response.json();

      if (response.ok) {
        dispatch({ type: "SET_SUGARS", payload: data });
      }
    };

    if (user) {
      fetchData();
    }
  }, [dispatch, user, timeframe]);

  return (
    <div className="home">
      <div className="workouts">
        <div>
          <button className="timeButton" onClick={() => setTimeframe("week")}>
            This Week
          </button>
          <button className="timeButton" onClick={() => setTimeframe("month")}>
            This Month
          </button>
          <button className="timeButton" onClick={() => setTimeframe("all")}>
            All Time
          </button>
        </div>
        {sugars &&
          sugars.map((sugar) => <SugarDetails key={sugar._id} sugar={sugar} />)}
      </div>
      <SugarForm />
    </div>
  );
};

export default Home;
