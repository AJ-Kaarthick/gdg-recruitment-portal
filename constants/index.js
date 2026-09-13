// Current Date
import {
  ManageAccounts,
  Trophy,
  Campaign,
  ConnectWithoutContact,
  DesignServices,
  Palette,
  Language,
  Mobile2,
  SportsEsports,
  Analytics,
  Hub,
  Link,
  Cloud,
} from "@material-symbols-svg/react/outlined";
import { getDepartmentDisplayName } from "../lib/departments.js";

export const curDay = new Date().getDay();
export const curYear = new Date().getFullYear();
export const curDate = new Date().getDate();
export const curMonth = new Date().getMonth();
export const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

// Contact Links
export const LINKS = {
  instagram: "#",
  discord: "#",
  gmail: "#",
  linkedin: "#",
  x: "#",
};

// Department Details
export const reviews = [
  {
      id: "c21ca066-ab4d-40a3-943c-f170d6312bdc",
      icon: ManageAccounts,
      tone: "#8ab4f8",
      name: "§_Mn9X7_qz",
      description: "bp05Lb(bTI, CZWSr₹#^Z *7J ^T( f391xQ 1kp #q₹X 3z!Kux 6j(IkL.",
    },
    {
      id: "4499a966-2740-4c36-88dd-8916a909fc77",
      icon: Campaign,
      tone: "#FF7A6B",
      name: "¥_Pb!8Q_wk",
      description: "oif 37ByD JahIXh — 79UzG, 31M^I & 7aF^1pkf0.",
    },
    {
      id: "3936d5a2-acd9-4a98-ac97-42c2c92f5c02",
      icon: ConnectWithoutContact,
      tone: "#FFD45E",
      name: "∆_Ot₹3W_vx",
      description: "qi8qMnWmzP5h, 1kL1d3er & nUKpZg %AU0₹g!ir3C.",
    },
    {
      id: "e2ed9c2c-c36c-457f-a8bb-cf2e8bc7c2e1",
      icon: DesignServices,
      tone: "#FF7A6B",
      name: "ø_UxK2_mj",
      description: "2dIf2%n5, ##*qF83I₹k & 6kz71p8pcA K7₹#87 ekeG.",
    },
    {
      id: "d3beefc1-f8b0-4202-b26c-36e9804b6636",
      icon: Palette,
      tone: "#FFD45E",
      name: "π_Ds9J8_tr",
      description: "^48qNZaJ, 0i0j!n2 & x3% c$q*Bh $1J$^Ycn Qq AV( Z4lvA3p0co*(.",
    },
    {
      id: "8143de1d-db17-42fa-958d-13b10804f894",
      icon: Language,
      tone: "#8AB4F8",
      name: "µ_Wb₹5D_lp",
      description: "!r9wz1 899%₹Gk3a, ZUVx-8vQUG %8m8 & VNz a!Lu CG5.",
    },
    {
      id: "339f0f8a-72f2-44b9-92ab-2b0d4dcfa0f6",
      icon: Mobile2,
      tone: "#6EE7A0",
      name: "∑_ApZ3V_gh",
      description: "V1₹(oj( & Ne4my-p@3gozJ0 ZHM* UBJk EW9Hp1 & p₹f(jev.",
    },
    {
      id: "9055864f-c7dc-44cd-91d5-8759d32a496a",
      icon: SportsEsports,
      tone: "#FF7A6B",
      name: "Ω_GmF6X_ny",
      description: "A%XSkat2 1VZor bQz1 iI#Q%, *9nvy & %1V 81P.",
    },
    {
      id: "c0f3b1d1-ce05-45f6-9e34-ac9443fc5fcb",
      icon: Analytics,
      tone: "#8AB4F8",
      name: "≈_DtB1S_zk",
      description: "@m, N$hnqk9hk & g7#TkO 8MYYq x₹ %gx1j UPqD.",
    },
    {
      id: "a1d920df-9eb9-49eb-b3a4-e4a3d1245ede",
      icon: Cloud,
      tone: "#FFD45E",
      name: "∂_CdH4D_bv",
      description: "Uu1rp Kyxlwv9Hf%WxFb, (pkJBJ*9!qS!rWs1, (t/q3 J$W38C3x1 & eR$8(%YXCt.",
    },
    {
      id: "6a89c4e2-7b19-4f32-821e-9821a41b5201",
      icon: Hub,
      tone: "#FF7A6B",
      name: "∫_BkY2C_xu",
      description: "B3V!qkq@Ss8Se 7k70P9e, 80sDS rFM%M1kbR & K7P7 lBFE₹0vF#J1₹.",
    },
    {
      id: "3e9ac635-01d4-495e-aa87-a7335a2403c2",
      icon: Trophy,
      tone: "#6EE7A0",
      name: "≤_CpM8P_rw",
      description: "#0Q, DmNOdq8S & bMTq%0hj T9Ep j6V3% z@8LFCwq7!.",
    },
];

