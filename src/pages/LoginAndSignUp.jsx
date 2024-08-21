import { useState } from 'react';
import style from './LoginAndSignUp.module.css';
import { Link, useLocation } from 'react-router-dom';
import Input from '../components/input/Input';

function LoginAndSignUp() {
  const location = useLocation();
  const loginPath = location.pathname === '/login';

  return (
    <div className={style.main}>
      <div className={style.mainBox}>
        <div className={style.heading}>
          <h1 className={style.headingText}>Quizzie</h1>
          <div className={style.headingButtons}>
            <button className={!loginPath ? 'btn-active' : ''}>
              <Link to='/register'>Sign Up</Link>
            </button>
            <button className={loginPath ? 'btn-active' : ''}>
              <Link to='/login'>Login</Link>
            </button>
          </div>
        </div>
        <div className={style.fields}>
          {loginPath ? <Login /> : <Register />}
        </div>
      </div>
    </div>
  );
}

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handelPassword = e => {
    if (password === 'a') handelError('Password is too sort');
    setPassword(e.target.value);
  };
  const handelError = e => setError(e);
  const handelEmail = e => setEmail(e.target.value);

  return (
    <div className={style.login}>
      <Input
        type='text'
        label='Email'
        placeholder='Enter Email'
        value={email}
        name='email'
        handeler={handelEmail}
      />
      <Input
        type='password'
        label='Password'
        placeholder='Enter Password'
        value={password}
        name='password'
        handeler={handelPassword}
      />
      {error && <p className={style.error}>{error}</p>}
      <button className={style.loginBtn}>Login</button>
    </div>
  );
}

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [error, setError] = useState('');

  const handelName = e => setName(e.target.value);
  const handelEmail = e => setEmail(e.target.value);
  const handelPassword = e => setPassword(e.target.value);
  const handelPassword2 = e => setPassword2(e.target.value);
  return (
    <div className={style.register}>
      <Input
        type='text'
        label='Name'
        placeholder='Yout Full Name'
        value={name}
        name='name'
        handeler={handelName}
      />
      <Input
        type='email'
        label='Email'
        placeholder='Enter Email'
        value={email}
        name='email'
        handeler={handelEmail}
      />
      <Input
        type='password'
        label='Password'
        placeholder='Enter a Strong Password'
        value={password}
        name='password'
        handeler={handelPassword}
      />
      <Input
        type='password'
        label='Confirm Password'
        placeholder='Enter above Password again'
        value={password2}
        name='password2'
        handeler={handelPassword2}
      />
      {error && <p className={style.error}>{error}</p>}
      <button className={style.registerBtn}>Sign UP</button>
    </div>
  );
}

export default LoginAndSignUp;
