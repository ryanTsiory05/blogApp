import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthModal from "../../auth/AuthModal";
import PostModal from "../../../pages/posts/form/PostModal";
import { logout } from "../../../services/authService";
import { toast } from "react-toastify";
import { createPost } from "../../../services/postService";
import { PostForm } from "../../../types/Post";

export default function Navbar() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showPostModal, setShowPostModal] = useState(false);
  const [user, setUser] = useState<{ username: string } | null>(null);
  const [form, setForm] = useState<PostForm & { id: number | null }>({
    title: "",
    content: "",
    id: null,
  });
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const handleLogout = () => {
    logout();
    setUser(null);
    navigate("/");
    toast.success("Logout successful.");
  };

  const isLoggedIn = !!localStorage.getItem("token");

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
              <button
                className="btn btn-outline-success"
                onClick={() => {
                  if (isLoggedIn) {
                    setShowPostModal(true);
                  } else {
                    toast.info("Vous devez être connecté pour créer un post.");
                    setShowAuthModal(true);
                  }
                  setIsCollapsed(false);
                }}
              >
                New Post
              </button>
            </div>

            <div className="d-flex align-items-center gap-3">
              {isLoggedIn && user ? (
                <>
                  <span className="text-white">Welcome, {user.username}</span>
                  <button
                    className="btn btn-outline-light "
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

      {/* Modals */}
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
            toast.error(e.message || "Erreur lors de la création du post");
          }
        }}
      />
    </>
  );
}
