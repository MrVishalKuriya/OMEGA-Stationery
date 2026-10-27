import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface WholesaleCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WholesaleCalculatorModal: React.FC<WholesaleCalculatorModalProps> = ({
  isOpen,
  onClose,
}) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      onClose();
      navigate('/wholesale#calculator');
    }
  }, [isOpen, navigate, onClose]);

  return null;
};
