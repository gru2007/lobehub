import { BUILTIN_AGENT_SLUGS } from '@lobechat/builtin-agents';
import { NanoBanana } from '@lobehub/icons';
import { type ButtonProps } from '@lobehub/ui';
import { Button, Center, Tooltip } from '@lobehub/ui';
import { GroupBotSquareIcon } from '@lobehub/ui/icons';
import { createStaticStyles, cssVar, cx } from 'antd-style';
import { BotIcon, PenLineIcon } from 'lucide-react';
import { memo, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { useInitBuiltinAgent } from '@/hooks/useInitBuiltinAgent';
import { type StarterMode } from '@/store/home';
import { useHomeStore } from '@/store/home';
import { featureFlagsSelectors, useServerConfigStore } from '@/store/serverConfig';

const styles = createStaticStyles(({ css, cssVar }) => ({
  active: css`
    border-color: ${cssVar.colorFillSecondary} !important;
    background: ${cssVar.colorBgElevated} !important;
  `,
  button: css`
    height: 40px;
    border-color: ${cssVar.colorFillSecondary};
    background: transparent;
    box-shadow: none !important;

    &:hover {
      border-color: ${cssVar.colorFillSecondary} !important;
      background: ${cssVar.colorBgElevated} !important;
    }
  `,
}));

type StarterTitleKey =
  | 'starter.createAgent'
  | 'starter.createGroup'
  | 'starter.write'
  | 'starter.seedance'
  | 'starter.deepResearch'
  | 'starter.nanoBanana2';

interface StarterItem {
  disabled?: boolean;
  hot?: boolean;
  icon?: ButtonProps['icon'];
  key: StarterMode;
  titleKey: StarterTitleKey;
}

const StarterList = memo(() => {
  const { t } = useTranslation('home');
  const { showAiImage } = useServerConfigStore(featureFlagsSelectors);

  useInitBuiltinAgent(BUILTIN_AGENT_SLUGS.agentBuilder);
  useInitBuiltinAgent(BUILTIN_AGENT_SLUGS.groupAgentBuilder);
  useInitBuiltinAgent(BUILTIN_AGENT_SLUGS.pageAgent);

  const [inputActiveMode, setInputActiveMode, navigate] = useHomeStore((s) => [
    s.inputActiveMode,
    s.setInputActiveMode,
    s.navigate,
  ]);

  const items: StarterItem[] = useMemo(
    () => {
      const items: StarterItem[] = [
        {
          icon: BotIcon,
          key: 'agent',
          titleKey: 'starter.createAgent',
        },
        {
          icon: GroupBotSquareIcon,
          key: 'group',
          titleKey: 'starter.createGroup',
        },
        {
          icon: PenLineIcon,
          key: 'write',
          titleKey: 'starter.write',
        },
        // {
        //   hot: true,
        //   icon: VideoIcon,
        //   key: 'video',
        //   titleKey: 'starter.seedance',
        // },
        // {
        //   disabled: true,
        //   icon: MicroscopeIcon,
        //   key: 'research',
        //   titleKey: 'starter.deepResearch',
        // },
      ];

      if (showAiImage) {
        items.push({
          icon: NanoBanana.Color,
          key: 'image',
          titleKey: 'starter.nanoBanana2',
        });
      }

      return items;
    },
    [showAiImage],
  );

  const handleClick = useCallback(
    (key: StarterMode) => {
      if (key === 'video') {
        navigate?.('/video');
        return;
      }

      if (key === 'image') {
        navigate?.('/image?model=gemini-3.1-flash-image-preview:image');
        return;
      }

      // Toggle mode: if clicking the active mode, clear it; otherwise set it
      if (inputActiveMode === key) {
        setInputActiveMode(null);
      } else {
        setInputActiveMode(key);
      }
    },
    [inputActiveMode, setInputActiveMode, navigate],
  );

  return (
    <Center horizontal gap={8}>
      {items.map((item) => {
        const button = (
          <Button
            className={cx(styles.button, inputActiveMode === item.key && styles.active)}
            disabled={item.disabled}
            icon={item.icon}
            key={item.key}
            shape={'round'}
            variant={'outlined'}
            iconProps={{
              color: inputActiveMode === item.key ? cssVar.colorText : cssVar.colorTextSecondary,
              size: 18,
            }}
            onClick={() => handleClick(item.key)}
          >
            {t(item.titleKey)}
            {item.hot && ' 🔥'}
          </Button>
        );

        if (item.disabled) {
          return (
            <Tooltip key={item.key} title={t('starter.developing')}>
              {button}
            </Tooltip>
          );
        }

        return button;
      })}
    </Center>
  );
});

export default StarterList;