// Questionnaire Data
export const QuestionnaireData = [
  {
    department: "§_Mn9X7_qz",
    questions: [
      {
        id: "f2adee3e-23c9-4186-b0d8-bbf27b00450b",
        name: "Describe a situation where you had to coordinate multiple people or tasks under a deadline.",
        type: "long-text",
        placeholder: "Describe the context, your approach to coordination, and the eventual outcome...",
      },
      {
        id: "aadaa6ee-f50a-4ac1-9be4-a754cb7f64cb",
        name: "How would you handle a disagreement between two team members during an important event?",
        type: "long-text",
        placeholder: "Explain your conflict resolution strategy and how you ensure the event remains on track...",
      },
      {
        id: "751aa7ef-a6f9-4fe9-a94e-5de55b1c53f5",
        name: "What would you prioritize when planning a major club event with limited time and resources?",
        type: "long-text",
        placeholder: "Outline your prioritization criteria and resource allocation steps...",
      },
      {
        id: "4fa7b7f9-e263-4a6d-a6a8-a91b03d0d9c4",
        name: "How do you keep track of responsibilities when managing several tasks simultaneously?",
        type: "long-text",
        placeholder: "Share the methods, tools, or habits you use to stay organized and meet deadlines...",
      },
      {
        id: "168fa593-817e-4708-9717-7a670cca5993",
        name: "What do you think makes a student organization run effectively?",
        type: "long-text",
        placeholder: "Share your perspective on team culture, communication, and leadership...",
      },
      {
        id: "c7bcbf23-ae18-4dab-8805-c7fc7e8a46aa",
        name: "Have you previously coordinated or led any student teams, clubs, or events? If so, briefly share your role.",
        type: "long-text",
        placeholder: "Optional: Share any past leadership, event organizing, or team coordination experience...",
        optional: true,
      },
      {
        id: "32a9714a-a8cd-4f08-928a-397c2b29bb68",
        name: "Which tools or methods have you used to manage schedules, tasks, or team communication (e.g. Notion, Trello, Sheets)?",
        type: "long-text",
        placeholder: "Optional: List any project management or collaboration tools you have worked with...",
        optional: true,
      },
    ],
  },
  {
    department: "¥_Pb!8Q_wk",
    questions: [
      {
        id: "02690c81-c047-404a-879d-8470f6e46342",
        name: "How would you plan a social-media campaign to increase participation in a club event?",
        type: "long-text",
        placeholder: "Describe the campaign phases, content schedule, and target channels...",
      },
      {
        id: "0c2b53cc-31b1-48aa-95ee-8d339d51258c",
        name: "What makes a promotional post effective for college students?",
        type: "long-text",
        placeholder: "Explain visual hooks, copywriting style, and timing considerations...",
      },
      {
        id: "3652e441-676d-43fb-8ce6-3b59facdc4c8",
        name: "How would you turn an ordinary club event into an engaging online campaign?",
        type: "long-text",
        placeholder: "Share creative storytelling, interactive elements, or teaser ideas...",
      },
      {
        id: "59a1f73b-4c58-4e89-9a2c-9051fb86e342",
        name: "What metrics would you use to judge whether a publicity campaign succeeded?",
        type: "long-text",
        placeholder: "Discuss reach, engagement rate, click-throughs, and actual event turnout...",
      },
      {
        id: "72e3d981-9b16-43a7-84bc-3d61ea908b51",
        name: "How would you handle promoting an event when engagement is unexpectedly low?",
        type: "long-text",
        placeholder: "Describe your pivot strategy, outreach changes, and re-engagement tactics...",
      },
      {
        id: "730d4c1d-98ea-4c32-bbbf-a84286902054",
        name: "Have you previously managed social media accounts, created promotional content, or run digital campaigns? Share any links or highlights.",
        type: "long-text",
        placeholder: "Optional: Share links to accounts, campaigns, or content you have managed or created...",
        optional: true,
      },
      {
        id: "7515a558-5b11-4cf3-9d97-90392db0d7fc",
        name: "Which content creation or analytics tools are you familiar with (e.g., Canva, Premiere Pro, Meta Business Suite, YouTube Analytics)?",
        type: "long-text",
        placeholder: "Optional: Mention tools or platforms you have used for publicity and content creation...",
        optional: true,
      },
    ],
  },
  {
    department: "∆_Ot₹3W_vx",
    questions: [
      {
        id: "6b41b340-1eef-4cd2-a763-c2f0f41b4e01",
        name: "How would you approach a potential external partner or sponsor for a college event?",
        type: "long-text",
        placeholder: "Describe how you research partners, establish value propositions, and initiate contact...",
      },
      {
        id: "6f964b23-dac9-4392-a0ee-c492a590632b",
        name: "How would you build and maintain a relationship with an external organization?",
        type: "long-text",
        placeholder: "Discuss communication cadence, deliverable tracking, and long-term engagement...",
      },
      {
        id: "7f39368a-5b12-4abd-9400-c4bbd85fe740",
        name: "What would you include in an initial outreach message?",
        type: "long-text",
        placeholder: "Outline key components of an engaging, professional cold message or email...",
      },
      {
        id: "05d0a68e-57e3-4bd6-8b89-d0f6133c2508",
        name: "How would you respond if a potential collaborator rejected your proposal?",
        type: "long-text",
        placeholder: "Explain your follow-up approach, feedback collection, and relationship preservation...",
      },
      {
        id: "b002631a-338a-4893-9671-5d038d730fa9",
        name: "Suggest one way our organization could expand its campus or community reach.",
        type: "long-text",
        placeholder: "Propose an initiative, collaboration, or outreach format you believe would work well...",
      },
      {
        id: "d6302f7a-49ce-4fb5-a2c2-b828675098ae",
        name: "Have you had prior experience reaching out to sponsors, guest speakers, student communities, or external organizations?",
        type: "long-text",
        placeholder: "Optional: Describe any prior sponsorship, partnership, or community outreach efforts...",
        optional: true,
      },
      {
        id: "b8c385ee-8e96-46b6-8e74-0c19fd377206",
        name: "Share an example of a proposal, cold email, or collaborative pitch you drafted or contributed to, if applicable.",
        type: "long-text",
        placeholder: "Optional: Briefly describe a pitch or outreach communication you worked on...",
        optional: true,
      },
    ],
  },
  {
    department: "ø_UxK2_mj",
    questions: [
      {
        id: "b6ce00dc-18fb-4ac6-86c0-f41df9c463b4",
        name: "Explain how you would improve the usability of an unfamiliar website.",
        type: "long-text",
        placeholder: "Describe your evaluation process, heuristics used, and user feedback gathering...",
      },
      {
        id: "f39f5ab6-bdeb-4e43-99a2-d1ab56cd5f16",
        name: "What factors do you consider when designing an accessible interface?",
        type: "long-text",
        placeholder: "Discuss contrast, keyboard navigation, screen readers, semantic structure, and WCAG standards...",
      },
      {
        id: "c6ef919b-be41-441a-8691-4b6aa360065a",
        name: "Describe a UI you consider particularly well designed and explain why.",
        type: "long-text",
        placeholder: "Identify the product, key interaction flows, and what makes it exceptional...",
      },
      {
        id: "56305c1c-ce3d-4108-aaaa-3d51af86f91c",
        name: "How would you decide between two competing interface designs?",
        type: "long-text",
        placeholder: "Explain your evaluation criteria, A/B testing, user testing, or design reviews...",
      },
      {
        id: "5e2584b8-f80b-4735-adf2-25cd8db8302c",
        name: "What is the difference between a visually attractive interface and a genuinely usable interface?",
        type: "long-text",
        placeholder: "Elaborate on how aesthetics and functional ergonomics balance in real product experiences...",
      },
      {
        id: "fec80f0d-44ef-45a7-a686-12e9bc56443c",
        name: "Have you designed user interfaces, wireframes, or design systems before? Feel free to link your Figma profile, Behance, or portfolio.",
        type: "long-text",
        placeholder: "Optional: Link your Figma, portfolio, or past interface design work...",
        optional: true,
      },
      {
        id: "8a0f0a85-aaab-4238-b4ec-a72ed05c38f1",
        name: "Which UX research or prototyping methodologies and tools (e.g., Figma, FigJam, user testing) have you practiced?",
        type: "long-text",
        placeholder: "Optional: Describe design tools and UX methods you have hands-on exposure to...",
        optional: true,
      },
    ],
  },
  {
    department: "π_Ds9J8_tr",
    questions: [
      {
        id: "c32622f5-8ae3-40d1-8484-f98739e3e30d",
        name: "How would you develop a visual identity for a new club event?",
        type: "long-text",
        placeholder: "Discuss moodboards, color schemes, typography choices, and theme alignment...",
      },
      {
        id: "df9b550c-c70a-4773-8fc2-7cda42ecaabf",
        name: "What principles do you follow when creating a poster or social-media graphic?",
        type: "long-text",
        placeholder: "Explain hierarchy, whitespace, balance, typography, and contrast...",
      },
      {
        id: "10737d7d-baaa-4acb-b31a-e175f9b3badc",
        name: "How would you maintain visual consistency across multiple promotional assets?",
        type: "long-text",
        placeholder: "Describe brand guidelines, design systems, templates, and asset libraries...",
      },
      {
        id: "a3dd5a14-3ed7-4604-adde-349a255c6651",
        name: "Describe your design workflow from brief to final asset.",
        type: "long-text",
        placeholder: "Walk through ideation, sketching, drafting, revisions, and exporting...",
      },
      {
        id: "880aaec5-252d-46e1-adce-054882579236",
        name: "How would you respond to feedback that conflicts with your original design direction?",
        type: "long-text",
        placeholder: "Explain how you evaluate critiques, iterate constructively, and reach consensus...",
      },
      {
        id: "2da148f2-7c4b-44c8-a4b5-dee8203bc8a0",
        name: "Do you have a graphic design portfolio, Behance, Dribbble, or drive folder showcasing your artwork, posters, or branding work?",
        type: "long-text",
        placeholder: "Optional: Link your design portfolio, Behance, Dribbble, or drive folder...",
        optional: true,
      },
      {
        id: "79463ae1-a125-412b-9b54-2e4ea6fa7af6",
        name: "Which graphic design software suites (e.g., Photoshop, Illustrator, Blender, Canva) are part of your regular creative toolkit?",
        type: "long-text",
        placeholder: "Optional: List software and tools you use for illustration and graphic design...",
        optional: true,
      },
    ],
  },
  {
    department: "µ_Wb₹5D_lp",
    questions: [
      {
        id: "80da3cc5-1aff-4522-b003-b8ac45b2699d",
        name: "Explain how you would structure a responsive website for a student organization.",
        type: "long-text",
        placeholder: "Describe layout architecture, breakpoint strategies, and component design...",
      },
      {
        id: "b298fef1-1a56-41f4-bf0e-d6c81d3fd429",
        name: "What steps would you take to improve a slow-loading web page?",
        type: "long-text",
        placeholder: "Discuss asset optimization, caching, code splitting, lazy loading, and bundle size reduction...",
      },
      {
        id: "395370b1-a71c-4b1f-a521-55f91d303565",
        name: "How would you decide what belongs on the client versus the server?",
        type: "long-text",
        placeholder: "Explain performance, security, data privacy, and rendering implications (SSR vs CSR)...",
      },
      {
        id: "ac8a75c7-7047-4fec-b412-37b06beb9717",
        name: "Describe one web technology you have used and what you built with it.",
        type: "long-text",
        placeholder: "Highlight the stack, key challenges encountered, and how you overcame them...",
      },
      {
        id: "4a288a49-6889-41d8-97d7-8a2fa1dfc116",
        name: "How would you debug a page that works locally but fails in production?",
        type: "long-text",
        placeholder: "Outline your debugging sequence: environment variables, build artifacts, network logs, and server logs...",
      },
      {
        id: "691b9a28-2c3e-4e3e-bed7-3dd44f51a230",
        name: "Have you built or contributed to any live web applications or personal websites? Share links to your GitHub, deployed sites, or repositories.",
        type: "long-text",
        placeholder: "Optional: Link your GitHub profile, deployed projects, or code repositories...",
        optional: true,
      },
      {
        id: "4f6c6940-cebc-48da-958b-d080cd87acb0",
        name: "Which frontend and backend frameworks, libraries, or databases have you worked with (e.g., React, Next.js, Node.js, Tailwind, PostgreSQL)?",
        type: "long-text",
        placeholder: "Optional: List web technologies and frameworks you have hands-on experience with...",
        optional: true,
      },
    ],
  },
  {
    department: "∑_ApZ3V_gh",
    questions: [
      {
        id: "dd7ff6c8-39cd-4f13-9c26-15a496ba8e35",
        name: "How would you design an app feature that must work reliably with intermittent internet connectivity?",
        type: "long-text",
        placeholder: "Discuss local storage/caching, optimistic UI updates, background synchronization, and conflict resolution...",
      },
      {
        id: "2b28c1ac-bb79-4738-9dc0-f899c3e20d68",
        name: "What considerations matter when designing a mobile user experience?",
        type: "long-text",
        placeholder: "Discuss touch targets, navigation patterns, platform ergonomics, battery efficiency, and screen diversity...",
      },
      {
        id: "2b16de54-fa07-4f7f-8ff7-ac38130872a2",
        name: "Describe an app you have built or would like to build and the technical decisions involved.",
        type: "long-text",
        placeholder: "Explain architecture choices, frameworks considered, and technical trade-offs...",
      },
      {
        id: "7bccf282-4d51-4cb2-a869-77698b2d274e",
        name: "How would you debug a crash that occurs only on some devices?",
        type: "long-text",
        placeholder: "Explain crash report analysis, OS version differences, hardware-specific issues, and reproduction steps...",
      },
      {
        id: "64c8eae6-2eea-4c6b-aab3-0e29b12bceb9",
        name: "What would you do to keep a mobile application responsive as it grows?",
        type: "long-text",
        placeholder: "Discuss threading/asynchronous work, memory management, list virtualization, and state architecture...",
      },
      {
        id: "8a46b9d0-a8cb-44ee-8e1a-52c606196ab3",
        name: "Have you developed mobile apps (native or cross-platform)? Share links to GitHub repositories, APKs, or store listings if available.",
        type: "long-text",
        placeholder: "Optional: Share links to mobile app projects, repos, or published apps...",
        optional: true,
      },
      {
        id: "afcf88b6-b241-4ef8-a97b-febcf5cac0d2",
        name: "Which mobile development SDKs or frameworks have you used (e.g., Flutter, React Native, Android Studio / Kotlin, Swift)?",
        type: "long-text",
        placeholder: "Optional: Mention the mobile frameworks and platforms you have developed with...",
        optional: true,
      },
    ],
  },
  {
    department: "Ω_GmF6X_ny",
    questions: [
      {
        id: "c0a58d0f-cc02-4621-b9ba-5093ad23af2f",
        name: "What makes a game mechanic engaging rather than repetitive?",
        type: "long-text",
        placeholder: "Discuss feedback loops, player agency, risk/reward balance, and progressive complexity...",
      },
      {
        id: "07b82df7-d7e6-4ac1-ac73-a56c903d4e33",
        name: "How would you approach designing a simple game from concept to prototype?",
        type: "long-text",
        placeholder: "Explain rapid prototyping, core loop verification, and trimming unnecessary scope...",
      },
      {
        id: "15f90d48-5897-4ff4-ace6-f8d91af9a529",
        name: "How would you debug inconsistent game behavior caused by player input?",
        type: "long-text",
        placeholder: "Discuss physics tick rates, frame rate independence, input buffering, and state determinism...",
      },
      {
        id: "04a97430-0764-451f-8cf1-72b2287d1ed0",
        name: "What considerations matter when balancing difficulty?",
        type: "long-text",
        placeholder: "Explain learning curves, difficulty spikes, player feedback, and pacing...",
      },
      {
        id: "6d83082b-869d-49d3-826e-ab7164c942de",
        name: "Describe a game mechanic you would like to implement and why.",
        type: "long-text",
        placeholder: "Explain the mechanic, player interactions, and how it enriches the gameplay experience...",
      },
      {
        id: "b1ee2dbc-db43-4a44-adf8-7c3bbb860df2",
        name: "Have you built or participated in developing any game projects or game jams? Share gameplay links, itch.io pages, or GitHub repos.",
        type: "long-text",
        placeholder: "Optional: Link to playable demos, itch.io pages, videos, or game repositories...",
        optional: true,
      },
      {
        id: "8d9c6df1-6149-4381-9a16-8c81ee4a28d6",
        name: "Which game engines, physics tools, or asset creation pipelines have you worked with (e.g., Unity, Unreal Engine, Godot, Blender)?",
        type: "long-text",
        placeholder: "Optional: Mention game engines, scripting languages, or modeling tools you have used...",
        optional: true,
      },
    ],
  },
  {
    department: "≈_DtB1S_zk",
    questions: [
      {
        id: "21765d02-7752-41f4-aa6d-a0bb493a3909",
        name: "How would you approach a dataset containing missing or inconsistent values?",
        type: "long-text",
        placeholder: "Discuss imputation techniques, deletion risks, data validation, and exploratory analysis...",
      },
      {
        id: "b32bfe44-ac15-4b6b-86ea-a91210472e69",
        name: "What is the difference between correlation and causation?",
        type: "long-text",
        placeholder: "Explain using a concrete example and discuss confounding variables...",
      },
      {
        id: "fd92e976-f016-4f98-9e45-189a151245f0",
        name: "How would you decide which features are useful for a prediction problem?",
        type: "long-text",
        placeholder: "Discuss feature importance, collinearity, domain knowledge, and dimensionality reduction...",
      },
      {
        id: "eb791ce4-41c7-45b4-88ea-6b95b143f0be",
        name: "Describe a data-analysis project you have worked on or would like to build.",
        type: "long-text",
        placeholder: "Describe the dataset, research questions, methodology, and key findings or expected results...",
      },
      {
        id: "fc4d2091-5006-4f25-90a7-074d4798d60f",
        name: "How would you communicate a data-driven conclusion to someone without a technical background?",
        type: "long-text",
        placeholder: "Discuss visualization choices, avoiding jargon, storytelling with numbers, and focusing on impact...",
      },
      {
        id: "ba1f96f9-f6bf-4b82-bf79-281b9e0780f8",
        name: "Have you worked on any data analysis, machine learning, or AI projects? Share links to your Kaggle profile, GitHub notebooks, or reports.",
        type: "long-text",
        placeholder: "Optional: Link your GitHub notebooks, Kaggle profile, or data science projects...",
        optional: true,
      },
      {
        id: "190f21d2-1958-414a-b07b-344dd963a651",
        name: "Which data science and ML libraries or environments are you familiar with (e.g., Pandas, NumPy, Scikit-learn, PyTorch, Jupyter)?",
        type: "long-text",
        placeholder: "Optional: List data analysis and machine learning tools you have practical experience with...",
        optional: true,
      },
    ],
  },
  {
    department: "∂_CdH4D_bv",
    questions: [
      {
        id: "d776bedc-1361-4749-90d2-47a22bace642",
        name: "Why is automation useful in software deployment?",
        type: "long-text",
        placeholder: "Explain reproducibility, human error reduction, deployment frequency, and consistency...",
      },
      {
        id: "a7a005f8-1f52-45c9-a10a-c9b73000db36",
        name: "What is the purpose of CI/CD?",
        type: "long-text",
        placeholder: "Describe automated testing, continuous integration, artifact building, and delivery pipelines...",
      },
      {
        id: "a738dd76-79e9-4a04-a589-15e1b715c65e",
        name: "How would you investigate a service that suddenly becomes unavailable?",
        type: "long-text",
        placeholder: "Walk through status checks, health endpoints, server metrics, network logs, and rollback strategies...",
      },
      {
        id: "500cb81f-43f6-4dda-830f-51793e9edf10",
        name: "What information would you monitor for a production web application?",
        type: "long-text",
        placeholder: "Discuss error rates, latency (p95/p99), CPU/memory usage, throughput, and alerting thresholds...",
      },
      {
        id: "8c3b1a94-6d42-4f31-89e5-6b2190f84a17",
        name: "Explain one cloud technology or DevOps tool you have used or want to learn.",
        type: "long-text",
        placeholder: "Share your experience or interest in tools like Docker, Kubernetes, GitHub Actions, AWS, etc...",
      },
      {
        id: "4b5fa7a8-b6fd-4eb7-a029-c1ed921483ef",
        name: "Have you deployed applications to cloud providers or set up CI/CD pipelines? Share any repositories, Dockerfiles, or architecture setups.",
        type: "long-text",
        placeholder: "Optional: Share links to repositories with Dockerfiles, GitHub Actions, or deployment setups...",
        optional: true,
      },
      {
        id: "1b79db4d-fd45-4df0-8301-91518ff9267e",
        name: "Which cloud platforms, containerization tools, or infrastructure technologies have you used (e.g., AWS, GCP, Docker, Kubernetes, Linux)?",
        type: "long-text",
        placeholder: "Optional: List cloud platforms, container engines, or DevOps tools you have explored...",
        optional: true,
      },
    ],
  },
  {
    department: "∫_BkY2C_xu",
    questions: [
      {
        id: "d3c41d69-dfe3-4ec2-86ae-930cd3e7bf3e",
        name: "Explain one real-world problem where blockchain could be useful.",
        type: "long-text",
        placeholder: "Discuss transparency, immutable ledgers, trustless verification, and specific industry applications...",
      },
      {
        id: "670ad41c-b1a0-47b2-bac1-bbd01508141d",
        name: "What is the purpose of consensus in a blockchain network?",
        type: "long-text",
        placeholder: "Explain how distributed nodes agree on ledger state (e.g. PoW, PoS) and prevent double-spending...",
      },
      {
        id: "c9ac534d-6da3-4e50-8228-906a4cefc3bd",
        name: "How would you decide whether blockchain is actually necessary for a project?",
        type: "long-text",
        placeholder: "Contrast decentralized trust requirements with traditional relational databases and centralized systems...",
      },
      {
        id: "7fa4529e-c7fa-4e2f-a68b-5d115357963b",
        name: "Describe a blockchain concept you understand well.",
        type: "long-text",
        placeholder: "Explain smart contracts, cryptographic hashing, gas mechanics, zero-knowledge proofs, or wallets...",
      },
      {
        id: "14a72d93-3e15-4cb2-81fa-78c903eb5420",
        name: "What security considerations matter when designing a blockchain application?",
        type: "long-text",
        placeholder: "Discuss reentrancy attacks, private key management, oracle reliability, and audit practices...",
      },
      {
        id: "aeedd231-5f12-4d4a-b18c-adb444a195aa",
        name: "Have you written smart contracts, built decentralized applications (dApps), or contributed to Web3 projects? Share any GitHub repos or testnet contracts.",
        type: "long-text",
        placeholder: "Optional: Share links to smart contracts, dApp repositories, or Web3 projects...",
        optional: true,
      },
      {
        id: "fcd97cb5-2e3a-491d-b1c3-104d2e0e3203",
        name: "Which blockchain networks, languages, or Web3 development tools have you experimented with (e.g., Solidity, Hardhat, Ethers.js, Foundry)?",
        type: "long-text",
        placeholder: "Optional: List blockchains, tools, or smart contract languages you have worked with...",
        optional: true,
      },
    ],
  },
  {
    department: "≤_CpM8P_rw",
    questions: [
      {
        id: "dbff3640-a538-4496-9529-c1fe0d273a10",
        name: "How do you approach a problem before writing code?",
        type: "long-text",
        placeholder: "Describe understanding constraints, edge-case identification, pseudocode, and complexity analysis...",
      },
      {
        id: "3671dd1c-2cdf-4cf5-a4f5-81cadeb04682",
        name: "Explain how you would identify the time complexity of an algorithm.",
        type: "long-text",
        placeholder: "Discuss Big-O analysis, loop nesting, recursive call trees, and space-time trade-offs...",
      },
      {
        id: "206a9728-11d8-4e1e-93a8-7376dd115d1e",
        name: "Describe a difficult algorithmic problem you have solved or attempted.",
        type: "long-text",
        placeholder: "Explain the problem statement, intuition behind your approach, and how you optimized it...",
      },
      {
        id: "6dafbb56-0497-4453-b1b8-dc1d2e2e767a",
        name: "How do you debug a solution that passes some test cases but fails others?",
        type: "long-text",
        placeholder: "Explain stress testing, edge-case generation (e.g. n=0, n=max), boundary values, and overflow checks...",
      },
      {
        id: "8f12703c-44a1-4845-b6f0-41e03110286e",
        name: "Which data structure do you use most often and why?",
        type: "long-text",
        placeholder: "Discuss lookup, insertion, and deletion trade-offs for your chosen data structure...",
      },
      {
        id: "d5d5d852-7d42-41fd-8a4d-6efb08c5512c",
        name: "Share your profiles on competitive programming platforms such as Codeforces, LeetCode, CodeChef, HackerRank, or AtCoder.",
        type: "long-text",
        placeholder: "Optional: Share URLs or handles for Codeforces, LeetCode, CodeChef, etc...",
        optional: true,
      },
      {
        id: "d3ee50a2-e79e-4da3-9e54-37b0d2191be6",
        name: "Have you participated in ICPC, coding hackathons, or algorithmic contests? Mention any notable contests or milestones.",
        type: "long-text",
        placeholder: "Optional: Mention coding contests, ranks, ratings, or hackathon participation...",
        optional: true,
      },
    ],
  },
];

