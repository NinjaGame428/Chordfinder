'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { AdvancedSongEditor } from '@/components/admin/AdvancedSongEditor';
import { AdminLayout } from '@/components/admin/AdminLayout';

const SongEditPage = () => {
  const params = useParams();
  const songId = params.id as string;

  return (
    <AdminLayout>
      <AdvancedSongEditor songId={songId} />
    </AdminLayout>
  );
};

export default SongEditPage;
