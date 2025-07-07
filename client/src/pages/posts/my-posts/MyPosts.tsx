import { useEffect, useState } from "react";
import {
  createPost,
  updatePost,
  getMyPosts,
} from "../../../services/postService";
import { Post, PostForm } from "../../../types/Post";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import PostCard from "../item/PostCard";
import PostModal from "../form/PostModal";
import AuthModal from "../../../components/auth/AuthModal";

export default function MyPosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<PostForm & { id: number | null }>({
    title: "",
    content: "",
    id: null,
  });
  const [showPostModal, setShowPostModal] = useState(false);
  const navigate = useNavigate();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [query, setQuery] = useState("");

  const loadPosts = () => {
    getMyPosts().then((data) => {
      setPosts(data);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const handlePostCreated = () => {
    setShowPostModal(false);
    setForm({ title: "", content: "", id: null });
    toast.success("Post created successfully.");
    loadPosts();
  };

  const handleSubmit = async () => {
    if (form.id) {
      await updatePost(form.id, { title: form.title, content: form.content });
      toast.success("Post updated.");
    } else {
      await createPost({ title: form.title, content: form.content });
      toast.success("New post added.");
    }
    setShowPostModal(false);
    setForm({ title: "", content: "", id: null });
    loadPosts();
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>📝 My posts</h2>
      </div>
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
              setShowPostModal(true);
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
      ) : posts.length === 0 ? (
        <div className="text-center text-muted fs-5">Tu n'as rien publié.</div>
      ) : (
        <div className="row row-cols-1 g-4">
          {posts.map((post) => (
            <div key={post.id} className="col">
              <PostCard
                post={post}
                onClick={() => navigate(`/posts/${post.id}`)}
                showActions
                onSuccess={loadPosts}
              />
            </div>
          ))}
        </div>
      )}

      {/*  Modal form */}
      <PostModal
        show={showPostModal}
        onClose={() => setShowPostModal(false)}
        form={form}
        setForm={setForm}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
