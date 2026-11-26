// App copy for the skeleton's screens. Sources: the edit log (498–505, 520–528, 613, 946–973, 1003–1010), the specs
// (TKC-024, 027, 030, 035, 036 0.1.1, 039, 046), IA Flows 1–3, and the Component Review's approved phones.
import type { CheckIn, StepId, Ref } from './engine/types';

export const STEP_COPY: Record<StepId, { heading: string; why: string; instruction?: string }> = {
  'am.sing': { heading: 'Begin by Singing to God', why: 'Singing to God brings all of you: heart, mind, and voice.', instruction: 'Sing it, or read the words to God.' },
  'am.ask': { heading: 'Pray Before You Read', why: 'Ask God to help you hear Him in today’s reading.', instruction: 'Pray this, or use your own words:' },
  'am.psalm': { heading: 'Worship with a Psalm', why: 'Psalms give words to every feeling. Let this one teach your heart to worship.' },
  'am.proverb': { heading: 'Get Wisdom for Today', why: 'God’s wisdom for how you live, work, and choose today.' },
  'am.reading': { heading: 'Read Today’s Passage', why: 'Read a little each day, and finish the Bible in a year. Reflect on how it relates to God, yourself, and other people.' },
  'am.respond': { heading: 'Tell God What You Heard', why: 'You’ve listened. Now give yourself to what you heard.', instruction: 'Say aloud or quietly:' },
  'am.memorize': { heading: 'Learn This Week’s Verse', why: 'Learn one verse by heart. It helps you stay close to God all day.' },
  'pm.turn': { heading: 'Pause and Pray', why: 'Turn from your busy day. Ask God to meet you tonight.', instruction: 'Pray this, or use your own words:' },
  'pm.classic': { heading: 'Read a Few Pages of a Classic', why: 'Wisdom from people who followed Jesus long before you, with their doubts, their struggles, and what they learned. Let it quiet your mind after the day.' },
  'pm.notes': { heading: 'Read Today’s Study Notes', why: 'The story behind the chapters: what was happening then, and what it asks of you now.' },
  'pm.dig': { heading: 'Dig Into Today’s Reading', why: 'A commentary on this morning’s chapters. See them through another person’s eyes, and understand them more deeply.' },
  'pm.prayer': { heading: 'Pray for Others', why: 'Jesus said to always pray and not give up. Tonight, pray for people near and far, even the ones you’d rather skip.' },
  'pm.checkin': { heading: 'Look Inward', why: 'God knows your heart and loves you. Let Him show you one thing to bring to Him.' },
  'pm.meditate': { heading: 'Set Your Mind on God', why: 'Slow down with one passage. Ask what it shows you about God, yourself, and the people you’ll see tomorrow.' },
};
/** TKC-064 Tip (frame-lock-11, 3410 y): the first-time tip by the book button, and its ✕'s name for a screen reader. */
export const TIP = { about: 'Tap the book to see why this step matters.', close: 'Close tip' };
export const SONG_COPY = { label: 'Song', heading: 'Worship with a Song', why: 'Songs in the Bible give words to every feeling. Let this one teach your heart to worship.' }; // 435, 522, 523
export const RESPOND = { line1: 'I hear You about', line2: 'I give myself to You, and to that, today.', helper: 'Fill the blank with one thing God put on your heart this morning.' }; // TKC-036 0.1.1
export const MEMORIZE_TIPS = ['Read it a few times, then try saying it without looking.', 'Say it out loud, slowly, one phrase at a time.', 'Write it down once, by hand.', 'Come back to it a few times during the day.'];

export const WALK = {
  morning: { name: 'Morning Walk', time: 'First hour of your day', purpose: 'Start your day listening to God.' },
  evening: { name: 'Evening Walk', time: 'Last hour of your day', purpose: 'End your day with God, praying for others.' },
};

// Check-ins (R25–R29; questions 170–172; areas 172, 194, the Oct 28 rule; anchors from each chart's epigraph). Frame Lock 4a, 4b, 4c (Nov 9–10, 2026): the words are the tappable
// ideas (1–3 words, never wrapping, 1698–1701); each opens a read sheet from sheets.json (60 sheets). Character and Fairness name the wrong (1704).
export const CHECKIN: Record<CheckIn, { anchor: string; question: string; move: string; areas: string[]; /** TKC-052: the quote stored per Bible where the first-comma cut can't promise whole words (1679) */ quote?: { web: string; kjv: string } }> = {
  burnt: { anchor: 'LUK 10:27', question: 'Is there something God gave me that I could use to help His kingdom come, in me and around me?', move: 'If something comes to mind, pray about it, and choose one way to love God and others with it tomorrow.',
    quote: { web: '“You shall love the Lord your God with all your heart, with all your soul, with all your strength, and with all your mind…”', kjv: '“Thou shalt love the Lord thy God with all thy heart, and with all thy soul, and with all thy strength, and with all thy mind…”' },
    areas: ['Energy', 'Imagination', 'Choices', 'Body', 'Memory', 'Words', 'Eyes and ears', 'Thinking', 'Personality', 'Emotions', 'Conscience', 'Soul'] },
  grain: { anchor: 'PRO 3:9', question: 'Where is God asking me to give?', move: 'If something comes to mind, pray about it, and decide where and when you’ll give.',
    areas: ['Relatives', 'Widows', 'Disabled people', 'The poor', 'Immigrants', 'The persecuted', 'Charities', 'Outcasts', 'Aid workers', 'A local church', 'Orphans', 'The earth'] },
  peace: { anchor: 'HEB 12:14', question: 'Is there someone I need to make peace with?', move: 'If someone comes to mind, pray for them, and choose one step toward peace.',
    areas: ['Family', 'Debts', 'Pastors', 'Church', 'Neighbors', 'Rivals', 'Friends', 'Clubs and teams', 'Strangers', 'Coworkers', 'Other cultures', 'Enemies'] },
  sin: { anchor: 'PRO 28:13', question: 'Is there a sin I need to turn from?', move: 'If something comes to mind, confess it to God and receive His mercy. Then choose one way to turn from it.',
    areas: ['Idols', 'Pride', 'Lying', 'Hatred', 'Overdoing it', 'Lust', 'Disrespect', 'Betrayal', 'Envy', 'Selfishness', 'Greed', 'Waste'] },
  trespass: { anchor: 'PRO 20:23', question: 'Is there a wrong I need to make right?', move: 'If something comes to mind, choose one way to make it right, and ask God to help you do it.',
    areas: ['Hoarding', 'Copying', 'Gossip', 'Cheating', 'Dividing people', 'False ads', 'Stealing', 'Deceiving', 'Bad example', 'Taking credit', 'Disloyalty', 'Accidents'] },
};
/** The ideas label on every Check-In (1707) and the read sheets' last section (frame-lock-4a §4). */
export const CHECKIN_IDEAS = 'Need ideas?';
/** Prayer's starter words sit behind this link in the card, which opens a sheet (frame-lock-7 R5, 1846 a, 2000 y). */
export const NEED_WORDS = 'Need words?';
/** The plate's small line (frame-lock-7 R6, 788). */
export const PLATE_EYEBROW = { name: 'A Name of God', attribute: 'What God Is Like' } as const;
/** The six Meditate questions are named by a group in the card's label (frame-lock-7 R7). */
export const MEDITATE_GROUP = ['Set Your Mind on God', 'Set Your Mind on God', 'Set Your Mind on God', 'Live It Out', 'Live It Out', 'Live It Out'] as const;
export const QUESTION_OF = (n: number, of: number) => `Question ${n} of ${of}`;
export const SHEET_BIBLE = 'From the Bible';
/** A meaning line in the anchor's verse sheet, like Turn to God's (1703, 1714, 1721). Giving's and Fairness's anchors read whole but need a line to be understood. */
export const ANCHOR_MEANING: Partial<Record<CheckIn, string>> = {
  grain: 'Substance means what you own. First fruits were the first and best of a harvest. Give God your first and best, not what’s left over.',
  trespass: 'Sellers once weighed goods on scales. A cheat kept two sets of weights, one for buying and one for selling. God cares that every deal is fair.',
};

