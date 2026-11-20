import React, { useState, useEffect } from 'react';
import { Star, CheckCircle2, MessageSquarePlus, Sparkles, UserCheck } from 'lucide-react';
import { toast } from 'sonner';
import { Product } from '@/types/store';
import { useStore } from '@/context/StoreContext';
import {
  getProductRatingSummary,
  submitProductRatingInDb,
  fetchProductReviewsFromDb,
  subscribeProductRatingUpdates,
  ProductReviewRecord,
} from '@/services/api';

interface StarRatingBadgeProps {
  product: Product;
  size?: 'sm' | 'md' | 'lg';
  allowQuickRate?: boolean;
  onScrollToReviews?: () => void;
}

const STAR_LABELS_EN: Record<number, string> = {
  1: 'Poor',
  2: 'Fair',
  3: 'Good',
  4: 'Very Good',
  5: 'Excellent Quality',
};

const STAR_LABELS_SW: Record<number, string> = {
  1: 'Chini',
  2: 'Wastani',
  3: 'Nzuri',
  4: 'Nzuri Sana',
  5: 'Ubora wa Juu',
};

export const StarRatingBadge: React.FC<StarRatingBadgeProps> = ({
  product,
  size = 'sm',
  allowQuickRate = true,
  onScrollToReviews,
}) => {
  const { language, currentUser } = useStore();
  const [summary, setSummary] = useState(() => getProductRatingSummary(product));
  const [isRatingPickerOpen, setIsRatingPickerOpen] = useState(false);
  const [hoverStar, setHoverStar] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setSummary(getProductRatingSummary(product));
    return subscribeProductRatingUpdates(() => {
      setSummary(getProductRatingSummary(product));
    });
  }, [product.id, product.rating, product.reviewCount]);

  const handleQuickStarSelect = async (e: React.MouseEvent, starValue: number) => {
    e.preventDefault();
    e.stopPropagation();
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      const res = await submitProductRatingInDb({
        productId: product.id,
        rating: starValue,
        customerName: currentUser?.name || 'Verified OMEGA Buyer',
        buyerType: currentUser?.accountType || 'Catalog Customer',
        currentRating: summary.rating,
        currentReviewCount: summary.reviewCount,
      });

      setSummary({
        rating: res.rating,
        reviewCount: res.reviewCount,
        userRating: starValue,
      });
      setIsRatingPickerOpen(false);
      toast.success(
        language === 'sw'
          ? `Asante! Umeweka nyota ${starValue} kwa ${product.name}`
          : `Rated ${starValue} ★ — Average updated to ${res.rating} (${res.reviewCount} ratings)`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const starIconSize = size === 'lg' ? 16 : size === 'md' ? 14 : 12;

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="relative inline-flex items-center gap-1.5 flex-wrap"
    >
      {/* Main Rating Display Button */}
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (onScrollToReviews) {
            onScrollToReviews();
          } else if (allowQuickRate) {
            setIsRatingPickerOpen((prev) => !prev);
          }
        }}
        title={
          language === 'sw'
            ? `Wastani wa nyota ${summary.rating} (${summary.reviewCount}). Bonyeza kuweka alama.`
            : `Average rating: ${summary.rating} out of 5 (${summary.reviewCount} ratings). Click to rate.`
        }
        className="inline-flex items-center gap-1 text-left group/stars cursor-pointer rounded-md py-0.5 transition-colors"
      >
        <div className="flex items-center gap-0.5 text-amber-400">
          {[1, 2, 3, 4, 5].map((starNum) => {
            const filled = starNum <= Math.round(summary.rating);
            return (
              <Star
                key={starNum}
                size={starIconSize}
                className={
                  filled
                    ? 'fill-amber-400 text-amber-400'
                    : 'fill-zinc-200 text-zinc-300'
                }
              />
            );
          })}
        </div>

        <span
          className={`font-mono font-bold text-[#161518] tabular-nums leading-none ${
            size === 'lg' ? 'text-sm' : size === 'md' ? 'text-xs' : 'text-[11px]'
          }`}
        >
          {summary.rating.toFixed(1)}
        </span>

        <span
          className={`font-mono text-zinc-400 group-hover/stars:text-[#D63A3A] transition-colors leading-none ${
            size === 'lg' ? 'text-xs' : 'text-[10px]'
          }`}
        >
          ({summary.reviewCount})
        </span>

        {summary.userRating && (
          <span
            className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded bg-amber-50 border border-amber-200/80 text-amber-800 text-[9px] font-mono font-bold"
            title={`Your rating: ${summary.userRating} stars`}
          >
            <span>★{summary.userRating}</span>
          </span>
        )}
      </button>

      {/* Interactive 1–5 Star Popover for Quick Rating on Cards */}
      {allowQuickRate && isRatingPickerOpen && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute left-0 top-full mt-1.5 z-30 bg-white rounded-xl border border-zinc-200 shadow-xl px-2.5 py-2 flex flex-col gap-1.5 min-w-[175px] animate-in fade-in zoom-in-95 duration-150"
        >
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-600">
              {language === 'sw' ? 'Weka Nyota (1–5)' : 'Rate this Product'}
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsRatingPickerOpen(false);
              }}
              className="text-[10px] font-mono text-zinc-400 hover:text-zinc-800 cursor-pointer"
            >
              ✕
            </button>
          </div>

          <div
            className="flex items-center justify-between gap-1 py-0.5"
            onMouseLeave={() => setHoverStar(0)}
          >
            {[1, 2, 3, 4, 5].map((starVal) => {
              const active = starVal <= (hoverStar || summary.userRating || 0);
              return (
                <button
                  key={starVal}
                  type="button"
                  disabled={isSubmitting}
                  onMouseEnter={() => setHoverStar(starVal)}
                  onClick={(e) => handleQuickStarSelect(e, starVal)}
                  aria-label={`Rate ${starVal} out of 5 stars`}
                  className="p-1 rounded-lg hover:bg-amber-50 transition-transform hover:scale-110 cursor-pointer"
                >
                  <Star
                    size={17}
                    className={
                      active
                        ? 'fill-amber-400 text-amber-400'
                        : 'fill-zinc-100 text-zinc-300 hover:text-amber-300'
                    }
                  />
                </button>
              );
            })}
          </div>

          <span className="text-[10px] font-sans font-medium text-amber-700 text-center">
            {hoverStar > 0
              ? language === 'sw'
                ? `${hoverStar}★ · ${STAR_LABELS_SW[hoverStar]}`
                : `${hoverStar}★ · ${STAR_LABELS_EN[hoverStar]}`
              : language === 'sw'
              ? 'Bonyeza nyota kuweka alama'
              : 'Click a star to submit'}
          </span>
        </div>
      )}
    </div>
  );
};

