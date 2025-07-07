import React, { useState } from "react";
import { Post, PostForm } from "../../../types/Post";
import { updatePost, deletePost } from "../../../services/postService";
import { toast } from "react-toastify";
import PostModal from "../form/PostModal";

type Props = {
  post: Post;
  onClick?: () => void;
  onLike?: () => void;
  likes?: number;
  showActions?: boolean;
  onSuccess?: () => void; // pour recharger après update
};

export default function PostCard({
  post,
  onClick,
  onLike,
  likes = 0,
  showActions = false,
  onSuccess,
}: Props) {
  const [postToDelete, setPostToDelete] = useState<Post | null>(null);
  const [showPostModal, setShowPostModal] = useState(false);
  const [form, setForm] = useState({
    title: "",
    content: "",
    id: null as number | null,
  });

  const confirmDelete = async () => {
    try {
      await deletePost(post.id);
      toast.success("Post deleted.");
      setPostToDelete(null);
      onSuccess?.();
    } catch (err: any) {
      toast.error(err.message || "Error deleting post");
    }
  };

  const handleSubmit = async (data: PostForm) => {
    try {
      if (form.id) {
        await updatePost(form.id, data);
        toast.success("Post updated!");
        setShowPostModal(false);
        onSuccess?.();
      }
    } catch (e: any) {
      toast.error(e.message || "An error occurred.");
    }
  };

  return (
    <>
      <div
        className="card shadow-sm border-0 rounded-3 p-3"
        style={{ cursor: onClick ? "pointer" : "default" }}
        onClick={onClick}
      >
        <div className="card-body">
          <h3 className="card-title text-primary text-truncate">
            {post.title}
          </h3>
          <p className="text-muted mb-2">
            by <span className="fw-semibold">{post.author.username}</span> —{" "}
            <span>{new Date(post.updated_at).toLocaleDateString()}</span>
          </p>
          <p className="card-text">{post.content}</p>

          {onLike && (
            <button
              className="btn btn-outline-danger btn-sm mt-3"
              onClick={(e) => {
                e.stopPropagation();
                onLike();
              }}
            >
              ❤️ Like ({likes})
            </button>
          )}

          {showActions && (
            <div className="d-flex justify-content-end gap-2 mt-3">
              <button
                className="btn btn-outline-primary btn-sm"
                onClick={(e) => {
                  e.stopPropagation();
                  setForm({
                    title: post.title,
                    content: post.content,
                    id: post.id,
                  });
                  setShowPostModal(true);
                }}
              >
                ✏️ Modify
              </button>
              <button
                className="btn btn-outline-danger btn-sm"
                onClick={(e) => {
                  e.stopPropagation();
                  setPostToDelete(post);
                }}
              >
                🗑️ Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal de suppression */}
      {postToDelete && (
        <div
          className="modal fade show d-block"
          tabIndex={-1}
          role="dialog"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          onClick={() => setPostToDelete(null)}
        >
          <div
            className="modal-dialog"
            role="document"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirmation</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setPostToDelete(null)}
                ></button>
              </div>
              <div className="modal-body">
                <p>
                  Delete post <strong>« {post.title} »</strong> ?
                </p>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setPostToDelete(null)}
                >
                  Cancel
                </button>
                <button className="btn btn-danger" onClick={confirmDelete}>
                  🗑️ Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PostModal pour modification */}
      <PostModal
        show={showPostModal}
        onClose={() => {
          setShowPostModal(false);
          setForm({ title: "", content: "", id: null });
        }}
        form={form}
        setForm={setForm}
        onSubmit={handleSubmit}
      />
    </>
  );
}
