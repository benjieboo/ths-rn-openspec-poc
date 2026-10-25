import { Button, PhotoViewer, RadioGroup, RadioGroupItem, Text, Textarea, TOAST_DURATION_MS, useToast } from '@ths/ui';
import { act, fireEvent, screen } from '@testing-library/react-native';
import * as React from 'react';

import { renderWithProviders } from '../render';

// Scenarios from openspec/changes/add-listing-view/specs/design-system/spec.md

const PHOTOS = Array.from({ length: 10 }, (_, i) => ({ id: `p${i}`, url: `https://example.com/${i}.jpg`, alt: null as never }));

describe('Core primitives', () => {
  it('Radio group semantics', async () => {
    function Reasons() {
      const [value, setValue] = React.useState<string>();
      return (
        <RadioGroup value={value} onValueChange={setValue}>
          {['Inaccurate', 'Possible scam', 'Other'].map((label, i, all) => (
            <RadioGroupItem key={label} value={label} label={label} index={i} total={all.length} />
          ))}
        </RadioGroup>
      );
    }
    renderWithProviders(<Reasons />);
    const scam = screen.getByRole('radio', { name: 'Possible scam, 2 of 3' });
    expect(scam).not.toBeChecked();
    fireEvent.press(scam);
    expect(screen.getByRole('radio', { name: 'Possible scam, 2 of 3' })).toBeChecked();
  });

  it('Labelled text area', () => {
    renderWithProviders(<Textarea label="Details (optional)" />);
    expect(screen.getByText('Details (optional)')).toBeVisible();
    expect(screen.getByLabelText('Details (optional)')).toBeTruthy();
  });
});

describe('Toast', () => {
  // Fake timers start after render, so the portal host mounts normally.
  afterEach(() => jest.useRealTimers());

  function Trigger() {
    const toast = useToast();
    return (
      <>
        <Button onPress={() => toast.show('Application sent', { tone: 'success' })}>
          <Text>first</Text>
        </Button>
        <Button onPress={() => toast.show('Link copied')}>
          <Text>second</Text>
        </Button>
      </>
    );
  }

  it('Confirmation', () => {
    renderWithProviders(<Trigger />);
    jest.useFakeTimers();
    fireEvent.press(screen.getByText('first'));
    expect(screen.getByRole('status')).toHaveTextContent('Application sent');
    act(() => jest.advanceTimersByTime(TOAST_DURATION_MS + 50));
    expect(screen.queryByRole('status')).toBeNull();
  });

  it('Several messages', () => {
    renderWithProviders(<Trigger />);
    fireEvent.press(screen.getByText('first'));
    fireEvent.press(screen.getByText('second'));
    expect(screen.getAllByRole('status')).toHaveLength(1);
    expect(screen.getByRole('status')).toHaveTextContent('Link copied');
  });
});

describe('PhotoViewer', () => {
  it('Open at a photo', () => {
    renderWithProviders(<PhotoViewer photos={PHOTOS} initialIndex={2} onClose={() => {}} />);
    expect(screen.getByTestId('photo-viewer-position')).toHaveTextContent('3 / 10');
  });

  it('arrow buttons move and close is labelled', () => {
    const onClose = jest.fn();
    renderWithProviders(<PhotoViewer photos={PHOTOS} initialIndex={0} onClose={onClose} />);
    fireEvent.press(screen.getByRole('button', { name: 'Next photo' }));
    expect(screen.getByTestId('photo-viewer-position')).toHaveTextContent('2 / 10');
    fireEvent.press(screen.getByRole('button', { name: 'Close photos' }));
    expect(onClose).toHaveBeenCalled();
  });
});
