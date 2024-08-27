import { NavLink } from 'react-router-dom';
import style from './DashboardHeader.module.css';

function DashboardHeader() {
  return (
    <nav className={style.dashboardHeader}>
      <div className={style.logoBox}>
        <h1 className={style.logo}>Quizzie</h1>
      </div>
      <div className={style.navlinks}>
        <NavLink to='/dashboard'>DashBoard</NavLink>
        <NavLink to='/analytics'>Analytics</NavLink>
        <NavLink to='/createquiz'>Create Quiz</NavLink>
      </div>
      <div className={style.logoutBox}>
        <hr />
        <button>Logout</button>
      </div>
    </nav>
  );
}

export default DashboardHeader;
