import React from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Construction } from 'lucide-react';

interface PlaceholderPageProps {
  title: string;
  description: string;
}

export default function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">{title}</h1>
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-12 shadow-sm text-center">
          <Construction className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-display text-base font-semibold text-foreground mb-1">Coming Soon</h3>
          <p className="text-sm text-muted-foreground">This section will be available after Supabase integration.</p>
        </div>
      </div>
    </AdminLayout>
  );
}