// Sample Admin Data
export const sampleAdminHeader = [
  {
    Header: "SrNo",
    accessor: "srno",
  },
  {
    Header: "Name",
    accessor: "name",
  },
  {
    Header: "Email",
    accessor: "email",
  },
  {
    Header: "Department",
    accessor: "department",
  },
];

// Headers for CSV exports
export const CSV_Header = [
  {
    label: "Name",
    key: "Name",
  },
  {
    label: "Email",
    key: "Email",
  },
  {
    label: "Registration Number",
    key: "RegistrationNumber",
  },
  {
    label: "Gender",
    key: "Gender",
  },
  {
    label: "Phone",
    key: "Phone",
  },
  {
    label: "Department",
    key: "Department",
  },

  {
    label: "Priority",
    key: "Priority",
  },
  {
    label: "Preference",
    key: "Pref",
  },
  {
    label: "Status",
    key: "Status",
  },
  {
    label: "Shortlisted",
    key: "shortlisted",
  },
  {
    label: "Questions",
    key: "Questions",
  },
];

// Mailing Templates
export const mailingTemplate = {
  Interview:
    "<p>Edit content</p><br><p>Thank you for applying to GDG Club. We are excited to let you know that you have been shortlisted for joining the #dept Department!</p><p>We look forward to your active participation!</p>",
};

