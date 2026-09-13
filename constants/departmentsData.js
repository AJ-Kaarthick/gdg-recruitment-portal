/**
 * Comprehensive Department Metadata for the "Explore Departments" Experience
 * Sourced for all 12 official GDG departments.
 * Zero database calls, 100% static, deterministic, and typed.
 */

export const EXPLORE_CATEGORIES = [
  "All",
  "Technical",
  "Creative & Media",
  "Core & Operations",
];

export const DEPARTMENTS_EXPLORE_DATA = [
  // 1. Web Development
  {
    id: "8143de1d-db17-42fa-958d-13b10804f894",
    obfuscatedId: "µ_Wb₹5D_lp",
    name: "Web Development",
    shortName: "Web Dev",
    category: "Technical",
    tone: "#4285F4", // Google Blue
    iconPath: "/assets/images/icons/web-dev.svg",
    tagline: "Engineer responsive, scalable web platforms that power community hackathons, recruitment, and student initiatives.",
    overview:
      "The Web Development department builds, maintains, and scales digital web experiences for the community. We develop production-grade web applications ranging from dynamic event portals and real-time hackathon dashboards to community blogs and the recruitment portal itself. Our focus is on modern full-stack workflows, accessible UI engineering, robust APIs, and performant state architecture that can reliably serve thousands of concurrent campus users.",
    tags: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Node.js", "REST & GraphQL"],
    workAreas: [
      {
        title: "Event & Hackathon Portals",
        description:
          "Architect dynamic submission portals, live countdowns, team registration systems, and real-time scoreboards for flagship GDG hackathons.",
      },
      {
        title: "Community Internal Tooling",
        description:
          "Build internal administrative dashboards, applicant review systems, and automated email trigger pipelines for chapter operations.",
      },
      {
        title: "Performance & Accessibility Optimization",
        description:
          "Conduct bundle size audits, optimize Core Web Vitals, implement semantic HTML5, and ensure WCAG 2.1 AA accessibility across all public web properties.",
      },
      {
        title: "API Integration & Serverless Backends",
        description:
          "Connect frontend interfaces with backend services, authentication providers, cloud storage buckets, and third-party APIs like Discord and GitHub webhooks.",
      },
    ],
    skills: [
      "JavaScript (ES6+) & TypeScript",
      "React.js & Next.js (App Router, SSR, Server Components)",
      "HTML5, Modern CSS, and Tailwind CSS",
      "State Management (Zustand, Redux Toolkit, Context API)",
      "RESTful APIs, WebSockets, and Fetch/Axios",
      "Git, GitHub PR workflows, and code review etiquette",
    ],
    goodToHave: [
      "Familiarity with basic JavaScript syntax, DOM manipulation, or building simple static websites",
      "Exposure to version control using Git and creating repositories on GitHub",
      "Basic understanding of how client-server communication and HTTP requests operate",
    ],
    beginnerFriendlyNote:
      "Prior production experience is not required! A strong drive to learn web fundamentals, experiment with code, and collaborate in teams is what matters most.",
    learningOutcomes: [
      "Production-level React and Next.js full-stack patterns",
      "Designing resilient client-side state architectures and handling edge-case loading/error states",
      "Collaborative software engineering: branch management, PR reviews, and CI deployment",
      "Real-world performance tuning (Lighthouse audits, dynamic imports, image caching)",
    ],
    suitableFor: [
      "Students eager to see immediate visual results from their code and build software used by hundreds of peers",
      "Developers interested in mastering frontend ecosystems, backend microservices, or full-stack web architectures",
      "Problem-solvers who care about both aesthetic user polish and underlying code architecture",
    ],
    activities: [
      "Hands-on full-stack workshops on building React apps with Next.js and Tailwind CSS",
      "Fast-paced 24-hour web build sprints during community hackathons",
      "Code review teardowns and interactive web performance optimization clinics",
      "Pair programming sessions on internal GDG portal feature updates and bug fixes",
    ],
  },

  // 2. App Development
  {
    id: "339f0f8a-72f2-44b9-92ab-2b0d4dcfa0f6",
    obfuscatedId: "∑_ApZ3V_gh",
    name: "App Development",
    shortName: "App Dev",
    category: "Technical",
    tone: "#34A853", // Google Green
    iconPath: "/assets/images/icons/app-dev.svg",
    tagline: "Build high-performance, cross-platform mobile apps that put community events and tools in every student's pocket.",
    overview:
      "The App Development department crafts intuitive mobile applications for Android and iOS devices. From conference guide apps with offline scheduling and push notifications to campus utility tools and interactive event check-in apps, our team tackles mobile ergonomics, device hardware sensors, and smooth animations. We explore modern cross-platform ecosystems like Flutter and React Native as well as native Android development with Kotlin.",
    tags: ["Flutter", "React Native", "Kotlin", "Android Studio", "Firebase Mobile", "Mobile UX"],
    workAreas: [
      {
        title: "Offline-First Community Mobile App",
        description:
          "Develop the flagship GDG companion app with offline event schedules, speaker profiles, bookmarking, and local SQLite/Hive caching.",
      },
      {
        title: "Live Event QR Scanning & Verification",
        description:
          "Implement high-speed camera scanner modules for real-time attendee badge validation and ticket verification at campus entrances.",
      },
      {
        title: "Push Notifications & Real-Time Sync",
        description:
          "Integrate Firebase Cloud Messaging (FCM) and WebSockets to broadcast instant schedule shifts, round announcements, and emergency updates.",
      },
      {
        title: "Native Device Feature Integration",
        description:
          "Leverage biometric authentication, GPS location services, Bluetooth beacons, and device storage permissions cleanly across platforms.",
      },
    ],
    skills: [
      "Dart & Flutter or JavaScript/TypeScript & React Native",
      "Kotlin and native Android architectural patterns (MVVM)",
      "Mobile State Management (Bloc, Provider, Riverpod)",
      "REST API integration and JSON serialization in mobile runtimes",
      "Mobile debugging, memory leak profiling, and responsive layouts across screen sizes",
    ],
    goodToHave: [
      "Familiarity with Object-Oriented Programming (Java, C++, Kotlin, or Dart)",
      "Curiosity about mobile UI lifecycles, navigation stacks, and touch gestures",
      "Any prior experience building a beginner mobile screen or mobile emulator setup",
    ],
    beginnerFriendlyNote:
      "Don't worry if you have never deployed an app to the Play Store or App Store! We guide enthusiastic beginners through SDK setup, widget hierarchies, and first builds.",
    learningOutcomes: [
      "Mastering reactive mobile UI patterns and handling complex navigation state",
      "Designing graceful offline experiences with local databases and background data synchronization",
      "Debugging device-specific quirks, orientation changes, and memory constraints",
      "Deploying and signing APKs, App Bundles, and configuring test distributions",
    ],
    suitableFor: [
      "Students fascinated by mobile apps and touch-driven user interaction paradigms",
      "Developers looking to build cross-platform tools that run seamlessly across Android and iOS",
      "Builders who enjoy optimizing software for performance under constrained battery and network conditions",
    ],
    activities: [
      "Flutter & Kotlin deep-dive workshops for beginners and intermediate builders",
      "Mobile App Jam: 48-hour challenge to design and prototype a functional campus utility app",
      "Device lab sessions testing apps on diverse screen ratios, tablets, and low-spec phones",
      "Talks on modern mobile system architecture, background workers, and app store release cycles",
    ],
  },

  // 3. Game Development
  {
    id: "9055864f-c7dc-44cd-91d5-8759d32a496a",
    obfuscatedId: "Ω_GmF6X_ny",
    name: "Game Development",
    shortName: "Game Dev",
    category: "Technical",
    tone: "#EA4335", // Google Red
    iconPath: "/assets/images/icons/game-dev.svg",
    tagline: "Blend mechanics, physics, and storytelling into playable interactive experiences and game jam titles.",
    overview:
      "The Game Development department sits at the intersection of programming, interactive mechanics, and creative narrative. We prototype 2D and 3D indie games, technical simulations, and gamified community installations using engines like Unity, Godot, and Unreal Engine. Whether designing physics-based puzzle mechanics, procedural audio triggers, or networked multiplayer game jams, our members turn abstract ideas into engaging playable worlds.",
    tags: ["Unity", "Godot", "C#", "Game Physics", "3D Math", "Game Jams"],
    workAreas: [
      {
        title: "Community Game Jam Projects",
        description:
          "Team up to brainstorm, prototype, and polish complete standalone games within 48 to 72 hours for international itch.io game jams.",
      },
      {
        title: "Interactive Conference Mini-Games",
        description:
          "Build web-playable retro arcade games or AR mini-games showcased on interactive kiosks during major tech fest events.",
      },
      {
        title: "Physics & Gameplay Mechanics Tuning",
        description:
          "Script character controllers, collision matrices, procedural animations, dynamic camera behaviors, and custom particle shaders.",
      },
      {
        title: "Sound & Atmosphere Implementation",
        description:
          "Integrate spatial audio, adaptive musical transitions, and particle FX that respond dynamically to player input and narrative pacing.",
      },
    ],
    skills: [
      "C# (for Unity) or GDScript / C++ (for Godot/Unreal)",
      "Game Loop architecture, frame-rate independence, and DeltaTime math",
      "2D/3D Transform math (vectors, quaternions, dot products)",
      "State Machines for character controllers and AI enemies",
      "Asset pipelines: importing sprites, 3D meshes, colliders, and sound FX",
    ],
    goodToHave: [
      "Familiarity with basic programming logic (loops, conditionals, object-oriented concepts)",
      "Passion for playing games and analyzing why game mechanics feel responsive or frustrating",
      "Basic exposure to any game engine or 3D modeling tool like Blender is a plus",
    ],
    beginnerFriendlyNote:
      "You don't need 3D modeling mastery or advanced shader math to join! If you love games and want to learn how game loops and mechanics are coded, we start from fundamentals.",
    learningOutcomes: [
      "Transforming game concepts into playable, balanced prototypes using Unity or Godot",
      "Understanding game loop timing, physics engines, hitboxes, and input buffering",
      "Techniques for game optimization (draw call reduction, object pooling, sprite atlases)",
      "Collaborative game development using Git LFS and iterative playtesting protocols",
    ],
    suitableFor: [
      "Creative coders who want to build immersive, responsive virtual worlds",
      "Storytellers and gameplay designers who enjoy rapid prototyping and playtesting",
      "Developers curious about real-time simulation, physics calculations, and interactive audio",
    ],
    activities: [
      "Weekend internal GDG Game Jams with custom theme reveals and peer voting",
      "Workshops covering player controller physics, tilemaps, and state machine architecture",
      "Live playtesting circles: play each other's prototypes and give actionable game feel feedback",
      "Technical talks on shader programming, 2D lighting, and performance profiling on mobile/WebGL",
    ],
  },

  // 4. UI/UX
  {
    id: "e2ed9c2c-c36c-457f-a8bb-cf2e8bc7c2e1",
    obfuscatedId: "ø_UxK2_mj",
    name: "UI/UX",
    shortName: "UI/UX",
    category: "Technical",
    tone: "#FBBC04", // Google Yellow
    iconPath: "/assets/images/icons/ui-ux.svg",
    tagline: "Design intuitive, accessible digital experiences through rigorous research, design systems, and wireframing.",
    overview:
      "The UI/UX department bridges the gap between human psychology and digital product software. We conduct user research, construct user journeys, build design systems, and draft pixel-perfect Figma prototypes for all web and mobile platforms developed by the club. Our focus is ensuring that every digital touchpoint is accessible, aesthetically cohesive, intuitive, and delightful to interact with.",
    tags: ["Figma", "User Research", "Wireframing", "Design Systems", "Prototyping", "WCAG"],
    workAreas: [
      {
        title: "Product Design & Interactive Prototyping",
        description:
          "Create high-fidelity interactive Figma prototypes with realistic component states, micro-interactions, and transitions for upcoming portal tools.",
      },
      {
        title: "Universal Design System Maintenance",
        description:
          "Maintain a shared UI kit of typography scales, accessible color palettes, form inputs, buttons, and tokens adopted by all frontend teams.",
      },
      {
        title: "Usability Testing & User Journey Mapping",
        description:
          "Conduct usability testing sessions with student candidates, analyze user drop-off bottlenecks, and optimize complex navigation flows.",
      },
      {
        title: "Design-to-Code Developer Handoff",
        description:
          "Annotate responsive flexbox/grid layouts, token variables, and edge case states to facilitate seamless implementation by web and mobile engineers.",
      },
    ],
    skills: [
      "Figma (Auto Layout, Components, Variants, Interactive Components, Variables)",
      "Information Architecture and User Flow Mapping",
      "Accessibility Guidelines (WCAG 2.1 contrast, touch targets, keyboard navigation)",
      "Qualitative & Quantitative User Research methodologies",
      "Wireframing, low-fidelity sketching, and rapid design iteration",
    ],
    goodToHave: [
      "An eye for visual hierarchy, spacing, typography, and clear layouts",
      "Curiosity about why certain everyday apps feel effortless to use while others feel confusing",
      "Familiarity with Figma or any wireframing/vector software",
    ],
    beginnerFriendlyNote:
      "You don't need a formal design degree! Anyone with empathy for users, attention to visual detail, and an eagerness to master modern design tools is warmly welcomed.",
    learningOutcomes: [
      "Structuring professional, scalable design systems and reusable component libraries in Figma",
      "Conducting structured user interviews and translating feedback into actionable UI iterations",
      "Understanding design handoff best practices that prevent friction with software engineers",
      "Mastering typography, color harmony, visual rhythm, and accessibility compliance",
    ],
    suitableFor: [
      "Students passionate about product design, human-computer interaction, and aesthetic usability",
      "Empathic problem-solvers who enjoy questioning user assumptions and designing clean workflows",
      "Designers who want to see their Figma creations built into live production applications",
    ],
    activities: [
      "Interactive Figma Masterclasses covering Auto Layout, component variants, and design tokens",
      "Design Critique Clinics: teardowns of popular apps and collaborative UI redesign challenges",
      "User testing workshops observing real users navigating GDG portal prototypes",
      "UI/UX sprints pairing designers directly with frontend developers for rapid execution",
    ],
  },

  // 5. Data Science
  {
    id: "c0f3b1d1-ce05-45f6-9e34-ac9443fc5fcb",
    obfuscatedId: "≈_DtB1S_zk",
    name: "Data Science",
    shortName: "Data Science",
    category: "Technical",
    tone: "#4285F4", // Google Blue
    iconPath: "/assets/images/icons/data-science.svg",
    tagline: "Harness machine learning, statistical modeling, and data analytics to unlock insights and automate intelligence.",
    overview:
      "The Data Science department explores the power of data, machine learning, and artificial intelligence to solve complex challenges. We work with exploratory data analysis, natural language processing, computer vision, and predictive modeling using Python and modern ML frameworks. Members analyze real-world datasets, build algorithmic pipelines, generate actionable community insights, and experiment with cutting-edge LLMs and computer vision models.",
    tags: ["Python", "Pandas", "Scikit-learn", "PyTorch", "Data Viz", "NLP & LLMs"],
    workAreas: [
      {
        title: "Predictive Analytics & Community Dashboards",
        description:
          "Analyze chapter engagement metrics, event attendance trends, and candidate preferences to deliver predictive insights to club leads.",
      },
      {
        title: "Computer Vision & Visual Intelligence",
        description:
          "Build image classification, object detection, or facial recognition models for smart attendance, interactive booths, and automation.",
      },
      {
        title: "Natural Language Processing & RAG Pipelines",
        description:
          "Develop intelligent chatbots, automated FAQ assistants, and document summarization systems using embeddings and modern LLM APIs.",
      },
      {
        title: "Data Cleaning & Feature Engineering",
        description:
          "Handle sparse datasets, detect outliers, perform statistical hypothesis tests, and prepare high-dimensional data for training algorithms.",
      },
    ],
    skills: [
      "Python for Data Science (NumPy, Pandas, SciPy)",
      "Data Visualization (Matplotlib, Seaborn, Plotly)",
      "Machine Learning Algorithms (Regression, Decision Trees, Clustering, Random Forests)",
      "Deep Learning fundamentals (PyTorch, TensorFlow / Keras basics)",
      "Jupyter Notebooks, Kaggle workflows, and model evaluation metrics (F1-score, ROC-AUC)",
    ],
    goodToHave: [
      "Familiarity with basic Python programming (lists, dictionaries, functions)",
      "Foundational understanding of high-school mathematics (basic statistics, linear algebra, calculus)",
      "Curiosity about asking questions of data and finding patterns in numerical tables",
    ],
    beginnerFriendlyNote:
      "You don't need a PhD in statistics or advanced deep learning research experience! We start with clean data exploration and walk step-by-step into training your first models.",
    learningOutcomes: [
      "Wrangling messy, real-world data and conducting rigorous Exploratory Data Analysis (EDA)",
      "Training, evaluating, and tuning machine learning models to solve regression and classification problems",
      "Deploying ML models as lightweight API services using FastAPI or Streamlit",
      "Presenting statistical findings with clear, compelling charts to non-technical stakeholders",
    ],
    suitableFor: [
      "Analytical thinkers who enjoy discovering hidden patterns in raw numbers and tables",
      "Developers eager to explore the practical foundations of artificial intelligence and machine learning",
      "Students interested in data-driven decision making, research, and predictive modeling",
    ],
    activities: [
      "Hands-on Kaggle-style data analysis sprints on curated campus datasets",
      "Workshops on training classification models with Scikit-learn and neural nets with PyTorch",
      "Exploratory data visualization sessions crafting interactive dashboards in Streamlit",
      "Journal clubs discussing breakthroughs in Large Language Models, generative AI, and ethics",
    ],
  },

  // 6. Cloud & DevOps
  {
    id: "a1d920df-9eb9-49eb-b3a4-e4a3d1245ede",
    obfuscatedId: "∂_CdH4D_bv",
    name: "Cloud & DevOps",
    shortName: "Cloud & DevOps",
    category: "Technical",
    tone: "#FBBC04", // Google Yellow
    iconPath: "/assets/images/icons/cloud.svg",
    tagline: "Architect reliable cloud infrastructure, automated CI/CD pipelines, and secure containerized environments.",
    overview:
      "The Cloud & DevOps department forms the operational backbone of GDG's technical projects. We containerize applications with Docker, automate testing and deployment with CI/CD workflows, configure cloud resources on Google Cloud Platform and AWS, and monitor service health. Our mission is to ensure that every web and mobile product runs smoothly, scales elastically under traffic spikes, and stays resilient against infrastructure failures.",
    tags: ["Docker", "Google Cloud", "CI/CD", "Kubernetes", "Linux", "Terraform"],
    workAreas: [
      {
        title: "Automated CI/CD Delivery Pipelines",
        description:
          "Configure GitHub Actions workflows that automatically run linting, execute test suites, build production containers, and deploy to staging.",
      },
      {
        title: "Containerization & Microservice Orchestration",
        description:
          "Write multi-stage Dockerfiles that minimize image sizes, eliminate vulnerabilities, and orchestrate multi-container setups using Docker Compose.",
      },
      {
        title: "Cloud Infrastructure Provisioning",
        description:
          "Deploy virtual machines, managed serverless containers (Cloud Run), and object storage buckets on Google Cloud Platform with best-practice IAM security.",
      },
      {
        title: "Observability, Logging & Uptime Monitoring",
        description:
          "Set up real-time monitoring dashboards, uptime pings, structured log aggregation, and automated alerting channels for high-traffic events.",
      },
    ],
    skills: [
      "Linux Command Line & Shell Scripting (Bash)",
      "Docker & Containerization principles",
      "GitHub Actions & CI/CD workflow automation",
      "Cloud Foundations (GCP / AWS: Compute, Storage, Networking, IAM)",
      "DNS, SSL/TLS certificates, reverse proxies (Nginx), and HTTP protocols",
    ],
    goodToHave: [
      "Familiarity with operating in a Linux or macOS terminal environment",
      "Basic understanding of networking concepts (IP addresses, ports, DNS, HTTP vs HTTPS)",
      "Curiosity about what happens behind the scenes when a website is deployed to the internet",
    ],
    beginnerFriendlyNote:
      "DevOps tools may sound intimidating at first, but we demystify the command line, containers, and cloud consoles through step-by-step practical labs!",
    learningOutcomes: [
      "Mastering Docker containerization from development environments to production releases",
      "Building production-grade CI/CD pipelines that automate deployment on every Git push",
      "Configuring cloud environments on Google Cloud Platform with security and cost efficiency",
      "Troubleshooting server crashes, port conflicts, networking bottlenecks, and permission issues",
    ],
    suitableFor: [
      "Students passionate about infrastructure, automation, and backend system reliability",
      "Developers who love the terminal, scripting, and eliminating repetitive manual workflows",
      "Builders interested in learning cloud computing and platform engineering practices",
    ],
    activities: [
      "Hands-on Docker labs: containerizing full-stack web applications from scratch",
      "GitHub Actions automation workshops building automated testing and deployment pipelines",
      "Cloud architecture teardowns examining high-scale web application infrastructure",
      "DevOps disaster recovery drills: debugging broken builds, bad configs, and simulated server crashes",
    ],
  },

  // 7. Blockchain
  {
    id: "6a89c4e2-7b19-4f32-821e-9821a41b5201",
    obfuscatedId: "∫_BkY2C_xu",
    name: "Blockchain",
    shortName: "Blockchain",
    category: "Technical",
    tone: "#EA4335", // Google Red
    iconPath: "/assets/images/icons/blockchain.svg",
    tagline: "Explore decentralized ledgers, write verifiable smart contracts, and build Web3 applications.",
    overview:
      "The Blockchain department delves into decentralized protocols, cryptographic primitives, and smart contract engineering. We research consensus algorithms, explore decentralized identity systems, and build decentralized applications (dApps) on Ethereum-compatible networks. Our members test the boundaries of verifiable transparency, security audits, and decentralized storage solutions.",
    tags: ["Solidity", "Web3.js", "Ethers.js", "Hardhat", "Smart Contracts", "Cryptographic Prim."],
    workAreas: [
      {
        title: "Smart Contract Architecture & Testing",
        description:
          "Write, test, and deploy secure Solidity smart contracts on testnets using Hardhat or Foundry, complete with automated unit tests.",
      },
      {
        title: "Decentralized Application (dApp) Frontends",
        description:
          "Connect React/Next.js user interfaces to Web3 wallets (MetaMask) using Ethers.js and Viem to trigger transactions and read chain data.",
      },
      {
        title: "Verifiable Event Badges & Certificates",
        description:
          "Architect on-chain credentialing systems and digital commemorative tokens for hackathon winners and workshop participants.",
      },
      {
        title: "Security Auditing & Vulnerability Research",
        description:
          "Study real-world exploits, learn common vulnerability vectors like reentrancy and integer overflow, and implement defensive design patterns.",
      },
    ],
    skills: [
      "Solidity programming language and EVM execution mechanics",
      "Hardhat, Foundry, or Remix IDE for testing and deployment",
      "Web3 Client Libraries (Ethers.js, Viem, Wagmi)",
      "Cryptographic basics (Public/Private keys, Hash functions, Signatures)",
      "Smart contract standards (ERC-20, ERC-721, ERC-1155)",
    ],
    goodToHave: [
      "Basic familiarity with programming logic (JavaScript, Python, C++, or Java)",
      "Curiosity about peer-to-peer networks, cryptographic hashes, and decentralized systems",
      "Understanding of fundamental data structures like linked lists and trees",
    ],
    beginnerFriendlyNote:
      "You don't need any cryptocurrency experience or expensive hardware! All development and testing takes place on free local simulated networks and public testnets.",
    learningOutcomes: [
      "Writing, testing, and deploying audited smart contracts using modern development frameworks",
      "Building end-to-end dApps connecting wallet extensions to decentralized backends",
      "Understanding gas optimization techniques and the economics of distributed ledgers",
      "Evaluating when a decentralized architecture is genuinely beneficial versus when a traditional database is better",
    ],
    suitableFor: [
      "Developers intrigued by cryptography, peer-to-peer protocols, and distributed consensus",
      "Builders looking to master the burgeoning Web3 and decentralized software ecosystem",
      "Problem-solvers who care deeply about verifiable data transparency and programmatic trust",
    ],
    activities: [
      "Interactive smart contract bootcamps: writing your first token and escrow contract in Solidity",
      "Web3 dApp hackathons building decentralized voting and verification systems",
      "Smart contract capture-the-flag (CTF) challenges reverse-engineering vulnerable contracts",
      "Discussions analyzing real-world protocol upgrades, zero-knowledge proofs, and decentralized storage",
    ],
  },

  // 8. Competitive Programming
  {
    id: "3e9ac635-01d4-495e-aa87-a7335a2403c2",
    obfuscatedId: "≤_CpM8P_rw",
    name: "Competitive Programming",
    shortName: "Competitive Programming",
    category: "Technical",
    tone: "#34A853", // Google Green
    iconPath: "/assets/images/icons/cp.svg",
    tagline: "Master advanced data structures, algorithmic intuition, and rapid mathematical problem solving under pressure.",
    overview:
      "The Competitive Programming department cultivates sharp algorithmic problem-solving instincts, rigorous mathematical logic, and coding speed. We analyze complex time and space complexities, study advanced data structures (segment trees, Fenwick trees, tries), and dissect dynamic programming paradigms. Our members represent the chapter in global programming contests, participate in peer contest lockouts, and host campus algorithmic training camps.",
    tags: ["C++", "Data Structures", "Algorithms", "Dynamic Prog.", "Graph Theory", "Codeforces"],
    workAreas: [
      {
        title: "Contest Preparation & Platform Contests",
        description:
          "Train regularly for Codeforces, LeetCode, CodeChef, and ICPC contests with structured post-contest problem upsolving sessions.",
      },
      {
        title: "Campus Coding Contests & Editorial Writing",
        description:
          "Create original algorithmic problem sets, define strict test suites with corner cases, and author detailed educational editorials for campus coders.",
      },
      {
        title: "Peer Lockout Battles & Timed Sprints",
        description:
          "Organize friendly 1v1 lockout coding duels that test fast thinking, rapid debugging, and accuracy under ticking clocks.",
      },
      {
        title: "Algorithmic Mentorship & Workshops",
        description:
          "Deliver beginner-friendly sessions breaking down recursion, binary search, two-pointer methods, graph traversals, and dynamic programming.",
      },
    ],
    skills: [
      "C++ (STL containers, iterators, fast I/O) or Java/Python equivalent",
      "Time & Space Complexity analysis (Big-O notation, constraint interpretation)",
      "Data Structures: Heaps, Disjoint Set Union (DSU), Segment Trees, Hash Maps",
      "Algorithms: Binary Search, BFS/DFS, Dijkstra, Dynamic Programming, Bit Manipulation",
      "Stress-testing solutions and edge-case discovery (boundary values, integer overflows)",
    ],
    goodToHave: [
      "Familiarity with any programming language syntax (C, C++, Java, or Python)",
      "Enjoyment of puzzles, math riddles, and analytical problem-solving",
      "Interest in writing cleaner, more optimal algorithms that run within strict milliseconds",
    ],
    beginnerFriendlyNote:
      "You don't need to be a candidate master or expert rated coder! We welcome everyone from beginners starting with basic arrays to advanced contest enthusiasts.",
    learningOutcomes: [
      "Rapidly identifying the optimal algorithmic paradigm by analyzing problem constraints",
      "Mastering C++ Standard Template Library (STL) to write concise, lightning-fast code",
      "Developing disciplined debugging techniques to identify off-by-one errors and tricky corner cases",
      "Building rock-solid technical interview problem-solving skills for top software companies",
    ],
    suitableFor: [
      "Students who love mathematical puzzles, logic riddles, and optimization challenges",
      "Coders seeking to excel in algorithmic programming contests like ICPC and Codeforces",
      "Builders looking to deeply understand data structures and computational efficiency",
    ],
    activities: [
      "Weekly GDG Codeforces upsolving circles and algorithmic strategy breakdowns",
      "Campus-wide online coding contests hosted and moderated on HackerRank / CodeChef",
      "Dynamic programming and graph theory intensive bootcamps",
      "Speed coding lockouts and pair-debugging challenges",
    ],
  },

  // 9. Design
  {
    id: "d3beefc1-f8b0-4202-b26c-36e9804b6636",
    obfuscatedId: "π_Ds9J8_tr",
    name: "Design",
    shortName: "Design",
    category: "Creative & Media",
    tone: "#FBBC04", // Google Yellow
    iconPath: "/assets/images/icons/design.svg",
    tagline: "Define GDG's visual brand identity through striking posters, digital illustrations, motion assets, and merch.",
    overview:
      "The Design department is the creative powerhouse that shapes how the community looks, feels, and communicates visually. We design official event branding packages, high-impact social media creatives, conference posters, stage backdrops, club stickers, and physical merchandise. Our members master typography, layout composition, color theory, and visual hierarchy using tools like Photoshop, Illustrator, and Canva.",
    tags: ["Illustrator", "Photoshop", "Brand Identity", "Typography", "Poster Design", "Visual Arts"],
    workAreas: [
      {
        title: "Flagship Event Brand Identities",
        description:
          "Conceptualize cohesive visual themes, color palettes, custom badges, and stage banners for mega hackathons, devfests, and tech summits.",
      },
      {
        title: "High-Engagement Social Media Visuals",
        description:
          "Design scroll-stopping Instagram carousels, speaker announcement posters, countdown graphics, and YouTube thumbnail artwork.",
      },
      {
        title: "Community Merch & Physical Swag",
        description:
          "Create unique illustrations and vector artwork for t-shirts, hoodies, laptop sticker packs, attendee badges, and tote bags.",
      },
      {
        title: "Print & Campus Marketing Collateral",
        description:
          "Prepare print-ready vector files, brochures, standees, and noticeboard posters adhering strictly to bleed zones and color profiles.",
      },
    ],
    skills: [
      "Adobe Photoshop, Illustrator, or Figma for visual graphic design",
      "Typography pairing, font scales, and typographic hierarchy",
      "Color theory, palette harmony, and contrast dynamics",
      "Compositional techniques (rule of thirds, golden ratio, whitespace management)",
      "Exporting formats: vector SVGs, high-res print PDFs, web-optimized PNGs",
    ],
    goodToHave: [
      "A keen eye for aesthetic details, colors, textures, and clean compositions",
      "Familiarity with digital art, graphic editing software, or sketching",
      "Enthusiasm for transforming conceptual event themes into tangible visual artwork",
    ],
    beginnerFriendlyNote:
      "You don't need a finished professional portfolio! If you love art, doodling, experimenting with layouts, and learning creative design software, you belong here.",
    learningOutcomes: [
      "Developing complete brand styleguides and maintaining visual consistency across assets",
      "Mastering vector pen tools, masking, blend modes, and raster photo manipulation",
      "Understanding print design standards (CMYK vs RGB, DPI resolutions, vector scaling)",
      "Receiving and applying creative critique constructively in a collaborative design team",
    ],
    suitableFor: [
      "Creative students passionate about graphic design, digital illustration, and branding",
      "Visual artists who want their designs displayed across campus, social channels, and event stages",
      "Individuals who care deeply about aesthetics, typography, and visual storytelling",
    ],
    activities: [
      "Visual design sprints: creating promotional posters from real event briefs in 90 minutes",
      "Design masterclasses on typography hierarchy, vector illustration, and brand guideline creation",
      "Poster teardown sessions analyzing what catches eyes and what confuses viewers",
      "Merch design contests where winning illustrations get printed on official club merchandise",
    ],
  },

  // 10. Publicity
  {
    id: "4499a966-2740-4c36-88dd-8916a909fc77",
    obfuscatedId: "¥_Pb!8Q_wk",
    name: "Publicity",
    shortName: "Publicity",
    category: "Creative & Media",
    tone: "#EA4335", // Google Red
    iconPath: "/assets/images/icons/social-media.svg",
    tagline: "Drive community hype, viral campaigns, video production, and social media engagement across campus.",
    overview:
      "The Publicity department commands the voice, social presence, and narrative momentum of GDG. We script and produce high-energy teaser reels, craft engaging social copy, interview speakers, manage multi-channel promotional campaigns, and track real-time analytics to maximize event turnout. If there's excitement on campus about a GDG event, this is the team that ignited it.",
    tags: ["Social Media", "Video Editing", "Copywriting", "Campaign Strategy", "Reels/Shorts", "Analytics"],
    workAreas: [
      {
        title: "Multi-Platform Campaign Strategy",
        description:
          "Plan chronological campaign rollouts across Instagram, LinkedIn, X, and YouTube with teaser phases, countdowns, and hype videos.",
      },
      {
        title: "Short-Form Video Production (Reels & Shorts)",
        description:
          "Shoot, edit, and score fast-paced TikTok/Reels content, speaker highlight clips, and behind-the-scenes organizer bloopers.",
      },
      {
        title: "Compelling Copywriting & Storytelling",
        description:
          "Author witty, informative captions, registration push announcements, and email newsletter updates that resonate with students.",
      },
      {
        title: "Audience Analytics & Engagement Optimization",
        description:
          "Track reach metrics, engagement ratios, story polls, and conversion click-throughs to optimize posting schedules and campaign messaging.",
      },
    ],
    skills: [
      "Video Editing (Premiere Pro, DaVinci Resolve, CapCut, After Effects)",
      "Social Media Management & Algorithm Nuances (Instagram, LinkedIn, YouTube)",
      "Creative Copywriting, Hook Writing, and Call-to-Action framing",
      "Content Calendar Scheduling and Multi-Channel Planning",
      "Basic Photography and On-Campus Video Shooting ergonomics",
    ],
    goodToHave: [
      "Enthusiasm for social media culture, memes, trending audio, and storytelling",
      "Comfort writing engaging captions or speaking on camera for quick campus interviews",
      "Basic familiarity with video editing tools or creating mobile video reels",
    ],
    beginnerFriendlyNote:
      "You don't need thousands of followers or cinema cameras! We value creativity, humor, curiosity about social trends, and a willingness to create content collaboratively.",
    learningOutcomes: [
      "Producing viral short-form video content from concept and storyboard to final cut",
      "Crafting persuasive marketing copy that drives hundreds of event registrations",
      "Interpreting audience analytics to make data-informed content adjustments",
      "Coordinating cross-functional promotional launches under tight event countdown deadlines",
    ],
    suitableFor: [
      "Dynamic students who love social media trends, reels creation, and video storytelling",
      "Writers who enjoy crafting witty, punchy copy that demands attention",
      "Charismatic communicators eager to interview speakers, lead hype campaigns, and energize crowds",
    ],
    activities: [
      "Video editing jam sessions covering pacing, sound design, and text animation tricks",
      "Behind-the-scenes event vlogging and rapid same-day recap reel production",
      "Copywriting workshops analyzing viral hooks, newsletter open rates, and call-to-actions",
      "Campaign brainstorming roundtables designing unique promotional stunts across campus",
    ],
  },

  // 11. Outreach
  {
    id: "3936d5a2-acd9-4a98-ac97-42c2c92f5c02",
    obfuscatedId: "∆_Ot₹3W_vx",
    name: "Outreach",
    shortName: "Outreach",
    category: "Core & Operations",
    tone: "#4285F4", // Google Blue
    iconPath: "/assets/images/icons/outreach.svg",
    tagline: "Build industry partnerships, secure event sponsorships, and connect the chapter with global tech communities.",
    overview:
      "The Outreach department builds strategic bridges between GDG, the tech industry, corporate sponsors, alumni, and other student communities. We pitch sponsorship proposals, negotiate financial and developer tooling partnerships, invite industry leaders as guest speakers, and foster collaborative tie-ups. Our work ensures that our chapter has the financial backing, resources, and industry connectivity to host world-class events.",
    tags: ["Sponsorships", "Partnerships", "Public Relations", "Speaker Curation", "Negotiation", "Pitching"],
    workAreas: [
      {
        title: "Corporate Sponsorship Acquisition",
        description:
          "Identify prospective company sponsors, tailor value-driven sponsorship decks, and conduct outreach meetings to secure funding and swag.",
      },
      {
        title: "Keynote Speaker & Judge Curation",
        description:
          "Reach out to software engineers, tech founders, and developer advocates on LinkedIn to invite them as hackathon judges and keynote speakers.",
      },
      {
        title: "Inter-College & Chapter Collaborations",
        description:
          "Coordinate joint hackathons, technical exchanges, and community meetups with other developer clubs and GDG chapters across regions.",
      },
      {
        title: "Partner Relationship Management & Deliverables",
        description:
          "Ensure sponsor commitments (booth spaces, banner placements, judging slots, promotional shoutouts) are meticulously delivered during events.",
      },
    ],
    skills: [
      "Professional Written & Verbal Communication (Cold emailing, LinkedIn networking)",
      "Pitch Deck Creation and Value Proposition Articulation",
      "Negotiation and Sponsorship Tier Structuring",
      "CRM & Pipeline Tracking (Notion, Google Sheets, Airtable)",
      "Professional Relationship Management and Follow-Through Etiquette",
    ],
    goodToHave: [
      "Confidence in reaching out to new people and communicating clearly and respectfully",
      "Interest in understanding how corporate partnerships and tech sponsorship models work",
      "Prior exposure to drafting emails, organizing club collaborations, or public speaking",
    ],
    beginnerFriendlyNote:
      "Never sent a sponsorship cold email before? No problem! We provide proven email templates, pitch decks, and mock negotiation practice to build your confidence.",
    learningOutcomes: [
      "Mastering professional corporate communication and cold outreach on LinkedIn and email",
      "Negotiating sponsor deliverables, funding agreements, and in-kind partnerships",
      "Building a valuable professional network of software engineers, founders, and community leads",
      "Managing complex client deliverables under real-world event constraints",
    ],
    suitableFor: [
      "Outgoing communicators who love networking, meeting new people, and forging connections",
      "Students interested in public relations, business development, and corporate partnerships",
      "Persuasive presenters who enjoy representing the club with professionalism and poise",
    ],
    activities: [
      "Mock corporate pitch workshops: practice presenting sponsorship proposals to mock executives",
      "Cold outreach clinics: crafting high-conversion emails and LinkedIn messages with instant feedback",
      "Speaker networking dinners and hosting VIP guests during flagship tech fest days",
      "Ecosystem mapping sessions identifying emerging tech startups and sponsor prospects",
    ],
  },

  // 12. Management
  {
    id: "c21ca066-ab4d-40a3-943c-f170d6312bdc",
    obfuscatedId: "§_Mn9X7_qz",
    name: "Management",
    shortName: "Management",
    category: "Core & Operations",
    tone: "#34A853", // Google Green
    iconPath: "/assets/images/icons/management.svg",
    tagline: "Drive end-to-end event execution, cross-team logistics, venue operations, and strategic club planning.",
    overview:
      "The Management department is the operational engine that transforms grand ideas into flawlessly executed reality. We manage event schedules, coordinate venue logistics, handle on-ground crowd flow, maintain cross-department accountability, and manage budgets. From securing auditorium permissions to resolving sudden technical roadblocks during a live keynote, our managers lead from the front to ensure high-impact experiences.",
    tags: ["Event Ops", "Logistics", "Budgeting", "Team Coordination", "Crisis Mgmt", "Leadership"],
    workAreas: [
      {
        title: "End-to-End Event Operations & Run-of-Show",
        description:
          "Draft minute-by-minute schedules, stage itineraries, volunteer rosters, and oversee smooth transitions across multi-day conferences.",
      },
      {
        title: "Venue Logistics & Administrative Clearances",
        description:
          "Liaise with college administration to secure auditoriums, labs, audio-visual systems, high-speed Wi-Fi access, and security approvals.",
      },
      {
        title: "Crowd Flow & Participant Hospitality",
        description:
          "Design efficient check-in queues, food & beverage distribution stations, hackathon resting zones, and participant helpdesks.",
      },
      {
        title: "Cross-Department Synchronization & Timelines",
        description:
          "Facilitate weekly chapter syncs, resolve cross-team scheduling bottlenecks between tech, design, and outreach, and track milestones.",
      },
    ],
    skills: [
      "Event Planning, Logistics Structuring, and Resource Allocation",
      "Crisis Management, Quick Decision-Making, and On-Ground Improvisation",
      "Budget Management, Expense Tracking, and Vendor Coordination",
      "Team Leadership, Task Delegation, and Conflict Resolution",
      "Tools: Notion, Trello, Google Sheets, Slack/Discord operations",
    ],
    goodToHave: [
      "Strong organizational habits, punctuality, and attention to deadlines",
      "Calm demeanor under pressure when unexpected challenges arise during live events",
      "Prior experience helping coordinate school/college events, sports meets, or festivals",
    ],
    beginnerFriendlyNote:
      "You don't need years of managerial credentials! If you are reliable, proactive, and love orchestrating teams to make memorable things happen, you will thrive here.",
    learningOutcomes: [
      "Orchestrating large-scale campus events with hundreds of attendees seamlessly",
      "Developing composure, critical thinking, and rapid problem-solving under real-time event stress",
      "Managing budgets, vendor negotiations, and multi-team resource allocation",
      "Cultivating indispensable interpersonal leadership and organizational project management skills",
    ],
    suitableFor: [
      "Natural leaders and organizers who enjoy turning chaotic plans into structured execution",
      "Problem-solvers who stay calm and proactive when plans need to change on the fly",
      "Students eager to develop enterprise-grade project management and team leadership skills",
    ],
    activities: [
      "Live event simulation drills: resolving mock crises (power outage, Wi-Fi crash, speaker delay)",
      "Run-of-show drafting workshops breaking down 3-day hackathons into 15-minute operational blocks",
      "Behind-the-scenes stage and crowd management coordination during major tech fests",
      "Chapter retrospective meetings celebrating milestones and planning next-semester initiatives",
    ],
  },
];

