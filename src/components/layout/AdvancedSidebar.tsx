'use client'

import SharedSidebar from './SharedSidebar'
import DeleteAccountPopup from './DeleteAccountPopup'
import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'

export default function AdvancedSidebar() {
  const { signOut } = useAuth()
  const [showDeletePopup, setShowDeletePopup] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  
  const handleDeletePopupOpen = () => setShowDeletePopup(true)
  const handleDeletePopupClose = () => setShowDeletePopup(false)
  const handleDeleteConfirm = async (password: string) => {
    setIsDeleting(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      // Handle actual deletion logic here
      console.log('Account deleted with password:', password)
      // Sign out the user after deletion
      await signOut()
    } catch (error) {
      console.error('Error deleting account:', error)
    } finally {
      setIsDeleting(false)
      setShowDeletePopup(false)
    }
  }

  return (
    <>
      <SharedSidebar 
        onDeletePopupOpen={handleDeletePopupOpen}
        showDeletePopup={showDeletePopup}
        onDeletePopupClose={handleDeletePopupClose}
        onDeleteConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
      />
    </>
  )
}