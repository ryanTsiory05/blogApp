import React from 'react';
import { Post } from '../../../types/Post';

type Props = {
  post: Post;
  onClick?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onLike?: () => void;
  likes?: number;
  showActions?: boolean;
};

export default function PostCard({
  post,
  onClick,
  onEdit,
  onDelete,
  onLike,
  likes = 0,
  showActions = false
}: Props) {
  return (
    <div className="card shadow-sm border-0 rounded-3 p-3" style={{ cursor: onClick ? 'pointer' : 'default' }} onClick={onClick}>
      <div className="card-body">
        <h3 className="card-title text-primary text-truncate">{post.title}</h3>
        <p className="text-muted mb-2">
          by <span className="fw-semibold">{post.author.username}</span> —{' '}
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
            <button className="btn btn-outline-primary btn-sm" onClick={(e) => { e.stopPropagation(); onEdit?.(); }}>✏️ Modify</button>
            <button className="btn btn-outline-danger btn-sm" onClick={(e) => { e.stopPropagation(); onDelete?.(); }}>🗑️ Delete</button>
          </div>
        )}
      </div>
    </div>
  );
}
