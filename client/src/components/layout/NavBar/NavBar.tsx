import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthModal from "../../auth/AuthModal";
import PostModal from "../../../pages/posts/form/PostModal";
import { toast } from "react-toastify";
import { createPost } from "../../../services/postService";
import { PostForm } from "../../../types/Post";
import { useAuth } from "../../../providers/AuthProvider";

export default function Navbar() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showPostModal, setShowPostModal] = useState(false);
  const [form, setForm] = useState<PostForm & { id: number | null }>({
    title: "",
    content: "",
    id: null,
  });
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();
  const { user, isLoggedIn, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
    toast.success("Logout successful.");
  };

  const handlePostCreated = () => {
    setShowPostModal(false);
    setForm({ title: "", content: "", id: null });
    toast.success("Post created successfully.");
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4">
        <Link className="navbar-brand" to="/">
          BlogApp
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          onClick={() => setIsCollapsed(!isCollapsed)}
          aria-controls="navbarNav"
          aria-expanded={isCollapsed}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div
          className={`collapse navbar-collapse ${isCollapsed ? "show" : ""}`}
          id="navbarNav"
        >
          <div className="d-flex flex-column flex-lg-row w-100 justify-content-between align-items-start align-items-lg-center gap-3 mt-3 mt-lg-0">
            <div className="d-flex gap-3 align-items-center">
              {isLoggedIn && (
                <ul className="navbar-nav me-auto">
                  <li className="nav-item">
                    <Link className="nav-link" to="/myposts">
                      My posts
                    </Link>
                  </li>
                </ul>
              )}
            </div>

            <div className="d-flex align-items-center gap-3">
              {isLoggedIn ? (
                <>
                  <span className="text-white">Welcome, {user?.username}</span>
                  <button
                    className="btn btn-outline-light"
                    onClick={() => {
                      handleLogout();
                      setIsCollapsed(false);
                    }}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <button
                  className="btn btn-outline-primary"
                  onClick={() => {
                    setShowAuthModal(true);
                    setIsCollapsed(false);
                  }}
                >
                  Login
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      <AuthModal show={showAuthModal} onClose={() => setShowAuthModal(false)} />
      <PostModal
        show={showPostModal}
        onClose={() => {
          setShowPostModal(false);
          setForm({ title: "", content: "", id: null });
        }}
        form={form}
        setForm={setForm}
        onSubmit={async (data) => {
          try {
            await createPost(data);
            handlePostCreated();
          } catch (e: any) {
            toast.error(e.message || "Error");
          }
        }}
      />
    </>
  );
}
