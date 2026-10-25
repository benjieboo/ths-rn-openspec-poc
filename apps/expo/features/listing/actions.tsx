import { ReportReason } from '@ths/api-contract';
import { useApply, useIsFavourite, useReportListing, useToggleFavourite } from '@ths/api-contract/react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  formatDateRange,
  RadioGroup,
  RadioGroupItem,
  Text,
  Textarea,
  useToast,
} from '@ths/ui';
import * as React from 'react';
import { Platform, Share } from 'react-native';

import { copy } from './copy';
import type { ListingPage } from './use-listing-page';

/** The listing's public web address: what people share. */
export function listingWebUrl(listingId: string) {
  const origin =
    Platform.OS === 'web' && typeof window !== 'undefined'
      ? window.location.origin
      : (process.env.EXPO_PUBLIC_WEB_URL ?? 'http://localhost:8090');
  return `${origin.replace(/\/$/, '')}/listing/${listingId}`;
}

type Options = {
  /** Brings the date chips into view (mobile scrolls to them). */
  revealDates?: () => void;
};

export function useListingActions(page: ListingPage, { revealDates }: Options = {}) {
  const toast = useToast();
  const isFavourite = useIsFavourite(page.listingId);
  const toggleFavourite = useToggleFavourite(page.listingId);
  const apply = useApply(page.listingId);
  const report = useReportListing(page.listingId);

  const [membershipOpen, setMembershipOpen] = React.useState(false);
  const [applyOpen, setApplyOpen] = React.useState(false);
  const [reportOpen, setReportOpen] = React.useState(false);

  const onCta = () => {
    const { cta } = page;
    if (cta.kind === 'join' || cta.kind === 'upgrade') setMembershipOpen(true);
    else if (cta.kind === 'choose-dates') {
      toast.show(copy.chooseDatesFirst);
      revealDates?.();
    } else if (cta.kind === 'apply') setApplyOpen(true);
  };

  const submitApplication = (message: string) => {
    const assignmentId = page.selectedId;
    if (!assignmentId) return;
    apply.mutate(
      { assignmentId, ...(message.trim() && { message: message.trim() }) },
      {
        onSuccess: () => {
          setApplyOpen(false);
          toast.show(copy.apply.sent, { tone: 'success' });
        },
        onError: (error) => {
          setApplyOpen(false);
          if (error.code === 'not_available') {
            toast.show(copy.apply.unavailable, { tone: 'error' });
            page.assignments.refetch();
          } else if (error.code === 'already_applied') {
            toast.show(copy.apply.alreadyApplied);
            page.me.refetch();
          } else {
            toast.show(copy.apply.failed, { tone: 'error' });
          }
        },
      }
    );
  };

  const onFavourite = () => {
    if (page.role === 'anonymous') {
      setMembershipOpen(true);
      return;
    }
    toggleFavourite.mutate(!isFavourite, {
      onError: () => toast.show(copy.favourite.failed, { tone: 'error' }),
    });
  };

  const onShare = async () => {
    const url = listingWebUrl(page.listingId);
    const title = page.listing.data?.title ?? copy.brand;
    if (Platform.OS !== 'web') {
      await Share.share({ title, message: `${title} ${url}`, url });
      return;
    }
    const nav = typeof navigator !== 'undefined' ? navigator : undefined;
    if (nav?.share) {
      try {
        await nav.share({ title, url });
        return;
      } catch {
        // Cancelled or blocked: fall through to copying.
      }
    }
    await nav?.clipboard?.writeText(url);
    toast.show(copy.share.copied);
  };

  const submitReport = (reason: ReportReason, details: string) => {
    report.mutate(
      { reason, ...(details.trim() && { details: details.trim() }) },
      {
        onSuccess: () => {
          setReportOpen(false);
          toast.show(copy.report.thanks, { tone: 'success' });
        },
        onError: () => toast.show(copy.report.failed, { tone: 'error' }),
      }
    );
  };

  const dialogs = (
    <>
      <MembershipPrompt open={membershipOpen} onOpenChange={setMembershipOpen} />
      <ApplyDialog
        open={applyOpen}
        onOpenChange={setApplyOpen}
        ownerName={page.listing.data?.owner.firstName ?? ''}
        dates={page.selectedAssignment ? formatDateRange(page.selectedAssignment.startDate, page.selectedAssignment.endDate) : ''}
        sending={apply.isPending}
        onSubmit={submitApplication}
      />
      <ReportDialog open={reportOpen} onOpenChange={setReportOpen} sending={report.isPending} onSubmit={submitReport} />
    </>
  );

  return {
    onCta,
    onFavourite,
    onShare,
    openReport: () => setReportOpen(true),
    isFavourite,
    dialogs,
  };
}

export type ListingActions = ReturnType<typeof useListingActions>;

function MembershipPrompt({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{copy.membershipPrompt.title}</AlertDialogTitle>
          <AlertDialogDescription>{copy.membershipPrompt.body}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>
            <Text>{copy.membershipPrompt.notNow}</Text>
          </AlertDialogCancel>
          {/* Membership purchase is out of scope; this stands in for the plans page. */}
          <AlertDialogAction>
            <Text>{copy.membershipPrompt.plans}</Text>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function ApplyDialog({
  open,
  onOpenChange,
  ownerName,
  dates,
  sending,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ownerName: string;
  dates: string;
  sending: boolean;
  onSubmit: (message: string) => void;
}) {
  const [message, setMessage] = React.useState('');
  React.useEffect(() => {
    if (!open) setMessage('');
  }, [open]);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-lg">
        <DialogHeader>
          <DialogTitle>{copy.apply.title}</DialogTitle>
          <DialogDescription>{copy.apply.body(ownerName, dates)}</DialogDescription>
        </DialogHeader>
        <Textarea label={copy.apply.messageLabel(ownerName)} value={message} onChangeText={setMessage} maxLength={2000} />
        <DialogFooter>
          <Button variant="outline" onPress={() => onOpenChange(false)}>
            <Text>{copy.apply.cancel}</Text>
          </Button>
          <Button onPress={() => onSubmit(message)} disabled={sending}>
            <Text>{copy.apply.send}</Text>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ReportDialog({
  open,
  onOpenChange,
  sending,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sending: boolean;
  onSubmit: (reason: ReportReason, details: string) => void;
}) {
  const [reason, setReason] = React.useState<ReportReason | undefined>();
  const [details, setDetails] = React.useState('');
  React.useEffect(() => {
    if (!open) {
      setReason(undefined);
      setDetails('');
    }
  }, [open]);
  const reasons = ReportReason.options;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-lg">
        <DialogHeader>
          <DialogTitle>{copy.report.title}</DialogTitle>
          <DialogDescription>{copy.report.description}</DialogDescription>
        </DialogHeader>
        <RadioGroup value={reason} onValueChange={(v) => setReason(v as ReportReason)} aria-label={copy.report.title}>
          {reasons.map((r, i) => (
            <RadioGroupItem key={r} value={r} label={copy.report.reasons[r]} index={i} total={reasons.length} />
          ))}
        </RadioGroup>
        <Textarea label={copy.report.details} value={details} onChangeText={setDetails} maxLength={2000} />
        <DialogFooter>
          <Button variant="outline" onPress={() => onOpenChange(false)}>
            <Text>{copy.report.cancel}</Text>
          </Button>
          <Button onPress={() => reason && onSubmit(reason, details)} disabled={!reason || sending}>
            <Text>{copy.report.send}</Text>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
