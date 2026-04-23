import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { ServerConfigStoreProvider } from '@/store/serverConfig/Provider';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

vi.mock('@/config/routes', () => ({
  getRouteById: () => ({ icon: () => null }),
}));

vi.mock('@/store/global', () => ({
  useGlobalStore: (selector: (state: { toggleCommandMenu: () => void }) => unknown) =>
    selector({ toggleCommandMenu: vi.fn() }),
}));

import { useNavLayout } from './useNavLayout';

describe('useNavLayout', () => {
  it('maps changelog and eval footer entries from feature flags', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ServerConfigStoreProvider featureFlags={{ changelog: false, rag_eval: true }}>
        {children}
      </ServerConfigStoreProvider>
    );

    const { result } = renderHook(() => useNavLayout(), { wrapper });

    expect(result.current.footer.showChangelog).toBe(false);
    expect(result.current.footer.showEvalEntry).toBe(true);
  });
});
