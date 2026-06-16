import React from 'react';

export const BlogCardSkeleton: React.FC = () => {
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-cyber-card-dark p-6 space-y-4 animate-pulse">
      {/* Cover Image Placeholder */}
      <div className="aspect-video w-full rounded-xl bg-slate-250 dark:bg-slate-800" />

      {/* Meta category + date */}
      <div className="flex items-center justify-between">
        <div className="h-5 w-20 rounded bg-slate-250 dark:bg-slate-800" />
        <div className="h-4 w-24 rounded bg-slate-250 dark:bg-slate-800" />
      </div>

      {/* Title */}
      <div className="space-y-2">
        <div className="h-6 w-full rounded bg-slate-250 dark:bg-slate-800" />
        <div className="h-6 w-3/4 rounded bg-slate-250 dark:bg-slate-800" />
      </div>

      {/* Divider */}
      <div className="h-px bg-slate-200 dark:bg-slate-800" />

      {/* Footer info */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-full bg-slate-250 dark:bg-slate-800" />
          <div className="h-4 w-16 rounded bg-slate-250 dark:bg-slate-800" />
        </div>
        <div className="h-4 w-20 rounded bg-slate-250 dark:bg-slate-800" />
      </div>
    </div>
  );
};

export const BlogDetailsSkeleton: React.FC = () => {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 space-y-8 animate-pulse">
      {/* Title block */}
      <div className="space-y-4">
        <div className="h-4 w-24 rounded bg-slate-250 dark:bg-slate-800" />
        <div className="h-10 w-full rounded bg-slate-250 dark:bg-slate-800" />
        <div className="h-10 w-2/3 rounded bg-slate-250 dark:bg-slate-800" />
      </div>

      {/* Author / Date block */}
      <div className="flex items-center gap-4">
        <div className="h-12 w-12 rounded-full bg-slate-250 dark:bg-slate-800" />
        <div className="space-y-2">
          <div className="h-4 w-28 rounded bg-slate-250 dark:bg-slate-800" />
          <div className="h-3.5 w-20 rounded bg-slate-250 dark:bg-slate-800" />
        </div>
      </div>

      {/* Main Image */}
      <div className="aspect-[21/9] w-full rounded-2xl bg-slate-250 dark:bg-slate-800" />

      {/* Text paragraphs */}
      <div className="space-y-4">
        <div className="h-5 w-full rounded bg-slate-250 dark:bg-slate-800" />
        <div className="h-5 w-full rounded bg-slate-250 dark:bg-slate-800" />
        <div className="h-5 w-5/6 rounded bg-slate-250 dark:bg-slate-800" />
        <div className="h-5 w-4/5 rounded bg-slate-250 dark:bg-slate-800" />
      </div>
    </div>
  );
};

export const DashboardStatsSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 animate-pulse">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-cyber-card-dark p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="h-4 w-24 rounded bg-slate-250 dark:bg-slate-800" />
            <div className="h-8 w-8 rounded bg-slate-250 dark:bg-slate-800" />
          </div>
          <div className="h-8 w-16 rounded bg-slate-250 dark:bg-slate-800" />
        </div>
      ))}
    </div>
  );
};

export const ProjectCardSkeleton: React.FC = () => {
  return (
    <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-cyber-card-dark/40 p-6 space-y-6 animate-pulse">
      <div className="flex items-center gap-4">
        <div className="h-12 w-12 rounded-2xl bg-slate-200 dark:bg-slate-800" />
        <div className="space-y-2 flex-1">
          <div className="h-4 w-24 rounded bg-slate-200 dark:bg-slate-800" />
          <div className="h-5 w-40 rounded bg-slate-200 dark:bg-slate-800" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-4 w-full rounded bg-slate-200 dark:bg-slate-800" />
        <div className="h-4 w-5/6 rounded bg-slate-200 dark:bg-slate-800" />
      </div>
      <div className="h-20 w-full rounded-2xl bg-slate-200 dark:bg-slate-800" />
      <div className="flex justify-between items-center">
        <div className="h-4 w-24 rounded bg-slate-200 dark:bg-slate-800" />
        <div className="h-8 w-24 rounded-full bg-slate-200 dark:bg-slate-800" />
      </div>
    </div>
  );
};
