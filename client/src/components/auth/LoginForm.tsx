import { useState } from "react";
import { login } from "../../services/authService";
import { useAuth } from "../../providers/AuthProvider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

type LoginFormProps = {
  onSuccess: () => void;
};

export default function LoginForm({ onSuccess }: LoginFormProps) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const { login: contextLogin } = useAuth();
const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (!form.email || !form.password) {
      return "All fields are required.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      return "Invalid email format.";
    }

    if (form.password.length < 6) {
      return "Password must be at least 6 characters.";
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      const { user, token } = await login(form);
      contextLogin(user, token);
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="mb-3">
        <label htmlFor="email" className="form-label">
          Email
        </label>
        <input
          type="text"
          name="email"
          id="email"
          className="form-control"
          value={form.email}
          onChange={handleChange}
          required
        />
      </div>

<div className="mb-3 position-relative">
  <label htmlFor="password" className="form-label">
    Password
  </label>
  <input
    type={showPassword ? "text" : "password"}
    name="password"
    id="password"
    className="form-control"
    value={form.password}
    onChange={handleChange}
    required
  />
  <span
    className="position-absolute top-50 end-0 translate-middle-y me-3 mt-3"
    onClick={() => setShowPassword((prev) => !prev)}
    style={{ cursor: "pointer" }}
  >
    <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
  </span>
</div>

      <button type="submit" className="btn btn-primary w-100">
        Log in
      </button>
    </form>
  );
}
