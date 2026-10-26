import {
  ActionListRow,
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  AmenityList,
  AnimalCountBadge,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  DateRangeChip,
  formatDateRange,
  IconButton,
  MapPreview,
  OwnerCard,
  PersonAvatar,
  PetCard,
  PhotoGallery,
  PhotoViewer,
  RadioGroup,
  RadioGroupItem,
  ReadMore,
  ReviewCard,
  Section,
  Separator,
  Skeleton,
  StatusBanner,
  StickyApplyBar,
  Text,
  Textarea,
  useBreakpoint,
  useToast,
} from '@ths/ui';
import { Stack } from 'expo-router';
import { FlagIcon, HeartIcon, Share2Icon, WifiIcon, WindIcon } from 'lucide-react-native';
import * as React from 'react';
import { Modal, ScrollView, View } from 'react-native';

// Showcase for the design-system spec's "Visual parity across platforms" requirement.
// Sample data is fictional and lives here only; journeys get data from the mock API.

const PHOTOS = Array.from({ length: 10 }, (_, i) => ({
  id: `p${i}`,
  url: `https://picsum.photos/seed/ths-home-${i}/1200/900`,
  alt: i === 0 ? 'Bright living room' : undefined,
}));

const DATES = [
  { id: 'd1', start: '2026-12-20', end: '2026-12-27' },
  { id: 'd2', start: '2027-02-10', end: '2027-02-24' },
  { id: 'd3', start: '2027-03-28', end: '2027-04-04', reviewing: true },
];

const AMENITIES = [
  { id: 'a1', label: 'Wifi', detail: 'High-speed', icon: WifiIcon },
  { id: 'a2', label: 'Balcony' },
  { id: 'a3', label: 'Dedicated workspace', detail: 'Desk' },
  { id: 'a4', label: 'Air conditioning', icon: WindIcon },
  { id: 'a5', label: 'TV', detail: 'Streaming services' },
  { id: 'a6', label: 'Washing machine' },
  { id: 'a7', label: 'Parking' },
];

const LONG_TEXT =
  "Welcome to our home! It's a bright, top-floor apartment with plenty of natural light and two balconies, one at the front and one at the back, where you can start your morning or unwind in the evening. The neighbourhood is full of cafés, bakeries and parks, and the metro is a five-minute walk away. Our cat Pickle is shy for a day or two, then becomes the most affectionate lap cat you'll ever meet.";

const SWATCHES: { name: string; className: string }[] = [
  { name: 'primary', className: 'bg-primary' },
  { name: 'heading', className: 'bg-heading' },
  { name: 'brand', className: 'bg-brand' },
  { name: 'brand-subtle', className: 'bg-brand-subtle' },
  { name: 'accent-cta', className: 'bg-accent-cta' },
  { name: 'accent-cta-subtle', className: 'bg-accent-cta-subtle' },
  { name: 'highlight', className: 'bg-highlight' },
  { name: 'subtle', className: 'bg-subtle' },
  { name: 'secondary', className: 'bg-secondary' },
  { name: 'divider', className: 'bg-divider' },
  { name: 'success-surface', className: 'bg-success-surface' },
  { name: 'warning-surface', className: 'bg-warning-surface' },
  { name: 'info-surface', className: 'bg-info-surface' },
  { name: 'error-surface', className: 'bg-error-surface' },
  { name: 'destructive', className: 'bg-destructive' },
  { name: 'ring (focus)', className: 'bg-ring' },
];

