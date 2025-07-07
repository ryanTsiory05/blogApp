import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Post } from "../../../types/Post";
import { getOnePost } from "../../../services/postService";

export default function PostDetail() {
  const { id } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    getOnePost(Number(id))
      .then((post) => {
        setPost(post);
        setError("");
      })
      .catch((err) => {
        setError(err.message || "Error ");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <div className="text-center text-secondary py-5">Loading...</div>;
  }

  if (error) {
    return <div className="alert alert-warning text-center py-5">{error}</div>;
  }

  if (!post) {
    return <div className="text-center text-muted py-5">Post not found</div>;
  }

  return (
    <div className="container py-5">
      <h2 className="text-primary">{post.title}</h2>
      <p className="text-muted">
        by <strong>{post.author.username}</strong> —{" "}
        {new Date(post.updated_at).toLocaleDateString()}
      </p>
      <p className="card-text fs-5 py-3">{post.content}</p>

      <hr />
    </div>
  );
}
