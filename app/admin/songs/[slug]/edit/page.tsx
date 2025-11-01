'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { SimpleSongEditor } from '@/components/admin/SimpleSongEditor';
import { AdminLayout } from '@/components/admin/AdminLayout';

const SongEditPage = () => {
  const params = useParams();
  const [songSlug, setSongSlug] = useState<string>('');

  useEffect(() => {
    // Ensure params.slug is properly resolved
    if (params?.slug) {
      const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;
      setSongSlug(slug);
    }
  }, [params]);

  if (!songSlug) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <p className="text-muted-foreground">Loading song...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <SimpleSongEditor songSlug={songSlug} />
    </AdminLayout>
  );
};

export default SongEditPage;

