// pages/UserDetail.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const UserDetail = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="px-6 py-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">User Details</h2>
            <Link to="/dashboard" className="text-blue-500 hover:text-blue-700">
              Back to Dashboard
            </Link>
          </div>

          <div className="mb-6 p-4 bg-blue-50 rounded-md">
            <p className="text-lg font-medium text-blue-800">
              User ID: 123
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-4 rounded-md">
              <h3 className="text-lg font-medium text-gray-800 mb-3">Account Information</h3>
              <div className="space-y-2">
                <div className="flex">
                  <span className="font-medium w-32">Username:</span>
                  <span>john_doe</span>
                </div>
                <div className="flex">
                  <span className="font-medium w-32">Email:</span>
                  <span>john@example.com</span>
                </div>
                <div className="flex">
                  <span className="font-medium w-32">Status:</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Active</span>
                </div>
                <div className="flex">
                  <span className="font-medium w-32">Role:</span>
                  <span>User</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-md">
              <h3 className="text-lg font-medium text-gray-800 mb-3">Activity Information</h3>
              <div className="space-y-2">
                <div className="flex">
                  <span className="font-medium w-32">Created:</span>
                  <span>Dec 10, 2024</span>
                </div>
                <div className="flex">
                  <span className="font-medium w-32">Last Update:</span>
                  <span>Jan 15, 2025</span>
                </div>
                <div className="flex">
                  <span className="font-medium w-32">Last Login:</span>
                  <span>Mar 20, 2025</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex space-x-4">
            <Link
              to="/edit-user/123"
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Edit User
            </Link>
            <button
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Delete User
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetail;