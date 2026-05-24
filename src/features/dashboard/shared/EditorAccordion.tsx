"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface EditorAccordionContextValue {
  openId: string | null;
  setOpenId: (id: string | null) => void;
  onActivate?: (id: string) => void;
}

const EditorAccordionContext = createContext<EditorAccordionContextValue | null>(
  null
);

interface EditorAccordionProps {
  children: ReactNode;
  defaultOpenId?: string;
  onActivate?: (id: string) => void;
}

export function EditorAccordion({
  children,
  defaultOpenId = "page-setup",
  onActivate,
}: EditorAccordionProps) {
  const [openId, setOpenId] = useState<string | null>(defaultOpenId);

  const handleSetOpen = (id: string | null) => {
    setOpenId(id);
    if (id) onActivate?.(id);
  };

  return (
    <EditorAccordionContext.Provider
      value={{ openId, setOpenId: handleSetOpen, onActivate }}
    >
      <div className="space-y-3">{children}</div>
    </EditorAccordionContext.Provider>
  );
}

interface EditorAccordionItemProps {
  id: string;
  title: string;
  description?: string;
  children: ReactNode;
}

function EditorAccordionItem({
  id,
  title,
  description,
  children,
}: EditorAccordionItemProps) {
  const ctx = useContext(EditorAccordionContext);
  if (!ctx) throw new Error("EditorAccordionItem must be inside EditorAccordion");

  const isOpen = ctx.openId === id;

  return (
    <section className="overflow-hidden rounded-2xl border border-champagne-gold/10 bg-surface-container/70 shadow-[0_18px_60px_rgba(0,0,0,0.2)]">
      <button
        type="button"
        onClick={() => ctx.setOpenId(isOpen ? null : id)}
        className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left transition hover:bg-champagne-gold/5"
        aria-expanded={isOpen}
      >
        <div className="min-w-0 space-y-0.5">
          <h2 className="font-heading text-lg text-champagne-gold">{title}</h2>
          {description && (
            <p className="text-xs leading-relaxed text-on-surface-variant/60">
              {description}
            </p>
          )}
        </div>
        <ChevronDown
          size={18}
          className={cn(
            "shrink-0 text-champagne-gold/70 transition-transform duration-300",
            isOpen && "rotate-180"
          )}
        />
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key={id}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <div
              className="space-y-4 border-t border-champagne-gold/10 px-5 pb-5 pt-4"
              onFocusCapture={() => ctx.onActivate?.(id)}
            >
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

EditorAccordion.Item = EditorAccordionItem;
