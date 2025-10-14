'use client'

import { useState, useRef, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useDarkMode } from '@/contexts/DarkModeContext'
import SharedSidebar from '@/components/layout/SharedSidebar'
import { Camera, Save, X, User, Mail, Phone, MapPin, Globe, Calendar, CreditCard, Twitter, Linkedin, Facebook, Github, Lock, Search } from 'lucide-react'
import { countries } from '@/lib/countries'
import { createClient } from '@/utils/supabase/client'

export default function ProfilePage() {
  const { user, updatePassword } = useAuth()
  const { darkMode } = useDarkMode()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [showUnsavedWarning, setShowUnsavedWarning] = useState(false)
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [showChangePassword, setShowChangePassword] = useState(false)
  const [showAddPayment, setShowAddPayment] = useState(false)
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  })
  const [paymentForm, setPaymentForm] = useState({
    cardType: 'visa',
    cardNumber: '',
    expirationDate: '',
    cvv: '',
    cardholderName: ''
  })
  const [saveStatus, setSaveStatus] = useState<{type: 'success' | 'error' | null, message: string}>({type: null, message: ''})
  const [searchCountry, setSearchCountry] = useState('')
  
  // Form data state with initial values from user context
  const [formData, setFormData] = useState({
    firstName: user?.user_metadata?.full_name?.split(' ')[0] || 'John',
    lastName: user?.user_metadata?.full_name?.split(' ')[1] || 'Doe',
    email: user?.email || 'john.doe@example.com',
    phoneNumber: '+1 (555) 123-4567',
    address: '123 Main Street',
    country: 'United States',
    gender: 'Male',
    language: 'English',
    dateOfBirth: {
      month: 'June',
      day: '15',
      year: '1990'
    },
    socialMedia: {
      twitter: '@johndoe',
      linkedin: 'linkedin.com/in/johndoe',
      facebook: 'facebook.com/johndoe',
      github: 'github.com/johndoe'
    },
    professionalTitle: 'Senior Product Designer',
    paymentMethods: [] as { type: string; number: string }[]
  })

  // Load user data from Supabase when component mounts
  useEffect(() => {
    const loadUserData = async () => {
      if (user) {
        // Get additional user data from user_metadata
        const userData = user.user_metadata || {}
        
        setFormData(prev => ({
          ...prev,
          firstName: (userData as any)?.full_name?.split(' ')[0] || prev.firstName,
          lastName: (userData as any)?.full_name?.split(' ')[1] || prev.lastName,
          email: user.email || prev.email,
          phoneNumber: (userData as any)?.phone || prev.phoneNumber,
          address: (userData as any)?.address || prev.address,
          country: (userData as any)?.country || prev.country,
          gender: (userData as any)?.gender || prev.gender,
          language: (userData as any)?.language || prev.language,
          dateOfBirth: {
            month: (userData as any)?.dob_month || prev.dateOfBirth.month,
            day: (userData as any)?.dob_day || prev.dateOfBirth.day,
            year: (userData as any)?.dob_year || prev.dateOfBirth.year
          },
          socialMedia: {
            twitter: (userData as any)?.social_twitter || prev.socialMedia.twitter,
            linkedin: (userData as any)?.social_linkedin || prev.socialMedia.linkedin,
            facebook: (userData as any)?.social_facebook || prev.socialMedia.facebook,
            github: (userData as any)?.social_github || prev.socialMedia.github
          },
          professionalTitle: (userData as any)?.title || prev.professionalTitle
        }))
      }
    }
    
    loadUserData()
  }, [user])

  const [originalFormData] = useState({ ...formData })

  // Filter countries based on search
  const filteredCountries = countries.filter(country => 
    country.toLowerCase().includes(searchCountry.toLowerCase())
  )

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    
    if (name.includes('.')) {
      // Handle nested objects like dateOfBirth.month
      const [parent, child] = name.split('.')
      setFormData({
        ...formData,
        [parent]: {
          ...(formData as any)[parent],
          [child]: value
        }
      })
    } else {
      setFormData({
        ...formData,
        [name]: value
      })
    }
    
    // Show unsaved warning if data differs from original
    setShowUnsavedWarning(JSON.stringify(formData) !== JSON.stringify(originalFormData))
  }

  // Handle password form changes
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPasswordForm({
      ...passwordForm,
      [name]: value
    })
  }

  // Handle payment form changes
  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setPaymentForm({
      ...paymentForm,
      [name]: value
    })
  }

  // Handle profile image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target?.result) {
          setProfileImage(event.target.result as string)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  // Trigger file input click
  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  // Save profile changes
  const handleSave = async () => {
    try {
      // In a real app, you would send the data to your backend here
      console.log('Saving profile data:', formData)
      
      // Update user metadata in Supabase
      const supabase = createClient()
      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: `${formData.firstName} ${formData.lastName}`,
          phone: formData.phoneNumber,
          address: formData.address,
          country: formData.country,
          gender: formData.gender,
          language: formData.language,
          dob_month: formData.dateOfBirth.month,
          dob_day: formData.dateOfBirth.day,
          dob_year: formData.dateOfBirth.year,
          social_twitter: formData.socialMedia.twitter,
          social_linkedin: formData.socialMedia.linkedin,
          social_facebook: formData.socialMedia.facebook,
          social_github: formData.socialMedia.github,
          title: formData.professionalTitle
        }
      })
      
      if (error) {
        console.error('Error updating profile:', error)
        setSaveStatus({type: 'error', message: 'Failed to update profile'})
      } else {
        setSaveStatus({type: 'success', message: 'Profile updated successfully!'})
        setShowUnsavedWarning(false)
        setIsEditing(false)
      }
    } catch (error) {
      console.error('Error saving profile:', error)
      setSaveStatus({type: 'error', message: 'An unexpected error occurred'})
    }
    
    setTimeout(() => setSaveStatus({type: null, message: ''}), 3000)
  }

  // Cancel editing
  const handleCancel = () => {
    setFormData(originalFormData)
    setShowUnsavedWarning(false)
    setIsEditing(false)
  }

  // Handle password update
  const handleUpdatePassword = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmNewPassword) {
      setSaveStatus({type: 'error', message: 'Passwords do not match'})
      setTimeout(() => setSaveStatus({type: null, message: ''}), 3000)
      return
    }
    
    if (passwordForm.newPassword.length < 6) {
      setSaveStatus({type: 'error', message: 'Password must be at least 6 characters'})
      setTimeout(() => setSaveStatus({type: null, message: ''}), 3000)
      return
    }
    
    const result = await updatePassword(passwordForm.currentPassword, passwordForm.newPassword)
    
    if (result.error) {
      setSaveStatus({type: 'error', message: result.error.message})
      setTimeout(() => setSaveStatus({type: null, message: ''}), 3000)
      return
    }
    
    setSaveStatus({type: 'success', message: 'Password updated successfully!'})
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: ''
    })
    setShowChangePassword(false)
    setTimeout(() => setSaveStatus({type: null, message: ''}), 3000)
  }

  // Handle add payment method
  const handleAddPaymentMethod = () => {
    if (!paymentForm.cardNumber || !paymentForm.expirationDate || !paymentForm.cvv || !paymentForm.cardholderName) {
      setSaveStatus({type: 'error', message: 'Please fill all payment fields'})
      setTimeout(() => setSaveStatus({type: null, message: ''}), 3000)
      return
    }
    
    // Mask card number (show only last 4 digits)
    const maskedNumber = paymentForm.cardNumber.replace(/\d/g, '*').replace(/^(.*)(\d{4})$/, (_, prefix, last4) => prefix + last4)
    
    setFormData({
      ...formData,
      paymentMethods: [
        ...formData.paymentMethods,
        { type: paymentForm.cardType, number: maskedNumber }
      ]
    })
    
    setSaveStatus({type: 'success', message: 'Payment method added successfully!'})
    setPaymentForm({
      cardType: 'visa',
      cardNumber: '',
      expirationDate: '',
      cvv: '',
      cardholderName: ''
    })
    setShowAddPayment(false)
    setTimeout(() => setSaveStatus({type: null, message: ''}), 3000)
  }

  // Get user display name
  const getUserDisplayName = () => {
    return `${formData.firstName} ${formData.lastName}`
  }

  return (
    <div className={`flex min-h-screen transition-colors duration-200 ${
      darkMode 
        ? 'bg-gradient-to-br from-gray-900 to-gray-900' 
        : 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50'
    }`}>
      <SharedSidebar />
      
      {/* Main Content Area - Unified layout occupying remaining space */}
      <div className="flex-1 ml-80 pt-6 pb-20"> {/* ml-80 to account for sidebar width */}
        <div className="h-full">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 px-6">
            <div>
              <h1 className={`text-2xl font-bold ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>My Profile</h1>
              <p className={`${
                darkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>Edit your personal information</p>
            </div>
            <div className="flex space-x-3 mt-4 sm:mt-0">
              {isEditing ? (
                <>
                  <button
                    onClick={handleCancel}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      darkMode 
                        ? 'border border-gray-600 text-gray-300 hover:bg-gray-700' 
                        : 'border border-gray-300 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Edit Profile
                </button>
              )}
            </div>
          </div>

          {/* Unsaved changes warning */}
          {showUnsavedWarning && (
            <div className="mb-6 px-6">
              <div className={`p-4 rounded-lg flex items-center ${
                darkMode 
                  ? 'bg-amber-900/30 border border-amber-700 text-amber-200' 
                  : 'bg-amber-50 border border-amber-200 text-amber-800'
              }`}>
                <div className="flex-1">
                  You have unsaved changes. Don't forget to save before leaving.
                </div>
                <button 
                  onClick={() => setShowUnsavedWarning(false)}
                  className={
                    darkMode 
                      ? 'text-amber-200 hover:text-amber-100' 
                      : 'text-amber-800 hover:text-amber-900'
                  }
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {/* Save status message */}
          {saveStatus.type && (
            <div className="mb-6 px-6">
              <div className={`p-4 rounded-lg ${
                saveStatus.type === 'success' 
                  ? (darkMode 
                      ? 'bg-green-900/30 border border-green-700 text-green-200' 
                      : 'bg-green-50 border border-green-200 text-green-800')
                  : (darkMode 
                      ? 'bg-red-900/30 border border-red-700 text-red-200' 
                      : 'bg-red-50 border border-red-200 text-red-800')
              }`}>
                {saveStatus.message}
              </div>
            </div>
          )}

          {/* Unified Profile Content - Single section occupying remaining space */}
          <div className={`h-full mx-6 rounded-xl transition-colors duration-200 ${
            darkMode 
              ? 'bg-gray-800 border border-gray-700' 
              : 'bg-white border border-slate-200'
          }`}>
            <div className="p-6 h-full">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
                {/* Left Column - Profile Info */}
                <div className="lg:col-span-1">
                  <div className="space-y-8">
                    {/* Profile Header */}
                    <div className="flex flex-col items-center text-center">
                      {/* Profile Image */}
                      <div className="relative group mb-4">
                        <div className="relative">
                          {profileImage ? (
                            <img 
                              src={profileImage} 
                              alt="Profile" 
                              className="w-32 h-32 rounded-full object-cover border-4 border-white dark:border-gray-700 shadow-lg"
                            />
                          ) : user?.user_metadata?.avatar_url ? (
                            <img 
                              src={user.user_metadata.avatar_url} 
                              alt="Profile" 
                              className="w-32 h-32 rounded-full object-cover border-4 border-white dark:border-gray-700 shadow-lg"
                            />
                          ) : (
                            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-green-500 to-blue-600 flex items-center justify-center shadow-lg border-4 border-white dark:border-gray-700">
                              <span className="text-3xl font-bold text-white">
                                {getUserDisplayName().charAt(0)}
                              </span>
                            </div>
                          )}
                          
                          {isEditing && (
                            <button
                              onClick={triggerFileInput}
                              className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Camera className="w-8 h-8 text-white" />
                            </button>
                          )}
                        </div>
                        
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleImageUpload}
                          accept="image/*"
                          className="hidden"
                        />
                      </div>
                      
                      {/* User Info */}
                      <h2 className={`text-2xl font-bold ${
                        darkMode ? 'text-white' : 'text-gray-900'
                      }`}>{getUserDisplayName()}</h2>
                      <p className={`mb-3 ${
                        darkMode ? 'text-gray-300' : 'text-gray-600'
                      }`}>{formData.professionalTitle}</p>
                      
                      <div className="flex flex-wrap items-center justify-center gap-4">
                        <div className={`flex items-center text-sm ${
                          darkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          <Mail className="w-4 h-4 mr-1" />
                          {formData.email}
                        </div>
                      </div>
                    </div>

                    {/* Payment Methods Section */}
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <h3 className={`text-lg font-semibold ${
                          darkMode ? 'text-white' : 'text-gray-900'
                        }`}>Payment Methods</h3>
                        {isEditing && (
                          <button 
                            onClick={() => setShowAddPayment(true)}
                            className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                          >
                            Add Payment
                          </button>
                        )}
                      </div>
                      
                      {formData.paymentMethods.length > 0 ? (
                        <div className="space-y-3">
                          {formData.paymentMethods.map((method, index) => (
                            <div 
                              key={index} 
                              className={`p-3 rounded-lg border flex items-center ${
                                darkMode 
                                  ? 'bg-gray-700/50 border-gray-600' 
                                  : 'bg-gray-50 border-gray-200'
                              }`}
                            >
                              <div className="mr-3">
                                {method.type === 'visa' ? (
                                  <div className="w-12 h-8 bg-blue-600 rounded flex items-center justify-center">
                                    <span className="text-white text-xs font-bold">VISA</span>
                                  </div>
                                ) : (
                                  <div className="w-12 h-8 bg-orange-600 rounded flex items-center justify-center">
                                    <span className="text-white text-xs font-bold">MC</span>
                                  </div>
                                )}
                              </div>
                              <span className={
                                darkMode ? 'text-white font-medium' : 'text-gray-900 font-medium'
                              }>{method.number}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className={`text-center py-6 rounded-lg ${
                          darkMode 
                            ? 'bg-gray-700/30 border border-gray-600/50' 
                            : 'bg-gray-50 border border-gray-200'
                        }`}>
                          <CreditCard className="w-10 h-10 mx-auto mb-2" 
                            color={darkMode ? '#9CA3AF' : '#6B7280'} />
                          <p className={`text-sm ${
                            darkMode ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                            {isEditing 
                              ? 'No payment methods added yet' 
                              : 'No payment methods available'}
                          </p>
                          {isEditing && (
                            <button 
                              onClick={() => setShowAddPayment(true)}
                              className="text-green-600 hover:text-green-700 font-medium text-sm mt-1"
                            >
                              Add payment method
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Right Column - Profile Details */}
                <div className="lg:col-span-2">
                  <div className="space-y-8">
                    {/* Personal Information Section */}
                    <div>
                      <h3 className={`text-lg font-semibold mb-4 ${
                        darkMode ? 'text-white' : 'text-gray-900'
                      }`}>Personal Information</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className={`block text-sm font-medium mb-1 ${
                            darkMode ? 'text-gray-300' : 'text-gray-700'
                          }`}>First Name</label>
                          {isEditing ? (
                            <input
                              type="text"
                              name="firstName"
                              value={formData.firstName}
                              onChange={handleInputChange}
                              className={`w-full px-3 py-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                                darkMode 
                                  ? 'border border-gray-600 bg-gray-700 text-white' 
                                  : 'border border-gray-300 bg-white text-gray-900'
                              }`}
                            />
                          ) : (
                            <p className={
                              darkMode ? 'text-white py-2' : 'text-gray-900 py-2'
                            }>{formData.firstName}</p>
                          )}
                        </div>
                        
                        <div>
                          <label className={`block text-sm font-medium mb-1 ${
                            darkMode ? 'text-gray-300' : 'text-gray-700'
                          }`}>Last Name</label>
                          {isEditing ? (
                            <input
                              type="text"
                              name="lastName"
                              value={formData.lastName}
                              onChange={handleInputChange}
                              className={`w-full px-3 py-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                                darkMode 
                                  ? 'border border-gray-600 bg-gray-700 text-white' 
                                  : 'border border-gray-300 bg-white text-gray-900'
                              }`}
                            />
                          ) : (
                            <p className={
                              darkMode ? 'text-white py-2' : 'text-gray-900 py-2'
                            }>{formData.lastName}</p>
                          )}
                        </div>
                        
                        <div>
                          <div className="flex justify-between items-center">
                            <label className={`block text-sm font-medium mb-1 ${
                              darkMode ? 'text-gray-300' : 'text-gray-700'
                            }`}>Password</label>
                            {isEditing && (
                              <button 
                                onClick={() => setShowChangePassword(true)}
                                className="text-sm text-green-600 hover:text-green-700 font-medium flex items-center"
                              >
                                <Lock className="w-4 h-4 mr-1" />
                                Change
                              </button>
                            )}
                          </div>
                          {isEditing ? (
                            <div className="py-2">
                              <p className={
                                darkMode ? 'text-white' : 'text-gray-900'
                              }>••••••••</p>
                              <p className={`text-xs mt-1 ${
                                darkMode ? 'text-gray-400' : 'text-gray-500'
                              }`}>Click "Change" to update</p>
                            </div>
                          ) : (
                            <p className={
                              darkMode ? 'text-white py-2' : 'text-gray-900 py-2'
                            }>••••••••</p>
                          )}
                        </div>
                        
                        <div>
                          <label className={`block text-sm font-medium mb-1 ${
                            darkMode ? 'text-gray-300' : 'text-gray-700'
                          }`}>Email Address</label>
                          {isEditing ? (
                            <input
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              className={`w-full px-3 py-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                                darkMode 
                                  ? 'border border-gray-600 bg-gray-700 text-white' 
                                  : 'border border-gray-300 bg-white text-gray-900'
                              }`}
                            />
                          ) : (
                            <p className={
                              darkMode ? 'text-white py-2' : 'text-gray-900 py-2'
                            }>{formData.email}</p>
                          )}
                        </div>
                        
                        <div>
                          <label className={`block text-sm font-medium mb-1 ${
                            darkMode ? 'text-gray-300' : 'text-gray-700'
                          }`}>Phone Number</label>
                          {isEditing ? (
                            <input
                              type="tel"
                              name="phoneNumber"
                              value={formData.phoneNumber}
                              onChange={handleInputChange}
                              className={`w-full px-3 py-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                                darkMode 
                                  ? 'border border-gray-600 bg-gray-700 text-white' 
                                  : 'border border-gray-300 bg-white text-gray-900'
                              }`}
                            />
                          ) : (
                            <p className={
                              darkMode ? 'text-white py-2' : 'text-gray-900 py-2'
                            }>{formData.phoneNumber}</p>
                          )}
                        </div>
                        
                        <div>
                          <label className={`block text-sm font-medium mb-1 ${
                            darkMode ? 'text-gray-300' : 'text-gray-700'
                          }`}>Address</label>
                          {isEditing ? (
                            <input
                              type="text"
                              name="address"
                              value={formData.address}
                              onChange={handleInputChange}
                              className={`w-full px-3 py-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                                darkMode 
                                  ? 'border border-gray-600 bg-gray-700 text-white' 
                                  : 'border border-gray-300 bg-white text-gray-900'
                              }`}
                            />
                          ) : (
                            <p className={
                              darkMode ? 'text-white py-2' : 'text-gray-900 py-2'
                            }>{formData.address}</p>
                          )}
                        </div>
                        
                        <div>
                          <label className={`block text-sm font-medium mb-1 ${
                            darkMode ? 'text-gray-300' : 'text-gray-700'
                          }`}>Nation / Country</label>
                          {isEditing ? (
                            <div className="relative">
                              <div className="relative">
                                <input
                                  type="text"
                                  value={searchCountry || formData.country}
                                  onChange={(e) => setSearchCountry(e.target.value)}
                                  placeholder="Search country..."
                                  className={`w-full px-3 py-2 pl-10 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                                    darkMode 
                                      ? 'border border-gray-600 bg-gray-700 text-white' 
                                      : 'border border-gray-300 bg-white text-gray-900'
                                  }`}
                                />
                                <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                              </div>
                              {searchCountry && (
                                <div className={`absolute z-10 mt-1 w-full max-h-60 overflow-auto rounded-md shadow-lg ${
                                  darkMode 
                                    ? 'bg-gray-800 border border-gray-700' 
                                    : 'bg-white border border-gray-200'
                                }`}>
                                  {filteredCountries.length > 0 ? (
                                    filteredCountries.map((country) => (
                                      <div
                                        key={country}
                                        className={`px-4 py-2 cursor-pointer hover:${
                                          darkMode ? 'bg-gray-700' : 'bg-gray-100'
                                        }`}
                                        onClick={() => {
                                          setFormData({ ...formData, country })
                                          setSearchCountry('')
                                        }}
                                      >
                                        <span className={
                                          darkMode ? 'text-white' : 'text-gray-900'
                                        }>{country}</span>
                                      </div>
                                    ))
                                  ) : (
                                    <div className={
                                      darkMode ? 'px-4 py-2 text-gray-400' : 'px-4 py-2 text-gray-500'
                                    }>No countries found</div>
                                  )}
                                </div>
                              )}
                            </div>
                          ) : (
                            <p className={
                              darkMode ? 'text-white py-2' : 'text-gray-900 py-2'
                            }>{formData.country}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Additional Information Section */}
                    <div>
                      <h3 className={`text-lg font-semibold mb-4 ${
                        darkMode ? 'text-white' : 'text-gray-900'
                      }`}>Additional Information</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className={`block text-sm font-medium mb-1 ${
                            darkMode ? 'text-gray-300' : 'text-gray-700'
                          }`}>Gender</label>
                          {isEditing ? (
                            <select
                              name="gender"
                              value={formData.gender}
                              onChange={handleInputChange}
                              className={`w-full px-3 py-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                                darkMode 
                                  ? 'border border-gray-600 bg-gray-700 text-white' 
                                  : 'border border-gray-300 bg-white text-gray-900'
                              }`}
                            >
                              <option value="Male" className={
                                darkMode ? 'bg-gray-700' : 'bg-white'
                              }>Male</option>
                              <option value="Female" className={
                                darkMode ? 'bg-gray-700' : 'bg-white'
                              }>Female</option>
                              <option value="Other" className={
                                darkMode ? 'bg-gray-700' : 'bg-white'
                              }>Other</option>
                              <option value="Prefer not to say" className={
                                darkMode ? 'bg-gray-700' : 'bg-white'
                              }>Prefer not to say</option>
                            </select>
                          ) : (
                            <p className={
                              darkMode ? 'text-white py-2' : 'text-gray-900 py-2'
                            }>{formData.gender}</p>
                          )}
                        </div>
                        
                        <div>
                          <label className={`block text-sm font-medium mb-1 ${
                            darkMode ? 'text-gray-300' : 'text-gray-700'
                          }`}>Language</label>
                          {isEditing ? (
                            <select
                              name="language"
                              value={formData.language}
                              onChange={handleInputChange}
                              className={`w-full px-3 py-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                                darkMode 
                                  ? 'border border-gray-600 bg-gray-700 text-white' 
                                  : 'border border-gray-300 bg-white text-gray-900'
                              }`}
                            >
                              <option value="English" className={
                                darkMode ? 'bg-gray-700' : 'bg-white'
                              }>English</option>
                              <option value="Spanish" className={
                                darkMode ? 'bg-gray-700' : 'bg-white'
                              }>Spanish</option>
                              <option value="French" className={
                                darkMode ? 'bg-gray-700' : 'bg-white'
                              }>French</option>
                              <option value="German" className={
                                darkMode ? 'bg-gray-700' : 'bg-white'
                              }>German</option>
                              <option value="Chinese" className={
                                darkMode ? 'bg-gray-700' : 'bg-white'
                              }>Chinese</option>
                            </select>
                          ) : (
                            <p className={
                              darkMode ? 'text-white py-2' : 'text-gray-900 py-2'
                            }>{formData.language}</p>
                          )}
                        </div>
                        
                        <div>
                          <label className={`block text-sm font-medium mb-1 ${
                            darkMode ? 'text-gray-300' : 'text-gray-700'
                          }`}>Date of Birth</label>
                          {isEditing ? (
                            <div className="grid grid-cols-3 gap-2">
                              <select
                                name="dateOfBirth.month"
                                value={formData.dateOfBirth.month}
                                onChange={handleInputChange}
                                className={`px-3 py-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                                  darkMode 
                                    ? 'border border-gray-600 bg-gray-700 text-white' 
                                    : 'border border-gray-300 bg-white text-gray-900'
                                }`}
                              >
                                <option value="January" className={
                                  darkMode ? 'bg-gray-700' : 'bg-white'
                                }>January</option>
                                <option value="February" className={
                                  darkMode ? 'bg-gray-700' : 'bg-white'
                                }>February</option>
                                <option value="March" className={
                                  darkMode ? 'bg-gray-700' : 'bg-white'
                                }>March</option>
                                <option value="April" className={
                                  darkMode ? 'bg-gray-700' : 'bg-white'
                                }>April</option>
                                <option value="May" className={
                                  darkMode ? 'bg-gray-700' : 'bg-white'
                                }>May</option>
                                <option value="June" className={
                                  darkMode ? 'bg-gray-700' : 'bg-white'
                                }>June</option>
                                <option value="July" className={
                                  darkMode ? 'bg-gray-700' : 'bg-white'
                                }>July</option>
                                <option value="August" className={
                                  darkMode ? 'bg-gray-700' : 'bg-white'
                                }>August</option>
                                <option value="September" className={
                                  darkMode ? 'bg-gray-700' : 'bg-white'
                                }>September</option>
                                <option value="October" className={
                                  darkMode ? 'bg-gray-700' : 'bg-white'
                                }>October</option>
                                <option value="November" className={
                                  darkMode ? 'bg-gray-700' : 'bg-white'
                                }>November</option>
                                <option value="December" className={
                                  darkMode ? 'bg-gray-700' : 'bg-white'
                                }>December</option>
                              </select>
                              <select
                                name="dateOfBirth.day"
                                value={formData.dateOfBirth.day}
                                onChange={handleInputChange}
                                className={`px-3 py-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                                  darkMode 
                                    ? 'border border-gray-600 bg-gray-700 text-white' 
                                    : 'border border-gray-300 bg-white text-gray-900'
                                }`}
                              >
                                {[...Array(31)].map((_, i) => (
                                  <option key={i+1} value={i+1} className={
                                    darkMode ? 'bg-gray-700' : 'bg-white'
                                  }>{i+1}</option>
                                ))}
                              </select>
                              <select
                                name="dateOfBirth.year"
                                value={formData.dateOfBirth.year}
                                onChange={handleInputChange}
                                className={`px-3 py-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                                  darkMode 
                                    ? 'border border-gray-600 bg-gray-700 text-white' 
                                    : 'border border-gray-300 bg-white text-gray-900'
                                }`}
                              >
                                {[...Array(100)].map((_, i) => {
                                  const year = new Date().getFullYear() - i;
                                  return <option key={year} value={year} className={
                                    darkMode ? 'bg-gray-700' : 'bg-white'
                                  }>{year}</option>;
                                })}
                              </select>
                            </div>
                          ) : (
                            <p className={
                              darkMode ? 'text-white py-2' : 'text-gray-900 py-2'
                            }>
                              {formData.dateOfBirth.month} {formData.dateOfBirth.day}, {formData.dateOfBirth.year}
                            </p>
                          )}
                        </div>
                        
                        <div>
                          <label className={`block text-sm font-medium mb-1 ${
                            darkMode ? 'text-gray-300' : 'text-gray-700'
                          }`}>Professional Title</label>
                          {isEditing ? (
                            <input
                              type="text"
                              name="professionalTitle"
                              value={formData.professionalTitle}
                              onChange={handleInputChange}
                              className={`w-full px-3 py-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                                darkMode 
                                  ? 'border border-gray-600 bg-gray-700 text-white' 
                                  : 'border border-gray-300 bg-white text-gray-900'
                              }`}
                            />
                          ) : (
                            <p className={
                              darkMode ? 'text-white py-2' : 'text-gray-900 py-2'
                            }>{formData.professionalTitle}</p>
                          )}
                        </div>
                        
                        <div className="md:col-span-2">
                          <label className={`block text-sm font-medium mb-1 ${
                            darkMode ? 'text-gray-300' : 'text-gray-700'
                          }`}>Social Media Links</label>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {isEditing ? (
                              <>
                                <div className="flex items-center">
                                  <Twitter className="w-4 h-4 text-blue-400 mr-2" />
                                  <input
                                    type="text"
                                    name="socialMedia.twitter"
                                    value={formData.socialMedia.twitter}
                                    onChange={handleInputChange}
                                    placeholder="Twitter handle"
                                    className={`flex-1 px-3 py-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                                      darkMode 
                                        ? 'border border-gray-600 bg-gray-700 text-white' 
                                        : 'border border-gray-300 bg-white text-gray-900'
                                    }`}
                                  />
                                </div>
                                <div className="flex items-center">
                                  <Linkedin className="w-4 h-4 text-blue-600 mr-2" />
                                  <input
                                    type="text"
                                    name="socialMedia.linkedin"
                                    value={formData.socialMedia.linkedin}
                                    onChange={handleInputChange}
                                    placeholder="LinkedIn profile"
                                    className={`flex-1 px-3 py-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                                      darkMode 
                                        ? 'border border-gray-600 bg-gray-700 text-white' 
                                        : 'border border-gray-300 bg-white text-gray-900'
                                    }`}
                                  />
                                </div>
                                <div className="flex items-center">
                                  <Facebook className="w-4 h-4 text-blue-800 mr-2" />
                                  <input
                                    type="text"
                                    name="socialMedia.facebook"
                                    value={formData.socialMedia.facebook}
                                    onChange={handleInputChange}
                                    placeholder="Facebook profile"
                                    className={`flex-1 px-3 py-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                                      darkMode 
                                        ? 'border border-gray-600 bg-gray-700 text-white' 
                                        : 'border border-gray-300 bg-white text-gray-900'
                                    }`}
                                  />
                                </div>
                                <div className="flex items-center">
                                  <Github className="w-4 h-4 mr-2" 
                                    color={darkMode ? '#FFFFFF' : '#111827'} />
                                  <input
                                    type="text"
                                    name="socialMedia.github"
                                    value={formData.socialMedia.github}
                                    onChange={handleInputChange}
                                    placeholder="GitHub profile"
                                    className={`flex-1 px-3 py-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                                      darkMode 
                                        ? 'border border-gray-600 bg-gray-700 text-white' 
                                        : 'border border-gray-300 bg-white text-gray-900'
                                    }`}
                                  />
                                </div>
                              </>
                            ) : (
                              <>
                                <div className="flex items-center">
                                  <Twitter className="w-4 h-4 text-blue-400 mr-2" />
                                  <span className={
                                    darkMode ? 'text-white' : 'text-gray-900'
                                  }>{formData.socialMedia.twitter}</span>
                                </div>
                                <div className="flex items-center">
                                  <Linkedin className="w-4 h-4 text-blue-600 mr-2" />
                                  <span className={
                                    darkMode ? 'text-white' : 'text-gray-900'
                                  }>{formData.socialMedia.linkedin}</span>
                                </div>
                                <div className="flex items-center">
                                  <Facebook className="w-4 h-4 text-blue-800 mr-2" />
                                  <span className={
                                    darkMode ? 'text-white' : 'text-gray-900'
                                  }>{formData.socialMedia.facebook}</span>
                                </div>
                                <div className="flex items-center">
                                  <Github className="w-4 h-4 mr-2" 
                                    color={darkMode ? '#FFFFFF' : '#111827'} />
                                  <span className={
                                    darkMode ? 'text-white' : 'text-gray-900'
                                  }>{formData.socialMedia.github}</span>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      {showChangePassword && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className={`relative rounded-xl shadow-xl w-full max-w-md transform transition-all duration-300 backdrop-blur-lg ${
            darkMode 
              ? 'bg-gray-800/30 border border-gray-700/30' 
              : 'bg-white/30 border border-slate-200/30'
          }`}>
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className={`text-lg font-semibold ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>Change Password</h3>
                <button 
                  onClick={() => {
                    setShowChangePassword(false)
                    setPasswordForm({
                      currentPassword: '',
                      newPassword: '',
                      confirmNewPassword: ''
                    })
                  }}
                  className={
                    darkMode 
                      ? 'text-gray-400 hover:text-gray-200' 
                      : 'text-gray-500 hover:text-gray-700'
                  }
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium mb-1 ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>Current Password</label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={passwordForm.currentPassword}
                    onChange={handlePasswordChange}
                    className={`w-full px-3 py-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                      darkMode 
                        ? 'border border-gray-600 bg-gray-700/50 text-white backdrop-blur-sm' 
                        : 'border border-gray-300 bg-white/50 text-gray-900 backdrop-blur-sm'
                    }`}
                    placeholder="Enter current password"
                  />
                </div>
                
                <div>
                  <label className={`block text-sm font-medium mb-1 ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>New Password</label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordForm.newPassword}
                    onChange={handlePasswordChange}
                    className={`w-full px-3 py-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                      darkMode 
                        ? 'border border-gray-600 bg-gray-700/50 text-white backdrop-blur-sm' 
                        : 'border border-gray-300 bg-white/50 text-gray-900 backdrop-blur-sm'
                    }`}
                    placeholder="Enter new password"
                  />
                </div>
                
                <div>
                  <label className={`block text-sm font-medium mb-1 ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>Confirm New Password</label>
                  <input
                    type="password"
                    name="confirmNewPassword"
                    value={passwordForm.confirmNewPassword}
                    onChange={handlePasswordChange}
                    className={`w-full px-3 py-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                      darkMode 
                        ? 'border border-gray-600 bg-gray-700/50 text-white backdrop-blur-sm' 
                        : 'border border-gray-300 bg-white/50 text-gray-900 backdrop-blur-sm'
                    }`}
                    placeholder="Confirm new password"
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowChangePassword(false)
                    setPasswordForm({
                      currentPassword: '',
                      newPassword: '',
                      confirmNewPassword: ''
                    })
                  }}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    darkMode 
                      ? 'border border-gray-600 text-gray-300 hover:bg-gray-700/50 backdrop-blur-sm' 
                      : 'border border-gray-300 text-gray-700 hover:bg-white/50 backdrop-blur-sm'
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdatePassword}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors backdrop-blur-sm"
                >
                  Update Password
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Payment Method Modal */}
      {showAddPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className={`relative rounded-xl shadow-xl w-full max-w-md transform transition-all duration-300 backdrop-blur-lg ${
            darkMode 
              ? 'bg-gray-800/30 border border-gray-700/30' 
              : 'bg-white/30 border border-slate-200/30'
                  }`}>
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className={`text-lg font-semibold ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>Add Payment Method</h3>
                <button 
                  onClick={() => {
                    setShowAddPayment(false)
                    setPaymentForm({
                      cardType: 'visa',
                      cardNumber: '',
                      expirationDate: '',
                      cvv: '',
                      cardholderName: ''
                    })
                  }}
                  className={
                    darkMode 
                      ? 'text-gray-400 hover:text-gray-200' 
                      : 'text-gray-500 hover:text-gray-700'
                  }
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium mb-1 ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>Card Type</label>
                  <select
                    name="cardType"
                    value={paymentForm.cardType}
                    onChange={handlePaymentChange}
                    className={`w-full px-3 py-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                      darkMode 
                        ? 'border border-gray-600 bg-gray-700/50 text-white backdrop-blur-sm' 
                        : 'border border-gray-300 bg-white/50 text-gray-900 backdrop-blur-sm'
                    }`}
                  >
                    <option value="visa" className={
                      darkMode ? 'bg-gray-700' : 'bg-white'
                    }>Visa</option>
                    <option value="mastercard" className={
                      darkMode ? 'bg-gray-700' : 'bg-white'
                    }>MasterCard</option>
                    <option value="amex" className={
                      darkMode ? 'bg-gray-700' : 'bg-white'
                    }>American Express</option>
                  </select>
                </div>
                
                <div>
                  <label className={`block text-sm font-medium mb-1 ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>Card Number</label>
                  <input
                    type="text"
                    name="cardNumber"
                    value={paymentForm.cardNumber}
                    onChange={handlePaymentChange}
                    className={`w-full px-3 py-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                      darkMode 
                        ? 'border border-gray-600 bg-gray-700/50 text-white backdrop-blur-sm' 
                        : 'border border-gray-300 bg-white/50 text-gray-900 backdrop-blur-sm'
                    }`}
                    placeholder="1234 5678 9012 3456"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${
                      darkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>Expiration Date</label>
                    <input
                      type="text"
                      name="expirationDate"
                      value={paymentForm.expirationDate}
                      onChange={handlePaymentChange}
                      className={`w-full px-3 py-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                        darkMode 
                          ? 'border border-gray-600 bg-gray-700/50 text-white backdrop-blur-sm' 
                          : 'border border-gray-300 bg-white/50 text-gray-900 backdrop-blur-sm'
                      }`}
                      placeholder="MM/YY"
                    />
                  </div>
                  
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${
                      darkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>CVV</label>
                    <input
                      type="text"
                      name="cvv"
                      value={paymentForm.cvv}
                      onChange={handlePaymentChange}
                      className={`w-full px-3 py-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                        darkMode 
                          ? 'border border-gray-600 bg-gray-700/50 text-white backdrop-blur-sm' 
                          : 'border border-gray-300 bg-white/50 text-gray-900 backdrop-blur-sm'
                      }`}
                      placeholder="123"
                    />
                  </div>
                </div>
                
                <div>
                  <label className={`block text-sm font-medium mb-1 ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>Cardholder Name</label>
                  <input
                    type="text"
                    name="cardholderName"
                    value={paymentForm.cardholderName}
                    onChange={handlePaymentChange}
                    className={`w-full px-3 py-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                      darkMode 
                        ? 'border border-gray-600 bg-gray-700/50 text-white backdrop-blur-sm' 
                        : 'border border-gray-300 bg-white/50 text-gray-900 backdrop-blur-sm'
                    }`}
                    placeholder="Full name as on card"
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowAddPayment(false)
                    setPaymentForm({
                      cardType: 'visa',
                      cardNumber: '',
                      expirationDate: '',
                      cvv: '',
                      cardholderName: ''
                    })
                  }}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    darkMode 
                      ? 'border border-gray-600 text-gray-300 hover:bg-gray-700/50 backdrop-blur-sm' 
                      : 'border border-gray-300 text-gray-700 hover:bg-white/50 backdrop-blur-sm'
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddPaymentMethod}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors backdrop-blur-sm"
                >
                  Add Payment Method
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
