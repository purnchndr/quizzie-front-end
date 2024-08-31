import { useEffect, useState } from 'react';
import style from './LoginAndSignUp.module.css';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import Input from '../../components/input/Input';
import Loader from '../../components/loder/Loder';
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';

function LoginAndSignUp({ setAuth }) {
  const location = useLocation();
  // const loginPath = login || true;
  const loginPath = location.pathname === '/login';

  return (
    <div className={style.main}>
      <ToastContainer />
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
          {loginPath ? (
            <Login setAuth={setAuth} />
          ) : (
            <Register setAuth={setAuth} />
          )}
        </div>
      </div>
    </div>
  );
}

function Login({ setAuth }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handelPassword = e => setPassword(e.target.value);
  const handelEmail = e => setEmail(e.target.value);

  async function login(e) {
    try {
      e.preventDefault();
      if (!email) {
        setError('Email is required');
        return toast.error('Email is required');
      }
      if (!password) {
        setError('Password is required');
        return toast.error('Password is required');
      }

      setLoading(true);

      let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://quizzie-back-end-pygi.onrender.com/api/user/login',
        headers: {},
        data: { email, password },
      };
      axios.request(config).then(success).catch(fail);

      function success(res) {
        toast.success('Login Complete');
        const token = res.data.token;
        console.log(token);
        localStorage.setItem('auth-token', token);
        navigate('/dashboard');
        setAuth(token);
      }

      function fail(err) {
        const msg = err.response?.data?.message || err.message;
        toast.error(msg);
        setError(msg);
        setLoading(false);
      }
    } catch (e) {
      setError(e.message);
      setLoading(false);
    }
  }

  return (
    <>
      <form className={style.login} onSubmit={login}>
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
        <button className={style.loginBtn} type='submit'>
          Login
        </button>
      </form>
      {loading && <Loader />}
    </>
  );
}

function Register({ setAuth }) {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handelName = e => setName(e.target.value);
  const handelEmail = e => setEmail(e.target.value);
  const handelPassword = e => setPassword(e.target.value);
  const handelPassword2 = e => setPassword2(e.target.value);

  async function register(e) {
    try {
      e.preventDefault();
      if (!name) {
        setError('Name is required');
        return toast.error('Name is required');
      }
      if (!email) {
        setError('Email is required');
        return toast.error('Email is required');
      }
      if (!password) {
        setError('Password is required');
        return toast.error('Password is required');
      }
      if (!password2) {
        setError('Please Repeat Password');
        return toast.error('Please Repeat Password');
      }
      if (password !== password2) {
        setError('Password did not match');
        return toast.error('Password did not match');
      }

      setLoading(true);

      let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://quizzie-back-end-pygi.onrender.com/api/user/register',
        headers: {},
        data: { name, email, password },
      };
      axios.request(config).then(success).catch(fail);

      function success(res) {
        console.log(res);
        toast.success('Registration Complete');
        const token = res.data.token;
        console.log(token);
        localStorage.setItem('auth-token', token);
        setAuth(token);
        navigate('/dashboard');
      }

      function fail(err) {
        console.log(err);
        const msg = err.response?.data?.message || err.message;
        toast.error(msg);
        setError(msg);
        setLoading(false);
      }
    } catch (e) {
      setError(e.message);
      setLoading(false);
    }
  }

  return (
    <>
      <form className={style.register} onSubmit={register}>
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
        <button className={style.registerBtn} type='submit'>
          Sign UP
        </button>
      </form>
      {loading && <Loader />}
    </>
  );
}

export default LoginAndSignUp;
