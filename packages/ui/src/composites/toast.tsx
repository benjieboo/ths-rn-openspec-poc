import { Portal } from '@rn-primitives/portal';
import { CheckCircle2Icon, InfoIcon, XCircleIcon, type LucideIcon } from 'lucide-react-native';
import * as React from 'react';
import { AccessibilityInfo, Platform, View } from 'react-native';
import Animated, { FadeInDown, FadeOutDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon } from '../components/icon';
import { Text } from '../components/text';
import { cn } from '../lib/utils';

export type ToastTone = 'default' | 'success' | 'error';
type ToastState = { id: number; message: string; tone: ToastTone };

type ToastContextValue = {
  show: (message: string, options?: { tone?: ToastTone }) => void;
  /** Lift toasts above a sticky bar while it's mounted; pass 0 to reset. */
  setBottomOffset: (px: number) => void;
};

const ToastContext = React.createContext<ToastContextValue | null>(null);

export const TOAST_DURATION_MS = 4000;

const TONE: Record<ToastTone, { icon: LucideIcon; iconClass: string }> = {
  default: { icon: InfoIcon, iconClass: 'text-primary-foreground' },
  success: { icon: CheckCircle2Icon, iconClass: 'text-success-icon' },
  error: { icon: XCircleIcon, iconClass: 'text-error-icon' },
};

/** Brief, self-dismissing messages. Newest replaces oldest. */
function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = React.useState<ToastState | null>(null);
  const [bottomOffset, setBottomOffset] = React.useState(0);
  const timer = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const counter = React.useRef(0);

  const show = React.useCallback<ToastContextValue['show']>((message, { tone = 'default' } = {}) => {
    counter.current += 1;
    setToast({ id: counter.current, message, tone });
    if (Platform.OS !== 'web') AccessibilityInfo.announceForAccessibility(message);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast(null), TOAST_DURATION_MS);
  }, []);

  React.useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const value = React.useMemo(() => ({ show, setBottomOffset }), [show]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <Portal name="ths-toast">
        <ToastView toast={toast} bottomOffset={bottomOffset} />
      </Portal>
    </ToastContext.Provider>
  );
}

function ToastView({ toast, bottomOffset }: { toast: ToastState | null; bottomOffset: number }) {
  const insets = useSafeAreaInsets();
  return (
    <View
      pointerEvents="box-none"
      style={{ bottom: insets.bottom + bottomOffset + 16 }}
      className="absolute left-4 right-4 items-center">
      {toast ? (
        // Reanimated views don't take NativeWind classes, so the animation wraps a styled View.
        <Animated.View
          key={toast.id}
          entering={FadeInDown.duration(180)}
          exiting={FadeOutDown.duration(180)}
          style={{ width: '100%', maxWidth: 448 }}>
          <View
            accessible
            role="status"
            aria-live="polite"
            accessibilityLiveRegion="polite"
            testID="toast"
            className="w-full flex-row items-center gap-3 rounded-lg bg-brand-surface px-4 py-3 shadow-overlay">
            <Icon as={TONE[toast.tone].icon} className={cn(TONE[toast.tone].iconClass)} />
            <Text className="flex-1 text-primary-foreground">{toast.message}</Text>
          </View>
        </Animated.View>
      ) : null}
    </View>
  );
}

function useToast() {
  const ctx = React.useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>');
  return ctx;
}

/** Keeps toasts clear of a sticky bar of the given height while the caller is mounted. */
function useToastBottomOffset(px: number) {
  const { setBottomOffset } = useToast();
  React.useEffect(() => {
    setBottomOffset(px);
    return () => setBottomOffset(0);
  }, [px, setBottomOffset]);
}

export { ToastProvider, useToast, useToastBottomOffset };
