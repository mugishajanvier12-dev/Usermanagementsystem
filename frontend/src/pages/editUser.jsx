// pages/EditUser.jsx
import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api from '../api';

const EditUser = () => {

  const { id } = useParams();
  // eslint-disable-next-line no-unused-vars
  const [user, setUser] = useState({})
  const [loading, setLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState('')
  const [error, setError] = useState(null);
  const [username, setUsername] = useState()
  const [email, setEmail] = useState()
  const navigate = useNavigate()


  const fetchUser  = async (id) =>{
    // Fetch user data from API
    setLoading(true);
    try{
      const response = await  api.get(`/users/${id}`);
      setUser(response.data);
      setUsername(response.data.username);
      setEmail(response.data.email);
    } catch(err){
      setError(err.message)
    } finally{
      setLoading(false)
    }
  }

  const updateUser = async (e) =>{
    e.preventDefault()
    setUpdateLoading(true)
    try {
      const response = await api.put(`/users/${id}`, {username, email});
      if(response.status === 200){
        alert('User updated successfully');
        navigate('/dashboard');
      }
    } catch(error){
      setError(error.message);
    } finally{
      setUpdateLoading(false)
    }
  }

  useEffect(()=>{
    fetchUser(id)
  }, [])

  if(error){
    return <div className="text-red-500 text-center">{error}</div>
  }

  if(loading){
    return <div className="text-center">Loading...</div>
  }

  return (
    
    <div className="max-w-2xl mx-auto">
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="px-6 py-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Edit User</h2>
            <Link to="/dashboard" className="text-blue-500 hover:text-blue-700">
              Back to Dashboard
            </Link>
          </div>
          
          <div className="mb-6 p-4 bg-blue-50 rounded-md">
            <p className="text-gray-600">
              Editing user ID: <strong>{id}</strong>
            </p>
          </div>

          <form onSubmit ={updateUser}> 
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-blue-500"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-blue-500"
              />
            </div>

       

            <div className="flex items-center justify-between">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 cursor-pointer  text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                {updateLoading ? "updating ...": "Update User"}
              </button>
              <Link
                to="/dashboard"
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>

      <div className="mt-8 bg-white shadow-md rounded-lg overflow-hidden">
        <div className="px-6 py-8">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Danger Zone</h2>
          <p className="mb-4 text-gray-600">
            Once you delete this user account, there is no going back. Please be certain.
          </p>

          <button
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Delete User Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditUser;