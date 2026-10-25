import { Button, IconButton, Skeleton, StatusBanner, Text } from '@ths/ui';
import { useRouter } from 'expo-router';
import { ArrowLeftIcon, SearchXIcon } from 'lucide-react-native';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icon } from '@ths/ui';

import { copy } from './copy';

/** Back control for full-page states on mobile, where the listing hides the stack header. */
export function BackBar({ overlay = false }: { overlay?: boolean }) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  return (
    <View style={{ paddingTop: insets.top + 4 }} className={overlay ? 'absolute left-0 right-0 top-0 z-10 px-4' : 'px-4'}>
      <IconButton
        icon={ArrowLeftIcon}
        variant="overlay"
        accessibilityLabel={copy.back}
        onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))}
      />
    </View>
  );
}

export function ListingSkeleton({ desktop }: { desktop: boolean }) {
  return (
    <View
      accessible
      role="progressbar"
      aria-busy
      accessibilityLabel={copy.loading}
      testID="listing-skeleton"
      className="flex-1 bg-background">
      {desktop ? (
        <View className="w-full max-w-6xl gap-6 self-center px-8 py-8">
          <Skeleton className="h-10 w-2/3" />
          <Skeleton className="h-5 w-1/3" />
          <Skeleton className="aspect-[16/9] w-full rounded-lg" />
          <View className="flex-row gap-12">
            <View className="flex-1 gap-4">
              {[0, 1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-24 w-full rounded-md" />
              ))}
            </View>
            <Skeleton className="h-96 w-96 rounded-lg" />
          </View>
        </View>
      ) : (
        <>
          <Skeleton className="aspect-[4/3] w-full rounded-none" />
          <View className="gap-4 px-4 py-6">
            <Skeleton className="h-8 w-4/5" />
            <Skeleton className="h-5 w-1/2" />
            {[0, 1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-14 w-full rounded-md" />
            ))}
          </View>
        </>
      )}
    </View>
  );
}

export function ListingError({ onRetry, showBack }: { onRetry: () => void; showBack: boolean }) {
  return (
    <View className="flex-1 bg-background">
      {showBack && <BackBar />}
      <View className="w-full max-w-xl flex-1 justify-center gap-4 self-center px-4">
        <StatusBanner tone="error" title={copy.listingError.title}>
          {copy.listingError.body}
        </StatusBanner>
        <Button onPress={onRetry} className="self-start">
          <Text>{copy.listingError.retry}</Text>
        </Button>
      </View>
    </View>
  );
}

export function ListingNotFound({ showBack }: { showBack: boolean }) {
  const router = useRouter();
  return (
    <View className="flex-1 bg-background">
      {showBack && <BackBar />}
      <View className="w-full max-w-xl flex-1 items-center justify-center gap-4 self-center px-6">
        <Icon as={SearchXIcon} size={48} className="text-brand" />
        <Text variant="h2" className="text-center">
          {copy.notFound.title}
        </Text>
        <Text variant="lead" className="text-center">
          {copy.notFound.body}
        </Text>
        <Button onPress={() => router.replace('/')}>
          <Text>{copy.notFound.action}</Text>
        </Button>
      </View>
    </View>
  );
}
