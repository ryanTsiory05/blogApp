import { useEffect, useState } from 'react';
import { createPost, updatePost, deletePost, getMyPosts } from '../../../services/postService';
import { Post, PostForm } from '../../../types/Post';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import PostCard from '../item/PostCard';
import PostModal from '../form/PostModal';

export default function MyPosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<PostForm & { id: number | null }>({ title: '', content: '', id: null });
  const [postToDelete, setPostToDelete] = useState<Post | null>(null);
  const [showPostModal, setShowPostModal] = useState(false);
  const navigate = useNavigate();

  const loadPosts = () => {
    getMyPosts().then(data => {
      setPosts(data);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const handleOpenModal = (post?: Post) => {
    if (post) {
      setForm({ id: post.id, title: post.title, content: post.content });
    } else {
      setForm({ id: null, title: '', content: '' });
    }
    setShowPostModal(true);
  };

  const handleSubmit = async () => {
    if (form.id) {
      await updatePost(form.id, { title: form.title, content: form.content });
      toast.success('Post updated.');
    } else {
      await createPost({ title: form.title, content: form.content });
      toast.success('New post added.');
    }
    setShowPostModal(false);
    setForm({ title: '', content: '', id: null });
    loadPosts();
  };

  const confirmDelete = async () => {
    if (postToDelete) {
      await deletePost(postToDelete.id);
      toast.success('Post deleted.');
      setPostToDelete(null);
      loadPosts();
    }
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>📝 My posts</h2>
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
                onEdit={() => handleOpenModal(post)}
                onDelete={() => setPostToDelete(post)}
                showActions
              />
            </div>
          ))}
        </div>
      )}

      {/* ✅ Modal pour créer ou modifier un post */}
      <PostModal
        show={showPostModal}
        onClose={() => setShowPostModal(false)}
        form={form}
        setForm={setForm}
        onSubmit={handleSubmit}
      />

      {/* Modal de confirmation suppression */}
      {postToDelete && (
        <div className="modal fade show d-block" tabIndex={-1} role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirmation</h5>
                <button type="button" className="btn-close" onClick={() => setPostToDelete(null)}></button>
              </div>
              <div className="modal-body">
                <p>Supprimer le post <strong>« {postToDelete.title} »</strong> ?</p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setPostToDelete(null)}>Annuler</button>
                <button className="btn btn-danger" onClick={confirmDelete}>🗑️ Supprimer</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
