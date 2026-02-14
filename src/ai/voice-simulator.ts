import type { VoiceScript } from '@/domain/types'

export const voiceScripts: Record<string, VoiceScript> = {
  'shipper-status': {
    id: 'shipper-status',
    title: 'Where is my truck?',
    caller: 'Southeast Distributors',
    topic: 'Status inquiry',
    durationSeconds: 34,
    outcome: 'Resolved with updated ETA and confirmation text sent',
    frames: [
      {
        atSecond: 0,
        speaker: 'system',
        text: 'Incoming shipper call connected',
      },
      {
        atSecond: 3,
        speaker: 'caller',
        text: 'Can you tell me where truck for load 4521 is right now?',
      },
      {
        atSecond: 6,
        speaker: 'system',
        text: 'Searching by load reference and validating latest GPS ping',
      },
      {
        atSecond: 10,
        speaker: 'agent',
        text: 'Load 4521 is in transit near Birmingham, ETA 4:32 PM local.',
      },
      {
        atSecond: 15,
        speaker: 'caller',
        text: 'Will it still make our appointment window?',
      },
      {
        atSecond: 18,
        speaker: 'system',
        text: 'Checking detention risk and traffic-adjusted route',
      },
      {
        atSecond: 22,
        speaker: 'agent',
        text: 'Yes, projected arrival is 28 minutes before your cutoff window.',
      },
      {
        atSecond: 29,
        speaker: 'agent',
        text: 'I have sent a status confirmation to your email on file.',
      },
      {
        atSecond: 34,
        speaker: 'system',
        text: 'Call completed and summary logged on load timeline',
      },
    ],
  },
  'new-tender': {
    id: 'new-tender',
    title: 'Inbound tender capture',
    caller: 'Peachtree Foods',
    topic: 'New load tender',
    durationSeconds: 38,
    outcome: 'Tender details captured and pending dispatch card created',
    frames: [
      { atSecond: 0, speaker: 'system', text: 'Inbound tender call connected' },
      {
        atSecond: 5,
        speaker: 'caller',
        text: 'Need a reefer from Atlanta to Nashville tomorrow at 8 AM.',
      },
      {
        atSecond: 8,
        speaker: 'system',
        text: 'Capturing lane details and checking capacity window',
      },
      {
        atSecond: 13,
        speaker: 'agent',
        text: 'We can cover that. I am creating your tender and confirming details now.',
      },
      {
        atSecond: 22,
        speaker: 'caller',
        text: 'Rate target is $2,900 all in.',
      },
      {
        atSecond: 27,
        speaker: 'agent',
        text: 'Recorded. We will send a formal confirmation shortly.',
      },
      { atSecond: 34, speaker: 'system', text: 'Pending load record created' },
      {
        atSecond: 38,
        speaker: 'system',
        text: 'Call completed and shipper notified by email',
      },
    ],
  },
}

export const defaultVoiceScriptId = 'shipper-status'
