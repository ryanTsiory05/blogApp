import { useEffect, useState } from 'react';
import { createPost, updatePost, deletePost, getMyPosts } from '../../../services/postService';
import { Post, PostForm } from '../../../types/Post';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function MyPosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<PostForm & { id: number | null }>({ title: '', content: '', id: null });
  const [postToDelete, setPostToDelete] = useState<Post | null>(null);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.id) {
      await updatePost(form.id, { title: form.title, content: form.content });
    } else {
      await createPost({ title: form.title, content: form.content });
    }
    setForm({ title: '', content: '', id: null });
    toast.success('Successfully added.')
    loadPosts();
  };

  const handleEdit = (post: Post) => {
    setForm({ title: post.title, content: post.content, id: post.id });
  };

  const handleCancelEdit = () => {
    setForm({ title: '', content: '', id: null });
  };

  const confirmDelete = async () => {
    if (postToDelete) {
      await deletePost(postToDelete.id);
      setPostToDelete(null);
      loadPosts();
      toast.success('Successful deletion.')
    }
  };

  const handleNavigateToDetail = (postId: number) => {
    navigate(`/posts/${postId}`);
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4">📝 My posts</h2>

      {/* principle form */}
      {form.id === null && (
        <form onSubmit={handleSubmit} className="p-4 shadow-sm mb-5">
          <div className="mb-3">
            <label htmlFor="title" className="form-label">Title</label>
            <input
              id="title"
              name="title"
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              className="form-control"
              placeholder="Post's title"
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="content" className="form-label">Content</label>
            <textarea
              id="content"
              name="content"
              value={form.content}
              onChange={e => setForm({ ...form, content: e.target.value })}
              className="form-control"
              rows={5}
              placeholder="Post's content"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary ">Add new post</button>
        </form>
      )}

      {loading ? (
        <div className="text-center text-secondary">Loading...</div>
      ) : posts.length === 0 ? (
        <div className="text-center text-muted fs-5">Tu n'as rien publié.</div>
      ) : (
        <div className="row row-cols-1 g-4">
          {posts.map((post: Post) => (
            <div key={post.id} className="col">
              <div className="card shadow-sm border-0 rounded-3 p-3">
                <div className="card-body">

                  {/* edit mode */}
                  {form.id === post.id ? (
                    <form onSubmit={handleSubmit}>
                      <label htmlFor="title" className="form-label">Title</label>
                      <input
                        value={form.title}
                        onChange={e => setForm({ ...form, title: e.target.value })}
                        className="form-control mb-2"
                        required
                      />
                      <label htmlFor="content" className="form-label">Content</label>
                      <textarea
                        value={form.content}
                        onChange={e => setForm({ ...form, content: e.target.value })}
                        className="form-control mb-2"
                        rows={10}
                        required
                      />
                      <div className="d-flex gap-2">
                        <button type="submit" className="btn btn-outline-success btn-sm">💾 Save</button>
                        <button type="button" onClick={handleCancelEdit} className="btn btn-outline-secondary btn-sm">❌ Cancel</button>
                      </div>
                    </form>
                  ) : (
                    <>
                      <div style={{ cursor: 'pointer' }} onClick={() => handleNavigateToDetail(post.id)}>
                        <h5 className="card-title text-primary text-truncate">{post.title}</h5>
                        <p className="text-muted mb-2">
                          <span>{new Date(post.updated_at).toLocaleDateString()}</span>
                        </p>
                        <p className="card-text fs-5">{post.content}</p>
                      </div>
                      <div className="d-flex justify-content-end gap-2 mt-2">
                        <button className="btn btn-sm btn-outline-primary" onClick={() => handleEdit(post)}>
                          ✏️ Modify
                        </button>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => setPostToDelete(post)}>
                          🗑️ Delete
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* confirmation delete modal */}
      {postToDelete && (
        <div className="modal fade show d-block" tabIndex={-1} role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirmation</h5>
                <button type="button" className="btn-close" onClick={() => setPostToDelete(null)}></button>
              </div>
              <div className="modal-body">
                <p>Es-tu sûr de vouloir supprimer le post <strong>« {postToDelete.title} »</strong> ?</p>
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
