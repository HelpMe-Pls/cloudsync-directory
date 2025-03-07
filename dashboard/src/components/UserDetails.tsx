import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

interface User {
  id: string;
  username: string;
  displayName: string;
  email: string;
  isActive: boolean;
  groups?: { id: string; name: string }[];
  roles?: { id: string; name: string }[];
}

const UserDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [formData, setFormData] = useState<Partial<User>>({});

  useEffect(() => {
    // In a real app, this would fetch data from the API
    // For demo purposes, we'll use mock data
    const fetchUser = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Mock user data
        if (id === '1') {
          setUser({
            id: '1',
            username: 'admin',
            displayName: 'System Administrator',
            email: 'admin@example.com',
            isActive: true,
            groups: [
              { id: '1', name: 'Engineering' },
              { id: '3', name: 'Backend' }
            ],
            roles: [
              { id: '1', name: 'admin' }
            ]
          });
        } else if (id === '2') {
          setUser({
            id: '2',
            username: 'user',
            displayName: 'Regular User',
            email: 'user@example.com',
            isActive: true,
            groups: [
              { id: '2', name: 'Marketing' }
            ],
            roles: [
              { id: '2', name: 'user' }
            ]
          });
        } else {
          setError('User not found');
        }
      } catch (error) {
        console.error('Error fetching user:', error);
        setError('Failed to load user details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchUser();
    }
  }, [id]);

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username,
        displayName: user.displayName,
        email: user.email,
        isActive: user.isActive
      });
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update local state
      if (user) {
        setUser({
          ...user,
          ...formData
        });
      }
      
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating user:', error);
      setError('Failed to update user. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }
    
    try {
      setLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      navigate('/users');
    } catch (error) {
      console.error('Error deleting user:', error);
      setError('Failed to delete user. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !user) {
    return <div className="loading">Loading user details...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!user) {
    return <div className="not-found">User not found</div>;
  }

  return (
    <div className="user-details">
      <div className="details-header">
        <h1>{isEditing ? 'Edit User' : 'User Details'}</h1>
        <div className="header-actions">
          {!isEditing && (
            <>
              <button onClick={() => setIsEditing(true)} className="edit-button">
                Edit
              </button>
              <button onClick={handleDelete} className="delete-button">
                Delete
              </button>
            </>
          )}
        </div>
      </div>
      
      {isEditing ? (
        <form onSubmit={handleSubmit} className="edit-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username || ''}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="displayName">Display Name</label>
            <input
              type="text"
              id="displayName"
              name="displayName"
              value={formData.displayName || ''}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email || ''}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-group checkbox-group">
            <label htmlFor="isActive">
              <input
                type="checkbox"
                id="isActive"
                name="isActive"
                checked={formData.isActive || false}
                onChange={handleInputChange}
              />
              Active
            </label>
          </div>
          
          <div className="form-actions">
            <button type="submit" className="save-button" disabled={loading}>
              {loading ? 'Saving...' : 'Save'}
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="cancel-button"
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="user-info">
          <div className="info-section">
            <h2>Basic Information</h2>
            <div className="info-grid">
              <div className="info-label">Username</div>
              <div className="info-value">{user.username}</div>
              
              <div className="info-label">Display Name</div>
              <div className="info-value">{user.displayName}</div>
              
              <div className="info-label">Email</div>
              <div className="info-value">{user.email}</div>
              
              <div className="info-label">Status</div>
              <div className="info-value">
                <span className={`status-badge ${user.isActive ? 'active' : 'inactive'}`}>
                  {user.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          </div>
          
          <div className="info-section">
            <h2>Groups</h2>
            {user.groups && user.groups.length > 0 ? (
              <ul className="groups-list">
                {user.groups.map(group => (
                  <li key={group.id}>
                    <a href={`/groups/${group.id}`}>{group.name}</a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="no-data">No groups assigned</p>
            )}
          </div>
          
          <div className="info-section">
            <h2>Roles</h2>
            {user.roles && user.roles.length > 0 ? (
              <ul className="roles-list">
                {user.roles.map(role => (
                  <li key={role.id}>{role.name}</li>
                ))}
              </ul>
            ) : (
              <p className="no-data">No roles assigned</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDetails;
