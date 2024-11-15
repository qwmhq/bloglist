import { useState } from 'react';
import loginService from '../services/login.js';

const LoginForm = ({ onSuccess, onFailure }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await loginService.login(username, password);
      onSuccess(response);
      setUsername('');
      setPassword('');
    } catch (error) {
      onFailure(error.response.data.error);
    }
  };

  return (
    <div>
      <h2>log in to application</h2>
      <form onSubmit={onSubmit}>
        <div>username: <input type='text' value={username} onChange={e => setUsername(e.target.value)} /></div>
        <div>password: <input type='password' value={password} onChange={e => setPassword(e.target.value)} /></div>
        <button type='submit'>submit</button>
      </form>
    </div>
  );
};

export default LoginForm;
