import type { StepHeaderProps } from './StepHeader';
export const ID = 'TKC-030', NAME = 'StepHeader', VERSION = '0.8';
// 0.7 (569): the label row left the page. The step's name, counter and state live in the TopBar's where-line; the header keeps the heading,
// the why line. 0.8 (frame-lock-7 part 2, C1): the "About This Step ›" link left the page; the book button in the TopBar opens the step's page.
const PSALM = { label: 'Psalm', heading: 'Worship with a Psalm', why: 'Psalms give words to every feeling. Let this one teach your heart to worship.' };
export const STATES: Array<{ name: string; props: StepHeaderProps }> = [
  { name: 'step (heading, why line)', props: PSALM },
  { name: 'Meditate (the counter is in the where-line)', props: { label: 'Meditate', slot: ' · Question 6 of 6', heading: 'Live It Out', why: 'God’s Word matters most when you live it. Think about what it means for you.' } },
  { name: 'Check-In (the name is in the where-line)', props: { label: 'Check-In', slot: ' · All of Me', heading: 'Look Inward', why: 'God knows your heart and loves you. Let Him show you one thing to bring to Him.' } },
  { name: 'More Tonight? (data why)', props: { label: 'Check-In', heading: 'More Tonight?', why: 'Today is the last day of the week and the month, so 2 more check-ins are available.' } },
  { name: 'Prayer intro (no why line)', props: { label: 'Prayer', heading: 'Pray the Prayer Jesus Taught Us' } },
  { name: 'Prayer parts 2–5 (nothing here)', props: { label: 'Prayer' } },
  { name: 'Guide', props: { label: 'Start Here', heading: 'Two Walks With God, Morning and Evening' } },
];
