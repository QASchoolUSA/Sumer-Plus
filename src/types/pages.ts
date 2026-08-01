import type { ReactNode } from "react";

/** Align with Next.js generated ParamMap (`lang: string`). */
export type LangParams = Promise<{ lang: string }>;

export type PageProps = {
  params: LangParams;
};

export type AppLayoutProps = {
  children: ReactNode;
  params: LangParams;
};
