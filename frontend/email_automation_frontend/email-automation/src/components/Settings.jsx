import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { 
  Cog6ToothIcon, 
  BuildingOfficeIcon, 
  KeyIcon, 
  GlobeAltIcon,
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline';
import { authAPI } from '../utils/apiLayer';

function Settings() {
  const [settingsData, setSettingsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showApiKeys, setShowApiKeys] = useState({});

  useEffect(() => {
    fetchSettingsData();
  }, []);

  const fetchSettingsData = async () => {
    try {
      const response = await authAPI.getSettingsInfo();
      if (response.success) {
        setSettingsData(response.data);
        const initialVisibility = {};
        Object.keys(response.data.apiKeys || {}).forEach(key => {
          initialVisibility[key] = false;
        });
        setShowApiKeys(initialVisibility);
      } else {
        toast.error('Failed to fetch settings data');
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast.error('Error loading settings information');
    } finally {
      setLoading(false);
    }
  };

  const toggleApiKeyVisibility = (key) => {
    setShowApiKeys(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
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
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center space-x-4">
            <div className="bg-blue-100 rounded-lg p-3">
              <Cog6ToothIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
              <p className="text-sm text-gray-500">Manage your account settings and preferences</p>
            </div>
          </div>
        </div>

        {/* Organization Settings */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center space-x-3 mb-6">
            <BuildingOfficeIcon className="h-5 w-5 text-gray-400" />
            <h2 className="text-lg font-medium text-gray-900">Organization Details</h2>
          </div>
          
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">Organization Name</label>
              <p className="mt-1 p-3 bg-gray-50 rounded-md text-sm text-gray-900">
                {settingsData?.organization?.name || 'Not set'}
              </p>
            </div>
            
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">Website URL</label>
              <p className="mt-1 p-3 bg-gray-50 rounded-md text-sm text-blue-600 hover:underline">
                <a href={settingsData?.organization?.url} target="_blank" rel="noopener noreferrer">
                  {settingsData?.organization?.url || 'Not set'}
                </a>
              </p>
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">About</label>
              <p className="mt-1 p-3 bg-gray-50 rounded-md text-sm text-gray-900">
                {settingsData?.organization?.about || 'No description provided'}
              </p>
            </div>
          </div>
        </div>

        {/* API Keys */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center space-x-3 mb-6">
            <KeyIcon className="h-5 w-5 text-gray-400" />
            <h2 className="text-lg font-medium text-gray-900">API Keys</h2>
          </div>

          <div className="space-y-4">
            {Object.entries(settingsData?.apiKeys || {}).map(([key, value]) => (
              <div key={key} className="border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium text-gray-700 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </label>
                  <button
                    onClick={() => toggleApiKeyVisibility(key)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    {showApiKeys[key] ? (
                      <EyeSlashIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
                <p className="mt-2 p-3 bg-gray-50 rounded-md text-sm font-mono">
                  {value ? (showApiKeys[key] ? value : '••••••••••••••••') : 'Not configured'}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* API URLs */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center space-x-3 mb-6">
            <GlobeAltIcon className="h-5 w-5 text-gray-400" />
            <h2 className="text-lg font-medium text-gray-900">API URLs</h2>
          </div>

          <div className="space-y-4">
            {Object.entries(settingsData?.apiUrls || {}).map(([key, value]) => (
              <div key={key} className="border rounded-lg p-4">
                <label className="block text-sm font-medium text-gray-700 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </label>
                <p className="mt-2 p-3 bg-gray-50 rounded-md text-sm font-mono">
                  {value || 'Not configured'}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;