// Meditate: first-person questions (170) and the moves drawn from the Author's endings (171).
export const MEDITATE_Q = [
  'What does this show me about God that’s worth praising?', 'What does this show me about my own heart?',
  'What does this show me about how God sees people?', 'How should this change the way I worship?',
  'How should this change what I do tomorrow?', 'How should this change the way I treat people?',
];
export const MEDITATE_MOVE = [
  'If something comes to mind, praise God for it, aloud or quietly.',
  'If something comes to mind, ask God to help you change it.',
  'If someone comes to mind, ask God to help you see them the way He does.',
  'If something comes to mind, bring it with you when you sing tomorrow morning.',
  'If something comes to mind, choose one small way to start.',
  'If someone comes to mind, choose one kind thing to do for them this week.',
];

// Prayer (Flow 3; 946–973). Anchors are the prayer's lines in her Bible (Matthew 6:9–13).
export const PRAYER = {
  introHeading: 'Pray the Prayer Jesus Taught Us',
  introBody: 'Tonight, bring your world into His prayer: the nations, the people in your life, and what’s on your heart.',
  parts: [
    { name: 'Father', line: 'Come to God just as you are.' },
    { name: 'Kingdom', line: 'Pray for the people of tonight’s nations.' },
    { name: 'People', line: 'Pray for the people in your life.' },
    { name: 'Trust', line: 'Tell God why you trust Him.' },
    { name: 'Amen', line: 'Leave it in God’s hands.' },
  ],
  father: { aim: 'Come to God just as you are.', move: 'Tell your Father how you’re doing tonight.',
    starter: 'Father, thank You for welcoming me just as I am. I’m not alone. I pray alongside people everywhere who call on You. You’re bigger than anything I bring You, and You’re listening.' },
  kingdom: { aim: 'Pray for the people who call tonight’s nations home.', aimNone: 'Pray for people in every nation tonight.',
    moveMany: 'Picture a family in one of these nations tonight. They love their kids and worry about them, too. Thank God for the good in their lives, and grieve what’s hard.',
    moveOne: (n: string) => `Picture a family in ${n} tonight. They love their kids and worry about them, too. Thank God for the good in their lives, and grieve what’s hard.`,
    moveNone: 'Picture a family somewhere in the world tonight. They love their kids and worry about them, too. Thank God for the good in their lives, and grieve what’s hard.',
    starter: (n: string) => `God, let Your kingdom come in ${n}. Give every home there what it needs tonight: food, safety, and someone who cares. Show me where I can help.`,
    starterNone: 'God, let Your kingdom come in every nation. Give every home what it needs tonight: food, safety, and someone who cares. Show me where I can help.' },
  people: { aim: 'Pray for the people in your life tonight.', aimRequests: 'Bring your own requests to God.', select: 'Select what you ask God for.', key: 'What do these mean?',
    keyLines: { provide: 'They need help with daily needs: work, money, health, a home.', forgive: 'Something needs forgiving: their wrongs, or what I hold against them.', protect: 'They need protecting: from harm, from temptation, and from evil.' },
    empty: 'Who comes to mind?', emptyRequests: 'What’s on your heart?' },
  trust: { aim: 'Tell God why you trust Him.', move: 'Think of the people you just prayed for. Now look to God, who can answer.',
    starter: 'God, everything is Yours to give. Nothing I asked is too hard for You. Whatever You answer, I know You are good.' },
  amen: { aim: 'Leave it in God’s hands.', starter: 'God, I trust You heard me. Because of Jesus, I can always come to You. Amen.' },
  anchors: ['MAT 6:9', 'MAT 6:10', 'MAT 6:11-12', 'MAT 6:13', 'MAT 6:13'],
  /** The anchor line's quoted words per part (Review J-p1 to J-p5). The KJV lines are best guesses (flagged, asked 1458). */
  anchorText: {
    web: ['“Our Father in heaven,”', '“Let your Kingdom come. Let your will be done on earth as it is in heaven.”', '“Give us today our daily bread. Forgive us… deliver us…”', '“For yours is the Kingdom, the power, and the glory forever.”', '“Amen.”'],
    kjv: ['“Our Father which art in heaven,”', '“Thy kingdom come. Thy will be done in earth, as it is in heaven.”', '“Give us this day our daily bread. And forgive us… deliver us…”', '“For thine is the kingdom, and the power, and the glory, for ever.”', '“Amen.”'],
  },
};

export const END = {
  morningDone: 'Morning Walk Complete', morningLine: 'You started your day with God.',
  eveningDone: 'Evening Walk Complete', eveningLine: 'You ended your day with God.',
  pastLine: 'You walked with God.', dayPastLine: 'You walked with God, morning and evening.',
  morningOpen: 'Your Morning Walk is still open. Finish it to complete today’s walks.', morningOpenPast: 'Your Morning Walk is still open. Finish it to complete this day’s walks.',
  dayDone: 'You Completed Today’s Walks!', dayLine: 'You started and ended your day with God.',
};

/** Learn More (TKC-004 read): each step's What You Do and Why It Matters, word for word from the step-pages sweep (claude/content/step-lessons.md; 1910–1939 y, Nov 12–13). */
export const LEARN_MORE: Partial<Record<StepId, Array<{ head: string; body: string }>>> = {
  'am.sing': [{ head: 'What You Do', body: 'Sing today’s song to God, out loud or quietly.' }, { head: 'Why It Matters', body: 'Before the day’s plans and worries, a song turns your eyes to who God is. People have sung to Him for thousands of years, and this morning you join them.' }],
  'am.ask': [{ head: 'What You Do', body: 'Pray one short prayer, in your own words or the psalm’s.' }, { head: 'Why It Matters', body: 'This short prayer is an honest one: you came to hear from God, and you need His help to do it. It can turn reading into listening.' }],
  'am.psalm': [{ head: 'What You Do', body: 'Read today’s psalm. Let it turn your heart toward God.' }, { head: 'Why It Matters', body: 'Worship is the right place to start a day with God. The Psalms give you words for every feeling you have.' }],
  'am.proverb': [{ head: 'What You Do', body: 'Read today’s chapter of Proverbs. Pick one saying to keep in mind today.' }, { head: 'Why It Matters', body: 'Proverbs is short sayings about everyday life: words, work, money, and friends. It has 31 chapters, one for each day of the month, so you come back to each one again and again.' }],
  'am.reading': [{ head: 'What You Do', body: 'Read today’s chapters.' }, { head: 'Why It Matters', body: 'The whole Bible shows more of who God is than any one part can. Reading all of it, a little each day, can shape what you believe, how you live, and how you love other people.' }],
  'am.respond': [{ head: 'What You Do', body: 'Tell God one thing you heard this morning. Then tell Him you’re ready to live it today.' }, { head: 'Why It Matters', body: 'You’ve spent the morning listening. This is your chance to answer. Saying what you heard, in your own words, can help you carry it into the day.' }],
  'am.memorize': [{ head: 'What You Do', body: 'Read this week’s verse a few times. Then try saying it without looking.' }, { head: 'Why It Matters', body: 'A verse you know by heart is there when you need it: in a hard talk, a long line, or a sleepless night. You keep the same verse all week, so it has time to sink in.' }],
  'pm.turn': [{ head: 'What You Do', body: 'Stop for a moment and let the day go quiet. Then ask God to hear you tonight.' }, { head: 'Why It Matters', body: 'The morning is mostly listening. The evening makes room for you to talk with God about your day, the people in it, and yourself. A short prayer first can help you leave the day’s noise behind.' }],
  'pm.classic': [{ head: 'What You Do', body: 'Read tonight’s few pages of the classic.' }, { head: 'Why It Matters', body: 'A day can pull your thoughts in every direction. A few pages from someone who followed Jesus in another time and place can turn your heart back toward God. You’re part of something far older and wider than today.' }],
  'pm.notes': [{ head: 'What You Do', body: 'Read tonight’s study notes on a few chapters of the Bible.' }, { head: 'Why It Matters', body: 'The Bible was written long ago and far away. Study notes connect it to ordinary life: your work, your home, and the people around you. At the end of the day, they can help you think about how to live what you believe.' }],
  'pm.dig': [{ head: 'What You Do', body: 'Read tonight’s commentary on this morning’s chapters.' }, { head: 'Why It Matters', body: 'This morning you read these chapters on your own. Tonight you come back to them with help. The more clearly you understand what you read, the more fully you can live it.' }],
  'pm.prayer': [{ head: 'What You Do', body: 'Pray the Lord’s Prayer in five parts. Along the way, pray for tonight’s nations and the people in your life.' }, { head: 'Why It Matters', body: 'Praying for someone is a way to love them, even from far away. Jesus taught this prayer Himself, and praying it this way reaches past your own needs to people you may never meet. It can also change how you see them.' }],
  'pm.checkin': [{ head: 'What You Do', body: 'Ask yourself tonight’s question. If something comes to mind, choose one step to take.' }, { head: 'Why It Matters', body: 'The question changes through the year, so in time you look at your whole life: what God gave you, your giving, your relationships, your character, and how fairly you treat people. A little at a time is easier than all at once.' }],
  'pm.meditate': [{ head: 'What You Do', body: 'Read tonight’s passage slowly. Then think about tonight’s one question.' }, { head: 'Why It Matters', body: 'Reading the Bible is the start. Thinking it over slowly is how it reaches what you believe and what you do. Some nights you think on words from the Bible, and other nights on one of God’s names or something He has done.' }],
};
/** The first Sunday of each month: the day's hymn is the Doxology (3163 a, 3164, 3165). Thomas Ken, public domain; the semicolons are his and stay. */
/** Psalm 119's letter block (frame-lock-5-names-2 §E; 1004, 3005, 3006 y) and its sheet "About This Psalm ›" (796). Each Bible keeps its own spelling of the letter's name. */
export const PSALM_119 = {
  more: 'About This Psalm', sheetTitle: 'About Psalm 119',
  plain: (n: number) => `Hebrew letter ${n} of 22`,
  meaning: (n: number) => `Psalm 119 is a poem in 22 parts, one for each letter of the Hebrew alphabet. This is part ${n}.${n === 21 ? ' This letter has two sounds, s and sh.' : ''}`,
  sheet: (n: number, name: string) => [
    { head: 'A Poem Built on an Alphabet', body: 'Psalm 119 is the longest chapter in the Bible. It has 22 parts, one for each letter of the Hebrew alphabet, in order. In Hebrew, every verse in a part starts with that part’s letter. English can’t keep that, so Bibles print the letter’s name above each part.' },
    { head: 'Why Every Letter', body: 'Nearly every verse is about God’s word. Using every letter can be a way of saying: all of it, from first to last.' },
    { head: 'Where This Part Falls', body: `This is part ${n} of 22. Its letter is ${name}.` },
  ],
};
/** TKC-035 meaning line under Turn to God's verse (566, 574). */
export const TURN_MEANING = 'In the temple, incense and an offering went up to God each evening. This asks Him to receive your prayer the same way.';
/** The hymn's credit and its sheet, "About This Hymn" (Build 7h; 118, 119). The Words (the writer line spelled out), The Writer (the hymn's short story, 3124, 3155) and The Hymnal (compiled by the chaplains of the Army and Navy, The Century Co., New York, 1920). */
export const HYMN_ABOUT = { credit: 'From The Army and Navy Hymnal, 1920', link: 'About This Hymn', words: 'The Words', writer: 'The Writer', hymnal: 'The Hymnal',
  hymnalText: 'The Army and Navy Hymnal was put together by the chaplains of the Army and Navy and printed in New York in 1920.' };
