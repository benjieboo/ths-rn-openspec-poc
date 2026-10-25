import { renderHook, waitFor } from '@testing-library/react-native';

import { Providers, setWindowSize, PHONE } from '@/test/render';
import { useListingPage } from './use-listing-page';

const wrap = (scenario: string) => ({ children }: { children: React.ReactNode }) => (
  <Providers scenario={scenario}>{children}</Providers>
);

beforeEach(() => setWindowSize(PHONE));

it('Single available range is selected when the page opens', async () => {
  const { result } = renderHook(() => useListingPage('2002'), { wrapper: wrap('full-sitter') });
  await waitFor(() => expect(result.current.selectedId).toBe('as_2002_1'));
  expect(result.current.cta).toMatchObject({ kind: 'apply' });
});

it('several open ranges: nothing selected, Apply asks to choose dates', async () => {
  const { result } = renderHook(() => useListingPage('2001'), { wrapper: wrap('full-sitter') });
  await waitFor(() => expect(result.current.assignments.isSuccess).toBe(true));
  expect(result.current.selectedId).toBeUndefined();
  expect(result.current.cta).toMatchObject({ kind: 'choose-dates' });
});

it('own listing: role owner, no CTA, no favourite/report', async () => {
  const { result } = renderHook(() => useListingPage('2001'), { wrapper: wrap('own-listing') });
  await waitFor(() => expect(result.current.role).toBe('owner'));
  expect(result.current.cta).toEqual({ kind: 'none', reason: 'owner' });
  expect(result.current.visible).toMatchObject({ favourite: false, report: false });
});
