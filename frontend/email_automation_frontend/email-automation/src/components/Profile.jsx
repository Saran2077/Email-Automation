import { useState, useEffect } from 'react';
import { UserCircleIcon, CalendarIcon, ClockIcon, IdentificationIcon, EnvelopeIcon, PencilIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import { authAPI } from '../utils/apiLayer';

function Profile() {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({
    username: '',
    email: ''
  });

  useEffect(() => {
    fetchProfileData();
  }, []);

  useEffect(() => {
    if (profileData) {
      setEditedData({
        username: profileData.username,
        email: profileData.email
      });
    }
  }, [profileData]);

  const fetchProfileData = async () => {
    try {
      const response = await authAPI.getProfileInfo();
      if (response.success) {
        setProfileData(response.data);
      } else {
        toast.error('Failed to fetch profile data');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Error loading profile information');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      const response = await authAPI.updateProfile(editedData);
      if (response.success) {
        setProfileData({
          ...profileData,
          ...editedData
        });
        setIsEditing(false);
        toast.success('Profile updated successfully');
      } else {
        toast.error('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Error updating profile information');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-32"></div>
          <div className="relative px-6 pb-6">
            <div className="absolute -top-12">
              <div className="bg-white rounded-full p-2 shadow-lg">
                <UserCircleIcon className="h-20 w-20 text-blue-500" />
              </div>
            </div>
            <div className="pt-12">
              <h1 className="text-3xl font-bold text-gray-900">{profileData?.username}</h1>
              <p className="text-gray-500">{profileData?.email}</p>
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="mt-8 bg-white rounded-lg shadow-sm">
          <div className="px-6 py-5">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900">Profile Information</h2>
              <button
                onClick={() => isEditing ? handleUpdate() : setIsEditing(true)}
                className="flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                {isEditing ? 'Save Changes' : (
                  <>
                    <PencilIcon className="h-4 w-4 mr-2" />
                    Edit Profile
                  </>
                )}
              </button>
            </div>
            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="flex items-center space-x-3">
                <IdentificationIcon className="h-5 w-5 text-gray-400" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-500">User Name</p>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedData.username}
                      onChange={(e) => setEditedData({ ...editedData, username: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                  ) : (
                    <p className="mt-1 text-sm text-gray-900">{profileData?.username}</p>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <CalendarIcon className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Member Since</p>
                  <p className="mt-1 text-sm text-gray-900">
                    {new Date(profileData?.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-500">Email</p>
                  {isEditing ? (
                    <input
                      type="email"
                      value={editedData.email}
                      onChange={(e) => setEditedData({ ...editedData, email: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                  ) : (
                    <p className="mt-1 text-sm text-gray-900">{profileData?.email}</p>
                  )}
                </div>
              </div>

              {/* <div className="flex items-center space-x-3">
                <ClockIcon className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Last Updated</p>
                  <p className="mt-1 text-sm text-gray-900">
                    {new Date(profileData?.updatedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div> */}
            </div>
          </div>
        </div>

        {/* Activity Section */}
        {/* <div className="mt-8 bg-white rounded-lg shadow-sm">
          <div className="px-6 py-5">
            <h2 className="text-lg font-medium text-gray-900">Account Status</h2>
            <div className="mt-4">
              <div className="flex items-center justify-between py-3 border-b border-gray-200">
                <div className="flex items-center">
                  <div className="h-2.5 w-2.5 rounded-full bg-green-400 mr-2"></div>
                  <span className="text-sm text-gray-500">Account Active</span>
                </div>
                <span className="px-2 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full">
                  Verified
                </span>
              </div>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
}

export default Profile;

