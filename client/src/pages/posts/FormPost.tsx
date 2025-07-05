import React from 'react';
import { PostForm } from '../../types/Post';

type Props = {
  form: PostForm;
  onChange: (form: PostForm) => void;
  onSubmit: (e: React.FormEvent) => void;
  isEdit?: boolean;
  onCancel?: () => void;
};

export default function PostFormComponent({ form, onChange, onSubmit, isEdit = false, onCancel }: Props) {
  return (
    <form onSubmit={onSubmit} className="p-4 shadow-sm mb-4">
      <div className="mb-3">
        <label htmlFor="title" className="form-label">Title</label>
        <input
          id="title"
          value={form.title}
          onChange={(e) => onChange({ ...form, title: e.target.value })}
          className="form-control"
          placeholder="Post title"
          required
        />
      </div>
      <div className="mb-3">
        <label htmlFor="content" className="form-label">Content</label>
        <textarea
          id="content"
          value={form.content}
          onChange={(e) => onChange({ ...form, content: e.target.value })}
          className="form-control"
          rows={5}
          placeholder="Post content"
          required
        />
      </div>
      <div className="d-flex gap-2">
        <button type="submit" className="btn btn-primary">
          {isEdit ? '💾 Save' : '➕ Add new post'}
        </button>
        {isEdit && onCancel && (
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            ❌ Cancel
          </button>
        )}
      </div>
    </form>
  );
}