export const technicalCards = [
  {
    title: "Blockchain",
    description:
      "Explores decentralized apps, smart contracts, and Web3 development, giving members hands-on experience with blockchain protocols and tools.",
    color: "#FF7A6B",
    image: "/assets/images/icons/blockchain.svg",
    formLink: "/6a89c4e2-7b19-4f32-821e-9821a41b5201",
  },
  {
    title: "Cloud &\nDevOps",
    description:
      "Explores cloud computing, infrastructure, and automation by building scalable applications, hosting hands-on workshops, and educating members about cloud platforms, containerization, CI/CD pipelines, and DevOps practices.",
    color: "#FBBC04",
    image: "/assets/images/icons/cloud.svg",
    formLink: "/a1d920df-9eb9-49eb-b3a4-e4a3d1245ede", // Cloud & DevOps ID
  },
  {
    title: "Game Dev",
    description:
      "Combines creativity and technical skills to design engaging, entertaining games, giving members hands-on experience with real-world game development tools, engines, and production workflows.",
    color: "#4285F4",
    image: "/assets/images/icons/game-dev.svg",
    formLink: "/9055864f-c7dc-44cd-91d5-8759d32a496a", // App Development ID (placeholder)
  },
  {
    title: "App Dev",
    description:
      "Builds intuitive, impactful mobile applications, improving accessibility, interaction, and convenience for members and event participants through functional, user-focused design.",
    color: "#EA4335",
    image: "/assets/images/icons/app-dev.svg",
    formLink: "/339f0f8a-72f2-44b9-92ab-2b0d4dcfa0f6",
  },
  {
    title: "UI/UX",
    description:
      "Designs visually appealing, user-friendly digital interfaces with a focus on accessibility, usability, and aesthetics, ensuring products provide enjoyable, intuitive, and meaningful user experiences.",
    color: "#0F9D58",
    image: "/assets/images/icons/ui-ux.svg",
    formLink: "/e2ed9c2c-c36c-457f-a8bb-cf2e8bc7c2e1",
  },
  {
    title: "Data\nScience",
    description:
      "Applies AI, machine learning, and analytics to transform data into actionable insights, helping solve problems, build predictive models, and inspire innovation across projects.",
    color: "#EA4335",
    image: "/assets/images/icons/data-science.svg",
    formLink: "/c0f3b1d1-ce05-45f6-9e34-ac9443fc5fcb", // App Development ID (placeholder)
  },
  {
    title: "Competitive Programming",
    description:
      "Promotes problem-solving skills through coding contests, hackathons, and peer learning, helping members sharpen algorithms, logic, and efficiency while preparing for real-world tech challenges.",
    color: "#0F9D58",
    image: "/assets/images/icons/cp.svg",
    formLink: "/3e9ac635-01d4-495e-aa87-a7335a2403c2", // App Development ID (placeholder)
  },
  {
    title: "Web Dev",
    description:
      "Designs, develops, and maintains responsive, high-performance websites for projects and events, using modern web technologies to enhance accessibility, user experience, and community engagement online.",
    color: "#FBBC04",
    image: "/assets/images/icons/web-dev.svg",
    formLink: "/8143de1d-db17-42fa-958d-13b10804f894",
  },
];

