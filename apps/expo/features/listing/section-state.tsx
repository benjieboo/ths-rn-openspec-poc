import type { ApiError } from '@ths/api-contract';
import { Button, Skeleton, StatusBanner, Text } from '@ths/ui';
import * as React from 'react';
import { View } from 'react-native';

import { copy } from './copy';

type QueryLike<T> = { data: T | undefined; isPending: boolean; error: ApiError | null; refetch: () => unknown };

type SectionStateProps<T> = {
  query: QueryLike<T>;
  /** Used in the error message: "We couldn't load {what}." */
  what: string;
  skeleton?: React.ReactNode;
  children: (data: T) => React.ReactNode;
};

/** Secondary sections render their own loading and error states, so one failure never blanks the page. */
export function SectionState<T>({ query, what, skeleton, children }: SectionStateProps<T>) {
  if (query.isPending) return <>{skeleton ?? <Skeleton className="h-20 w-full rounded-md" />}</>;
  if (query.error || query.data === undefined) {
    return (
      <View className="gap-3">
        <StatusBanner tone="error">{copy.sectionError(what)}</StatusBanner>
        <Button variant="outline" size="sm" className="self-start" onPress={() => query.refetch()}>
          <Text>{copy.listingError.retry}</Text>
        </Button>
      </View>
    );
  }
  return <>{children(query.data)}</>;
}
