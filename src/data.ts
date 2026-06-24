import { DocumentType } from './types';

export const SUPPORTED_DOCUMENTS: DocumentType[] = [
  {
    id: 'report',
    name: 'Office Report',
    emoji: '📊',
    description: 'Create a formal report for your department, local government division, or committee activities.',
    price: 2000,
    fields: [
      {
        id: 'organization',
        label: 'Your Organization Name',
        placeholder: 'e.g. Mukono District Local Government',
        type: 'text'
      },
      {
        id: 'period',
        label: 'Period Covered',
        placeholder: 'e.g. Second Quarter FY 2025/2026',
        type: 'text'
      },
      {
        id: 'department',
        label: 'Your Department / Committee',
        placeholder: 'e.g. Health and Sanitation Department',
        type: 'text'
      },
      {
        id: 'preparedBy',
        label: 'Your Name and Job Title',
        placeholder: 'e.g. Dr. Sarah Namubiru (Senior Medical Officer)',
        type: 'text'
      },
      {
        id: 'activities',
        label: 'Key Activities & achievements (Main Points)',
        placeholder: 'e.g. Distributed 5,000 malaria nets, carried out polio immunization in Ggaba, and completed renovation of Kyetume Health Centre II.',
        type: 'textarea'
      }
    ]
  },
  {
    id: 'speech',
    name: 'Formal Speech',
    emoji: '🎤',
    description: 'Draft a dignified, respectful speech for school events, graduations, community gatherings, or church services.',
    price: 2000,
    fields: [
      {
        id: 'occasion',
        label: 'What is the Occasion / Event?',
        placeholder: 'e.g. Official Opening of the New Library at Jinja Senior Secondary School',
        type: 'text'
      },
      {
        id: 'speaker',
        label: 'Speaker Name and Title',
        placeholder: 'e.g. Hon. John Alimpa, Minister of State for Higher Education',
        type: 'text'
      },
      {
        id: 'audience',
        label: 'Who is listening? (Audience)',
        placeholder: 'e.g. Parents, Teachers, Students, and Local Leaders of Jinja District',
        type: 'text'
      },
      {
        id: 'theme',
        label: 'Key Message or Main Theme',
        placeholder: 'e.g. How reading and computer literacy empower the youth for Uganda\'s future prosperity.',
        type: 'textarea'
      }
    ]
  },
  {
    id: 'letter',
    name: 'Formal Letter',
    emoji: '✉️',
    description: 'Write a formal letter to a government ministry, district head, business partner, or parent.',
    price: 2000,
    fields: [
      {
        id: 'sender',
        label: 'Your Name and Title',
        placeholder: 'e.g. Mr. Charles Ssekajugo (Headteacher)',
        type: 'text'
      },
      {
        id: 'organization',
        label: 'Your Organization / Address',
        placeholder: 'e.g. Kabale Primary School, P.O. Box 45, Kabale',
        type: 'text'
      },
      {
        id: 'recipient',
        label: 'Who are you writing to? (Recipient)',
        placeholder: 'e.g. The Chief Administrative Officer, Kabale District Local Government',
        type: 'text'
      },
      {
        id: 'subject',
        label: 'Subject of the Letter',
        placeholder: 'e.g. Request for emergency funding to repair storm-damaged classroom blocks',
        type: 'text'
      },
      {
        id: 'points',
        label: 'What do you want to tell them? (Main Points)',
        placeholder: 'e.g. Heavy rain and wind blew off the roofs of P.4 and P.5 classrooms last Tuesday. Over 120 pupils are studying under mango trees. We kindly request 50 iron sheets and timber.',
        type: 'textarea'
      }
    ]
  },
  {
    id: 'minutes',
    name: 'Meeting Minutes',
    emoji: '📝',
    description: 'Document discussion and resolutions of office, board, school, or community committee meetings.',
    price: 2000,
    fields: [
      {
        id: 'meetingType',
        label: 'Meeting Name / Type',
        placeholder: 'e.g. Gulu Town Council Planning Committee Meeting',
        type: 'text'
      },
      {
        id: 'venue',
        label: 'Date, Time, and Venue',
        placeholder: 'e.g. 15th January 2026 at 10:00 AM at Gulu Municipal Boardroom',
        type: 'text'
      },
      {
        id: 'chairperson',
        label: 'Name of the Chairperson',
        placeholder: 'e.g. Mrs. Beatrice Aber (Committee Chair)',
        type: 'text'
      },
      {
        id: 'secretary',
        label: 'Name of the Secretary',
        placeholder: 'e.g. Mr. Patrick Okello (Town Clerk)',
        type: 'text'
      },
      {
        id: 'agenda',
        label: 'Agenda Items & Resolutions (Main Points)',
        placeholder: 'e.g. 1. Opening prayer. 2. Budget approved for Gulu-Kitgum road water drainage extension. 3. New garbage truck schedule agreed for Gulu central market. 4. Next meeting set for 12th February.',
        type: 'textarea'
      }
    ]
  },
  {
    id: 'proposal',
    name: 'Project Proposal',
    emoji: '📈',
    description: 'Draft a compelling project proposal to present to donors, NGOs, ministries, or community leaders.',
    price: 2000,
    fields: [
      {
        id: 'projectName',
        label: 'Project Name',
        placeholder: 'e.g. Safe Water Borehole Project',
        type: 'text'
      },
      {
        id: 'organization',
        label: 'Your Organization Name',
        placeholder: 'e.g. Masaka Rural Development Association (MRDA)',
        type: 'text'
      },
      {
        id: 'budget',
        label: 'Estimated Budget (UGX)',
        placeholder: 'e.g. 15,000,000',
        type: 'number'
      },
      {
        id: 'duration',
        label: 'Project Duration',
        placeholder: 'e.g. 6 Months (August 2026 - January 2027)',
        type: 'text'
      },
      {
        id: 'whyNeeded',
        label: 'Why is this project needed? (Problem Statement)',
        placeholder: 'e.g. Currently, 300 families in Kyabakuza Village rely on a dirty swamp water source 5km away, which has caused high cases of cholera and typhoid among children.',
        type: 'textarea'
      }
    ]
  },
  {
    id: 'minutes_church',
    name: 'Church Minutes',
    emoji: '⛪',
    description: 'Record decisions, prayer requests, and event plans for church fellowships, parishes, or ministries.',
    price: 2000,
    fields: [
      {
        id: 'churchName',
        label: 'Church / Fellowship Name',
        placeholder: 'e.g. St. Paul\'s Cathedral Namirembe (Mothers\' Union)',
        type: 'text'
      },
      {
        id: 'venue',
        label: 'Date and Venue',
        placeholder: 'e.g. Sunday, 22nd February 2026 at Cathedral Community Hall',
        type: 'text'
      },
      {
        id: 'leader',
        label: 'Leader / Chairperson Name',
        placeholder: 'e.g. Canon Grace Nabatanzi (Fellowship Coordinator)',
        type: 'text'
      },
      {
        id: 'matters',
        label: 'Matters Discussed & Prayer Points',
        placeholder: 'e.g. 1. Devotional prayer for sick members. 2. Arranged charity visit to Mulago Children\'s Ward on Easter Monday. 3. Raised UGX 1,500,000 for purchasing fellowship choir uniforms.',
        type: 'textarea'
      }
    ]
  },
  {
    id: 'invitation',
    name: 'Invitation Letter',
    emoji: '📩',
    description: 'Write invitation letters for weddings, school functions, community launches, or official ceremonies.',
    price: 2000,
    fields: [
      {
        id: 'eventName',
        label: 'Event Name',
        placeholder: 'e.g. Golden Jubilee Celebrations of Kabale Secondary School',
        type: 'text'
      },
      {
        id: 'dateTimeVenue',
        label: 'Date, Time, and Venue',
        placeholder: 'e.g. Saturday, 18th July 2026 at 9:00 AM in the School Main Gardens',
        type: 'text'
      },
      {
        id: 'invitedBy',
        label: 'Who is inviting? (Hosts)',
        placeholder: 'e.g. The Board of Governors and Management of Kabale Secondary School',
        type: 'text'
      },
      {
        id: 'guest',
        label: 'Name or Group of the Guest(s)',
        placeholder: 'e.g. Old Boys and Girls of Class of 1990-1996',
        type: 'text'
      }
    ]
  },
  {
    id: 'certificate',
    name: 'Official Certificate',
    emoji: '📜',
    description: 'Generate high-fidelity certificates of attendance, achievement, service, or appreciation.',
    price: 3000,
    fields: [
      {
        id: 'recipient',
        label: 'Recipient\'s Full Name',
        placeholder: 'e.g. Ms. Harriet Nakimera',
        type: 'text'
      },
      {
        id: 'awardTitle',
        label: 'Certificate / Award Title',
        placeholder: 'e.g. Certificate of Distinguished Service',
        type: 'text'
      },
      {
        id: 'reason',
        label: 'Reason for the Award',
        placeholder: 'e.g. Outstanding commitment and 20 years of exceptional teaching service',
        type: 'text'
      },
      {
        id: 'organization',
        label: 'Issuing Organization',
        placeholder: 'e.g. Gayaza High School Board of Governors',
        type: 'text'
      },
      {
        id: 'signedBy',
        label: 'Who is signing? (Names and Titles)',
        placeholder: 'e.g. Dr. Evelyn Kigozi (Board Chair) and Mrs. Robinah Sseninde (Headmistress)',
        type: 'text'
      }
    ]
  },
  {
    id: 'notice',
    name: 'Official Memo / Notice',
    emoji: '📢',
    description: 'Post an official notification, memo, or announcement for staff, students, tenants, or congregation members.',
    price: 2000,
    fields: [
      {
        id: 'to',
        label: 'Who is it for? (To)',
        placeholder: 'e.g. All Teaching and Non-Teaching Staff',
        type: 'text'
      },
      {
        id: 'from',
        label: 'Who is it from? (From)',
        placeholder: 'e.g. Office of the Principal, National Teachers College, Kabale',
        type: 'text'
      },
      {
        id: 'subject',
        label: 'Subject of Notice',
        placeholder: 'e.g. Compulsory End-of-Term Planning Session and General Meeting',
        type: 'text'
      },
      {
        id: 'details',
        label: 'Notice Details / Main Message',
        placeholder: 'e.g. The end-of-term meeting will take place on Friday, 11th July 2026 at 9:00 AM in the Staff Room. We will review exams grading, adjust the upcoming term syllabus, and discuss general welfare. Attendance is mandatory.',
        type: 'textarea'
      }
    ]
  },
  {
    id: 'cv',
    name: 'Simple CV / Resume',
    emoji: '💼',
    description: 'Produce a standard, clean Ugandan-style CV highlighting work experience and skills.',
    price: 2000,
    fields: [
      {
        id: 'fullName',
        label: 'Your Full Name',
        placeholder: 'e.g. Moses Opio',
        type: 'text'
      },
      {
        id: 'contact',
        label: 'Phone Number and Email',
        placeholder: 'e.g. 0772 123456 / moses.opio@gmail.com',
        type: 'text'
      },
      {
        id: 'jobTitle',
        label: 'Current / Desired Job Title',
        placeholder: 'e.g. Senior Agricultural Extension Officer',
        type: 'text'
      },
      {
        id: 'experience',
        label: 'Brief Work Experience Summary',
        placeholder: 'e.g. Worked at Gulu District Local Government (2015-2024). Supervised farmer training groups, managed distribution of seed inputs, and compiled monthly crop yield reports.',
        type: 'textarea'
      },
      {
        id: 'skills',
        label: 'Key Professional Skills',
        placeholder: 'e.g. Farm management, soil analysis, community mobilization, report writing, Acholi/English translation.',
        type: 'textarea'
      }
    ]
  }
];
