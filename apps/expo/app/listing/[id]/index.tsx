import { ListingScreen } from '@/features/listing/listing-screen';
import { useLocalSearchParams } from 'expo-router';

export default function Route() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <ListingScreen listingId={id} />;
}
