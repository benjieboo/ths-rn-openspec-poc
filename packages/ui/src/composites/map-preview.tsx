import * as React from 'react';
import { Image, View, type LayoutChangeEvent } from 'react-native';

import { Text } from '../components/text';
import { cn } from '../lib/utils';

const TILE = 256;
// OpenStreetMap tiles. No key; fine for a POC, not for production traffic (OSM tile policy).
// OSM blocks generic HTTP client user agents (Android's okhttp), so native requests identify the
// app. Browsers ignore this header and send their own.
const tileUrl = (z: number, x: number, y: number) => `https://tile.openstreetmap.org/${z}/${x}/${y}.png`;
const TILE_HEADERS = { 'User-Agent': 'THSListingPOC/0.1 (TrustedHousesitters proof of concept)' };

function toTileCoords(lat: number, lon: number, zoom: number) {
  const n = 2 ** zoom;
  const latRad = (lat * Math.PI) / 180;
  return {
    x: ((lon + 180) / 360) * n,
    y: ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * n,
  };
}

type MapPreviewProps = {
  /** An approximate point. The API must never send an exact address here. */
  latitude: number;
  longitude: number;
  /** Spoken description, e.g. "Approximate location: Plateau-Mont-Royal, Montréal". */
  accessibilityLabel: string;
  zoom?: number;
  /** Radius of the approximate-area circle, in px. */
  areaRadius?: number;
  className?: string;
};

/** Approximate location: an area circle on a map, never a pin. Plain images, same on every platform. */
function MapPreview({ latitude, longitude, accessibilityLabel, zoom = 13, areaRadius = 56, className }: MapPreviewProps) {
  const [size, setSize] = React.useState({ width: 0, height: 0 });
  const onLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setSize({ width, height });
  };

  const centre = toTileCoords(latitude, longitude, zoom);
  const baseX = Math.floor(centre.x);
  const baseY = Math.floor(centre.y);
  const colsEachSide = Math.ceil(size.width / 2 / TILE) + 1;
  const rowsEachSide = Math.ceil(size.height / 2 / TILE) + 1;

  const tiles: { key: string; uri: string; left: number; top: number }[] = [];
  if (size.width > 0) {
    for (let dx = -colsEachSide; dx <= colsEachSide; dx++) {
      for (let dy = -rowsEachSide; dy <= rowsEachSide; dy++) {
        const tx = baseX + dx;
        const ty = baseY + dy;
        tiles.push({
          key: `${tx}-${ty}`,
          uri: tileUrl(zoom, tx, ty),
          left: (tx - centre.x) * TILE + size.width / 2,
          top: (ty - centre.y) * TILE + size.height / 2,
        });
      }
    }
  }

  return (
    <View
      accessible
      role="img"
      accessibilityLabel={accessibilityLabel}
      onLayout={onLayout}
      className={cn('h-56 w-full overflow-hidden rounded-lg bg-secondary', className)}>
      {tiles.map((t) => (
        <Image
          key={t.key}
          source={{ uri: t.uri, headers: TILE_HEADERS }}
          style={{ position: 'absolute', left: t.left, top: t.top, width: TILE, height: TILE }}
        />
      ))}
      {size.width > 0 && (
        <View
          pointerEvents="none"
          className="absolute rounded-full border-2 border-brand bg-brand/20"
          style={{
            width: areaRadius * 2,
            height: areaRadius * 2,
            left: size.width / 2 - areaRadius,
            top: size.height / 2 - areaRadius,
          }}
        />
      )}
      <View pointerEvents="none" className="absolute bottom-0 right-0 rounded-tl-sm bg-background/80 px-1.5 py-0.5">
        <Text className="text-2xs text-subtle">© OpenStreetMap contributors</Text>
      </View>
    </View>
  );
}

export { MapPreview };
export type { MapPreviewProps };
