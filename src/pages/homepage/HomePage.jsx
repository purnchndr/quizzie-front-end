import { Link } from 'react-router-dom';
import style from './HomePage.module.css';

function HomePage() {
  const token = localStorage.getItem('auth-token');

  return (
    <div className={style.homePage}>
      <div className={style.mainBox}>
        <div className={style.header}>
          <p>Welocme to</p>
          <h1>Quizzie</h1>
        </div>
        {token ? (
          <div className={style.body}>
            <p>
              A free, simple and powerfull tool to built, analyse and share
              Quizes.
            </p>
            <span> Go to Dashboard...</span>
            <div className={style.buttons}>
              <Link to='/dashboard'>
                <button>Dashboard</button>
              </Link>
            </div>
          </div>
        ) : (
          <div className={style.body}>
            <p>
              A free, simple and powerfull tool to built, analyse and share
              Quizes.
            </p>
            <span> Get Started...</span>
            <div className={style.buttons}>
              <Link to='/register'>
                <button>Register</button>
              </Link>
              <Link to='/register'>
                <button>Login</button>
              </Link>
            </div>
          </div>
        )}
        <div className={style.footer}>
          <p>
            This app is build by{' '}
            <a href='https://linkedin.com/in/purnchndr' target='_blank'>
              Purnachandra
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
