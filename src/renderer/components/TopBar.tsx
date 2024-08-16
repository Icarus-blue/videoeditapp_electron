/** @jsxImportSource @emotion/react */
import React from 'react';
import { css } from '@emotion/react';
import { useNavigate , Link} from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { logout } from '../store/authSlice';

const TopBar: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  const styles = {
    topBar: css`
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 20px;
      background-color: white;
      border-bottom: 1px solid #ddd; 
      &:hover {
        background-color: #00C8F2;
      }
    `,
    leftSection: css`
      display: flex;
      align-items: center;
      gap: 20px;
    `,
    logo: css`
      font-size: 1.2em;
      font-weight: bold;
      font-family: 'Times New Roman';
    `,
    navLinks: css`
      display: flex;
      gap: 15px;
    `,
    link: css`
      text-decoration: none;
      color: #333;
      font-family: 'Times New Roman';
      &:hover {
        text-decoration: underline;
      }
    `,
    userInfo: css`
      display: flex;
      align-items: center;
      gap: 10px;
    `,
    logoutButton: css`
      padding: 5px 10px;
      background-color: #007bff;
      color: white;
      border: none;
      border-radius: 3px;
      cursor: pointer;
      font-family: 'Times New Roman';
      &:hover {
        background-color: #0056b3;
      }
    `,
  };

  return (
    <div css={styles.topBar}>
      <div css={styles.leftSection}>
        <div css={styles.logo}>App Logo</div>
        <nav css={styles.navLinks}>
          <Link to="/pricing" css={styles.link}>Pricing</Link>
          <Link to="/about" css={styles.link}>About Us</Link>
        </nav>
      </div>
      <div css={styles.userInfo}>        
        <span css={{fontFamily:'Times New Roman'}}>{user?.email}</span>
        <button type='button' onClick={handleLogout} css={styles.logoutButton}>Logout</button>
      </div>
    </div>
  );
};

export default TopBar;