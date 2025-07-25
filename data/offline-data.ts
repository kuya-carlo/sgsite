// data/offlineData.ts
import { EventRecord, SubeventRecord } from "@/types/data";

export const subevents: SubeventRecord[] = [
  {
    id: 1,
    event_id: "devkit",
    title: "DevKit 101: Git & GitHub",
    description:
      "A workshop about how to setup git and GitHub for Project Management and Development.",
    registration_url: null,
    subevent_index: 1,
    event_start: null,
    event_end: null,
  },
  {
    id: 2,
    event_id: "devkit",
    title: "DevKit 102: GitHub & Markdown",
    description:
      "A workshop about how to use GitHub for Integration and Testing and Markdown to showcase your projects.",
    registration_url: null,
    subevent_index: 2,
    event_start: null,
    event_end: null,
  },
  {
    id: 3,
    event_id: "devkit",
    title: "DevKit 103: HTML, CSS, Javascript",
    description:
      "A workshop about how to code efficiently using languages of the web.",
    registration_url: null,
    subevent_index: 3,
    event_start: null,
    event_end: null,
  },
  {
    id: 4,
    event_id: "innoverse",
    title: "Pitching Competition",
    description:
      "The pitching competition is where early-stage founders present their ideas to a panel of experts and investors, while networking continues to thrive.",
    registration_url: "https://forms.gle/duvx4CvkNyFrw4R16",
    subevent_index: 1,
    event_start: "2025-06-21 00:00:00+00",
    event_end: null,
  },
  {
    id: 5,
    event_id: "innoverse",
    title:
      "Panel Discussion: The Importance of Community in Building a Startup",
    description:
      "The panel discussion entitled “The Importance of Community in Building a Startup,” features guest speaker Mr. Ritch Traballo, CEO of Nexhire, who brings extensive insight on talent, ecosystem building, and startup growth. Simultaneously, a networking session will allow students, founders, investors, and professionals to engage in meaningful conversations. ",
    registration_url: "https://lu.ma/gv94156m",
    subevent_index: 2,
    event_start: null,
    event_end: null,
  },
  {
    id: 6,
    event_id: "innoverse",
    title: "Special Talk: Entrepreneurial Journey",
    description:
      "The talk of Ms. Kristina Ay-ay, an esteemed alumna, co-founder of ShopBack Philippines, and currently leading Business Development & Partnerships at GoGo Xpress (QuadX) will deliver an Entrepreneurial Journey Talk to inspire early founders and student entrepreneurs.",
    registration_url: "https://lu.ma/gv94156m",
    subevent_index: 3,
    event_start: null,
    event_end: null,
  },
];

export const events: EventRecord[] = [
  {
    id: "devkit",
    title: "DevKit 2025",
    subtitle:
      "The portal into the unknown, the torch towards the path to success.",
    description:
      "A workshop series aimed to teach the basics of Git, Github, Markdown, Web Development Languages(HTML, CSS, JS), Bash and Powershell Scripting and more...",
    subevents: [1, 2, 3],
    registration_url: "https://google.com",
    event_start: null,
    event_end: null,
  },
  {
    id: "innoverse",
    title: "Innoverse 2025",
    subtitle: "The Launchpad for Young Innovators",
    description:
      "NOVELINK captures the fusion of two powerful ideas: “Novel,” representing innovation and fresh thinking, and “Link,” symbolizing the bridge connecting students, investors, and founders. Designed as a launchpad for breakthrough ideas, NOVELINK is more than just a competition, it’s a collaborative platform where bold student-led and early-stage startup solutions are validated, mentored, and linked to real-world opportunities.",
    subevents: [4, 5, 6],
    registration_url: "https://lu.ma/gv94156m",
    event_start: "2025-06-21 01:00:00+00",
    event_end: "2025-06-21 07:00:00+00",
  },
];
