import { Link } from "react-router-dom";
import { useLogout } from "../hooks/userLogout";
import { useAuthContext } from "../hooks/useAuthContext";

const Navbar = () => {
  const { logout } = useLogout();
  const handleClick = () => {
    logout();
  };

  const { user } = useAuthContext();

  return (
    <header className="container">
      <Link to="/">
        <nav>
          <h1>SugarSync</h1>
          <div>
            {user && (
              <>
                <span>{user.name}</span>
                <button onClick={handleClick} className="button">
                  Logout
                </button>
              </>
            )}
            <div>
              {!user && (
                <>
                  <Link to="/login">Login</Link>
                  <Link to="/signup">Signup</Link>
                </>
              )}
            </div>
          </div>
        </nav>
      </Link>
    </header>
  );
};

export default Navbar;
