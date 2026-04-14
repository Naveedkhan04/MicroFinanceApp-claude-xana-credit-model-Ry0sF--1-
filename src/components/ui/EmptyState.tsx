import React from "react";

interface Props {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<Props> = ({ icon, title, description, action }) => (
  <div className="flex flex-col items-center text-center py-10 px-6">
    <div className="mb-4 text-4xl text-gold-dim">{icon ?? "✨"}</div>
    <h3 className="mb-1 text-[17px] font-semibold text-gold">{title}</h3>
    {description && <p className="text-[13px] text-text-muted max-w-[260px]">{description}</p>}
    {action && <div className="mt-5 w-full">{action}</div>}
  </div>
);
