"use client";
import { createContext, useContext } from "react";
import type { PublishIssue } from "@/lib/publish-readiness";
export const PublishValidationContext = createContext<PublishIssue[]>([]);
export function usePublishFieldError(path?: string) {
  const issues = useContext(PublishValidationContext);
  return path ? issues.find(issue => issue.path === path)?.message : undefined;
}
