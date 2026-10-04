"use client";

import { Dialog as Primitive } from "radix-ui";
import { cloneElement, useRef, type ReactElement, type ReactNode, type RefObject } from "react";

interface ModalSurfaceProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: ReactElement<{ children?: ReactNode }>;
  dismissible?: boolean;
  /** Inline surfaces inherit the template's CSS variables and animations. */
  portalled?: boolean;
  onAfterCloseFocus?: () => void;
  returnFocusRef?: RefObject<HTMLElement | null>;
}

/** Shared modal mechanics; callers retain their existing artwork and layout. */
export function ModalSurface({ open, onOpenChange, title, children,
  dismissible = true, portalled = true, onAfterCloseFocus, returnFocusRef }: ModalSurfaceProps) {
  const returnFocus = useRef<HTMLElement | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const surface = (
    <Primitive.Overlay asChild>
      <Primitive.Content
        ref={contentRef}
        asChild
        aria-modal="true"
        aria-describedby={undefined}
        onOpenAutoFocus={(event) => {
          returnFocus.current = document.activeElement instanceof HTMLElement
            ? document.activeElement : null;
          const container = event.target as HTMLElement;
          const initial = container.querySelector<HTMLElement>("[data-dialog-initial-focus]");
          if (initial) { event.preventDefault(); initial.focus(); }
        }}
        onCloseAutoFocus={(event) => {
          event.preventDefault();
          // A replacement/newly opened modal may have already taken focus
          // before Radix dispatches this deferred unmount event. Leave it there.
          const focusedModal = document.activeElement instanceof HTMLElement
            ? document.activeElement.closest("[role='dialog']") : null;
          const target = returnFocusRef?.current ?? returnFocus.current;
          if (focusedModal && focusedModal !== event.target && !focusedModal.contains(target)) return;
          if (onAfterCloseFocus) { onAfterCloseFocus(); return; }
          if (target?.isConnected && !target.closest("[inert]")) {
            target.focus();
          } else {
            const fallback = document.querySelector<HTMLElement>("[role='dialog'], main h1, main");
            if (fallback) { fallback.setAttribute("tabindex", "-1"); fallback.focus(); }
          }
        }}
        onEscapeKeyDown={(event) => { if (!dismissible) event.preventDefault(); }}
        onInteractOutside={(event) => { if (!dismissible) event.preventDefault(); }}
      >
        {cloneElement(children, {},
          <Primitive.Title className="sr-only">{title}</Primitive.Title>,
          children.props.children)}
      </Primitive.Content>
    </Primitive.Overlay>
  );
  return (
    <Primitive.Root open={open} onOpenChange={(next) => {
      if (next || dismissible) onOpenChange(next);
    }}>
      {portalled ? <Primitive.Portal>{surface}</Primitive.Portal> : surface}
    </Primitive.Root>
  );
}
