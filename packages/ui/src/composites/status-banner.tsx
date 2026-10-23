import { cva, type VariantProps } from 'class-variance-authority';
import { AlertTriangleIcon, CheckCircle2Icon, InfoIcon, PawPrintIcon, XCircleIcon, type LucideIcon } from 'lucide-react-native';
import { View } from 'react-native';

import { Icon } from '../components/icon';
import { Text } from '../components/text';
import { cn } from '../lib/utils';

const bannerVariants = cva('flex-row items-start gap-3 rounded-md px-4 py-3', {
  variants: {
    tone: {
      info: 'bg-info-surface',
      success: 'bg-success-surface',
      warning: 'bg-warning-surface',
      error: 'bg-error-surface',
      brand: 'bg-brand-subtle',
    },
  },
  defaultVariants: { tone: 'info' },
});

const TONE: Record<NonNullable<VariantProps<typeof bannerVariants>['tone']>, { icon: LucideIcon; iconClass: string; textClass: string }> = {
  info: { icon: InfoIcon, iconClass: 'text-info-icon', textClass: 'text-info' },
  success: { icon: CheckCircle2Icon, iconClass: 'text-success-icon', textClass: 'text-success' },
  warning: { icon: AlertTriangleIcon, iconClass: 'text-warning-icon', textClass: 'text-warning' },
  error: { icon: XCircleIcon, iconClass: 'text-error-icon', textClass: 'text-error' },
  brand: { icon: PawPrintIcon, iconClass: 'text-brand', textClass: 'text-foreground' },
};

type StatusBannerProps = VariantProps<typeof bannerVariants> & {
  children: string;
  title?: string;
  className?: string;
};

/** Inline status message. Announced to assistive tech as a status, not just shown by colour. */
function StatusBanner({ tone = 'info', title, children, className }: StatusBannerProps) {
  const t = TONE[tone ?? 'info'];
  return (
    <View role="status" aria-live="polite" accessibilityLiveRegion="polite" className={cn(bannerVariants({ tone }), className)}>
      <Icon as={t.icon} className={cn('mt-0.5', t.iconClass)} />
      <View className="flex-1 gap-0.5">
        {title ? <Text className={cn('font-semibold', t.textClass)}>{title}</Text> : null}
        <Text variant="small" className={t.textClass}>
          {children}
        </Text>
      </View>
    </View>
  );
}

export { StatusBanner };
export type { StatusBannerProps };
