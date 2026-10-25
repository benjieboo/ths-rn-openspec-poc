import Head from 'expo-router/head';
import * as React from 'react';
import { Platform } from 'react-native';

/**
 * Page metadata is a web requirement (listing-view spec, "Web page metadata"). On iOS, expo-router's
 * Head drives Handoff, which needs a native rebuild with an origin and is out of scope for the POC.
 */
export function WebHead({ children }: { children: React.ReactNode }) {
  return Platform.OS === 'web' ? <Head>{children}</Head> : null;
}
