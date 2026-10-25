import { useMe } from '@ths/api-contract/react';
import { Text } from '@ths/ui';
import { screen } from '@testing-library/react-native';

import { renderWithProviders } from '../render';

function WhoAmI() {
  const me = useMe();
  return <Text>{me.data ? `${me.data.membership}:${me.data.firstName}` : me.error ? `error:${me.error.code}` : 'loading'}</Text>;
}

it('talks to the real mock API with a scenario', async () => {
  renderWithProviders(<WhoAmI />, { scenario: 'full-sitter' });
  expect(await screen.findByText('full:Jordan')).toBeTruthy();
});
