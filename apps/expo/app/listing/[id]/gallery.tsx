import { GalleryPage } from '@/features/listing/detail-pages';
import { useLocalSearchParams } from 'expo-router';

export default function Route() {
  const { id, photo } = useLocalSearchParams<{ id: string; photo?: string }>();
  return <GalleryPage listingId={id} initialIndex={Number(photo ?? 0) || 0} />;
}
