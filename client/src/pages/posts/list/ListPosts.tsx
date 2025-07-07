import { useEffect, useState } from "react";
import { createPost, getAllPosts } from "../../../services/postService";
import { Post } from "../../../types/Post";
import { useNavigate } from "react-router-dom";
import PostCard from "../item/PostCard";
import { toast } from "react-toastify";
import PostModal from "../form/PostModal";
import AuthModal from "../../../components/auth/AuthModal";
import { useAuth } from "../../../providers/AuthProvider";

const POSTS_PER_PAGE = 5;

export default function ListPosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState(query);
  const [loading, setLoading] = useState(true);
  const [showPostModal, setShowPostModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedQuery(query), 400);
    return () => clearTimeout(timeout);
  }, [query]);

  const loadPosts = () => {
    setLoading(true);
    getAllPosts(debouncedQuery, page, POSTS_PER_PAGE)
      .then(({ data, total }) => {
        setPosts(data);
        setTotal(total);
      })
      .catch((e) => toast.error(e.message || "Erreur inconnue"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    setPage(1);
  }, [debouncedQuery]);

  useEffect(() => {
    loadPosts();
  }, [debouncedQuery, page]);

  const totalPages = Math.ceil(total / POSTS_PER_PAGE);

  return (
    <div className="container py-5">
      <h2 className="text-center mb-4 display-5">📰 All posts</h2>

      <div className="mb-4 d-flex">
        <input
          type="text"
          className="form-control"
          placeholder="🔍 Rechercher un post..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          className="btn btn-outline-success ms-2"
          onClick={() => {
            if (localStorage.getItem("token")) setShowPostModal(true);
            else {
              toast.info("You must be logged in to create a post.");
              setShowAuthModal(true);
            }
          }}
        >
          New Post
        </button>
      </div>

      <AuthModal show={showAuthModal} onClose={() => setShowAuthModal(false)} />
      <PostModal
        show={showPostModal}
        onClose={() => setShowPostModal(false)}
        form={{ title: "", content: "", id: null }}
        setForm={() => {}}
        onSubmit={async (data) => {
          try {
            await createPost(data);
            toast.success("Post created successfully");
            setShowPostModal(false);
            loadPosts();
          } catch (e: any) {
            toast.error(e.message || "Error");
          }
        }}
      />

      {loading ? (
        <div className="text-center text-secondary">Loading...</div>
      ) : !posts || posts.length === 0 ? (
        <div className="text-center text-muted">
          Aucun résultat pour « {query} »
        </div>
      ) : (
        <>
          <div className="row g-4">
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onClick={() => navigate(`/posts/${post.id}`)}
                showActions={user?.id === post.author.id}
                onSuccess={loadPosts}
              />
            ))}
          </div>

          {/* Pagination */}
          <nav
            className="d-flex justify-content-center mt-4"
            aria-label="Page navigation"
          >
            <ul className="pagination">
              <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
                <button
                  className="page-link"
                  onClick={() => setPage((p) => p - 1)}
                >
                  &laquo; Prev
                </button>
              </li>
              {Array.from({ length: totalPages }, (_, i) => (
                <li
                  key={i}
                  className={`page-item ${page === i + 1 ? "active" : ""}`}
                >
                  <button className="page-link" onClick={() => setPage(i + 1)}>
                    {i + 1}
                  </button>
                </li>
              ))}
              <li
                className={`page-item ${page === totalPages ? "disabled" : ""}`}
              >
                <button
                  className="page-link"
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next &raquo;
                </button>
              </li>
            </ul>
          </nav>
        </>
      )}
    </div>
  );
}
