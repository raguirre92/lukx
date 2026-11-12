"use client";

import { useState } from "react";

export type FaqItem = {
  question: string;
  answer: string;
};

type FaqAccordionProps = {
  items: FaqItem[];
};

export default function FaqAccordion({ items }: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="divide-y divide-black/10 border-y border-black/10">
      {items.map((item, index) => {
        const open = openIndex === index;
        return (
          <div key={item.question}>
            <button
              type="button"
              className="flex w-full items-start justify-between gap-4 py-5 text-left"
              aria-expanded={open}
              onClick={() => setOpenIndex(open ? null : index)}
            >
              <span className="text-base font-semibold text-lukx-charcoal md:text-lg">
                {item.question}
              </span>
              <span
                className={`mt-1 inline-flex h-7 w-7 shrink-0 items-center justify-center border border-lukx-charcoal text-lg leading-none transition-colors ${
                  open ? "bg-lukx-green-btn text-white border-lukx-green-btn" : "text-lukx-charcoal"
                }`}
                aria-hidden
              >
                {open ? "−" : "+"}
              </span>
            </button>
            <div
              className={`grid transition-[grid-template-rows] duration-300 ${
                open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              }`}
            >
              <div className="overflow-hidden">
                <p className="pb-5 pr-12 text-sm leading-relaxed text-lukx-muted md:text-base whitespace-pre-line">
                  {item.answer}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
