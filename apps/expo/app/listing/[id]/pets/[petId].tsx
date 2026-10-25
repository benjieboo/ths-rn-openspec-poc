import { PetDetailPage } from '@/features/listing/detail-pages';
import { useLocalSearchParams } from 'expo-router';

export default function Route() {
  const { id, petId } = useLocalSearchParams<{ id: string; petId: string }>();
  return <PetDetailPage listingId={id} petId={petId} />;
}
