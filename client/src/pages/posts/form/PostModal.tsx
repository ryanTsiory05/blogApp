import React from "react";
import { PostForm } from "../../../types/Post";

type PostModalProps = {
  show: boolean;
  onClose: () => void;
  form: PostForm & { id: number | null };
  setForm: React.Dispatch<
    React.SetStateAction<PostForm & { id: number | null }>
  >;
  onSubmit: (data: PostForm) => Promise<void>;
};

export default function PostModal({
  show,
  onClose,
  form,
  setForm,
  onSubmit,
}: PostModalProps) {
  if (!show) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({ title: form.title, content: form.content });
  };

  return (
    <div
      className="modal show fade show d-block"
      tabIndex={-1}
      role="dialog"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      onClick={onClose}
    >
      <div
        className="modal-dialog modal-lg"
        role="document"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-content">
          <form onSubmit={handleSubmit}>
            <div className="modal-header">
              <h5 className="modal-title">
                {form.id ? "✏️ Edit Post" : "➕ New Post"}
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={onClose}
              ></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label htmlFor="title" className="form-label">
                  Title
                </label>
                <input
                  id="title"
                  name="title"
                  className="form-control"
                  placeholder="Post title"
                  value={form.title}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, title: e.target.value }))
                  }
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="content" className="form-label">
                  Content
                </label>
                <textarea
                  id="content"
                  name="content"
                  className="form-control"
                  placeholder="Post content"
                  rows={6}
                  value={form.content}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, content: e.target.value }))
                  }
                  required
                />
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-success">
                {form.id ? "Update" : "Add"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
