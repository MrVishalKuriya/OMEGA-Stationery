import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface ProductCompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialProductIds?: string[];
}

export const ProductCompareModal: React.FC<ProductCompareModalProps> = ({
  isOpen,
  onClose,
}) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      onClose();
      navigate('/catalog');
    }
  }, [isOpen, navigate, onClose]);

  return null;
};
