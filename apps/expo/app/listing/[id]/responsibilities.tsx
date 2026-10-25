import { ResponsibilitiesDetailPage } from '@/features/listing/detail-pages';
import { useLocalSearchParams } from 'expo-router';

export default function Route() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <ResponsibilitiesDetailPage listingId={id} />;
}
