import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

interface GroupMember {
  id: string;
  username: string;
  displayName: string;
  email: string;
}

interface Group {
  id: string;
  name: string;
  description: string;
  members: GroupMember[];
  parentGroup?: {
    id: string;
    name: string;
  };
  childGroups?: {
    id: string;
    name: string;
    description: string;
  }[];
}

const GroupDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [group, setGroup] = useState<Group | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [formData, setFormData] = useState<Partial<Group>>({});

  useEffect(() => {
    // In a real app, this would fetch data from the API
    // For demo purposes, we'll use mock data
    const fetchGroup = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Mock group data
        if (id === '1') {
          setGroup({
            id: '1',
            name: 'Engineering',
            description: 'Engineering department',
            members: [
              {
                id: '1',
                username: 'admin',
                displayName: 'System Administrator',
                email: 'admin@example.com'
              }
            ],
            childGroups: [
              {
                id: '3',
                name: 'Backend',
                description: 'Backend development team'
              },
              {
                id: '4',
                name: 'Frontend',
                description: 'Frontend development team'
              }
            ]
          });
        } else if (id === '2') {
          setGroup({
            id: '2',
            name: 'Marketing',
            description: 'Marketing department',
            members: [
              {
                id: '2',
                username: 'user',
                displayName: 'Regular User',
                email: 'user@example.com'
              }
            ]
          });
        } else if (id === '3') {
          setGroup({
            id: '3',
            name: 'Backend',
            description: 'Backend development team',
            members: [
              {
                id: '1',
                username: 'admin',
                displayName: 'System Administrator',
                email: 'admin@example.com'
              }
            ],
            parentGroup: {
              id: '1',
              name: 'Engineering'
            }
          });
        } else if (id === '4') {
          setGroup({
            id: '4',
            name: 'Frontend',
            description: 'Frontend development team',
            members: [],
            parentGroup: {
              id: '1',
              name: 'Engineering'
            }
          });
        } else {
          setError('Group not found');
        }
      } catch (error) {
        console.error('Error fetching group:', error);
        setError('Failed to load group details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchGroup();
    }
  }, [id]);

  useEffect(() => {
    if (group) {
      setFormData({
        name: group.name,
        description: group.description
      });
    }
  }, [group]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update local state
      if (group) {
        setGroup({
          ...group,
          ...formData
        });
      }
      
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating group:', error);
      setError('Failed to update group. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this group?')) {
      return;
    }
    
    try {
      setLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      navigate('/groups');
    } catch (error) {
      console.error('Error deleting group:', error);
      setError('Failed to delete group. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !group) {
    return <div className="loading">Loading group details...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!group) {
    return <div className="not-found">Group not found</div>;
  }

  return (
    <div className="group-details">
      <div className="details-header">
        <h1>{isEditing ? 'Edit Group' : 'Group Details'}</h1>
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
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name || ''}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description || ''}
              onChange={handleInputChange}
              rows={4}
            />
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
        <div className="group-info">
          <div className="info-section">
            <h2>Basic Information</h2>
            <div className="info-grid">
              <div className="info-label">Name</div>
              <div className="info-value">{group.name}</div>
              
              <div className="info-label">Description</div>
              <div className="info-value">{group.description || 'No description'}</div>
              
              {group.parentGroup && (
                <>
                  <div className="info-label">Parent Group</div>
                  <div className="info-value">
                    <Link to={`/groups/${group.parentGroup.id}`}>
                      {group.parentGroup.name}
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
          
          <div className="info-section">
            <h2>Members</h2>
            {group.members && group.members.length > 0 ? (
              <table className="members-table">
                <thead>
                  <tr>
                    <th>Username</th>
                    <th>Display Name</th>
                    <th>Email</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {group.members.map(member => (
                    <tr key={member.id}>
                      <td>{member.username}</td>
                      <td>{member.displayName}</td>
                      <td>{member.email}</td>
                      <td>
                        <Link to={`/users/${member.id}`} className="view-button">
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="no-data">No members in this group</p>
            )}
            <button className="add-member-button">Add Member</button>
          </div>
          
          {group.childGroups && group.childGroups.length > 0 && (
            <div className="info-section">
              <h2>Child Groups</h2>
              <ul className="child-groups-list">
                {group.childGroups.map(childGroup => (
                  <li key={childGroup.id}>
                    <Link to={`/groups/${childGroup.id}`}>
                      {childGroup.name}
                    </Link>
                    <span className="group-description">{childGroup.description}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GroupDetails;
