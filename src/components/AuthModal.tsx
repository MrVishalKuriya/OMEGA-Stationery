import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';

export const AuthModal: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthModalOpen, authModalMode, closeAuthModal } = useStore();

  useEffect(() => {
    if (isAuthModalOpen) {
      closeAuthModal();
      navigate(authModalMode === 'register' ? '/register' : '/login');
    }
  }, [isAuthModalOpen, authModalMode, closeAuthModal, navigate]);

  return null;
};
