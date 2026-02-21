import React, { useState, useContext, useEffect } from 'react';
import { UserContext } from '../../context/userContext';
import ProfilePhotoSelector from '../inputs/ProfilePhotoSelector';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import toast from 'react-hot-toast';
import { HiOutlineUser, HiOutlineLockClosed, HiOutlineMail, HiOutlineX } from 'react-icons/hi';

const ProfileModal = ({ isOpen, onClose }) => {
  const { user, updateUser } = useContext(UserContext);
  const [activeTab, setActiveTab] = useState('profile');

  // Form States
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [profilePic, setProfilePic] = useState(null);
  
  // Password States
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && isOpen) {
      setName(user.name || '');
      setEmail(user.email || '');
      setProfilePic(user.profileImageUrl || null);
      
      // Reset password fields when opening
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setActiveTab('profile'); // Default to profile tab
    }
  }, [user, isOpen]);

  if (!isOpen) return null;

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let payload = { name, email };

      // Handle Image Upload First
      if (profilePic && typeof profilePic !== 'string') {
        const formData = new FormData();
        formData.append('image', profilePic);
        const imageRes = await axiosInstance.post(API_PATHS.IMAGE.UPLOAD_IMAGE, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        payload.profileImageUrl = imageRes.data.imageUrl;
      } else if (profilePic === null && user.profileImageUrl) {
        // User explicitly removed the existing photo
        payload.profileImageUrl = null;
      }
      // If profilePic is a string, it means it's the existing URL and wasn't changed.
      // We don't need to send it again, saving bandwidth and potential validation issues.

      // Update Profile Details
      const response = await axiosInstance.put(API_PATHS.AUTH.UPDATE_PROFILE, payload);

      if (response.data && response.data.user) {
        updateUser(response.data.user);
        toast.success("Profile updated successfully!");
        onClose();
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match!");
      return;
    }
    
    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    
    try {
      const response = await axiosInstance.put(API_PATHS.AUTH.UPDATE_PROFILE, {
        oldPassword,
        newPassword
      });

      if (response.data && response.data.user) {
        toast.success("Password updated successfully!");
        onClose();
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update password.");
    } finally {
      setLoading(false);
    }
  };

  // Close when clicking outside modal content
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-fade-in"
      onClick={handleBackdropClick}
    >
      <div 
        className="w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row animate-scale-in max-h-[90vh]"
        style={{ backgroundColor: 'var(--color-surface)' }}
      >
        
        {/* Sidebar / Tabs */}
        <div className="w-full md:w-64 shrink-0 border-b md:border-b-0 md:border-r border-border/50 p-6 bg-surface-secondary/30">
          <div className="flex items-center justify-between md:mb-8 mb-4">
            <h2 className="text-xl font-bold text-text-primary">Settings</h2>
            <button 
              onClick={onClose}
              className="md:hidden p-2 text-text-secondary hover:bg-surface-tertiary rounded-xl transition-colors"
            >
               <HiOutlineX className="text-xl" />
            </button>
          </div>
          
          <div className="flex md:flex-col gap-2 overflow-x-auto pb-2 md:pb-0">
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-medium whitespace-nowrap ${
                activeTab === 'profile'
                  ? 'bg-gradient-to-r from-primary to-primary-light text-white shadow-md'
                  : 'text-text-secondary hover:bg-surface-tertiary hover:text-text-primary'
              }`}
            >
              <HiOutlineUser className="text-xl" />
              Personal Info
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-medium whitespace-nowrap ${
                activeTab === 'security'
                  ? 'bg-gradient-to-r from-primary to-primary-light text-white shadow-md'
                  : 'text-text-secondary hover:bg-surface-tertiary hover:text-text-primary'
              }`}
            >
              <HiOutlineLockClosed className="text-xl" />
              Security
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 relative">
          
          <button 
            onClick={onClose}
            className="hidden md:flex absolute top-6 right-6 p-2 text-text-secondary hover:bg-surface-tertiary rounded-xl transition-colors"
          >
            <HiOutlineX className="text-xl" />
          </button>

          {activeTab === 'profile' && (
            <div className="animate-fade-in max-w-2xl mx-auto md:mx-0">
              <h2 className="text-2xl font-bold text-text-primary mb-2">Personal Information</h2>
              <p className="text-text-secondary mb-8 text-sm">Update your avatar and personal details here.</p>
              
              <form onSubmit={handleProfileUpdate} className="space-y-6">
                {/* Profile Photo */}
                <div className="flex flex-col mb-8">
                  <label className="block text-sm font-medium text-text-secondary mb-4">Profile Photo</label>
                  <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name Input */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-text-secondary flex items-center gap-2">
                      <HiOutlineUser className="text-primary" /> Full Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-surface-tertiary border border-border rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-text-tertiary"
                      placeholder="John Doe"
                      required
                    />
                  </div>

                  {/* Email Input */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-text-secondary flex items-center gap-2">
                      <HiOutlineMail className="text-primary" /> Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-surface-tertiary border border-border rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-text-tertiary"
                      placeholder="john@example.com"
                      required
                    />
                  </div>
                </div>

                <div className="pt-6 flex justify-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary w-full md:w-auto px-8 py-3 disabled:opacity-70 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Saving...
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="animate-fade-in max-w-xl mx-auto md:mx-0">
              <h2 className="text-2xl font-bold text-text-primary mb-2">Security Settings</h2>
              <p className="text-text-secondary mb-8 text-sm">Ensure your account is using a long, random password to stay secure.</p>
              
              <form onSubmit={handlePasswordUpdate} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-secondary">Current Password</label>
                  <input
                    type="password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className="w-full bg-surface-tertiary border border-border rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    placeholder="••••••••"
                    required
                  />
                </div>
                
                <hr className="border-border my-6" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-text-secondary">New Password</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full bg-surface-tertiary border border-border rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                      placeholder="••••••••"
                      required
                      minLength={6}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-text-secondary">Confirm New Password</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full bg-surface-tertiary border border-border rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                      placeholder="••••••••"
                      required
                      minLength={6}
                    />
                  </div>
                </div>

                <div className="pt-6 flex justify-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary w-full md:w-auto px-8 py-3 disabled:opacity-70 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Updating...
                      </>
                    ) : (
                      'Update Password'
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default ProfileModal;
