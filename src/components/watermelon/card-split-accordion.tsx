import React, { useState, type FC } from 'react';
import { motion, MotionConfig, type Transition } from 'motion/react';
import { ChevronDown } from 'lucide-react';

export interface AccordionItemData {
  id: number | string;
  title: string;
  icon?: React.ReactNode;
  content: string | React.ReactNode;
}

interface AccordionItemProps {
  item: AccordionItemData;
  setOpenId: (id: number | string | null) => void;
  index: number;
  total: number;
  openIndex: number;
}

interface AccordionProps {
  items: AccordionItemData[];
  className?: string;
}

const springTransition: Transition = {
  type: 'spring',
  stiffness: 500,
  damping: 42,
  mass: 1,
};

const AccordionItem: FC<AccordionItemProps> = ({
  item,
  setOpenId,
  index,
  total,
  openIndex,
}) => {
  const isOpen = index === openIndex;

  const isFirst = index === 0;
  const isLast = index === total - 1;

  const isBeforeOpen = index === openIndex - 1;
  const isAfterOpen = index === openIndex + 1;

  const isAlone = (isAfterOpen && isLast) || (isBeforeOpen && isFirst);

  const BORDER_WIDTH = '1px';
  const BORDER_STYLE = 'solid';
  const borderTopWidth = isFirst || isAfterOpen || isOpen ? BORDER_WIDTH : '0px';
  const borderBottomWidth = isLast || isBeforeOpen || isOpen ? BORDER_WIDTH : '0px';
  const borderLeftWidth = BORDER_WIDTH;
  const borderRightWidth = BORDER_WIDTH;

  let borderTopLeftRadius = 0;
  let borderTopRightRadius = 0;
  let borderBottomLeftRadius = 0;
  let borderBottomRightRadius = 0;

  if (isOpen || isAlone) {
    borderTopLeftRadius = 18;
    borderTopRightRadius = 18;
    borderBottomLeftRadius = 18;
    borderBottomRightRadius = 18;
  } else if (isBeforeOpen) {
    borderBottomLeftRadius = 18;
    borderBottomRightRadius = 18;
  } else if (isAfterOpen) {
    borderTopLeftRadius = 18;
    borderTopRightRadius = 18;
  } else if (isFirst) {
    borderTopLeftRadius = 18;
    borderTopRightRadius = 18;
  } else if (isLast) {
    borderBottomLeftRadius = 18;
    borderBottomRightRadius = 18;
  }

  return (
    <MotionConfig transition={springTransition}>
      <motion.li layout className="list-none w-full">
        <motion.div
          animate={{
            borderTopLeftRadius,
            borderTopRightRadius,
            borderBottomLeftRadius,
            borderBottomRightRadius,
          }}
          className={`overflow-hidden border-[var(--border)] transition-colors duration-200 ${
            isOpen
              ? 'bg-[var(--surface-1)] shadow-lg shadow-black/5 dark:shadow-black/20 border-[var(--gold)]/40'
              : 'bg-[var(--surface-2)]/60 hover:bg-[var(--surface-2)]'
          }`}
          style={{
            borderTopWidth,
            borderBottomWidth,
            borderLeftWidth,
            borderRightWidth,
            borderStyle: BORDER_STYLE,
            marginBlock: isOpen ? '12px' : '0px',
          }}
        >
          <button
            type="button"
            onClick={() => setOpenId(isOpen ? null : item.id)}
            className="flex w-full cursor-pointer items-center justify-between p-4 sm:p-5 text-left transition-colors"
          >
            <div className="flex items-center gap-3.5 pr-3 min-w-0">
              {item.icon && (
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border transition-colors ${
                    isOpen
                      ? 'bg-[var(--gold)]/10 text-[var(--gold)] border-[var(--gold)]/30'
                      : 'bg-[var(--surface-1)] text-[var(--text-muted)] border-[var(--border)]'
                  }`}
                >
                  {item.icon}
                </div>
              )}
              <span
                className={`text-sm sm:text-base font-bold transition-colors ${
                  isOpen ? 'text-[var(--text)]' : 'text-[var(--text)]/90'
                }`}
              >
                {item.title}
              </span>
            </div>

            <motion.div
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={springTransition}
              className="shrink-0"
            >
              <ChevronDown
                className={`w-5 h-5 transition-colors ${
                  isOpen ? 'text-[var(--gold)]' : 'text-[var(--text-muted)]'
                }`}
              />
            </motion.div>
          </button>

          <motion.div
            initial={false}
            animate={{
              height: isOpen ? 'auto' : 0,
              opacity: isOpen ? 1 : 0,
            }}
            transition={springTransition}
            className="overflow-hidden will-change-[height,opacity]"
          >
            <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed font-sans border-t border-[var(--border)]/50">
              {item.content}
            </div>
          </motion.div>
        </motion.div>
      </motion.li>
    </MotionConfig>
  );
};

export const CardSplitAccordion: FC<AccordionProps> = ({ items, className = '' }) => {
  const [openId, setOpenId] = useState<number | string | null>(items[0]?.id ?? null);

  const openIndex = items.findIndex((item) => item.id === openId);

  return (
    <div className={`w-full max-w-3xl mx-auto ${className}`}>
      <ul className="w-full flex flex-col p-0 m-0">
        {items.map((item, index) => (
          <AccordionItem
            key={item.id}
            item={item}
            setOpenId={setOpenId}
            index={index}
            total={items.length}
            openIndex={openIndex}
          />
        ))}
      </ul>
    </div>
  );
};

export default CardSplitAccordion;

