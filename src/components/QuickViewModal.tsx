import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';

export const QuickViewModal: React.FC = () => {
  const navigate = useNavigate();
  const { quickViewProduct, setQuickViewProduct } = useStore();

  useEffect(() => {
    if (quickViewProduct) {
      const id = quickViewProduct.id;
      setQuickViewProduct(null);
      navigate(`/product/${id}`);
    }
  }, [quickViewProduct, navigate, setQuickViewProduct]);

  return null;
};
