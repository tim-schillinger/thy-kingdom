import type { PrayerWordsProps } from './PrayerWords';
export const ID = 'TKC-035', NAME = 'PrayerWords', VERSION = '0.4';
export const STATES: Array<{ name: string; props: PrayerWordsProps }> = [
  { name: 'one verse', props: { kind: 'verse', text: 'Open my eyes, that I may see wondrous things out of your law.' } },
  { name: 'meaning (under a one-verse prayer)', props: { kind: 'meaning', text: 'In the temple, incense and an offering went up to God each evening. This asks Him to receive your prayer the same way.' } },
  { name: 'aim', props: { kind: 'aim', text: 'Pray for the people who call tonight’s nations home.' } },
  { name: 'aim (part 1)', props: { kind: 'aim', first: true, text: 'Come to God just as you are.' } },
  { name: 'move', props: { kind: 'move', text: 'Tell your Father how you’re doing tonight.' } },
  { name: 'lead-in', props: { kind: 'leadin', text: 'If you want words:' } },
  { name: 'starter', props: { kind: 'starter', text: 'Father, thank You for welcoming me just as I am. I’m not alone. I pray alongside people everywhere who call on You. You’re bigger than anything I bring You, and You’re listening.' } },
  { name: 'part (Trust)', props: { kind: 'part', aim: 'Tell God why you trust Him.', move: 'Think of the people you just prayed for. Now look to God, who can answer.', leadin: 'If you want words:',
    starter: 'God, everything is Yours to give. Nothing I asked is too hard for You. Whatever You answer, I know You are good.' } },
];