/** The "where you are" line under the Bible Reading's source line (T25 Studio, 3490 y). Four seasons; no book, writer or story named; no "chronological" and no "one story" (voice §5). */
export const WHERE_YOU_ARE = {
  ot: 'Right now the readings are in the Old Testament. They come to Jesus’ life on Oct 1, and begin again at Genesis on Jan 1.',
  jesus: 'Right now the readings are in the four books about Jesus’ life. On Jan 1, they begin again at Genesis.',
  church: 'Right now the readings are about the first churches and the letters written to them. On Jan 1, they begin again at Genesis.',
  rev: 'Right now the readings are in Revelation, the Bible’s last book. On Jan 1, they begin again at Genesis.',
} as const;
/** The recording (frame-lock-9 §2b and §3; 375 y, 381 y). The note sits under the player on every day the player shows. */
export const HYMN_AUDIO = { note: 'The recording can differ from the words here.',
  /** 3-6d (frame-lock-13 §5, §6): on a morning whose hymn has no recording, while she is on In the App. The link opens the Hymnal sheet. */
  none: 'This hymn has no recording.', noneLink: 'Choose Hymns With a Recording', noneAria: 'Choose Hymns With a Recording. Opens the hymnal choices', heading: 'The Recording', aboutAria: 'About This Hymn. Opens its writer, its hymnal, and its recording', aboutAriaDoxology: 'About This Hymn. Opens its writer and its recording',
  tail: 'LibriVox volunteers record old books and songs and share them for free.',
  /** "Sung by [name], a volunteer with LibriVox. …" (one), "[a] and [b], volunteers" (two), "a group of volunteers" (the page names none), "[a] and another volunteer" (one named and one not) */
  body(t: { readers: string[]; more?: boolean; group?: boolean }): string {
    const n = t.readers.length;
    const who = t.group || n === 0 ? 'Sung by a group of volunteers with LibriVox.' : n === 1 && t.more ? `Sung by ${t.readers[0]} and another volunteer with LibriVox.`
      : n === 1 ? `Sung by ${t.readers[0]}, a volunteer with LibriVox.` : `Sung by ${t.readers.slice(0, -1).join(', ')}${n > 2 ? ',' : ''} and ${t.readers[n - 1]}, volunteers with LibriVox.`;
    return `${who} ${HYMN_AUDIO.tail}`;
  } };
export const DOXOLOGY = { n: 'doxology', title: 'Praise God, from Whom All Blessings Flow', firstLine: 'Praise God, from whom all blessings flow;', writer: 'Thomas Ken', year: 1695, recorded: null,
  stanzas: [['Praise God, from whom all blessings flow;', 'Praise Him, all creatures here below;', 'Praise Him above, ye heavenly host;', 'Praise Father, Son, and Holy Ghost.']], refrain: [] as string[],
  instruction: 'Sing it through, then once more.',
  story: 'Thomas Ken wrote these four lines as the last verse of a longer morning hymn that begins “Awake, my soul, and with the sun.” He wrote it, and an evening hymn that ends the same way, for the students of Winchester College, a school in England, to sing alone in their rooms. Both were printed in 1695 in his book of prayers for the students. In time, people began to sing the last verse on its own and called it the Doxology, a word for a short song of praise. In it, “heavenly host” means the angels, and “Holy Ghost” is an older name for the Holy Spirit.' };
/** The two pick-one sheets a step's source line opens (Hi-Fi Studio v8.1, locked 1087). */
export const BIBLE_SHEET = { title: 'Choose Your Bible', line: 'Every reading in the app uses the Bible you choose.', reference: 'Psalm 23:1',
  rows: [{ key: 'web', name: 'World English Bible', line: 'Modern, plain English' }, { key: 'kjv', name: 'King James Version', line: 'The classic wording' }] } as const;
export const READINGS_SHEET = { title: 'Bible Readings', line: 'Your choice is used for every Bible reading in the app.', own: { name: 'My Own Bible', line: 'Read in your own Bible, then come back for the next step.' } };
export const HYMNAL_SHEET = { title: 'Hymnal', line: 'Your choice is used every time the app asks you to sing.', app: { name: 'In the App', line: 'The hymn, right on the screen' },
  /** 3-6d (frame-lock-13 §6, 441 y): the third row, between In the App and My Own Hymnal. */
  recorded: { name: 'Hymns With a Recording', line: 'A hymn you can sing along with' }, own: { name: 'My Own Hymnal', line: 'Sing from your own hymnal, then come back for the next step.' } };
// Best-guess words (445, flagged for approval): same shape as the Bible Readings and Hymnal sheets
/** Meditate's Change sheet (452 proceed): best-guess words, flagged for approval. The week's verse only; a Name night keeps its own verse. */
export const MEDITATE_SHEET = { title: 'Meditation Verse', line: 'Your choice is used every time the app asks you to meditate.', app: { name: 'This Week’s Verse', line: 'A new verse each week, right on the screen' }, own: { name: 'My Own Verse', line: 'Meditate on a verse you choose, then answer the question here.' } };
export const MEMORIZE_SHEET = { title: 'Memory Verse', line: 'Your choice is used every time the app asks you to memorize.', app: { name: 'This Week’s Verse', line: 'A new verse each week, right on the screen' }, own: { name: 'My Own Verse', line: 'Memorize a verse you choose, then come back for the next step.' } };
export const OWN_LINES = { sing: 'Sing a hymn from your own hymnal.', memorize: 'Memorize a verse you choose.', meditate: 'Meditate on a verse you choose.', classic: 'Read the next part of your book.', notes: 'Read your study notes.', dig: 'Read your commentary.' };

