import { ImagesIcon } from 'lucide-react-native';
import * as React from 'react';
import {
  FlatList,
  Image,
  Platform,
  Pressable,
  View,
  type LayoutChangeEvent,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';

import { Icon } from '../components/icon';
import { Text } from '../components/text';
import { useBreakpoint } from '../hooks/use-breakpoint';
import { cn } from '../lib/utils';

export type GalleryPhoto = { id: string; url: string; alt?: string };

type PhotoGalleryProps = {
  photos: GalleryPhoto[];
  onPhotoPress?: (index: number) => void;
  /** Defaults to the breakpoint: carousel on mobile, grid on desktop. */
  layout?: 'auto' | 'carousel' | 'grid';
  className?: string;
};

/** Listing photos: swipeable carousel on mobile, one-large-four-small grid on desktop. */
function PhotoGallery({ photos, onPhotoPress, layout = 'auto', className }: PhotoGalleryProps) {
  const { isDesktop } = useBreakpoint();
  const resolved = layout === 'auto' ? (isDesktop ? 'grid' : 'carousel') : layout;
  if (photos.length === 0) return null;
  return resolved === 'grid' ? (
    <PhotoGrid photos={photos} onPhotoPress={onPhotoPress} className={className} />
  ) : (
    <PhotoCarousel photos={photos} onPhotoPress={onPhotoPress} className={className} />
  );
}

function photoLabel(photo: GalleryPhoto, index: number, total: number) {
  return `Photo ${index + 1} of ${total}${photo.alt ? `: ${photo.alt}` : ''}`;
}

function PhotoCarousel({ photos, onPhotoPress, className }: Omit<PhotoGalleryProps, 'layout'>) {
  const [{ width, height }, setSize] = React.useState({ width: 0, height: 0 });
  const [index, setIndex] = React.useState(0);

  // Items need explicit dimensions: a horizontal FlatList has no intrinsic height on web.
  const onLayout = (e: LayoutChangeEvent) => {
    const { width: w, height: h } = e.nativeEvent.layout;
    setSize({ width: w, height: h });
  };
  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (!width) return;
    const next = Math.round(e.nativeEvent.contentOffset.x / width);
    if (next !== index) setIndex(next);
  };

  return (
    // 4:3 on mobile keeps the pets visible (THS photography guidance).
    <View onLayout={onLayout} testID="photo-carousel" className={cn('aspect-[4/3] w-full bg-secondary', className)}>
      {width > 0 && (
        <FlatList
          data={photos}
          keyExtractor={(p) => p.id}
          style={{ width, height }}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={onScroll}
          scrollEventThrottle={16}
          getItemLayout={(_, i) => ({ length: width, offset: width * i, index: i })}
          renderItem={({ item, index: i }) => (
            <Pressable
              role="button"
              accessibilityLabel={photoLabel(item, i, photos.length)}
              onPress={() => onPhotoPress?.(i)}
              style={{ width, height }}>
              <Image source={{ uri: item.url }} className="h-full w-full" resizeMode="cover" />
            </Pressable>
          )}
        />
      )}
      <View
        pointerEvents="none"
        className="absolute bottom-4 right-4 rounded-full bg-overlay px-3 py-1"
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants">
        <Text variant="caption" className="font-semibold text-primary-foreground">
          {index + 1} / {photos.length}
        </Text>
      </View>
    </View>
  );
}

function GridPhoto({
  photo,
  index,
  total,
  onPress,
  className,
}: {
  photo: GalleryPhoto;
  index: number;
  total: number;
  onPress?: (i: number) => void;
  className?: string;
}) {
  return (
    <Pressable
      role="button"
      accessibilityLabel={photoLabel(photo, index, total)}
      onPress={() => onPress?.(index)}
      className={cn(
        'overflow-hidden bg-secondary',
        Platform.select({ web: 'outline-none hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ring' }),
        className
      )}>
      <Image source={{ uri: photo.url }} className="h-full w-full" resizeMode="cover" />
    </Pressable>
  );
}

function PhotoGrid({ photos, onPhotoPress, className }: Omit<PhotoGalleryProps, 'layout'>) {
  const [first, ...rest] = photos;
  const small = rest.slice(0, 4);
  return (
    <View className={cn('aspect-[16/9] w-full flex-row gap-2 overflow-hidden rounded-lg', className)}>
      <GridPhoto photo={first!} index={0} total={photos.length} onPress={onPhotoPress} className="flex-[2]" />
      {small.length > 0 && (
        // Rows of two, built with flex so it renders the same on native and web.
        <View className="flex-1 gap-2">
          {[small.slice(0, 2), small.slice(2, 4)]
            .filter((row) => row.length > 0)
            .map((row, r) => (
              <View key={r} className="flex-1 flex-row gap-2">
                {row.map((photo, i) => (
                  <GridPhoto
                    key={photo.id}
                    photo={photo}
                    index={r * 2 + i + 1}
                    total={photos.length}
                    onPress={onPhotoPress}
                    className="flex-1"
                  />
                ))}
              </View>
            ))}
        </View>
      )}
      <Pressable
        role="button"
        accessibilityLabel={`Show all ${photos.length} photos`}
        onPress={() => onPhotoPress?.(0)}
        className={cn(
          'absolute bottom-4 right-4 flex-row items-center gap-2 rounded-md bg-background px-3 py-2 shadow-card',
          Platform.select({ web: 'outline-none hover:bg-secondary focus-visible:ring-2 focus-visible:ring-ring' })
        )}>
        <Icon as={ImagesIcon} size={16} />
        <Text variant="label">{photos.length} photos</Text>
      </Pressable>
    </View>
  );
}

export { PhotoGallery };
export type { PhotoGalleryProps };