export const nonTechnicalCards = [
  {
    title: "Design",
    description:
      "Creates stunning visuals, event posters, and branding materials that capture the organization's identity, ensuring every design communicates creativity, professionalism, and excitement to engage the community.",
    color: "#329A4E",
    image: "/assets/images/icons/design.svg",
    formLink: "/d3beefc1-f8b0-4202-b26c-36e9804b6636",
  },
  {
    title: "Outreach",
    description:
      "Builds partnerships and expands outreach by connecting with communities, sponsors, and collaborators, ensuring diverse opportunities and impactful collaborations both within and beyond campus.",
    color: "#4285F4",
    image: "/assets/images/icons/outreach.svg",
    formLink: "/3936d5a2-acd9-4a98-ac97-42c2c92f5c02", // App Development ID (placeholder)
  },
  {
    title: "Publicity",
    description:
      "Drives online presence with creative campaigns, video editing, and storytelling, boosting engagement, promoting events, and showcasing the club to inspire participation and community growth.",
    color: "#EA4335",
    image: "/assets/images/icons/social-media.svg",
    formLink: "/4499a966-2740-4c36-88dd-8916a909fc77", // App Development ID (placeholder)
  },
  {
    title: "Management",
    description:
      "The backbone of the organization, turning vision into reality by planning, executing, and improvising. Oversees events, operations, and growth, ensuring smooth functioning, success, and impactful experiences.",
    color: "#FBBC04",
    image: "/assets/images/icons/management.svg",
    formLink: "/c21ca066-ab4d-40a3-943c-f170d6312bdc", // App Development ID (placeholder)
  },
];

