import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/context/StoreContext';

export const WishlistModal: React.FC = () => {
  const navigate = useNavigate();
  const { isWishlistModalOpen, setIsWishlistModalOpen } = useStore();

  useEffect(() => {
    if (isWishlistModalOpen) {
      setIsWishlistModalOpen(false);
      navigate('/wishlist');
    }
  }, [isWishlistModalOpen, navigate, setIsWishlistModalOpen]);

  return null;
};