/** What the three books' credit lines say (1400, Builder's reading, confirmed at the C1 walk). The Classic's credit is its writer's name, in the content file. */
/** The Study Notes' notice (739; CC BY-SA 4.0 needs the credit, the license link and a statement of changes one tap away). Best-guess words, flagged for approval. */
export const NOTES_NOTICE = { title: 'About These Notes',
  sections: [
    { head: 'Where They Come From', body: 'Aquifer Open Study Notes, by Mission Mutual (2026). They are adapted from the Tyndale Open Study Notes, by Tyndale House (2023).' },
    { head: 'What We Changed', body: 'Some notes are left out. The links between notes are plain text here.' },
    { head: 'How You Can Use Them', body: 'They are shared under a Creative Commons license, CC BY-SA 4.0. You can copy and share them with credit, under the same license.' },
  ],
  links: [{ label: 'Read the license', href: 'https://creativecommons.org/licenses/by-sa/4.0/' }, { label: 'See where they come from', href: 'https://github.com/BibleAquifer/AquiferOpenStudyNotes' }] };
/** Dig Deeper's notice (3431 y = A, Nov 24, 2026): the commentary is fixed, so its writer and years may be named. Public domain, so no license link, only where it comes from. */
export const DIG_NOTICE = { title: 'About This Commentary',
  sections: [
    { head: 'The Book', body: 'Matthew Henry’s Concise Commentary, a short version of the commentary Matthew Henry wrote on the whole Bible. He lived from 1662 to 1714 and served as a minister in England.' },
    { head: 'Where It Comes From', body: 'From the CrossWire Bible Society.' },
    { head: 'What We Changed', body: 'Some sections are left out.' },
    { head: 'How You Can Use It', body: 'It’s in the public domain, so you can copy and share it freely.' },
  ],
  links: [{ label: 'See where it comes from', href: 'https://crosswire.org/study/fulllibrary.jsp?show=MHCC' }] };
export const BOOK_CREDIT = { notes: 'Aquifer Open Study Notes · CC BY-SA 4.0', articles: 'Aquifer Open Bible Dictionary · CC BY-SA 4.0', dig: 'Matthew Henry, Concise Commentary' };
/** Study Notes on an article night (Books 2, 3203–3206: the first and last day of each month, and Christmas): one short dictionary article instead of notes on chapters.
 *  Best-guess words, flagged for approval (3220). The step keeps its name, Study Notes. */
export const ARTICLE = {
  heading: 'Read Today’s Article',
  why: 'A short article on one idea from the Bible, so its words can mean more when you read them.',
  source: 'Bible dictionary',
  learn: [{ head: 'What You Do', body: 'Read tonight’s short article about one idea in the Bible.' }, { head: 'Why It Matters', body: 'Words like grace and mercy are easy to say and hard to explain. A short article can show how the Bible uses them, so they mean more the next time you read.' }],
  notice: { title: 'About These Articles',
    sections: [
      { head: 'Where They Come From', body: 'Aquifer Open Bible Dictionary, by Mission Mutual (2026). It is adapted from the Tyndale Open Bible Dictionary, by Tyndale House (2023).' },
      { head: 'What We Changed', body: 'A few words are left out, and Bible book names are written the way this app writes them. The links between articles are plain text here.' },
      { head: 'How You Can Use Them', body: 'They are shared under a Creative Commons license, CC BY-SA 4.0. You can copy and share them with credit, under the same license.' },
    ],
    links: [{ label: 'Read the license', href: 'https://creativecommons.org/licenses/by-sa/4.0/' }, { label: 'See where they come from', href: 'https://github.com/BibleAquifer/AquiferOpenBibleDictionary' }] },
};
/** The three books' Change sheets (best-guess words, flagged for approval, 451): the same shape as Bible Readings, Hymnal and Memory Verse. */
export const BOOK_SHEETS = {
  classic: { title: 'Classic', line: 'Your choice is used every time the app asks you to read your classic.', app: { name: 'In the App', line: 'The reading, right on the screen' }, own: { name: 'My Own Book', line: 'Read your own book, then come back for the next step.' } },
  studyNotes: { title: 'Study Notes', line: 'Your choice is used every time the app asks you to read study notes.', app: { name: 'In the App', line: 'The notes, right on the screen' }, own: { name: 'My Own Study Notes', line: 'Read your own study notes, then come back for the next step.' } },
  digDeeper: { title: 'Dig Deeper', line: 'Your choice is used every time the app asks you to read a commentary.', app: { name: 'In the App', line: 'The commentary, right on the screen' }, own: { name: 'My Own Commentary', line: 'Read your own commentary, then come back for the next step.' } },
};
/** Settings › Bible and Books (POC T13). Row names and editions are the decided ones (1261, 1277, 1300, 1400); the Classic's and Study Notes' names follow 271 y, 272 y (Drummond follows Brother Lawrence; dictionary articles on the article nights). Müller joins the Classic's name when his book lands. */
export const BIBLE_BOOKS = {
  title: 'Bible and Books', back: 'Settings', app: 'In the App',
  kinds: { bible: 'Bible', readings: 'Bible Readings', hymnal: 'Hymnal', classic: 'Classic', studyNotes: 'Study Notes', digDeeper: 'Dig Deeper' },
  edition: { web: 'Text of Oct 22, 2026', kjv: '1769 edition' },
  classic: 'Brother Lawrence and Henry Drummond', studyNotes: 'Aquifer Open Study Notes and Bible Dictionary', digDeeper: 'Matthew Henry',
};
/** The Settings home (the Settings Lock, Oct 26, 2026; Settings Studio v2.2, look B: 1258, 1263, 1265, 1291, 1306, 1307) and its three sheets (TKC-004 0.6: 1241, 1249, 1255, 1256, 1291).
 *  Sing Days is left out of the home (290 y, Nov 18: the first Sunday of the month is plain, 3163–3165). Privacy and Add to Home Screen come with POC.v2 (T22). */
export const SETTINGS = {
  title: 'Settings',
  heads: { walks: 'Walks', progress: 'Progress', display: 'Display', data: 'Your Data' },
  evening: { name: 'Your Evening Begins', print: 'Your Evening Walk moves to the top of Today at this time.' },
  tracking: { name: 'Track My Progress', on: 'Shows your streak, your plant, and the Progress page.', off: 'Your streak, your plant, and the Progress page are hidden.' },
  appearance: { name: 'Appearance', title: 'Appearance', values: { phone: 'Match My Phone', light: 'Light', dark: 'Dark' },
    lines: { phone: 'Light or dark, as your phone is set', light: 'Always light', dark: 'Always dark, softer at night' } },
  textSize: { name: 'Text Size', title: 'Text Size', sample: 'This Week’s Verse', values: { phone: 'Match My Phone', regular: 'Regular', large: 'Large', larger: 'Larger', largest: 'Largest' },
    choices: { phone: 'Match My Phone', regular: 'Regular', large: 'Large (125%)', larger: 'Larger (150%)', largest: 'Largest (200%)' }, phoneLine: 'Uses your phone’s text size',
    /** each name is set at the size it names (TKC-012 C, 1256): px */ sizes: { phone: 17, regular: 17, large: 21, larger: 25.5, largest: 34 } as Record<string, number>, sampleName: (v: string) => `Sample at ${v}` },
  data: { save: 'Save a Backup', restore: 'Restore From a Backup', print: 'Everything you add stays on this phone.', erase: 'Erase Everything' },
  reminder: { name: 'Backup Reminder', title: 'Backup Reminder', values: { off: 'Off', week: 'Every Week', month: 'Every Month' }, print: 'Shows a reminder on Today when it’s time to save a backup.' },
  /** The Privacy page (T22; Settings Lock 1281, the six lines in claude/data-ownership.md). Also the public notice (1280). */
  privacy: { name: 'Privacy', title: 'Privacy', back: 'Settings', lines: [
    'Everything you add stays on this phone. Your lists, answered prayers, checkmarks, progress, and settings never leave it.',
    'There is no account. We can’t see your data.',
    'The app has no ads and no tracking. It never sends what you write.',
    'When your phone is online, the app checks for a new version. That check sends nothing about you.',
    'A backup is the only copy that leaves this phone. You choose where it goes.',
    'If you delete the app or clear Safari’s website data, what’s on this phone is gone. A backup brings it back.',
  ] },
  /** Add to Home Screen (T22; TKC-004 0.6, 1244, 1293, 1301): the row, and the read sheet in two versions (with or without lists to carry over). */
  addHome: { name: 'Add to Home Screen', title: 'Add to Home Screen', got: 'Got It',
    line: 'So your lists and progress stay safe on this phone.',
    lineLists: 'Your Home Screen app starts fresh. Restore your backup there to bring your lists.',
    steps: [{ name: 'Tap the ••• Button', line: 'It’s next to the address bar. Then tap Share.' }, { name: 'Tap Add to Home Screen', line: 'Scroll down if you don’t see it. Then tap Add.' }],
    save: { name: 'Save a Backup', line: 'Save it to Files.', button: 'Save a Backup' },
    restore: { name: 'Restore Your Backup', line: 'Open Thy Kingdom from your Home Screen. Tap Restore From a Backup.' } },
};
/** One sentence naming a few things, with the Oxford comma ("Luke 8 and Matthew 13", "A, B, and C"). */
export const listAnd = (xs: string[]) => (xs.length <= 2 ? xs.join(' and ') : `${xs.slice(0, -1).join(', ')}, and ${xs[xs.length - 1]}`);

