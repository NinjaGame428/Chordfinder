'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { SimpleSongEditor } from '@/components/admin/SimpleSongEditor';
import { AdminLayout } from '@/components/admin/AdminLayout';

const SongEditPage = () => {
  const params = useParams();
  const [songId, setSongId] = useState<string>('');

  useEffect(() => {
    // Ensure params.id is properly resolved
    if (params?.id) {
      const id = Array.isArray(params.id) ? params.id[0] : params.id;
      setSongId(id);
    }
  }, [params]);

  if (!songId) {
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
      <SimpleSongEditor songId={songId} />
    </AdminLayout>
  );
};

export default SongEditPage;
