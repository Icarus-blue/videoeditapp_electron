/** @jsxImportSource @emotion/react */
import React, { useState } from 'react';
import { css } from '@emotion/react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {api} from '../../apis'

const Signup: React.FC= () => {
  const [fullName,setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async  (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setError('');
    setIsLoading(true);
    try {
      const res = await api.signup(fullName, email, password);
      if(res){
        toast.success('Login successful!', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        // Navigate to the dashboard or home page after a short delay
        setTimeout(() => {
          navigate('/login'); // Adjust this path as needed
        }, 1500);
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
        toast.error(err.message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } else {
        setError('An unexpected error occurred');
        toast.error('An unexpected error occurred', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const styles = {
    container: css`
      max-width: 300px;
      margin: 100px auto;
      padding: 20px;
      border: 1px solid #ccc;
      border-radius: 5px;
    `,
    title: css`
      text-align: center;
      margin-bottom: 20px;
      font-family:Times New Roman;
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
      border: 1px solid #ccc;
      border-radius: 3px;
      font-family: 'Times New Roman';   
    `,
    passwordContainer: css`
      position: relative;
      display: flex;
      align-items: center;
    `,
    passwordInput: css`
      width: 100%;
      padding: 8px;
      border: 1px solid #ccc;
      border-radius: 3px;
      font-family: 'Times New Roman';
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
    error: css`
      color: red;
      margin-bottom: 10px;
      font-family:Times New Roman;
    `,
    button: css`
      padding: 10px;
      background-color: #28a745;
      color: white;
      border: none;
      border-radius: 3px;
      cursor: pointer;
      font-family:Times New Roman;
      &:hover {
        background-color: #218838;
      }
    `,
    loginText: css`
      text-align: center;
      margin-top: 15px;
      font-family:Times New Roman;
    `,
    loginLink: css`
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
      <ToastContainer />
      <h2 css={styles.title}>Sign Up</h2>
      <form onSubmit={handleSubmit} css={styles.form}>
          <div css={styles.inputGroup}>
            <label htmlFor="fullName" css={{fontFamily:'Times New Roman'}}>Full Name:
              <input
                type="text"
                id="fullName"
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value);
                  setError('');
                }}
                css={styles.input}
              />
            </label>
          </div>
        <div css={styles.inputGroup}>
          <label htmlFor="email" css={{fontFamily:'Times New Roman'}}>Email:
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
          </label>
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
              css={styles.passwordInput}
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
        <div css={styles.inputGroup}>
          <label htmlFor="confirmPassword" css={{fontFamily:'Times New Roman'}}>Confirm Password:</label>
          <div css={styles.passwordContainer}>
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setError('');
              } }
              css={styles.passwordInput}
            />
            <button 
              type="button" 
              onClick={toggleConfirmPasswordVisibility}
              css={styles.eyeButton}
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>
        {error && <p css={styles.error}>{error}</p>}
        <button type="submit" css={styles.button}  disabled={isLoading}>
          {isLoading ? 'Signing up...' : 'Sign Up'}
        </button>
      </form>
      <p css={styles.loginText}>
        Already have an account? <a href="#"  css={styles.loginLink}>Log in</a>
      </p>
    </div>
  );
};

export default Signup;