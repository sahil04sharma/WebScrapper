import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const { register, loading } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await register(form.name, form.email, form.password);
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="auth-card">
      <h2>Create account</h2>
      <form onSubmit={onSubmit} className="auth-form">
        <label>
          Name
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
        </label>
        <label>
          Email
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
            minLength={6}
          />
        </label>
        {error && <p className="error">{error}</p>}
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Creating…' : 'Register'}
        </button>
      </form>
      <p className="auth-alt">
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
};

export default Register;
