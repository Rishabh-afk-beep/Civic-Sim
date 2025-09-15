import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useForm } from 'react-hook-form';
import Card, { CardHeader, CardTitle, CardContent, CardFooter } from '../components/ui/Card';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { User, Mail, Shield, Edit, Save, X } from 'lucide-react';
import toast from 'react-hot-toast';

const Profile = () => {
  const { currentUser, userProfile, updateProfile, signOut, loading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [updating, setUpdating] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    defaultValues: {
      display_name: userProfile?.display_name || '',
      role: userProfile?.role || 'citizen'
    }
  });

  const onSubmit = async (data) => {
    setUpdating(true);
    try {
      await updateProfile(data);
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Profile update failed:', error);
    } finally {
      setUpdating(false);
    }
  };

  const handleCancel = () => {
    reset({
      display_name: userProfile?.display_name || '',
      role: userProfile?.role || 'citizen'
    });
    setIsEditing(false);
  };

  const roleLabels = {
    citizen: 'Citizen',
    researcher: 'Researcher', 
    journalist: 'Journalist',
    admin: 'Administrator'
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'researcher':
        return 'bg-blue-100 text-blue-800';
      case 'journalist':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen text="Loading profile..." />;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          User Profile
        </h1>
        <p className="text-gray-600">
          Manage your account settings and personal information.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Info */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>Profile Information</span>
                </CardTitle>
                {!isEditing && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                    icon={Edit}
                  >
                    Edit
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Display Name */}
                <div>
                  <label htmlFor="display_name" className="block text-sm font-medium text-gray-700">
                    Display Name
                  </label>
                  <input
                    type="text"
                    id="display_name"
                    {...register('display_name', {
                      required: 'Display name is required',
                      minLength: { value: 2, message: 'Display name must be at least 2 characters' }
                    })}
                    disabled={!isEditing}
                    className={`mt-1 input-field ${!isEditing ? 'bg-gray-50' : ''}`}
                  />
                  {errors.display_name && (
                    <p className="mt-1 text-sm text-red-600">{errors.display_name.message}</p>
                  )}
                </div>

                {/* Email (Read-only) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <div className="mt-1 flex items-center">
                    <input
                      type="email"
                      value={currentUser?.email || ''}
                      disabled
                      className="input-field bg-gray-50 flex-1"
                    />
                    <Mail className="ml-2 h-4 w-4 text-gray-400" />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Email address cannot be changed
                  </p>
                </div>

                {/* Role */}
                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                    Role
                  </label>
                  <select
                    id="role"
                    {...register('role')}
                    disabled={!isEditing}
                    className={`mt-1 input-field ${!isEditing ? 'bg-gray-50' : ''}`}
                  >
                    <option value="citizen">Citizen</option>
                    <option value="researcher">Researcher</option>
                    <option value="journalist">Journalist</option>
                  </select>
                  <p className="mt-1 text-xs text-gray-500">
                    Your role helps us customize your experience
                  </p>
                </div>

                {/* Account Created */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Member Since
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      value={userProfile?.created_at ? new Date(userProfile.created_at).toLocaleDateString() : 'N/A'}
                      disabled
                      className="input-field bg-gray-50"
                    />
                  </div>
                </div>

                {isEditing && (
                  <div className="flex justify-end space-x-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCancel}
                      icon={X}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      loading={updating}
                      disabled={updating}
                      icon={Save}
                    >
                      Save Changes
                    </Button>
                  </div>
                )}
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Profile Summary */}
        <div className="space-y-6">
          {/* User Card */}
          <Card>
            <CardContent className="text-center py-6">
              <div className="w-20 h-20 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                {userProfile?.display_name || 'User'}
              </h3>
              <p className="text-gray-600 text-sm">{currentUser?.email}</p>
              <div className="mt-3">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleBadgeColor(userProfile?.role)}`}>
                  {roleLabels[userProfile?.role] || 'Citizen'}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Account Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Account Status</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Account Status</span>
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                    Active
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Email Verified</span>
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                    Verified
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Two-Factor Auth</span>
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                    Not Set Up
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => toast.info('Feature coming soon!')}
                >
                  Change Password
                </Button>
                <Button
                  variant="outline" 
                  size="sm"
                  className="w-full"
                  onClick={() => toast.info('Feature coming soon!')}
                >
                  Download My Data
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  className="w-full"
                  onClick={signOut}
                >
                  Sign Out
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;