/** The Lists tab (Flow 5, the 5b Lists lock). Line copy for each list is LISTS (voice-lines); the counts and facts follow the lock. */
export const LISTS_TAB = {
  title: 'Lists', tabs: ['Praying For', 'Answered'] as const, back: 'Lists',
  count: (sat: boolean, n: number) => (sat ? (n === 0 ? 'No requests yet' : n === 1 ? '1 request' : `${n} requests`) : n === 0 ? 'No one yet' : n === 1 ? '1 person' : `${n} people`),
  add: 'Add Person', addRequest: 'Add Request',
  facts: { list: 'List', added: 'Added', prayed: 'Prayed for', asked: 'You asked', askedOn: 'Asked' },
  times: (n: number) => (n === 1 ? '1 time' : `${n} times`),
  actions: { answered: 'Mark Answered', edit: 'Edit', remove: 'Remove' },
  answered: { empty: 'When God answers a prayer, mark it answered. It will be kept here.', anchor: 'Psalm 103:2', heading: 'God Answered', menu: { edit: 'Edit Answer', undo: 'Undo Answered', remove: 'Remove' } },
  backOnList: (n: string, list: string) => `${n} is back on ${list}`,
};
/** Lists search and sort (TKC-011 0.2, TKC-048 0.2; decisions 1107, 1109, 1110, 1116, 1118): every visible line is the locked one. The two spoken lines (the count, "Results for …") are the spec's own (TKC-011 I). */
export const LISTS_FIND = {
  placeholder: 'Search names and requests', clear: 'Clear search',
  noMatch: (q: string) => `No names or requests match “${q}.”`,
  results: (n: number) => (n === 1 ? '1 result' : `${n} results`), resultsFor: (q: string) => `Results for ${q}`,
  sort: {
    title: (list: string) => `Sort ${list}`, group: 'Sort order',
    orders: [
      { key: 'oldest', name: 'Oldest First', line: 'The first one you added at the top' },
      { key: 'newest', name: 'Newest First', line: 'The last one you added at the top' },
      { key: 'az', name: 'A–Z', line: 'By name, A at the top', lineRequest: 'By request, A at the top' },
      { key: 'za', name: 'Z–A', line: 'By name, Z at the top', lineRequest: 'By request, Z at the top' },
    ] as ReadonlyArray<{ key: 'oldest' | 'newest' | 'az' | 'za'; name: 'Oldest First' | 'Newest First' | 'A–Z' | 'Z–A'; line: string; lineRequest?: string }>,
  },
};
/** People sheets (Add Person, Edit, Mark Answered, Choose a List): the words are the drawn states' (TKC-004, 011, 018, 020, 047). Best guesses are marked. */
export const PEOPLE_SHEETS = {
  add: { title: 'Add Person', titleRequest: 'Add Request', primary: 'Add', name: 'Name', pray: 'What to pray for', needName: 'Add a name.', needRequest: 'Add a request.' },
  edit: { title: 'Edit Person', titleRequest: 'Edit Request', primary: 'Save', moving: (n: string) => `Moving keeps ${n}’s prayer count.` },
  /** Edit Answer (the answered record's ⋯): best guess, flagged for approval (5b Lists build). */
  editAnswer: { title: 'Edit Answer', primary: 'Save' },
  chooser: { title: 'Choose a List', line: (n: string) => `Where does ${n} fit in your life?` },
  answered: { title: 'Mark Answered', question: (n: string) => `How did God answer your prayer for ${n}?`, questionRequest: 'How did God answer this request?', helper: 'In a few words, if you like.', primary: 'Save',
    when: (d: string, today: boolean) => (today ? `Answered today · ${d} ·` : `Answered ${d} ·`), pickTitle: 'Pick a Day', pickLine: (n: string) => `The day God answered your prayer for ${n}.`,
    pickLineRequest: 'The day God answered this request.', thanksTitle: 'Moved to Answered Prayers.', thanksLine: 'Take a moment to thank God.', amen: 'Amen' },
  menu: { answered: 'Mark Answered', edit: 'Edit', remove: 'Remove' },
  removed: (n: string) => `${n} removed`, undo: 'Undo',
  firstAdd: (list: string) => `Saved to ${list}.`,
  ahead: (n: number, d: string) => `These ${n} come up on ${d}.`,
};

/** The People count line and the Learn More sheet (frame-lock-6 §5.1 and §6; 1807, 1814, 1815, 1817). The nouns and the Leaders examples are approved;
 *  the variants marked "best guess" are new and wait for the Creator (questions 822 to 824). */
export const PEOPLE_COUNT = [
  { one: 'person from your faith family', many: 'people from your faith family' },
  { one: 'person close to you', many: 'people close to you' },
  { one: 'neighbor', many: 'neighbors' },
  { one: 'leader', many: 'leaders' },
  { one: 'person who is hurting', many: 'people who are hurting' },
  { one: 'person it’s hard to love', many: 'people it’s hard to love' },
] as const;
/** "Tonight, pray for 3 neighbors and select what you ask God for." Saturday: "Tonight, bring 3 requests to God and select what you ask Him for." */
export const peopleCountLine = (list: number, n: number) => list === 6
  ? `Tonight, bring ${n} ${n === 1 ? 'request' : 'requests'} to God and select what you ask Him for.`
  : `Tonight, pray for ${n} ${n === 1 ? PEOPLE_COUNT[list].one : PEOPLE_COUNT[list].many} and select what you ask God for.`;
export const PEOPLE_MORE = 'Learn More';
/** A reading that did not open: one message every time, with Try Again (3230, 3236). It says what happened, what may have caused it, and what she can do. */
export const READING_FAILED = 'This reading didn’t open. The app’s copy of it may be missing or out of date. Try again to reload it, or skip this step for now.';
const ordinal = (n: number) => `${n}${n % 100 >= 11 && n % 100 <= 13 ? 'th' : ['th', 'st', 'nd', 'rd'][n % 10 > 3 ? 0 : n % 10]}`;
/** The sheet's first section: why tonight's number is what it is. `d` is the day of the month, `pool` the people on the list before tonight,
 *  `added` the people who joined tonight's prayer tonight. Approved: 1817 (the 14th with 5 leaders; more people than the date; the 1st) and
 *  3232, 3234, 3237, 3238 (one on the list; someone added to a list with people; an empty list with someone added; Saturday prays "about" requests). */