export const UNIVERSAL_QUESTION_ID = "09a6b635-d8f1-4ec5-96a9-fa89de59e74f";

export const UNIVERSAL_QUESTION = {
  id: UNIVERSAL_QUESTION_ID,
  name: "Why do you want to join GDG Club?",
  type: "long-text",
  placeholder: "2-3 Sentences",
  aliases: [
    "Why do you want to join Organization Name?",
    "Why do you want to join DWASFW?",
  ],
};

export const LEGACY_QUESTION_MAP = {
  // Legacy UI/UX questions 6-10
  "78be82f7-e6d3-4be7-883f-e4dff66bce2c": "What tools do you use for design handoff and prototyping?",
  "bd47f9a8-b5a6-460c-bd55-8f3930282eb6": "How do you conduct user research or usability testing?",
  "4177decc-288c-41f0-ad47-309e7b209d0c": "Share a portfolio or link to past UI/UX work.",
  "a7114329-a17a-43a1-aa62-f261e3dc288c": "How do you approach mobile responsiveness in interface design?",
  "85d442c3-8190-4fb4-9412-149e9aed336c": "How do you balance aesthetic design with functional usability?",

  // Legacy Design question 6
  "92b452e9-dd72-4706-b5d7-70a8074506fb": "Share your design portfolio or links to recent work.",

  // Legacy Web Dev questions 6-8
  "38c7019e-7fdf-4f1a-9699-4481478528b2": "How do you ensure web accessibility (a11y) in your projects?",
  "ac42353b-66a0-49dd-b002-b512d3370698": "Explain your experience with state management in modern web apps.",
  "69db7d1d-afdd-4862-b93b-5d59ac8f0c8d": "Share a link to your GitHub profile or a live website project.",

  // Legacy Game Dev questions 6-7
  "37398af2-9540-4ac7-824b-0f814e4d3ab6": "What game engines or frameworks do you have experience with?",
  "690cac7a-e302-4d31-a4dd-b2cd9c51d71c": "Share a demo, video, or repository of a game you worked on.",

  // Legacy Data Science questions 6-7
  "5fb22940-d22e-45e0-93c9-3590e617e6bb": "Which libraries (e.g. pandas, scikit-learn, PyTorch) do you use most often?",
  "e2eab3f2-f566-45cd-b041-27aeae26d301": "Share a notebook, repository, or summary of a data project.",

  // Legacy Competitive Programming question 6
  "3b79042a-293b-4bf6-9548-bc6f314aac3e": "Share your profiles on competitive programming platforms (Codeforces, LeetCode, CodeChef, etc.).",
};

