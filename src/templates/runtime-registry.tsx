"use client";

import dynamic from "next/dynamic";
import type { ComponentType } from "react";
import type { TemplateId } from "./registry";
import type { TemplateProps } from "./types";

function TemplateLoading() {
  return <div role="status" className="flex min-h-[50vh] items-center justify-center p-8">
    Loading invitation…
  </div>;
}

// Literal import paths let Next split each runtime and its CSS. SSR stays
// enabled: public HTML renders the chosen template rather than a client-only
// invitation. Metadata-only consumers never import this module.
export const templateRuntimes = {
  royal: dynamic<TemplateProps>(() => import("./royal/RoyalTemplate").then(module => module.RoyalTemplate),
    { loading: TemplateLoading }),
  "floral-elegance": dynamic<TemplateProps>(() => import("./floral-elegance/FloralEleganceTemplate").then(module => module.FloralEleganceTemplate),
    { loading: TemplateLoading }),
  "royal-3d-cinema": dynamic<TemplateProps>(() => import("./royal-3d-cinema/Royal3DCinemaTemplate").then(module => module.Royal3DCinemaTemplate),
    { loading: TemplateLoading }),
} satisfies Record<TemplateId, ComponentType<TemplateProps>>;