export function whyTonight(list: number, d: number, pool: number, added: number): { title: string; body: string } {
  const sat = list === 6, c = PEOPLE_COUNT[sat ? 3 : list];
  const noun = (n: number) => (sat ? (n === 1 ? 'request' : 'requests') : n === 1 ? c.one : c.many);
  const who = sat ? 'requests' : 'people';
  const shown = Math.min(d, pool) + added;
  const all = (n: number) => (n === 1 ? (sat ? 'it' : 'them') : n === 2 ? 'both' : `all ${n}`);
  const verb = sat ? 'pray about' : 'pray for';
  const rule = sat
    ? ' Each night, the date sets the number: up to 3 on the 3rd, up to 25 on the 25th. When your list is longer, the requests you haven’t prayed about in the longest time come first, so each one gets a turn.'
    : ' Each night, the date sets the number: up to 3 on the 3rd, up to 25 on the 25th. When a list is longer, the people you haven’t prayed for in the longest time come first, so everyone gets a turn.';
  const day = `Tonight is the ${ordinal(d)}, so you can ${sat ? 'bring' : 'pray for'} up to ${d} ${d === 1 ? (sat ? 'request' : 'person') : who}${sat ? ' to God' : ''}.`;
  let body: string;
  if (pool === 0) body = `${day} You added ${added} ${noun(added)} tonight, so you ${verb} ${all(added)}.${rule}`;
  else if (pool > d) body = `Tonight is the ${ordinal(d)}, so you ${verb} ${d} of ${noun(pool).startsWith('people') || noun(pool).startsWith('person') ? 'the' : 'your'} ${pool} ${noun(pool)}${added ? `, plus the ${added} you added tonight` : ''}.${rule}`;
  else body = `${day} You have ${pool} ${noun(pool)}${added ? `, plus ${added} you added tonight` : ''}, so you ${verb} ${all(pool + added)}.${rule}`;
  return { title: `Why ${shown} Tonight`, body };
}
export const LEARN_ASK = 'What to Ask God For';
/** The three asks under "What to Ask God For": the key lines (525) and the prayer's own words in each Bible. */
export const LEARN_ITEMS = (bible: 'web' | 'kjv') => [
  { word: 'Provide', meaning: PRAYER.people.keyLines.provide, line: bible === 'kjv' ? '“Give us this day our daily bread.”' : '“Give us today our daily bread.”' },
  { word: 'Forgive', meaning: PRAYER.people.keyLines.forgive, line: bible === 'kjv' ? '“And forgive us our debts, as we forgive our debtors.”' : '“Forgive us our debts, as we also forgive our debtors.”' },
  { word: 'Protect', meaning: PRAYER.people.keyLines.protect, line: bible === 'kjv' ? '“And lead us not into temptation, but deliver us from evil:”' : '“Bring us not into temptation, but deliver us from the evil one.”' },
];

// ---------- The Guide (Guide Studio v1.0, locked 1218; words swept Nov 13–14, 2026) ----------
/** The Guide's home (IA, Guide: Start Here, Your Walks, Rhythms; Go Deeper joins when its lessons are written, 1193). */
export const GUIDE = {
  title: 'Guide', line: 'How it all works, and why.',
  heads: { walks: 'Your Walks', rhythms: 'Rhythms', deeper: 'Go Deeper' },
  startHere: { label: 'Start Here', title: 'How It Works', line: '5 short pages', done: 'Read Again' },
  walkLine: (purpose: string) => `7 steps · ${purpose}`,
  walkPage: { morning: 'Start your day listening to God. Seven steps, in order.', evening: 'End your day with God, praying for others. Seven steps, in order.' },
  year: { name: 'Your Whole Year', line: 'Why each day brings what it does' },
  stepLabel: (walk: string, n: number) => `${walk} · Step ${n}`,
  parts: { do: 'What You Do', why: 'Why It Matters', tips: 'Tips', bible: 'In the Bible' },
};
export interface GuideVerse { ref: Ref; /** Show the verse only up to and including this text (Respond's Luke 1:38 ends before "Then the angel departed from her", 1946) */ upTo?: string; /** The same cut in the King James text, where the words differ */ upToKjv?: string; /** Show the verse only from this text on (the Lord's Prayer's part 2 starts at "Our Father", 3316) */ from?: string; /** The same start in the King James text, where the words differ */ fromKjv?: string }
/** Start Here (claude/content/start-here.md, APPROVED Nov 14, 3060–3071). Each page: label, title, a line, and a verse. */
export const START_HERE = {
  of: (n: number) => `${n} of 5`, back: 'Back', next: 'Next', done: 'Done', close: 'Close',
  walkTiles: [{ name: 'Morning Walk', line: 'First hour of your day' }, { name: 'Evening Walk', line: 'Last hour of your day' }],
  pages: [
    { title: 'Two Walks With God, Morning and Evening', line: 'No need to plan. Each day’s readings and prayers are ready for you.', verse: { ref: { b: 'PSA', c: 74, v: 16 } } as GuideVerse },
    { title: 'Morning: Listen First', line: 'Start your day listening to God.', verse: { ref: { b: 'ISA', c: 50, v: 4 } } as GuideVerse,
      steps: [['Sing', 'Praise God with a song.'], ['Ask to Hear', 'Ask God to help you hear Him.'], ['Psalm', 'Worship with the day’s psalm.'], ['Proverb', 'Get wisdom for today.'], ['Bible Reading', 'Read the whole Bible, a little each day.'], ['Respond', 'Tell God what you heard.'], ['Memorize', 'Take one verse into your day.']] },
    { title: 'Evening: Look Out, Then In', line: 'End your day with God. Read, pray for others, then look inward.', verse: { ref: { b: 'PSA', c: 4, v: 8 } } as GuideVerse,
      steps: [['Turn to God', 'Let the day go quiet, and ask God to hear you.'], ['Classic', 'Read a few pages from someone who followed Jesus.'], ['Study Notes', 'Read notes that connect the Bible to everyday life.'], ['Dig Deeper', 'Understand this morning’s chapters more deeply.'], ['Prayer', 'Pray for tonight’s nations and the people in your life.'], ['Check-In', 'Ask yourself tonight’s question.'], ['Meditate', 'Think over one passage, and how to live it.']] },
    { title: 'Each Day Brings Something New', line: 'Your readings, your prayer list, and your check-in change with the day, the week, and the year.', verse: { ref: { b: 'PSA', c: 145, v: 2 } } as GuideVerse,
      facts: [['Every day', 'New readings and a check-in'], ['Every week', 'A different prayer list each night'], ['Every year', 'The whole Bible, and every nation four times']], row: 'See Your Whole Year' },
    { title: 'Grow at Your Own Pace', line: 'Each day you finish both walks, your streak grows. Skip a step when you need to. A day you don’t finish stays open, and you can finish it later.', verse: { ref: { b: 'MRK', c: 4, v: 28 } } as GuideVerse },
  ],
};
/** Your Whole Year (start-here.md, "Your Whole Year (Rhythms)"). Every line as approved; the verse is Ecclesiastes 3:1 (1216). */
export const YEAR = {
  title: 'Your Whole Year', line: 'Each day is ready for you. Here is how a year fits together.', verse: { ref: { b: 'ECC', c: 3, v: 1 } } as GuideVerse,
  sections: [
    { head: 'Every Day', rows: [['Morning', 'A song, a psalm, a proverb, and a Bible reading'], ['Evening', 'Prayer for a few nations, and the All of Me check-in']] },
    { head: 'Every Week', line: 'A prayer list for each night', rows: [['Sunday', 'Faith Family'], ['Monday', 'Family & Friends'], ['Tuesday', 'Neighbors'], ['Wednesday', 'Leaders'], ['Thursday', 'The Hurting'], ['Friday', 'Difficult People'], ['Saturday', 'Your Requests'], ['Saturday', 'The Giving check-in'], ['All week', 'One verse to learn by heart'], ['Most nights', 'One passage to think over'], ['About once a week', 'One of God’s names, or what He is like']] },
    { head: 'Every Month', rows: [['Through the month', 'All of Proverbs, about a chapter a day'], ['First and last day', 'A song from another part of the Bible, in place of the psalm'], ['Last day', 'The Relationships check-in']] },
    { head: 'Every Quarter', rows: [['Last day', 'The Character check-in'], ['A new start', 'Prayer for every nation begins again']] },
    { head: 'Every Year', rows: [['December 31', 'The Fairness check-in'], ['Over the year', 'The whole Bible, the Psalms twice, and every nation four times']] },
  ] as Array<{ head: string; line?: string; rows: string[][] }>,
  note: 'Some nights have more than one check-in. The rarest comes first. One is enough, and the others are there if you have time.',
};
/** A step's page, parts 3 and 4 (claude/content/step-lessons.md, "Tips and In the Bible, step by step"; approved Nov 13). What You Do and Why It Matters are LEARN_MORE's two parts, word for word. */
export const LESSONS: Record<StepId, { tips: string[]; verse: GuideVerse; line: string }> = {
  'am.sing': { tips: ['A whisper is still a song.', 'If the tune is new to you, the words can be prayed.', 'One line of the song can go with you into the day.'], verse: { ref: { b: 'PSA', c: 104, v: 33 } }, line: 'Singing to God is as old as the Psalms.' },
  'am.ask': { tips: ['The psalm’s own words are enough.', 'One sentence is plenty.', 'You can pray it again at any point in your reading.'], verse: { ref: { b: '1SA', c: 3, v: 10 } }, line: 'God called the boy Samuel, and Samuel answered that he was listening.' },
  'am.psalm': { tips: ['Read it as a prayer, with God as the One you’re talking to.', 'When a line fits how you feel, pray it as your own.', 'When a line is far from how you feel, pray it for someone it fits.'], verse: { ref: { b: 'PSA', c: 51, v: 15 } }, line: 'Even the words to praise God are something you can ask Him for.' },
  'am.proverb': { tips: ['Try putting the saying in your own words.', 'Think of one place today where it could apply.', 'Proverbs describe how life often goes. They are wisdom, not promises.'], verse: { ref: { b: 'PRO', c: 16, v: 16 } }, line: 'Proverbs calls wisdom worth more than gold.' },
  'am.reading': { tips: ['Some chapters are easier than others. Each one is part of the whole Bible.', 'Reading aloud can help you stay with it.', 'A question you can’t answer yet is worth holding on to.'], verse: { ref: { b: 'PSA', c: 119, v: 130 } }, line: 'God’s words give light and understanding, even to a beginner.' },
  'am.respond': { tips: ['One thing is enough. The smallest thing you noticed is fine.', 'Saying it out loud can make it feel more real.', 'Your own words are the right words.', 'A name can go in the blank, too.'], verse: { ref: { b: 'LUK', c: 1, v: 38 }, upTo: 'word.' }, line: 'Mary heard God’s word to her and answered by giving herself to it.' },
  'am.memorize': { tips: ['Say it out loud.', 'Learn it one phrase at a time.', 'Say it again at a set moment in your day, like a meal or a walk.', 'Writing it down can help.'], verse: { ref: { b: 'PSA', c: 119, v: 97 } }, line: 'The psalm writer kept God’s word in mind all day.' },
  'pm.turn': { tips: ['A breath before you pray can help.', 'The psalm’s words are enough.', 'Whatever kind of day it was, you can bring it as it is.'], verse: { ref: { b: 'PSA', c: 17, v: 6 } }, line: 'A prayer that asks God to listen.' },
  'pm.classic': { tips: ['Some words may be unfamiliar. Read on for the main thought.', 'Keep what helps you love God and people.', 'One sentence worth keeping is enough.'], verse: { ref: { b: 'PSA', c: 145, v: 4 } }, line: 'Each generation tells the next what God has done.' },
  'pm.notes': { tips: ['Look for one fact that changes how you see the passage.', 'Look for one thing to do.', 'Notes are people’s best understanding. The Bible is the source.'], verse: { ref: { b: 'NEH', c: 8, v: 8 } }, line: 'The people heard the Scriptures read, and others explained the meaning.' },
  'pm.dig': { tips: ['Start with the part of this morning’s reading you wondered about.', 'A commentary is one person’s view. Others may see it differently.', 'One new thing understood is enough.'], verse: { ref: { b: 'ACT', c: 8, v: 30, c2: 8, v2: 31 } }, line: 'A man reading the Bible asked for help to understand it.' },
  'pm.prayer': { tips: ['Use the words on the screen or your own.', 'A name and a sentence is a prayer.', 'For someone hard to love, one honest sentence is enough.'], verse: { ref: { b: 'LUK', c: 11, v: 1 } }, line: 'The Lord’s Prayer began with a request: teach us to pray.' },
  'pm.checkin': { tips: ['One thing is enough.', 'Be as honest as you would be with a friend who loves you.', 'Choose a step small enough to take tomorrow.'], verse: { ref: { b: 'PSA', c: 139, v: 23, c2: 139, v2: 24 } }, line: 'A prayer that asks God to look at your heart with you.' },
  'pm.meditate': { tips: ['Read the passage more than once.', 'Stay with one word or phrase.', 'Take one thought with you into tomorrow.'], verse: { ref: { b: 'PSA', c: 119, v: 15 } }, line: 'The psalm writer thinks on God’s words and on His ways.' },
};

