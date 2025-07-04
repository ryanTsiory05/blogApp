import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Post } from '../../types/Post';
import { getAllPosts } from '../../services/postService';

type Comment = {
  username: string;
  text: string;
};

export default function PostDetail() {
  const { id } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([
    { username: 'Alice', text: 'Super article !' },
    { username: 'Bob', text: 'Très bien expliqué.' },
    { username: 'Charlie', text: 'J’aimerais voir un exemple plus concret.' },
  ]);
  const [newCommentText, setNewCommentText] = useState('');
  const [newUsername, setNewUsername] = useState('');

  useEffect(() => {
    getAllPosts().then((posts) => {
      const found = posts.find((p) => p.id === Number(id));
      setPost(found || null);
    });
  }, [id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCommentText.trim() === '' || newUsername.trim() === '') return;

    setComments((prev) => [
      ...prev,
      { username: newUsername.trim(), text: newCommentText.trim() },
    ]);
    setNewCommentText('');
    setNewUsername('');
  };

  if (!post) return <div className="container py-5">Loading...</div>;

  return (
    <div className="container py-5">
      <h2 className="text-primary">{post.title}</h2>
      <p className="text-muted">
        by <strong>{post.author.username}</strong> — {new Date(post.updated_at).toLocaleDateString()}
      </p>
      <p className="card-text fs-5 py-3">{post.content}</p>

      <hr />

      <h6>Comments ({comments.length})</h6>
      <ul className="list-group mb-4">
        {comments.map((c, i) => (
          <li key={i} className="list-group-item">
            <strong>{c.username}</strong><br /> {c.text}
          </li>
        ))}
      </ul>

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="commentInput" className="form-label">
            Add a comment
          </label>
          <input
            type="text"
            id="commentInput"
            className="form-control"
            value={newCommentText}
            onChange={(e) => setNewCommentText(e.target.value)}
            placeholder="Your comment..."
            required
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Send
        </button>
      </form>
    </div>
  );
}
