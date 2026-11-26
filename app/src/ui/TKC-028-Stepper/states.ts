import type { StepperProps } from './Stepper';
export const ID = 'TKC-028', NAME = 'Stepper', VERSION = '0.2';
export const STATES: Array<{ name: string; props: StepperProps }> = [
  { name: 'Prayer intro (five parts)', props: { steps: [
    { name: 'Father', line: 'Come to God just as you are.' }, { name: 'Kingdom', line: 'Pray for tonight’s nations.' }, { name: 'People', line: 'Pray for the people on your heart.' },
    { name: 'Trust', line: 'Tell God why you trust Him to answer.' }, { name: 'Amen', line: 'Leave it in His hands.' }] } },
  { name: 'Add to Home Screen (four steps, a button, the ••• glyph)', props: { steps: [
    { name: 'Save a Backup', line: 'Save it to Files.', button: 'Save a Backup' }, { name: 'Tap the ••• Button', line: 'It’s next to the address bar. Then tap Share.' },
    { name: 'Tap Add to Home Screen', line: 'Scroll down if you don’t see it. Then tap Add.' }, { name: 'Restore Your Backup', line: 'Open Thy Kingdom from your Home Screen. Tap Restore From a Backup.' }] } },
  { name: 'step button pressed', props: { steps: [{ name: 'Save a Backup', line: 'Save it to Files.', button: 'Save a Backup', buttonShow: 'pressed' }, { name: 'Tap the ••• Button', line: 'It’s next to the address bar. Then tap Share.' }] } },
  { name: 'step button focus', props: { steps: [{ name: 'Save a Backup', line: 'Save it to Files.', button: 'Save a Backup', buttonShow: 'focus' }, { name: 'Tap the ••• Button', line: 'It’s next to the address bar. Then tap Share.' }] } },
];
