import { useState } from 'react';
import { register } from '../../services/authService';
import { useNavigate } from 'react-router-dom';

type RegisterFormProps = {
  onSuccess: () => void;
};

export default function RegisterForm({ onSuccess }: RegisterFormProps) {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    if (form.password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères");
      return;
    }

    try {
      await register({
        username: form.username,
        email: form.email,
        password: form.password
      });
      onSuccess();
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || "Échec de l’inscription");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="mb-3">
        <label htmlFor="username" className="form-label">Username</label>
        <input
          type="text"
          name="username"
          id="username"
          className="form-control"
          value={form.username}
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-3">
        <label htmlFor="email" className="form-label">Email</label>
        <input
          type="email"
          name="email"
          id="email"
          className="form-control"
          value={form.email}
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-3">
        <label htmlFor="password" className="form-label">Password</label>
        <input
          type="password"
          name="password"
          id="password"
          className="form-control"
          value={form.password}
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-3">
        <label htmlFor="confirmPassword" className="form-label">Confirm password</label>
        <input
          type="password"
          name="confirmPassword"
          id="confirmPassword"
          className="form-control"
          value={form.confirmPassword}
          onChange={handleChange}
          required
        />
      </div>

      <button type="submit" className="btn btn-primary w-100">Sign in</button>
    </form>
  );
}
