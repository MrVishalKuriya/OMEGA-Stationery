import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/context/StoreContext';

export const OrderTrackingModal: React.FC = () => {
  const navigate = useNavigate();
  const { isTrackingModalOpen, setIsTrackingModalOpen } = useStore();

  useEffect(() => {
    if (isTrackingModalOpen) {
      setIsTrackingModalOpen(false);
      navigate('/tracking');
    }
  }, [isTrackingModalOpen, navigate, setIsTrackingModalOpen]);

  return null;
};
