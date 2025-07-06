import { useEffect, useState } from "react";
import {
  createPost,
  getAllPosts,
  getMyPosts,
} from "../../../services/postService";
import { Post, PostForm } from "../../../types/Post";
import { useNavigate } from "react-router-dom";
import "./ListPosts.css";
import PostCard from "../item/PostCard";
import { toast } from "react-toastify";
import PostModal from "../form/PostModal";
import AuthModal from "../../../components/auth/AuthModal";

export default function ListPosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [showPostModal, setShowPostModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [likes, setLikes] = useState<{ [postId: number]: number }>({});
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState(query);
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [user, setUser] = useState<{ id: number; username: string } | null>(
    null
  );
  const [form, setForm] = useState<PostForm & { id: number | null }>({
    title: "",
    content: "",
    id: null,
  });
  const loadPosts = () => {
    getAllPosts().then((data) => {
      setPosts(data);
      setLoading(false);
    });
  };

  const isLoggedIn = !!localStorage.getItem("token");
  const handlePostCreated = () => {
    setShowPostModal(false);
    setForm({ title: "", content: "", id: null });
    toast.success("Post created successfully.");
    loadPosts();
  };

  useEffect(() => {
    getAllPosts()
      .then((data) => {
        setPosts(data);
        const initialLikes = data.reduce((acc: any, post: Post) => {
          acc[post.id] = 0;
          return acc;
        }, {});
        setLikes(initialLikes);
      })
      .catch((err) => {
        setError(err.message || "Erreur inconnue");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedQuery(query);
    }, 400);
    return () => clearTimeout(timeout);
  }, [query]);

  useEffect(() => {
    setLoading(true);
    getAllPosts(debouncedQuery)
      .then((data) => {
        setPosts(data);
        const initialLikes = data.reduce((acc: any, post: Post) => {
          acc[post.id] = 0;
          return acc;
        }, {});
        setLikes(initialLikes);
      })
      .catch((err) => {
        setError(err.message || "Erreur inconnue");
      })
      .finally(() => setLoading(false));
  }, [debouncedQuery]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const handleLike = (postId: number) => {
    setLikes((prev) => ({
      ...prev,
      [postId]: prev[postId] + 1,
    }));
  };

  const handleNavigateToDetail = (postId: number) => {
    navigate(`/posts/${postId}`);
  };

  return (
    <div className="container py-5">
      <h2 className="text-center mb-4 display-5">📰 All posts</h2>

      {/* research */}
      <div className="mb-4 d-flex">
        <input
          type="text"
          className="form-control"
          placeholder="🔍 Rechercher un post (titre, contenu ou auteur)..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          className="btn btn-outline-success ms-2"
          onClick={() => {
            if (isLoggedIn) {
              setShowPostModal(true);
            } else {
              toast.info("You must be logged in to create a post.");
              setShowAuthModal(true);
            }
          }}
        >
          New Post
        </button>
        <AuthModal
          show={showAuthModal}
          onClose={() => setShowAuthModal(false)}
        />
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
      </div>

      {loading ? (
        <div className="text-center text-secondary">Loading...</div>
      ) : error ? (
        <div className="alert alert-warning text-center">{error}</div>
      ) : posts.length === 0 ? (
        <div className="text-center text-muted">
          Aucun résultat pour « {query} »
        </div>
      ) : (
        <div className="row g-4">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onClick={() => handleNavigateToDetail(post.id)}
              onLike={() => handleLike(post.id)}
              likes={likes[post.id] || 0}
              showActions={user?.id === post.author.id}
              onSuccess={loadPosts}
            />
          ))}
        </div>
      )}
    </div>
  );
}
