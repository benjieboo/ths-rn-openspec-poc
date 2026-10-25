import { ChevronLeftIcon, ChevronRightIcon, XIcon } from 'lucide-react-native';
import * as React from 'react';
import { FlatList, Image, Platform, View, type LayoutChangeEvent, type NativeScrollEvent, type NativeSyntheticEvent } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Text } from '../components/text';
import { cn } from '../lib/utils';
import { IconButton } from './icon-button';
import type { GalleryPhoto } from './photo-gallery';

type PhotoViewerProps = {
  photos: GalleryPhoto[];
  initialIndex?: number;
  onClose: () => void;
  onIndexChange?: (index: number) => void;
  className?: string;
};

/** Full-screen photo viewer: swipe, arrow buttons, or arrow keys and Escape on web. */
function PhotoViewer({ photos, initialIndex = 0, onClose, onIndexChange, className }: PhotoViewerProps) {
  const insets = useSafeAreaInsets();
  const list = React.useRef<FlatList<GalleryPhoto>>(null);
  const start = Math.min(Math.max(initialIndex, 0), Math.max(photos.length - 1, 0));
  const [index, setIndex] = React.useState(start);
  const [size, setSize] = React.useState({ width: 0, height: 0 });

  const go = React.useCallback(
    (next: number) => {
      const clamped = Math.min(Math.max(next, 0), photos.length - 1);
      setIndex(clamped);
      onIndexChange?.(clamped);
      list.current?.scrollToIndex({ index: clamped, animated: true });
    },
    [photos.length, onIndexChange]
  );

  React.useEffect(() => {
    if (Platform.OS !== 'web' || typeof window === 'undefined') return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') go(index + 1);
      else if (e.key === 'ArrowLeft') go(index - 1);
      else if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [go, index, onClose]);

  const onLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setSize({ width, height });
  };
  const onScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (!size.width) return;
    const next = Math.round(e.nativeEvent.contentOffset.x / size.width);
    if (next !== index) {
      setIndex(next);
      onIndexChange?.(next);
    }
  };

  const photo = photos[index];

  return (
    <View
      role="dialog"
      aria-modal
      accessibilityViewIsModal
      accessibilityLabel="Photo viewer"
      className={cn('flex-1 bg-brand-surface', className)}
      onLayout={onLayout}>
      {size.width > 0 && (
        <FlatList
          ref={list}
          data={photos}
          keyExtractor={(p) => p.id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          initialScrollIndex={start}
          getItemLayout={(_, i) => ({ length: size.width, offset: size.width * i, index: i })}
          onMomentumScrollEnd={onScrollEnd}
          onScroll={Platform.OS === 'web' ? onScrollEnd : undefined}
          scrollEventThrottle={32}
          style={{ width: size.width, height: size.height }}
          renderItem={({ item, index: i }) => (
            <View style={{ width: size.width, height: size.height }} className="items-center justify-center">
              <Image
                source={{ uri: item.url }}
                accessibilityLabel={item.alt ?? `Photo ${i + 1} of ${photos.length}`}
                style={{ width: size.width, height: size.height }}
                resizeMode="contain"
              />
            </View>
          )}
        />
      )}

      <View
        style={{ top: insets.top + 8 }}
        pointerEvents="box-none"
        className="absolute left-4 right-4 flex-row items-center justify-between">
        <View className="rounded-full bg-overlay px-3 py-1">
          <Text variant="label" className="text-primary-foreground" testID="photo-viewer-position">
            {index + 1} / {photos.length}
          </Text>
        </View>
        <IconButton icon={XIcon} variant="overlay" accessibilityLabel="Close photos" onPress={onClose} />
      </View>

      {index > 0 && (
        <IconButton
          icon={ChevronLeftIcon}
          variant="overlay"
          accessibilityLabel="Previous photo"
          onPress={() => go(index - 1)}
          className="absolute left-4 top-1/2 -mt-6"
        />
      )}
      {index < photos.length - 1 && (
        <IconButton
          icon={ChevronRightIcon}
          variant="overlay"
          accessibilityLabel="Next photo"
          onPress={() => go(index + 1)}
          className="absolute right-4 top-1/2 -mt-6"
        />
      )}
      {photo?.alt ? (
        <View style={{ bottom: insets.bottom + 16 }} className="absolute left-4 right-4 items-center" pointerEvents="none">
          <Text variant="small" className="text-primary-foreground">
            {photo.alt}
          </Text>
        </View>
      ) : null}
    </View>
  );
}

export { PhotoViewer };
export type { PhotoViewerProps };
