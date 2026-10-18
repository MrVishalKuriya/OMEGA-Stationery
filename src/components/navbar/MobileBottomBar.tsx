import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Grid, Search, Heart, ShoppingBag } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

interface MobileBottomBarProps {
  onOpenMobileMenu: () => void;
  onOpenSearch: () => void;
  onOpenWishlist: () => void;
  onOpenCart: () => void;
}

export const MobileBottomBar: React.FC<MobileBottomBarProps> = ({
  onOpenMobileMenu,
  onOpenSearch,
  onOpenWishlist,
  onOpenCart,
}) => {
  const { cartItemCount, wishlistCount } = useStore();
  const location = useLocation();

  return (
    <nav
      aria-label="Mobile Bottom Navigation"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#fafafa]/95 backdrop-blur-md border-t border-[#e2dedb] shadow-lg px-2 py-1.5 pb-[max(0.375rem,env(safe-area-inset-bottom))]"
    >
      <div className="grid grid-cols-5 items-center max-w-md mx-auto text-[11px] font-medium">
        {/* Home */}
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center min-h-[44px] py-1 transition-colors ${
              isActive ? 'text-[#4b423b] font-bold' : 'text-[#6B7280] hover:text-[#14182B]'
            }`
          }
        >
          <Home className="w-5 h-5 stroke-[1.5]" />
          <span className="text-[10px] mt-0.5">Home</span>
        </NavLink>

        {/* Categories */}
        <button
          type="button"
          onClick={onOpenMobileMenu}
          className="flex flex-col items-center justify-center min-h-[44px] py-1 text-[#6B7280] hover:text-[#4b423b] transition-colors"
        >
          <Grid className="w-5 h-5 stroke-[1.5]" />
          <span className="text-[10px] mt-0.5">Categories</span>
        </button>

        {/* Search */}
        <button
          type="button"
          onClick={onOpenSearch}
          className="flex flex-col items-center justify-center min-h-[44px] py-1 text-[#6B7280] hover:text-[#4b423b] transition-colors"
        >
          <Search className="w-5 h-5 stroke-[1.5]" />
          <span className="text-[10px] mt-0.5">Search</span>
        </button>

        {/* Wishlist */}
        <button
          type="button"
          onClick={onOpenWishlist}
          className="flex flex-col items-center justify-center min-h-[44px] py-1 text-[#6B7280] hover:text-[#4b423b] transition-colors relative"
        >
          <div className="relative">
            <Heart className={`w-5 h-5 stroke-[1.5] ${wishlistCount > 0 ? 'fill-[#D64545] text-[#D64545]' : ''}`} />
            {wishlistCount > 0 && (
              <span className="absolute -top-1.5 -right-2.5 w-4 h-4 rounded-full bg-[#D64545] text-white text-[9px] font-bold flex items-center justify-center font-mono">
                {wishlistCount}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-0.5">Wishlist</span>
        </button>

        {/* Cart */}
        <button
          type="button"
          onClick={onOpenCart}
          className="flex flex-col items-center justify-center min-h-[44px] py-1 text-[#4b423b] font-bold transition-colors relative"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5 stroke-[1.5] text-[#4b423b]" />
            <span className="absolute -top-1.5 -right-2.5 w-4 h-4 rounded-full bg-[#c49b7c] text-[#4b423b] text-[9px] font-black flex items-center justify-center font-mono shadow-xs">
              {cartItemCount}
            </span>
          </div>
          <span className="text-[10px] mt-0.5">Bag</span>
        </button>
      </div>
    </nav>
  );
};
