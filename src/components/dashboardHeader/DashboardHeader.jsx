import { NavLink, useNavigate } from 'react-router-dom';
import style from './DashboardHeader.module.css';

function DashboardHeader() {
  const navigate = useNavigate();

  function logout() {
    //todo update logout
    console.log(logout);
    navigate('/login');
  }
  return (
    <nav className={style.dashboardHeader}>
      <div className={style.logoBox}>
        <h1 className={style.logo}>Quizzie</h1>
      </div>
      <div className={style.navlinks}>
        <NavLink to='/dashboard'>DashBoard</NavLink>
        <NavLink to='/analytics'>Analytics</NavLink>
        <NavLink to='/createquize'>Create Quiz</NavLink>
      </div>
      <div className={style.logoutBox}>
        <hr />
        <button onClick={logout}>Logout</button>
      </div>
    </nav>
  );
}

export default DashboardHeader;
