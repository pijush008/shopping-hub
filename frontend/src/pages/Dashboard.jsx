import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form state
  const [formData, setFormData] = useState({ name: '', description: '', price: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [formError, setFormError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedId, setSelectedId] = useState(null);

  // Inline delete confirmation
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await api.get('/products');
      setProducts(res.data.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setSuccess('');

    try {
      if (isEditing) {
        await api.put(`/products/${currentId}`, formData);
        setSuccess('Product updated successfully!');
      } else {
        await api.post('/products', formData);
        setSuccess('Product created successfully!');
      }

      setFormData({ name: '', description: '', price: '' });
      setIsEditing(false);
      setCurrentId(null);
      setSelectedId(null);
      fetchProducts();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setFormError(err.response?.data?.error || 'An error occurred');
    }
  };

  const handleSelect = (product) => {
    setSelectedId(product._id);
    setIsEditing(true);
    setCurrentId(product._id);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
    });
    setConfirmDeleteId(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteConfirmed = async (id) => {
    try {
      await api.delete(`/products/${id}`);
      if (selectedId === id) cancelEdit();
      setConfirmDeleteId(null);
      fetchProducts();
      setSuccess('Product deleted successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete product');
      setTimeout(() => setError(''), 3000);
    }
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setCurrentId(null);
    setSelectedId(null);
    setFormData({ name: '', description: '', price: '' });
    setFormError('');
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Manage your products seamlessly</p>
      </header>

      {success && <div className="alert alert-success">{success}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      <div className="card glass-panel">
        <h3>{isEditing ? '✏️ Edit Selected Product' : '➕ Add New Product'}</h3>
        {isEditing && (
          <div className="alert alert-info" style={{ marginBottom: '1rem' }}>
            Editing: <strong>{formData.name}</strong>
          </div>
        )}
        {formError && <div className="alert alert-error">{formError}</div>}

        <form onSubmit={handleSubmit} className="crud-form">
          <div className="form-row">
            <div className="form-group flex-1">
              <label>Product Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="e.g. Wireless Headphones"
              />
            </div>
            <div className="form-group flex-1">
              <label>Price (₹)</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                placeholder="e.g. 9999"
              />
            </div>
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              placeholder="Product description..."
              rows="3"
            ></textarea>
          </div>
          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              {isEditing ? '💾 Save Changes' : '🚀 Create Product'}
            </button>
            {isEditing && (
              <button type="button" className="btn btn-secondary" onClick={cancelEdit}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="products-list">
        <h2>Available Products ({products.length})</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
          Click a product card to select it for editing.
        </p>

        {loading ? (
          <div className="loading-spinner">Loading products...</div>
        ) : products.length === 0 ? (
          <div
            className="no-data"
            style={{ textAlign: 'center', padding: '3rem', background: 'var(--glass-bg)', borderRadius: '16px', border: '1px dashed var(--glass-border)' }}
          >
            <p style={{ marginBottom: '1.5rem', color: 'var(--text-muted)' }}>
              No products found. Start by adding some above.
            </p>
          </div>
        ) : (
          <div className="grid">
            {products.map((product) => {
              const isSelected = selectedId === product._id;
              const isConfirmingDelete = confirmDeleteId === product._id;
              return (
                <div
                  key={product._id}
                  className={`card product-card glass-panel hover-lift`}
                  onClick={() => { if (!isConfirmingDelete) handleSelect(product); }}
                  style={{ cursor: 'pointer', border: isSelected ? '2px solid var(--primary)' : '1px solid var(--glass-border)' }}
                >
                  {isSelected && (
                    <div style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', background: 'var(--primary)', borderRadius: '999px', padding: '2px 10px', fontSize: '0.75rem', fontWeight: 600, color: '#fff' }}>
                      Selected
                    </div>
                  )}
                  <div className="product-header">
                    <h3>{product.name}</h3>
                    <span className="price">₹{Number(product.price).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <p className="product-desc">{product.description}</p>
                  <div className="product-meta">
                    <small>Added by: {product.createdBy?.name || 'Unknown'}</small>
                    <small>{new Date(product.createdAt).toLocaleDateString('en-IN')}</small>
                  </div>

                  {isConfirmingDelete ? (
                    <div
                      className="alert alert-error"
                      style={{ margin: '0', padding: '0.75rem', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>Delete this product?</span>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button className="btn btn-sm btn-danger" onClick={() => handleDeleteConfirmed(product._id)}>
                          Yes, Delete
                        </button>
                        <button className="btn btn-sm btn-secondary" onClick={() => setConfirmDeleteId(null)}>
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="card-actions" onClick={(e) => e.stopPropagation()}>
                      <button className="btn btn-sm btn-secondary" onClick={() => handleSelect(product)}>
                        ✏️ Edit
                      </button>
                      <button className="btn btn-sm btn-danger" onClick={() => setConfirmDeleteId(product._id)}>
                        🗑️ Delete
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
