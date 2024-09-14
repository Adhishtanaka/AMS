import React, { useEffect, useState } from 'react';
import axios from 'axios';

// Define the User type
interface User {
    email: string;
    name: string;
    role: string;
    status: string;
    isBanned: boolean;
}

// Define the component
const AdminManageUsers: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]); // State to hold the list of users
    const [loading, setLoading] = useState<boolean>(true); // State to manage the loading state
    const [error, setError] = useState<string | null>(null); // State to manage errors

    // Fetch users from the API when the component mounts
    useEffect(() => {
        fetchUsers();
    }, []);

    // Function to fetch the list of users
    const fetchUsers = async () => {
        try {
            const response = await axios.get<User[]>('http://localhost:5000/api/Admin/ManageAllUsers');
            const usersData = response.data.map(user => ({
                ...user,
                isBanned: user.status === 'Banned' // Convert status to boolean for isBanned
            }));
            setUsers(usersData);
        } catch (error: any) {
            setError(error.message || 'Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    // Function to handle banning or unbanning a user
    const handleBanUnban = async (email: string, ban: boolean) => {
        try {
            const response = await axios.put('http://localhost:5000/api/Admin/BanUser', { Email: email, Ban: ban });
            alert(response.data.Message || 'Operation successful');
            fetchUsers(); // Refresh user list after ban/unban
        } catch (error: any) {
            alert(error.response?.data?.Message || 'Ban/Unban operation failed.');
        }
    };

    // Function to view more details about a user
    const handleViewDetails = (user: User) => {
        // Implement the logic to view more details about the user
        alert(`User details:\n\nEmail: ${user.email}\nName: ${user.name}\nStatus: ${user.isBanned ? 'Banned' : 'Active'}`);
    };

    if (loading) return <p>Loading users...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            <h1>Manage Users</h1>
            <table>
                <thead>
                    <tr>
                        <th>Email</th>
                        <th>Name</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.email}>
                            <td>{user.email}</td>
                            <td>{user.name}</td>
                            <td>{user.isBanned ? 'Banned' : 'Active'}</td>
                            <td>
                                <button
                                    onClick={() => handleBanUnban(user.email, !user.isBanned)} // Toggle between ban and unban
                                >
                                    {user.isBanned ? 'Unban' : 'Ban'}
                                </button>
                                <button onClick={() => handleViewDetails(user)}>View More Details</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminManageUsers;