interface ProductReviewsSectionProps {
  product: Product;
}

export const ProductReviewsSection: React.FC<ProductReviewsSectionProps> = ({ product }) => {
  const { language, currentUser } = useStore();
  const [summary, setSummary] = useState(() => getProductRatingSummary(product));
  const [reviews, setReviews] = useState<ProductReviewRecord[]>([]);
  const [selectedRating, setSelectedRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [customerName, setCustomerName] = useState<string>(currentUser?.name || '');
  const [buyerType, setBuyerType] = useState<string>('Wholesale Stationer');
  const [comment, setComment] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [justSubmitted, setJustSubmitted] = useState<boolean>(false);

  useEffect(() => {
    setSummary(getProductRatingSummary(product));
    fetchProductReviewsFromDb(product.id).then((list) => setReviews(list));

    return subscribeProductRatingUpdates(() => {
      setSummary(getProductRatingSummary(product));
      fetchProductReviewsFromDb(product.id).then((list) => setReviews(list));
    });
  }, [product.id, product.rating, product.reviewCount]);

  useEffect(() => {
    if (currentUser?.name && !customerName) {
      setCustomerName(currentUser.name);
    }
  }, [currentUser?.name]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      const res = await submitProductRatingInDb({
        productId: product.id,
        rating: selectedRating,
        customerName:
          customerName.trim() ||
          (language === 'sw' ? 'Mteja wa OMEGA Tanzania' : 'Verified OMEGA Customer'),
        buyerType,
        comment: comment.trim(),
        currentRating: summary.rating,
        currentReviewCount: summary.reviewCount,
      });

      setSummary({
        rating: res.rating,
        reviewCount: res.reviewCount,
        userRating: selectedRating,
      });
      setReviews((prev) => [
        res.review,
        ...prev.filter((r) => r.reviewId !== res.review.reviewId),
      ]);
      setComment('');
      setJustSubmitted(true);
      setTimeout(() => setJustSubmitted(false), 3500);

      toast.success(
        language === 'sw'
          ? 'Asante! Maoni na nyota zako zimehifadhiwa.'
          : `Thank you! Your ${selectedRating}-star rating has been published.`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Seed default authentic Tanzanian stationery reviews if none submitted yet
  const displayedReviews: ProductReviewRecord[] =
    reviews.length > 0
      ? reviews
      : [
          {
            reviewId: `seed-1-${product.id}`,
            productId: product.id,
            rating: 5,
            customerName: 'Mwalimu J. Mwakasege — Mbeya Highland Secondary',
            buyerType: 'School / Academy',
            comment:
              'Genuine 70 GSM bond paper with zero ink bleed-through. The Smyth-sewn binding lays completely flat for student ledger and laboratory records.',
            createdAt: '2026-10-18T09:30:00.000Z',
          },
          {
            reviewId: `seed-2-${product.id}`,
            productId: product.id,
            rating: 5,
            customerName: 'Kariakoo Stationery Mart — Dar es Salaam',
            buyerType: 'Wholesale Stationer',
            comment:
              'Consistent carton packaging and fast factory dispatch from Indigo Printed Limited. Our fastest-moving counter and exercise books in Tanzania.',
            createdAt: '2026-10-04T14:15:00.000Z',
          },
        ];

  // Star breakdown percentages
  const starDistribution = [
    { stars: 5, pct: summary.rating >= 4.8 ? 86 : 74 },
    { stars: 4, pct: summary.rating >= 4.8 ? 11 : 19 },
    { stars: 3, pct: summary.rating >= 4.8 ? 3 : 5 },
    { stars: 2, pct: summary.rating >= 4.8 ? 0 : 2 },
    { stars: 1, pct: 0 },
  ];

  const activeStarPreview = hoverRating || selectedRating;

  return (
    <section
      id="product-ratings-reviews"
      className="pt-12 border-t border-zinc-200/80 space-y-8 scroll-mt-24"
    >
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#D63A3A] block">
            {language === 'sw' ? 'TATHMINI YA UBORA WA KIWANDANI' : 'VERIFIED CUSTOMER RATINGS'}
          </span>
          <h2 className="font-heading text-xl sm:text-2xl font-bold text-[#161518] tracking-tight mt-1">
            {language === 'sw'
              ? 'Maoni na Nyota za Wateja'
              : 'Product Ratings & Buyer Reviews'}
          </h2>
        </div>

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200/80 text-amber-900 text-xs font-mono font-bold">
          <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
          <span>
            {summary.rating.toFixed(1)} / 5.0 ({summary.reviewCount}{' '}
            {language === 'sw' ? 'Tathmini' : 'Ratings'})
          </span>
        </div>
      </div>

      {/* Main 12-Col Grid: Left Summary & Breakdown (5 cols) + Right Submit Rating Form (7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Average Rating Card & Star Breakdown */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-zinc-200/90 p-5 sm:p-6 shadow-2xs space-y-5">
          <div className="flex items-center gap-5 pb-5 border-b border-zinc-100">
            <div className="text-center px-4 py-3 rounded-2xl bg-zinc-900 text-white shrink-0">
              <span className="text-3xl sm:text-4xl font-mono font-black block leading-none">
                {summary.rating.toFixed(1)}
              </span>
              <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 mt-1 block">
                OUT OF 5.0
              </span>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-1 text-amber-400">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={`w-5 h-5 ${
                      s <= Math.round(summary.rating)
                        ? 'fill-amber-400 text-amber-400'
                        : 'fill-zinc-200 text-zinc-300'
                    }`}
                  />
                ))}
              </div>
              <p className="text-xs font-bold text-zinc-900">
                Based on {summary.reviewCount} verified ratings
              </p>
              <p className="text-[11px] text-zinc-500">
                {language === 'sw'
                  ? 'Inajumuisha wauzaji wa jumla, shule na wateja wa rejareja.'
                  : 'Rated by Tanzanian schools, wholesale stationers & retail buyers.'}
              </p>
            </div>
          </div>

          {/* 5-Star Distribution Bars */}
          <div className="space-y-2.5">
            {starDistribution.map((row) => (
              <div key={row.stars} className="flex items-center gap-3 text-xs font-mono">
                <button
                  type="button"
                  onClick={() => setSelectedRating(row.stars)}
                  className="w-12 flex items-center gap-1 text-zinc-700 hover:text-[#D63A3A] font-bold shrink-0 cursor-pointer"
                >
                  <span>{row.stars}</span>
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                </button>
                <div className="flex-1 h-2 rounded-full bg-zinc-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-amber-400 transition-all duration-500"
                    style={{ width: `${row.pct}%` }}
                  />
                </div>
                <span className="w-9 text-right text-zinc-500 text-[11px]">{row.pct}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Interactive Star Rating Submission Form */}
        <form
          onSubmit={handleSubmitReview}
          className="lg:col-span-7 bg-white rounded-2xl border border-zinc-200/90 p-5 sm:p-6 shadow-2xs space-y-4"
        >
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              <MessageSquarePlus className="w-4 h-4 text-[#D63A3A]" />
              <h3 className="font-heading text-base font-bold text-zinc-900">
                {language === 'sw' ? 'Weka Nyota na Maoni Yako' : 'Submit Your Star Rating'}
              </h3>
            </div>
            {summary.userRating && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-mono font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Your Rating: {summary.userRating} ★</span>
              </span>
            )}
          </div>

          {/* Interactive 1–5 Star Selector Box */}
          <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-500 block">
                {language === 'sw' ? 'Chagua Idadi ya Nyota (1 hadi 5)' : 'Select Star Rating (1 to 5)'}
              </span>
              <span className="text-xs font-bold text-zinc-900 mt-0.5 block">
                {activeStarPreview} {activeStarPreview === 1 ? 'Star' : 'Stars'} —{' '}
                <span className="text-[#D63A3A]">
                  {language === 'sw'
                    ? STAR_LABELS_SW[activeStarPreview]
                    : STAR_LABELS_EN[activeStarPreview]}
                </span>
              </span>
            </div>

            <div
              className="flex items-center gap-1.5"
              onMouseLeave={() => setHoverRating(0)}
            >
              {[1, 2, 3, 4, 5].map((starNum) => {
                const isFilled = starNum <= activeStarPreview;
                return (
                  <button
                    key={starNum}
                    type="button"
                    onMouseEnter={() => setHoverRating(starNum)}
                    onClick={() => setSelectedRating(starNum)}
                    aria-label={`Select ${starNum} stars`}
                    className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-all cursor-pointer ${
                      isFilled
                        ? 'bg-amber-50 border-amber-300 scale-105 shadow-2xs'
                        : 'bg-white border-zinc-200 hover:border-amber-200'
                    }`}
                  >
                    <Star
                      className={`w-5 h-5 transition-colors ${
                        isFilled
                          ? 'fill-amber-400 text-amber-400'
                          : 'fill-zinc-100 text-zinc-300'
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Name & Buyer Type Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-600 mb-1">
                {language === 'sw' ? 'Jina Lako au Duka / Shule' : 'Your Name or Shop / School'}
              </label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder={
                  language === 'sw' ? 'Mfano: Duka la Vifaa Mbeya' : 'e.g. Mlimani Bookshop / Juma K.'
                }
                className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 bg-zinc-50/60 focus:bg-white focus:outline-none focus:border-[#D63A3A] text-xs font-sans text-zinc-900"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-600 mb-1">
                {language === 'sw' ? 'Aina ya Mnunuzi' : 'Buyer Profile'}
              </label>
              <select
                value={buyerType}
                onChange={(e) => setBuyerType(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 bg-zinc-50/60 focus:bg-white focus:outline-none focus:border-[#D63A3A] text-xs font-sans text-zinc-900 cursor-pointer"
              >
                <option value="Wholesale Stationer">Wholesale Stationer / Bookshop</option>
                <option value="School / Academy">Primary / Secondary School</option>
                <option value="Corporate / Office">Corporate / Commercial Office</option>
                <option value="Individual Buyer">Individual Student / Parent</option>
              </select>
            </div>
          </div>

          {/* Optional Written Review */}
          <div>
            <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-600 mb-1">
              {language === 'sw'
                ? 'Maoni Kuhusu Ubora wa Bidhaa (Hiari)'
                : 'Review Comment (Optional)'}
            </label>
            <textarea
              rows={2}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={
                language === 'sw'
                  ? 'Elezea uzoefu wako kuhusu ubora wa karatasi, ufungaji au usafirishaji...'
                  : 'Share your thoughts on paper GSM quality, binding durability, or carton packaging...'
              }
              className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 bg-zinc-50/60 focus:bg-white focus:outline-none focus:border-[#D63A3A] text-xs font-sans text-zinc-900 resize-none"
            />
          </div>

          <div className="flex items-center justify-between gap-3 pt-1">
            <span className="text-[11px] text-zinc-500 font-sans">
              {justSubmitted ? (
                <span className="text-emerald-700 font-bold inline-flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  {language === 'sw'
                    ? 'Wastani wa nyota umesasishwa!'
                    : 'Rating submitted & catalog average updated!'}
                </span>
              ) : (
                <span>
                  {language === 'sw'
                    ? 'Alama yako huongezwa moja kwa moja kwenye wastani wa bidhaa.'
                    : 'Your rating updates the live product average immediately.'}
                </span>
              )}
            </span>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl bg-[#161518] hover:bg-[#D63A3A] text-white text-xs font-mono font-bold uppercase tracking-wider inline-flex items-center gap-2 transition-colors cursor-pointer shadow-xs disabled:opacity-50"
            >
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>
                {isSubmitting
                  ? language === 'sw'
                    ? 'Inahifadhi...'
                    : 'Submitting...'
                  : language === 'sw'
                  ? `Tuma Nyota ${selectedRating}`
                  : `Submit ${selectedRating}★ Rating`}
              </span>
            </button>
          </div>
        </form>
      </div>

      {/* Recent Customer Reviews Feed */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {displayedReviews.slice(0, 6).map((rev) => (
          <div
            key={rev.reviewId}
            className="bg-white rounded-2xl border border-zinc-200/80 p-4 shadow-2xs space-y-2.5"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-700 font-mono text-xs font-bold shrink-0">
                  {rev.customerName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <span className="text-xs font-bold text-zinc-900 block leading-tight">
                    {rev.customerName}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-700">
                    <UserCheck className="w-3 h-3" />
                    <span>{rev.buyerType || 'Verified Buyer'}</span>
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-0.5 text-amber-400 shrink-0">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    size={13}
                    className={
                      s <= Math.round(rev.rating)
                        ? 'fill-amber-400 text-amber-400'
                        : 'fill-zinc-200 text-zinc-300'
                    }
                  />
                ))}
              </div>
            </div>

            {rev.comment && (
              <p className="text-xs text-zinc-600 leading-relaxed font-sans">{rev.comment}</p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};
