import { View } from 'react-native';

import { Text } from '../components/text';
import { formatDateRange } from '../lib/format';
import { cn } from '../lib/utils';
import { PersonAvatar } from './person-avatar';
import { ReadMore } from './read-more';

type ReviewCardProps = {
  reviewerName: string;
  reviewerPhotoUrl?: string | null;
  text: string;
  stayStart: string;
  stayEnd: string;
  className?: string;
};

/** One sitter review with read more and stay dates. */
function ReviewCard({ reviewerName, reviewerPhotoUrl, text, stayStart, stayEnd, className }: ReviewCardProps) {
  return (
    <View role="article" testID="review-card" className={cn('gap-3 rounded-lg border border-divider bg-card p-5', className)}>
      <View className="flex-row items-center gap-3">
        <PersonAvatar name={reviewerName} photoUrl={reviewerPhotoUrl} />
        <View className="flex-1">
          <Text className="font-semibold">{reviewerName}</Text>
          <Text variant="caption">Stayed · {formatDateRange(stayStart, stayEnd, { fullYear: true })}</Text>
        </View>
      </View>
      <ReadMore numberOfLines={4} collapseAfterChars={180}>
        {text}
      </ReadMore>
    </View>
  );
}

export { ReviewCard };
export type { ReviewCardProps };
