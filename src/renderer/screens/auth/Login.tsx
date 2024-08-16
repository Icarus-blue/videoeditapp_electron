/** @jsxImportSource @emotion/react */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { css } from '@emotion/react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import toast, { Toaster } from 'react-hot-toast';
import { login } from '@/renderer/store/authSlice';
import { useAppDispatch } from '../../store/hooks';
import {api} from '../../apis'

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleSubmit =async  (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }
    setIsLoading(true);
    try {
      await api.login(email, password);
      toast.success('Login successful!', {
        duration: 3000,
        position: 'top-right',
      });

      dispatch(login({ email }));      
      navigate('/dashboard'); 
      
    } catch (err) {
      if (err instanceof Error) {        
        toast.error(err.message, {
          duration: 5000,
          position: 'top-right',
        });
      } else {
        toast.error('An unexpected error occurred', {
          duration: 5000,
          position: 'top-right',
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSignUpClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate('/register');
  };

  const styles = {
    container: css`
      max-width: 300px;
      margin: 150px auto;
      padding: 20px;
      border: 1px solid #ccc;
      border-radius: 5px;
    `,
    title: css`
      text-align: center;
      margin-bottom: 20px;
      font-family:Times New Roman
    `,
    form: css`
      display: flex;
      flex-direction: column;
    `,
    inputGroup: css`
      margin-bottom: 15px;
    `,
    input: css`
      width: 100%;
      padding: 8px;
      font-family: 'Times New Roman';
      border: 1px solid #ccc;
      border-radius: 3px;
    `,
    error: css`
      color: red;
      margin-bottom: 10px;
      font-family:Times New Roman
    `,
    button: css`
      padding: 10px;
      background-color: #007bff;
      color: white;
      border: none;
      border-radius: 3px;
      cursor: pointer;
      font-family:Times New Roman;
      &:hover {
        background-color: #0056b3;
      }
    `,
    passwordContainer: css`
      position: relative;
      display: flex;
      align-items: center;
    `,
    eyeButton: css`
      position: absolute;
      right: 10px;
      background: none;
      border: none;
      cursor: pointer;
      font-size: 18px;
      color: #888;
    `,
    signUpText: css`
      text-align: center;
      margin-top: 15px;
      font-family:Times New Roman;
    `,
    signUpLink: css`
      color: #007bff;
      text-decoration: none;
      font-family:Times New Roman;
      &:hover {
        text-decoration: underline;
      }
    `,
  };

  return (
    <div css={styles.container}>
       <Toaster />
      <h2 css={styles.title}>Login</h2>
      <form onSubmit={handleSubmit} css={styles.form}>
        <div css={styles.inputGroup}>
          <label htmlFor="email" css={{fontFamily:'Times New Roman'}}>Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError('');
            }}
            css={styles.input}
          />
        </div>
        <div css={styles.inputGroup}>
          <label htmlFor="password" css={{fontFamily:'Times New Roman'}}>Password:</label>
          <div css={styles.passwordContainer}>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              css={styles.input}
          />
          <button 
              type="button" 
              onClick={togglePasswordVisibility}
              css={styles.eyeButton}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          
        </div>
        {error && <p css={styles.error}>{error}</p>}
        <button type="submit" css={styles.button} disabled={isLoading}>
          {isLoading ? 'Logging in...' : 'Log In'}
        </button>
        <p css={styles.signUpText}>
          Don&apos; t have an account yet? <a href="#" onClick={handleSignUpClick}  css={styles.signUpLink}>Sign up</a>
        </p>
      </form>
    </div>
  );
};

export default Login;