export default function DesignSystemScreen() {
  const { isDesktop, breakpoint, width } = useBreakpoint();
  const [selectedDate, setSelectedDate] = React.useState('d1');
  const [favourite, setFavourite] = React.useState(false);
  const [lastPress, setLastPress] = React.useState<string>('—');
  const selected = DATES.find((d) => d.id === selectedDate);
  const [reason, setReason] = React.useState<string | undefined>();
  const [viewerIndex, setViewerIndex] = React.useState<number | null>(null);
  const toast = useToast();

  return (
    <View className="flex-1 bg-background">
      <Stack.Screen options={{ title: 'Design system' }} />
      <ScrollView contentContainerClassName="pb-16">
        <View className="w-full max-w-5xl self-center px-4 lg:px-8">
          <Section>
            <Text variant="h1">THS design system</Text>
            <StatusBanner tone="brand" title={`Breakpoint: ${breakpoint} (${Math.round(width)}px)`}>
              {isDesktop
                ? 'Desktop presentation (1024px and wider).'
                : 'Mobile presentation. Native and narrow web share this.'}
            </StatusBanner>
            <Text variant="caption">Last interaction: {lastPress}</Text>
          </Section>

          <Section title="Colour">
            <View className="flex-row flex-wrap gap-3">
              {SWATCHES.map((s) => (
                <View key={s.name} className="w-24 gap-1">
                  <View className={`h-12 rounded-md border border-divider ${s.className}`} />
                  <Text variant="caption">{s.name}</Text>
                </View>
              ))}
            </View>
          </Section>

          <Section title="Typography">
            <Text variant="h1">Heading 1 · 32 bold</Text>
            <Text variant="h2">Heading 2 · 24 semibold</Text>
            <Text variant="h3">Heading 3 · 20 semibold</Text>
            <Text variant="h4">Heading 4 · 18 medium</Text>
            <Text variant="lead">Lead · 18 regular, subtle</Text>
            <Text>Body · 16 regular. Text is deep teal, never black.</Text>
            <Text variant="small">Small · 14 regular</Text>
            <Text variant="label">Label · 14 semibold</Text>
            <Text variant="caption">Caption · 12 regular, subtle</Text>
            <Text variant="link">Link · semibold, underlined</Text>
          </Section>

          <Section title="Buttons">
            <View className="flex-row flex-wrap gap-3">
              <Button onPress={() => setLastPress('Button default')}>
                <Text>Apply to sit</Text>
              </Button>
              <Button variant="accent" onPress={() => setLastPress('Button accent')}>
                <Text>Join now to apply</Text>
              </Button>
              <Button variant="outline">
                <Text>Outline</Text>
              </Button>
              <Button variant="secondary">
                <Text>Secondary</Text>
              </Button>
              <Button variant="ghost">
                <Text>Ghost</Text>
              </Button>
              <Button variant="destructive">
                <Text>Delete</Text>
              </Button>
              <Button variant="link">
                <Text>Link</Text>
              </Button>
              <Button disabled>
                <Text>Disabled</Text>
              </Button>
              <Button size="sm">
                <Text>Small (44pt)</Text>
              </Button>
            </View>
            <View className="flex-row items-center gap-3 rounded-lg bg-secondary p-3">
              <IconButton
                icon={HeartIcon}
                accessibilityLabel={favourite ? 'Remove from favourites' : 'Add to favourites'}
                selected={favourite}
                onPress={() => setFavourite((f) => !f)}
                variant="overlay"
                iconClassName={favourite ? 'text-destructive' : undefined}
                iconProps={{ fill: favourite ? 'currentColor' : 'none' }}
              />
              <IconButton icon={Share2Icon} accessibilityLabel="Share listing" variant="outline" />
              <IconButton icon={FlagIcon} accessibilityLabel="Report listing" />
              <Text variant="caption">IconButton: overlay, outline, ghost</Text>
            </View>
          </Section>

          <Section title="Badges and status">
            <View className="flex-row flex-wrap gap-2">
              <Badge variant="verified">
                <Text>ID verified</Text>
              </Badge>
              <Badge variant="highlight">
                <Text>New listing</Text>
              </Badge>
              <Badge variant="accent">
                <Text>Cat</Text>
              </Badge>
              <Badge variant="success">
                <Text>Confirmed</Text>
              </Badge>
              <Badge variant="warning">
                <Text>Premium</Text>
              </Badge>
              <Badge variant="info">
                <Text>Info</Text>
              </Badge>
              <Badge variant="outline">
                <Text>Outline</Text>
              </Badge>
            </View>
            <View className="flex-row gap-2">
              <AnimalCountBadge species="cat" count={1} />
              <AnimalCountBadge species="dog" count={2} />
              <AnimalCountBadge species="bird" count={3} />
            </View>
            <StatusBanner tone="warning" title="Reviewing applications">
              The pet parent is reviewing applications for all of their dates.
            </StatusBanner>
            <StatusBanner tone="info">Your exact address is only shared after a sit is confirmed.</StatusBanner>
            <StatusBanner tone="success">Listing saved to your favourites.</StatusBanner>
            <StatusBanner tone="error">We couldn't load this listing. Check your connection and try again.</StatusBanner>
          </Section>

          <Section title="Photo gallery">
            <Text variant="muted">Follows the breakpoint. Resize the browser across 1024px to switch.</Text>
            <PhotoGallery photos={PHOTOS} onPhotoPress={setViewerIndex} className="rounded-lg" />
            <Text variant="caption">Pressing a photo opens the PhotoViewer at that photo.</Text>
          </Section>

          <Section title="Forms and feedback">
            <RadioGroup value={reason} onValueChange={setReason} aria-label="Report reason">
              {['Inaccurate information', 'Possible scam', 'Other'].map((label, i, all) => (
                <RadioGroupItem key={label} value={label} label={label} index={i} total={all.length} />
              ))}
            </RadioGroup>
            <Textarea label="Details (optional)" placeholder="Tell us a bit more" hint="Up to 2,000 characters" />
            <View className="flex-row flex-wrap gap-3">
              <Button variant="outline" onPress={() => toast.show('Link copied')}>
                <Text>Default toast</Text>
              </Button>
              <Button variant="outline" onPress={() => toast.show('Application sent', { tone: 'success' })}>
                <Text>Success toast</Text>
              </Button>
              <Button variant="outline" onPress={() => toast.show("We couldn't update your favourites. Please try again.", { tone: 'error' })}>
                <Text>Error toast</Text>
              </Button>
            </View>
          </Section>

          <View className="gap-8 lg:flex-row">
            <View className="flex-1">
              <Section title="Introduction">
                <ReadMore>{LONG_TEXT}</ReadMore>
              </Section>

              <Section title="Listing details" className="gap-0">
                <ActionListRow label="Home & location" onPress={() => setLastPress('Home & location')} />
                <ActionListRow label="Amenities" description="31 amenities" onPress={() => setLastPress('Amenities')} />
                <ActionListRow label="Responsibilities" onPress={() => setLastPress('Responsibilities')} last />
              </Section>

              <Section title="Amenities">
                <AmenityList amenities={AMENITIES} limit={5} onShowAll={() => setLastPress('Show all amenities')} />
              </Section>

              <Section title="Meet the pets">
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="gap-4">
                  <PetCard
                    name="Pickle"
                    species="cat"
                    breed="Domestic shorthair"
                    age="3 years"
                    photoUrl="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400"
                    onPress={() => setLastPress('Pet Pickle')}
                  />
                  <PetCard
                    name="Biscuit"
                    species="dog"
                    breed="Beagle"
                    age="6 years"
                    photoUrl="https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=400"
                    onPress={() => setLastPress('Pet Biscuit')}
                  />
                  <PetCard name="Kiwi" species="bird" breed="Budgie" age="1 year" onPress={() => setLastPress('Pet Kiwi')} />
                </ScrollView>
              </Section>

              <Section title="Sitter reviews (2)">
                <ReviewCard
                  reviewerName="Priya Raman"
                  text="We had a lovely stay! Pickle hid under the bed for the first day, then became the sweetest companion. The apartment was spotless and the hosts left a brilliant guide to the neighbourhood. We'd sit here again in a heartbeat."
                  stayStart="2026-06-24"
                  stayEnd="2026-07-20"
                />
                <ReviewCard reviewerName="Tom Okafor" text="A calm, happy week with a very cuddly cat." stayStart="2026-04-04" stayEnd="2026-04-07" />
              </Section>

              <Section title="Location">
                <MapPreview
                  latitude={45.5236}
                  longitude={-73.5822}
                  accessibilityLabel="Approximate location: Plateau-Mont-Royal, Montréal"
                />
                <Text variant="caption">Approximate location. The exact address is shared once a sit is confirmed.</Text>
              </Section>
            </View>

            <View className="lg:w-96">
              <Section title="Owner card">
                <OwnerCard name="Maya Laurent" photoUrl="https://i.pravatar.cc/120?img=47" verified>
                  <View className="gap-3">
                    <Text variant="label">Sitter needed</Text>
                    {DATES.map((d) => (
                      <DateRangeChip
                        key={d.id}
                        start={d.start}
                        end={d.end}
                        reviewing={d.reviewing}
                        selected={selectedDate === d.id}
                        onPress={() => setSelectedDate(d.id)}
                      />
                    ))}
                  </View>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="accent">
                        <Text>Join now to apply</Text>
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Join to apply</AlertDialogTitle>
                        <AlertDialogDescription>
                          Members can apply to sits like this one. This dialog stands in for the membership flow.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>
                          <Text>Not now</Text>
                        </AlertDialogCancel>
                        <AlertDialogAction>
                          <Text>See plans</Text>
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </OwnerCard>
              </Section>

              <Section title="Sticky apply bar, summary only">
                <StickyApplyBar summary={<Text variant="muted">No dates available right now</Text>} />
              </Section>

              <Section title="Card, avatar, skeleton">
                <Card>
                  <CardHeader>
                    <CardTitle>Card title</CardTitle>
                    <CardDescription>Radius 12, level 1 elevation.</CardDescription>
                  </CardHeader>
                  <CardContent className="gap-4">
                    <View className="flex-row items-center gap-3">
                      <PersonAvatar name="Maya Laurent" photoUrl="https://i.pravatar.cc/120?img=47" size="sm" />
                      <PersonAvatar name="Maya Laurent" photoUrl="https://i.pravatar.cc/120?img=47" />
                      <PersonAvatar name="Jo Kim" size="lg" verified />
                      <PersonAvatar name="Sam Patel" size="xl" />
                    </View>
                    <Separator />
                    <View className="gap-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-24 w-full rounded-lg" />
                    </View>
                  </CardContent>
                </Card>
              </Section>
            </View>
          </View>
        </View>
      </ScrollView>

      <Modal visible={viewerIndex !== null} animationType="fade" onRequestClose={() => setViewerIndex(null)}>
        {viewerIndex !== null && (
          <PhotoViewer photos={PHOTOS} initialIndex={viewerIndex} onClose={() => setViewerIndex(null)} />
        )}
      </Modal>

      {!isDesktop && (
        <StickyApplyBar
          summary={
            selected ? (
              <View>
                <Text variant="caption">Sitter needed</Text>
                <Text className="font-semibold">{formatDateRange(selected.start, selected.end)}</Text>
              </View>
            ) : null
          }
          action={
            <Button variant="accent" onPress={() => setLastPress('Sticky bar CTA')}>
              <Text>Join now to apply</Text>
            </Button>
          }
        />
      )}
    </View>
  );
}
