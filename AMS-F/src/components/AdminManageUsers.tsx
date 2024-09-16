import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { handleErrorResult, handleSuccessResult } from '../util/errorMessage';

interface User {
  email: string;
  name: string;
  role: string;
  status: string;
  telephone: string;
  isBanned: boolean;
}

const ManageUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [nameFilter, setNameFilter] = useState<string>('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const fetchUsers = useCallback(async () => {
    
      const encodedFilter = encodeURIComponent(nameFilter);
      const response = await axios.get<User[]>(`http://localhost:5000/api/Admin/ManageAllUsers?nameFilter=${encodedFilter}`);
      const usersData = response.data.map(user => ({
        ...user,
        isBanned: user.status === 'Banned'
      }));
      setUsers(usersData);
    
  }, [nameFilter]);


  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);


  const handleBanUnban = async (email: string, ban: boolean) => {
    try {
      const response = await axios.put('http://localhost:5000/api/Admin/BanUser', { Email: email, Ban: ban });
      handleSuccessResult(response.data?.Message || 'Operation successful');
      fetchUsers(); 
    } catch (error) {
      if (axios.isAxiosError(error)) {
        handleErrorResult(error.response?.data?.Message || 'Ban/Unban operation failed.');
      } else {
        handleErrorResult('An unknown error occurred.');
      }
    }
  };

  const handleViewDetails = (user: User) => {
    setSelectedUser(user);
  };

  const closeDetailsModal = () => {
    setSelectedUser(null);
  };

  const handleNameFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNameFilter(e.target.value);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-6 text-center">Manage Users</h1>
          <div className="flex items-center space-x-4 mb-6">
            <input
              type="text"
              placeholder="Search by name"
              value={nameFilter}
              onChange={handleNameFilterChange}
              className="flex-grow px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border-collapse">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 border text-left text-sm font-medium text-gray-700">Name</th>
                  <th className="px-4 py-2 border text-left text-sm font-medium text-gray-700">Email</th>
                  <th className="px-4 py-2 border text-left text-sm font-medium text-gray-700">Role</th>
                  <th className="px-4 py-2 border text-left text-sm font-medium text-gray-700">Status</th>
                  <th className="px-4 py-2 border text-left text-sm font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.map(user => (
                  <tr key={user.email}>
                    <td className="px-4 py-2 border">{user.name}</td>
                    <td className="px-4 py-2 border">{user.email}</td>
                    <td className="px-4 py-2 border">{user.role}</td>
                    <td className="px-4 py-2 border">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                          user.isBanned ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {user.isBanned ? 'Banned' : 'Active'}
                      </span>
                    </td>
                    <td className="px-4 py-2 border space-x-2">
                      <button
                        onClick={() => handleBanUnban(user.email, !user.isBanned)}
                        className={`m-1 px-2 py-1 text-white rounded ${user.isBanned ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'}`}
                      >
                        {user.isBanned ? 'Unban' : 'Ban'}
                      </button>
                      <button
                        onClick={() => handleViewDetails(user)}
                        className="m-1 px-1 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded"
                      >
                        Info
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal Dialog */}
      {selectedUser && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white shadow-lg rounded-lg p-6 max-w-md w-full mx-4 border border-gray-300">
            <h2 className="text-xl font-bold mb-4">User Details</h2>
            <p className="mb-2">
              <strong>Email:</strong> {selectedUser.email}
            </p>
            <p className="mb-2">
              <strong>Name:</strong> {selectedUser.name}
            </p>
            <p className="mb-2">
              <strong>Role:</strong> {selectedUser.role}
            </p>
            <p className="mb-2">
              <strong>Telephone:</strong> {selectedUser.telephone}
            </p>
            <p className="mb-2">
              <strong>Status:</strong> {selectedUser.isBanned ? 'Banned' : 'Active'}
            </p>
            <div className="flex justify-end">
              <button
                onClick={closeDetailsModal}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;
