// Settings › Privacy (T22; the Settings Lock 1281, 1306): a plain page of six lines in one panel. No verse (1245). Also the public notice (1280).
// A screen file: data and layout only, built from the library.
import { SETTINGS as S } from '../../copy';
import { TopBar } from '../TKC-002-TopBar/TopBar';
import { SettingsShell, SettingsTitle, SettingsLines, type Place } from '../patterns/SettingsPage';
import type { Nav, Route } from '../App';

export function SettingsPrivacy({ nav }: { nav: Nav }) {
  const go = (p: Place) => nav({ s: p.toLowerCase() } as Route);
  return <SettingsShell view="privacy" onTab={go} top={<TopBar variant="page" label={S.privacy.back} onClose={() => nav({ s: 'settings' })} />}>
    <SettingsTitle>{S.privacy.title}</SettingsTitle>
    <SettingsLines label={S.privacy.title} lines={S.privacy.lines} />
  </SettingsShell>;
}
