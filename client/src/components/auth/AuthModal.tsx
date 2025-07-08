import { useState } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

type AuthModalProps = {
  show: boolean;
  onClose: () => void;
};

export default function AuthModal({ show, onClose }: AuthModalProps) {
  const [isLoginMode, setIsLoginMode] = useState(true);

  if (!show) return null;

  return (
    <div
      className="modal show fade d-block"
      tabIndex={-1}
      role="dialog"
      onClick={onClose}
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div
        className="modal-dialog modal-dialog-centered"
        role="document"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              {isLoginMode ? "Log in" : "Register"}
            </h5>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={onClose}
            ></button>
          </div>

          <div className="modal-body">
            {isLoginMode ? (
              <LoginForm onSuccess={onClose} />
            ) : (
              <RegisterForm onSuccess={onClose} />
            )}
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-link"
              onClick={() => setIsLoginMode(!isLoginMode)}
            >
              {isLoginMode ? "Create an account" : "Already registered?"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
