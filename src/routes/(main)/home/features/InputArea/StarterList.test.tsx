import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import StarterList from './StarterList';

const mockState = vi.hoisted(() => ({
  inputActiveMode: null as 'agent' | 'group' | 'write' | 'image' | 'video' | 'research' | null,
  showAiImage: true,
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) =>
      (
        {
          'starter.createAgent': 'Create Agent',
          'starter.createGroup': 'Create Group',
          'starter.developing': 'Coming soon',
          'starter.imageGeneration': 'Image Generation',
          'starter.videoGeneration': 'Seedance 2.0',
          'starter.write': 'Write',
        } as Record<string, string>
      )[key] || key,
  }),
}));

vi.mock('@/hooks/useInitBuiltinAgent', () => ({
  useInitBuiltinAgent: vi.fn(),
}));

vi.mock('@/hooks/useStableNavigate', () => ({
  useStableNavigate: () => vi.fn(),
}));

vi.mock('@/store/home', () => ({
  useHomeStore: <T,>(
    selector: (state: {
      inputActiveMode: typeof mockState.inputActiveMode;
      setInputActiveMode: (mode: typeof mockState.inputActiveMode) => void;
    }) => T,
  ) =>
    selector({
      inputActiveMode: mockState.inputActiveMode,
      setInputActiveMode: vi.fn(),
    }),
}));

vi.mock('@/store/serverConfig', () => ({
  featureFlagsSelectors: (state: { featureFlags: { showAiImage: boolean } }) => state.featureFlags,
  useServerConfigStore: <T,>(
    selector: (state: { featureFlags: { showAiImage: boolean } }) => T,
  ) =>
    selector({
      featureFlags: {
        showAiImage: mockState.showAiImage,
      },
    }),
}));

describe('StarterList', () => {
  afterEach(() => {
    mockState.inputActiveMode = null;
    mockState.showAiImage = true;
  });

  it('shows the image starter when image generation is enabled', () => {
    render(<StarterList />);

    expect(screen.getByRole('button', { name: /Image Generation/i })).toBeInTheDocument();
  });

  it('hides the image starter when image generation is disabled', () => {
    mockState.showAiImage = false;

    render(<StarterList />);

    expect(screen.queryByRole('button', { name: /Image Generation/i })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Seedance 2.0/i })).toBeInTheDocument();
  });
});