// ---------- Go Deeper (claude/content/go-deeper.md, APPROVED Nov 18, 2026, 3298–3312): the Lord's Prayer part by part, and the five check-ins' areas. Words word for word from that doc. ----------
export const GODEEPER = {
  /** Under the Guide's "Go Deeper" head: when each one comes in a walk (1209). No line under the head (1200) */
  prayer: { name: 'The Lord’s Prayer', when: 'Every night, in Prayer', ways: 'Ways to Pray This Part', bible: 'In the Bible' },
  when: { burnt: 'Every night', grain: 'Saturdays', peace: 'The last day of each month', sin: 'The last day of each quarter', trespass: 'December 31' } as Record<CheckIn, string>,
  /** The Lord's Prayer: each part's anchor line (WEB; the King James line is PRAYER.anchorText.kjv, per TKC-035), aim, ways (name, line), move, and In the Bible (a line and a verse) */
  parts: [
    { name: 'Father', anchor: '“Our Father in heaven,”', ref: 'Matthew 6:9', aim: 'Come to God as His Child',
      ways: [['Our', 'Remember that you pray alongside people everywhere who call on Him.'], ['Father', 'Come to Him the way a child comes to a loving parent.'], ['In Heaven', 'Remember how great He is, and that He is listening.']] as Array<[string, string]>,
      move: 'Then tell Him one honest thing about how you are today.', line: 'Abba means father, in the language Jesus spoke. You can call God that too.', verse: { ref: { b: 'ROM', c: 8, v: 15 } } as GuideVerse },
    { name: 'Kingdom', anchor: '“…may your name be kept holy. Let your Kingdom come. Let your will be done on earth as it is in heaven.”', anchorKjv: '“Hallowed be thy name. Thy kingdom come. Thy will be done in earth, as it is in heaven.”', ref: 'Matthew 6:9–10', aim: 'Pray for God’s Kingdom',
      ways: [['His Name', 'Ask that people everywhere would know God and honor His name.'], ['His Kingdom', 'Ask that Jesus’ love and peace would reach every place and every heart.'], ['His Will', 'Ask that people would live God’s way, here as in heaven.']] as Array<[string, string]>,
      move: 'For each one, thank God where you see it already, and grieve where you don’t yet.', line: 'Jesus taught His friends this prayer. This part asks for God’s love and goodness to fill the earth.', verse: { ref: { b: 'MAT', c: 6, v: 9, c2: 6, v2: 10 }, from: 'Our Father', fromKjv: 'Our Father' } as GuideVerse },
    { name: 'People', anchor: '“Give us today our daily bread. Forgive us… deliver us…”', ref: 'Matthew 6:11–13', aim: 'Ask God for What We Need',
      ways: [['Provide', 'Ask God to give what is needed for today, like food, a home, and health.'], ['Forgive', 'Ask God to forgive, and to help you forgive others, even from a safe distance.'], ['Protect', 'Ask God to keep people safe from harm, from temptation, and from evil.']] as Array<[string, string]>,
      move: 'Pray each one for someone who comes to mind, and then for yourself.', line: 'Jesus taught His friends this prayer. This part asks God for what we need each day.', verse: { ref: { b: 'MAT', c: 6, v: 11, c2: 6, v2: 13 }, upTo: 'deliver us from the evil one.', upToKjv: 'deliver us from evil:' } as GuideVerse },
    { name: 'Trust', anchor: '“For yours is the Kingdom, the power, and the glory forever.”', ref: 'Matthew 6:13', aim: 'Trust God With What You Asked',
      ways: [['The Kingdom', 'Tell God that everything is His, so it is His to give.'], ['The Power', 'Tell God that nothing you asked is too hard for Him.'], ['The Glory', 'Tell God that whatever He answers, you know He is good.']] as Array<[string, string]>,
      move: 'For each one, think of what you just asked God for.', line: 'David prayed these words long ago. The Lord’s Prayer ends in much the same way.', verse: { ref: { b: '1CH', c: 29, v: 11 }, upTo: 'is yours.', upToKjv: 'is thine;' } as GuideVerse },
    { name: 'Amen', anchor: '“Amen.”', ref: 'Matthew 6:13', aim: 'Say Amen, and Leave It With God',
      ways: [['So Be It', 'Amen means “so be it.” Leave the answer to Him.'], ['He Hears', 'Tell God you trust that He heard you.'], ['Through Jesus', 'Remember that Jesus made the way for you to come to God.']] as Array<[string, string]>,
      move: undefined as string | undefined, line: 'God keeps His promises through Jesus. Amen is our yes to that.', verse: { ref: { b: '2CO', c: 1, v: 20 } } as GuideVerse },
  ],
  /** A check-in's lesson page (go-deeper.md §5; 3325–3330 y, Nov 19, 2026): the line under the title, the short body (when it comes, then the safe-steps note where it applies, then the pointer to all 12 areas) and In the Bible (a line and its verses). */
  entry: {
    burnt: { line: 'See what God gave you, and how you could use it to love Him and others.', when: 'every night', bible: 'In Israel, a burnt offering was burned whole on the altar, with nothing held back.', verses: [{ ref: { b: 'HOS', c: 6, v: 6 } }] as GuideVerse[] },
    grain: { line: 'Ask God where you could give some of what you have.', when: 'on Saturdays', bible: 'In Israel, God’s people brought Him fine flour with oil, the first and best of what they grew.', verses: [{ ref: { b: 'LEV', c: 2, v: 1 } }, { ref: { b: 'PRO', c: 3, v: 9 } }] as GuideVerse[] },
    peace: { line: 'Think about who you may need to make peace with.', when: 'on the last day of each month', note: 'Peace never means going back into harm, so take only the steps that are safe.', bible: 'In Israel, people brought gifts to God at the altar. Jesus said what to do first.', verses: [{ ref: { b: 'MAT', c: 5, v: 23, c2: 5, v2: 24 } }] as GuideVerse[] },
    sin: { line: 'Ask God to show you anything you need to turn from, and receive His mercy.', when: 'on the last day of March, June, September, and December', bible: 'In Israel, someone who sinned brought a sin offering to God and was forgiven. John, a friend of Jesus, wrote about forgiveness too.', verses: [{ ref: { b: '1JN', c: 1, v: 9 } }] as GuideVerse[] },
    trespass: { line: 'Think about anyone you may have wronged, and how you could make it right.', when: 'on December 31', bible: 'In Israel, someone who wronged a neighbor gave back what they took, and a fifth more. Zacchaeus did the same, and more.', verses: [{ ref: { b: 'LUK', c: 19, v: 8 } }] as GuideVerse[] },
  } as Record<CheckIn, { line: string; when: string; note?: string; bible: string; verses: GuideVerse[] }>,
  /** The body's two sentences around `when` */
  entryBody: { before: 'This check-in comes in your Evening Walk ', after: '.', more: (n: number) => `On a day with more time, you can go through all ${n} areas.` },
  /** The five check-ins' area cards: the plate's small line and the area's question; the move is the Check-In step's own (CHECKIN[x].move). The area's name and description come from sheets.json (its first section). */
  checkins: {
    burnt: { small: 'What God Gave You', question: 'Could I use this gift to love God and others?' },
    grain: { small: 'Where You Could Give', question: 'Should some of what you give go here?' },
    peace: { small: 'People in Your Life', question: 'Is there someone here I need to make peace with?' },
    sin: { small: 'Something to Turn From', question: 'Has this shown up in me lately?' },
    trespass: { small: 'Something to Make Right', question: 'Have I done this to someone?' },
  } as Record<CheckIn, { small: string; question: string }>,
  area: { of: (n: number, total: number) => `Area ${n} of ${total}`, prev: 'Previous area', next: 'Next area', center: 'One Last Question', begin: 'Begin', back: 'Back', nextBtn: 'Next', done: 'Done' },
};