export function isObfuscated(str) {
  if (!str || typeof str !== "string") return false;
  if (/[₹*^%$#@!~∂≤≈πΩ§∆Δøµ∑∫]/.test(str)) return true;
  const words = str.trim().split(/\s+/);
  const mixedWordCount = words.filter((w) => /[a-zA-Z]/.test(w) && /\d/.test(w)).length;
  if (mixedWordCount >= 2 || (words.length <= 4 && mixedWordCount >= 1)) return true;
  return false;
}

export const resolveQuestionLabel = (key) => {
  if (!key) return "";

  // Universal question match (Direct ID or legacy aliases)
  if (
    key === UNIVERSAL_QUESTION_ID ||
    key === UNIVERSAL_QUESTION.name ||
    key === "Why do you want to join Organization Name?" ||
    key === "Why do you want to join DWASFW?" ||
    (UNIVERSAL_QUESTION.aliases && UNIVERSAL_QUESTION.aliases.includes(key))
  ) {
    return UNIVERSAL_QUESTION.name;
  }

  // 1. Direct ID match against current QuestionnaireData
  for (const dept of QuestionnaireData) {
    for (let i = 0; i < dept.questions.length; i++) {
      const q = dept.questions[i];
      if (q.id === key) {
        return q.name;
      }
    }
  }

  // 2. Legacy question ID match
  if (LEGACY_QUESTION_MAP[key]) {
    return LEGACY_QUESTION_MAP[key];
  }

  // 3. Legacy text match (Existing legacy documents)
  for (const dept of QuestionnaireData) {
    for (const q of dept.questions) {
      if (q.name === key || (q.aliases && q.aliases.includes(key))) {
        return q.name;
      }
    }
  }

  // 4. If key is an obfuscated string, do not expose it
  if (isObfuscated(key)) {
    return "Application Question";
  }

  // 5. Fallback
  return key;
};
