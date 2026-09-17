export const PHOTO_SLOTS = [
  { key: 'gift', label: 'Inside the gift (only after she opens it)', section: 'Gift' },
]

export const defaultContent = {
  herName: 'Maryam',
  nickname: '',
  fromName: '',
  birthdayDate: '',
  pin: '2036',
  muteByDefault: false,
  showSkip: true,
  companionOn: false,
  relatives: 'everyone at home',
  listenLabel: 'Turn it',
  replayLabel: 'Listen again',
  giftPrompt: "There's a picture from the future. A gift. Guess who is in it.",
  giftOpenLabel: 'old message',
  lockBeats: ['TRANSMISSION RECEIVED', 'SOURCE: UNKNOWN', 'YEAR', '2036'],
  turnLine: 'But before any of that happens...',
  todayLabel: 'TODAY',
  birthdayDateLine: 'Today is 17 September 2026',
  happyLine: 'HAPPY BIRTHDAY',
  nightLines: [
    'So...',
    'Go enjoy today.',
    'Make some more memories.',
    'Laugh a lot.',
    'Take too many photos.',
    'Eat something ridiculously good.',
    "I'll see you in ten years.",
    'Hopefully the Wi-Fi is still working.',
  ],
  blocks: [
    { id: 'b1', lines: ['hi'] },
    { id: 'b2', lines: ["it's you"] },
    { id: 'b3', lines: ['10 years from now'] },
    {
      id: 'b4',
      lines: [
        'I know this sounds impossible.',
        "Honestly, I'm still not sure how I sent this.",
        'But apparently... future me has Wi-Fi.',
      ],
    },
    {
      id: 'b5',
      lines: [
        'You worried so much about the future.',
        'Turns out... you were going to be fine.',
        'Better than fine, actually.',
      ],
    },
    {
      id: 'b6',
      lines: [
        'The thing you kept talking about.',
        'It took longer than you thought.',
        'You almost gave up twice.',
      ],
    },
    { id: 'b7', lines: ['But you did it.'] },
    { id: 'b8', lines: ["That place you said you'd visit someday with all of them?"] },
    { id: 'b9', lines: ['You finally went.'] },
    { id: 'b10', lines: ['And the support you always wanted to provide for everyone around you?'] },
    { id: 'b11', lines: ['You did that too.'] },
    {
      id: 'b12',
      lines: [
        'The life we dreamed about… ammu, fatima, sifat, Ujjol vhai, Ashru apu and ammuji abbuji.',
      ],
    },
    {
      id: 'b13',
      lines: [
        'Oh, and trading?',
        'You know you are very successful now.',
        'You found something awesome.',
        "And you should see Shifat's jealous face.",
      ],
    },
    { id: 'b14', lines: ['But honestly…'] },
    {
      id: 'b15',
      lines: [
        'ammu, fatima, sifat, Ujjol vhai, Ashru apu and ammuji abbuji… all of them are so proud of you.',
      ],
    },
    {
      id: 'b16',
      lines: [
        'Some people stayed.',
        'Some people appeared out of nowhere.',
        'Some became really important.',
        'And somehow, you still have that one friend who sends 17 messages instead of one.',
      ],
    },
    {
      id: 'b17',
      lines: [
        "You still stare at the other's ice cream with temptation.",
        'shifat still picks his nose and puts it in your mouth.',
        "You still laugh at things that aren't even funny.",
      ],
    },
    { id: 'b18', lines: ['Some things never change.'] },
    {
      id: 'b19',
      lines: [
        "You don't need to have everything figured out.",
        "You don't need to become someone else.",
        'Keep the things that make you happy.',
        'Keep the people who make you laugh.',
        'And please...',
      ],
    },
    { id: 'b20', lines: ["Don't stop being you."] },
    {
      id: 'b21',
      lines: ['Okay, enough emotional stuff.', 'I have one important update.'],
    },
    { id: 'b22', lines: ["You're still really cute."] },
  ],
}

export function interpolate(template, content) {
  if (!template) return ''
  const nick = (content.nickname || '').trim()
  const from = (content.fromName || '').trim()
  const vars = {
    herName: nick || content.herName || 'Maryam',
    nickname: nick,
    fromName: from,
    relatives: (content.relatives || 'everyone at home').trim(),
    fromSign: from ? `\n— ${from}` : '',
  }
  return String(template).replace(/\{\{(\w+)\}\}/g, (_, key) =>
    vars[key] != null ? vars[key] : '',
  )
}

export function formatPresentDate(content, now = new Date()) {
  const raw = (content.birthdayDate || '').trim()
  const date = raw ? new Date(`${raw}T12:00:00`) : now
  if (Number.isNaN(date.getTime())) {
    return now.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}