/** Coming Up's per-row sheets (3341, 3342 y; Evening Walk 343 y). Keyed by the row's title. */
export const COMING_SHEETS: Record<string, string> = {
  'Evening Walk': 'The Evening Walk is how you end your day with God. You read, pray for others, and look inward. It comes first on Today from the time your evening starts, and you can change that time.',
  'Extra Proverbs': 'Proverbs has 31 chapters, one for each day of a long month. Short months have fewer days, so a few chapters would be left out. An extra chapter lets the month end on chapter 31. Read one when you have time. Skipping is fine.',
  'Giving': 'On Saturdays, your Evening Walk has a check-in called Giving. Ask God where you could give some of what you have. On a night with more time, you can go through all 12 areas. You see it a day ahead so you can make room.',
  'Relationships': 'On the last day of each month, your Evening Walk has a check-in called Relationships. Think about who you may need to make peace with. Peace never means going back into harm, so take only the steps that are safe. You see it a few days ahead so you can make room.',
  'Character': 'On the last day of March, June, September, and December, your Evening Walk has a check-in called Character. Ask God to show you anything you need to turn from, and receive His mercy. That night also has Relationships. Character opens first, and one is enough. You see it well ahead so you can make room.',
  'Fairness': 'On December 31, your Evening Walk has a check-in called Fairness. Think about anyone you may have wronged, and how you could make it right. That night also has Relationships and Character. Fairness opens first, and the others are there if you have time. You see it weeks ahead so you can make room.',
  'Bible Song': 'On the first and last day of each month, the Psalm step is a song from the Bible instead. The songs follow the Bible\u2019s story, from Moses at the Red Sea to the choirs of heaven. You see it a day ahead, with the song\u2019s passage.',
};

/** Progress and Open Days (Hi-Fi Studio 7, locked Oct 25, 1168). Every line is the page's own as built before 3-5t, moved here word for word, except the lines marked NEW:
 *  Builder's calls in 3-5t, flagged for approval (the Select pass, and the one-day wording the count rule 537 asks for: "Finish these 1 days" was wrong). */
export const PROGRESS = {
  title: 'Progress', back: 'Today', verseRef: 'Psalm 1:3',
  open: { one: '1 day still open', many: (n: number) => `${n} days still open`, grows: (n: number) => `Finish them and your streak grows to ${n}` },
  days: {
    title: 'Open Days', back: 'Progress', tap: 'Tap a day to finish its walks.', skipAll: 'Skip All', clearAll: 'Clear All',
    join: (n: number, j: number) => (n === 1 ? `Finish this day and your streak grows to ${j}.` : `Finish these ${n} days and your streak grows to ${j}.`),   // NEW: the one-day form
    select: 'Select', done: 'Done', pick: 'Tap the days you want.', picked: (n: number) => `${n} selected`,   // NEW: the Select pass (registry: "Tap the days you want." / "2 selected"; Done from 1166)
    skipN: (n: number) => `Skip ${n}`, clearN: (n: number) => `Clear ${n}`,   // NEW: the confirm's buttons for a few days (the SelectBar's own words)
    ask: { skip: (n: number) => `Skip ${n} Open ${n === 1 ? 'Day' : 'Days'}?`, clear: (n: number) => `Clear ${n} Open ${n === 1 ? 'Day' : 'Days'}?`, cancel: 'Cancel',
      skipLine: (n: number) => (n === 1 ? 'It’ll count as done, the same as skipping a walk. Your streak will include it.' : 'They’ll count as done, the same as skipping a walk. Your streak will include them.'),   // NEW: the one-day form
      clearLine: (n: number) => (n === 1 ? 'Start fresh. This day won’t be listed again. Nothing is marked done or skipped, so your streak stays the same.' : 'Start fresh. These days won’t be listed again. Nothing is marked done or skipped, so your streak stays the same.') },   // NEW: the one-day form
    toast: (n: number, kind: 'skip' | 'clear') => `${n} ${n === 1 ? 'day' : 'days'} ${kind === 'skip' ? 'skipped' : 'cleared'}`, undo: 'Undo',
    settled: { head: 'Nothing open.', line: 'Every day is accounted for.' },
  },
};
