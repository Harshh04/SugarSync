import { useSugarContext } from "../hooks/useSugarContext";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import { useAuthContext } from "../hooks/useAuthContext";

const SugarDetails = ({ sugar }) => {
  const { dispatch } = useSugarContext();
  const { user } = useAuthContext();

  const handleClick = async () => {
    if (!user) {
      return;
    }

    const response = await fetch(`/api/sugars/${sugar._id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });
    const data = await response.json();

    if (!response.ok) {
      console.log(data.error);
    }
    if (response.ok) {
      dispatch({ type: "DELETE_SUGAR", payload: data });
    }
  };
  const date = sugar.time ? new Date(sugar.time) : new Date();
  const timeAgo = sugar.time
    ? formatDistanceToNow(date) + " ago"
    : "Unknown time";

  // Format the date and time
  const dateTime = sugar.time
    ? `${new Date(sugar.time).toLocaleDateString("en-GB")} at ${new Date(
        sugar.time
      ).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
    : "Unknown date and time";

  return (
    <div className="workout-details">
      <h4>Sugar Level : {sugar.sugarlvl}</h4>
      <p>Meal : {sugar.meal}</p>
      <p>Notes : {sugar.notes}</p>
      <p>Time and Date: {timeAgo}</p>
      <p>{dateTime}</p>
      <span>
        <DeleteIcon onClick={handleClick} />
      </span>
    </div>
  );
};
export default SugarDetails;
