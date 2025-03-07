import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface Group {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  parentGroup?: {
    id: string;
    name: string;
  };
}

const GroupsList: React.FC = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    // In a real app, this would fetch data from the API
    // For demo purposes, we'll use mock data
    const fetchGroups = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const mockGroups: Group[] = [
          {
            id: '1',
            name: 'Engineering',
            description: 'Engineering department',
            memberCount: 12,
          },
          {
            id: '2',
            name: 'Marketing',
            description: 'Marketing department',
            memberCount: 8,
          },
          {
            id: '3',
            name: 'Backend',
            description: 'Backend development team',
            memberCount: 6,
            parentGroup: {
              id: '1',
              name: 'Engineering',
            },
          },
          {
            id: '4',
            name: 'Frontend',
            description: 'Frontend development team',
            memberCount: 5,
            parentGroup: {
              id: '1',
              name: 'Engineering',
            },
          },
        ];
        
        setGroups(mockGroups);
      } catch (error) {
        console.error('Error fetching groups:', error);
        setError('Failed to load groups. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, []);

  // Filter groups based on search term
  const filteredGroups = groups.filter(group => 
    group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    group.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="loading">Loading groups...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="groups-list">
      <div className="list-header">
        <h1>Groups</h1>
        <Link to="/groups/new" className="add-button">Add Group</Link>
      </div>
      
      <div className="search-container">
        <input
          type="text"
          placeholder="Search groups..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>
      
      <div className="groups-table-container">
        <table className="groups-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Parent Group</th>
              <th>Members</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredGroups.length === 0 ? (
              <tr>
                <td colSpan={5} className="no-results">No groups found</td>
              </tr>
            ) : (
              filteredGroups.map(group => (
                <tr key={group.id}>
                  <td>{group.name}</td>
                  <td>{group.description}</td>
                  <td>
                    {group.parentGroup ? (
                      <Link to={`/groups/${group.parentGroup.id}`}>
                        {group.parentGroup.name}
                      </Link>
                    ) : (
                      <span className="no-parent">None</span>
                    )}
                  </td>
                  <td>{group.memberCount}</td>
                  <td>
                    <Link to={`/groups/${group.id}`} className="view-button">View</Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GroupsList;
