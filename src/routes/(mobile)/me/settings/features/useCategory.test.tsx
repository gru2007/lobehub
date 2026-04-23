import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { ServerConfigStoreProvider } from '@/store/serverConfig/Provider';

import { useCategory } from './useCategory';

vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe('mobile settings useCategory', () => {
  it('hides provider settings when the feature flag is disabled', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ServerConfigStoreProvider featureFlags={{ provider_settings: false }}>
        {children}
      </ServerConfigStoreProvider>
    );

    const { result } = renderHook(() => useCategory(), { wrapper });
    const agentGroup = result.current.find((group) => group.key === 'agent');

    expect(agentGroup?.items.some((item) => item.key === 'provider')).toBe(false);
  });
});