/**
 * Helper to retrieve explore data by UUID, obfuscated ID, or displayName.
 */
export function getDepartmentExploreData(idOrName) {
  if (!idOrName) return null;
  const target = String(idOrName).trim().toLowerCase();

  return (
    DEPARTMENTS_EXPLORE_DATA.find(
      (dept) =>
        dept.id.toLowerCase() === target ||
        dept.obfuscatedId.toLowerCase() === target ||
        dept.name.toLowerCase() === target ||
        dept.shortName.toLowerCase() === target
    ) || null
  );
}

/**
 * Filter departments by search term and category.
 */
export function searchDepartments(query = "", category = "All") {
  let list = DEPARTMENTS_EXPLORE_DATA;

  if (category && category !== "All") {
    list = list.filter((dept) => dept.category === category);
  }

  if (query && query.trim()) {
    const q = query.trim().toLowerCase();
    list = list.filter((dept) => {
      const matchName = dept.name.toLowerCase().includes(q);
      const matchShortName = dept.shortName.toLowerCase().includes(q);
      const matchTagline = dept.tagline.toLowerCase().includes(q);
      const matchOverview = dept.overview.toLowerCase().includes(q);
      const matchTags = dept.tags.some((tag) => tag.toLowerCase().includes(q));
      const matchSkills = dept.skills.some((skill) => skill.toLowerCase().includes(q));
      const matchWork = dept.workAreas.some(
        (w) => w.title.toLowerCase().includes(q) || w.description.toLowerCase().includes(q)
      );

      return matchName || matchShortName || matchTagline || matchOverview || matchTags || matchSkills || matchWork;
    });
  }

  return list;
}
