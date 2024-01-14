import './header.css'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux';
import DefaultProfilePic from '../../images/noPic.png'
import { resetState } from '../../pages/userSlice';

export default function Header() {
  const dispatch = useDispatch();
  const {user} = useSelector((state) => state.user);

  let navigate = useNavigate();

  // get the base64 image
  let base64String = user.profilePicture.split(",");

  // function to handle logout
  function handleLogout() {
    // remove the user from the local storage
    localStorage.removeItem("user");

    // reset the state
    dispatch(resetState());

    navigate("/register");
  }

  return(
    <div className="headerContainer">
      <div className="headerLeft">
        <Link to="/" style={{textDecoration:"none"}}>
          <span style={{color:"whitesmoke"}}>Chronicle</span>
        </Link>
      </div>
      <div className="headerRight">
        <Link to={`/profile/${user.username}`}>
          <img className="profileImg" src={user.profilePicture ? `data:image/jpeg;base64,${base64String[1]}` : DefaultProfilePic} alt="Profile Icon"/>
        </Link>
        <button className="headerLogoutButton" onClick={handleLogout}>Logout</button>
      </div>
    </div>
  )
  
}
