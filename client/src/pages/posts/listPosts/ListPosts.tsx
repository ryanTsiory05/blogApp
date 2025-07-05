import { useEffect, useState } from 'react';
import { getAllPosts } from '../../../services/postService';
import { Post } from '../../../types/Post';
import { useNavigate } from 'react-router-dom';
import './ListPosts.css';

export default function ListPosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [likes, setLikes] = useState<{ [postId: number]: number }>({});
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const [error, setError] = useState('');

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
        setError(err.message || 'Erreur inconnue');
      })
      .finally(() => {
        setLoading(false);
      });
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

  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(query.toLowerCase()) ||
    post.content.toLowerCase().includes(query.toLowerCase()) ||
    post.author.username.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="container py-5">
      <h2 className="text-center mb-4 display-5">📰 All posts</h2>

      {/* Champ de recherche */}
      <div className="mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="🔍 Rechercher un post (titre, contenu ou auteur)..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="text-center text-secondary">Loading...</div>
      ) : error ? ( 
        <div className="alert alert-warning text-center">
          {error}
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="text-center text-muted">Aucun résultat pour « {query} »</div>
      ) : (
        <div className="row g-4">
          {filteredPosts.map((post) => (
            <div key={post.id} className="col-12 col-md-4">
              <div
                className="card h-100 shadow-sm border-0 rounded-3 p-3"
                style={{ cursor: 'pointer' }}
                onClick={() => handleNavigateToDetail(post.id)}
              >
                <div className="card-body">
                  <h3 className="card-title text-primary text-truncate">{post.title}</h3>
                  <p className="text-muted mb-2">
                    by <span className="fw-semibold">{post.author.username}</span> —{' '}
                    <span>{new Date(post.updated_at).toLocaleDateString()}</span>
                  </p>
                  <p className="line-clamp-4 card-text">{post.content}</p>

                  <button
                    className="btn btn-outline-danger btn-sm mt-3"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLike(post.id);
                    }}
                    style={{ minWidth: '90px' }}
                  >
                    ❤️ Like ({likes[post.id] || 0})
                  </button>

                  <div className="mt-3">
                    <h6 className="text-muted">💬 Comments (3)</h6>
                    <ul className="list-unstyled small">
                      <li>Très intéressant !</li>
                      <li>Merci pour cet article.</li>
                      <li>J’attends la suite !</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
