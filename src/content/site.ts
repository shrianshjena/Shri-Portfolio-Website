import type { SiteContent } from "./types";

/*
 * Single source of truth for every word on the site.
 * Voice rules: every claim carries a number or names a system; trading-desk
 * register; headlines six words or fewer; backtests always labeled backtests;
 * no em dashes, no exclamation marks.
 */
export const SITE: SiteContent = {
  meta: {
    siteName: "Shriansh Jena",
    title: "Shriansh Jena · Derivatives Trader · Systems Builder",
    description:
      "NIFTY 50 options trader building the research, backtesting and alerting systems behind the trades. Capital markets, fintech and AI-augmented engineering, Mumbai.",
    author: "Shriansh Jena",
    location: "Mumbai, India",
    keywords: [
      "Shriansh Jena",
      "derivatives trader",
      "NIFTY options",
      "options backtesting",
      "capital markets",
      "fintech",
      "fixed income",
      "equity research",
      "AI engineering",
      "Mumbai",
    ],
  },

  nav: {
    ident: "SHRIANSH JENA",
    anchors: [
      { num: "02", label: "POSITION", href: "#position" },
      { num: "03", label: "DESK", href: "#desk" },
      { num: "04", label: "RECORD", href: "#record" },
      { num: "05", label: "WORK", href: "#production" },
      { num: "08", label: "CONTACT", href: "#contact" },
    ],
  },

  hero: {
    eyebrow: "01 · SHRIANSH JENA · MUMBAI, IN",
    headlineLines: ["EDGE IS", "ENGINEERED"],
    sub: "NIFTY options trader building the research, backtesting and alerting systems behind the trades.",
    ctas: [
      { label: "VIEW THE DESK", href: "#desk" },
      { label: "DOWNLOAD CV", href: "/docs/Shriansh_Jena_Resume.pdf", external: true },
    ],
    audioHint: "SOUND AVAILABLE · 03 TRACKS · ARM IN NAV",
    posterAlt: "Interactive 3D robot, idle frame",
  },

  ticker: {
    caption: "STATIC RECORD · FIGURES FROM BACKTESTS AND SHIPPED WORK · NOT A LIVE FEED",
    items: [
      { text: "BACKTEST CAGR +27.24% · 2Y 4M WINDOW", tone: "accent" },
      { text: "ALERT LATENCY 10S ▼ FROM 1 DAY", tone: "amber" },
      { text: "ISINS UNIFIED 200+", tone: "accent" },
      { text: "OFFSHORE CAMPAIGNS 11+ · ONGC / IOCL / JAGSON" },
      { text: "CERT REGISTRY 45+" },
      { text: "TIME TO PUBLISH -60%", tone: "accent" },
      { text: "INSTRUMENTS · NIFTY 50 OPTIONS · IRON CONDOR · SHORT STRADDLE" },
      { text: "COST MODEL · STT + BROKERAGE + SLIPPAGE + STAMP DUTY" },
      { text: "DESK · MUMBAI · IST" },
      { text: "CGPA 8.6/10" },
    ],
  },

  position: {
    num: "02",
    eyebrow: "02 · POSITION: LONG",
    heading: "THE POSITION",
    anchor: "position",
    lead: "Trader first. Engineer because the edge demanded it.",
    paragraphs: [
      "I trade NIFTY 50 index options. Defined-risk selling, iron condors, short straddles, trend-filtered entries. I reached consistent profitability inside my first year, and I got there by refusing to run any idea I could not test.",
      "So I built the test bench. A Python backtesting engine with a full India cost model, STT, brokerage, slippage, stamp duty, fed by Dhan and ICICI Breeze APIs. My multifactor EMA options-selling strategy holds a 27.24% CAGR across a two year, four month backtest.",
      "At Deepsea Finvest, a private wealth desk, that discipline became infrastructure. A bond monitor that screens NSE and Bondbazaar and pushes secured AAA and AA alerts inside ten seconds. A master model turning 200+ ISINs into client deliverables. A catch that kept the desk inside SEBI's algo rules.",
      "I ship through AI-augmented workflows, Claude Code, MCP, agent systems, and I own the architecture and the review. The market keeps score. I like that.",
    ],
  },

  desk: {
    num: "03",
    eyebrow: "03 · PRIVATE BUILDS / DEEPSEA FINVEST",
    heading: "THE DESK",
    anchor: "desk",
    introLine: "Built for a private wealth desk. No public links. The systems run anyway.",
    contextLine: "CONTRACT · DEEPSEA FINVEST · PRIVATE WEALTH · MUMBAI · APR-JUN 2026",
    panels: [
      {
        id: "backtest-engine",
        index: "01",
        title: "BACKTEST ENGINE",
        microcopy: "SYS.01 / PYTHON · DHAN API · ICICI BREEZE",
        body: "A custom backtesting engine for NIFTY 50 options strategies, built from scratch with an India-specific cost model. Every result is net of STT, brokerage, slippage and stamp duty, so the curve shows what a real account would keep.",
        chips: ["STT", "BROKERAGE", "SLIPPAGE", "STAMP DUTY"],
        metrics: [
          { label: "BACKTEST CAGR", value: 27.24, decimals: 2, suffix: "%" },
          { label: "WINDOW", value: 28, suffix: " MONTHS" },
        ],
        status: "PRIVATE · IN PRODUCTION",
      },
      {
        id: "bonds-sentinel",
        index: "02",
        title: "BONDS SENTINEL",
        microcopy: "SYS.02 / NSE + BONDBAZAAR · TELEGRAM · DISCORD",
        body: "A monitor that watches the NSE bond exchange and secondary markets around the clock, screens every listing on yield, coupon structure, zero-coupon status, ISIN and quantity, and pushes qualifying AAA and AA rated secured bonds with full trade detail.",
        diagram: ["NSE + BONDBAZAAR", "SCREEN · YIELD / COUPON / ISIN / QTY", "TELEGRAM / DISCORD"],
        metrics: [{ label: "ALERT LATENCY", value: 10, suffix: "S" }],
        amberDelta: "▼ FROM 1 DAY OF MANUAL SCREENING",
        status: "PRIVATE · IN PRODUCTION",
      },
      {
        id: "master-data-model",
        index: "03",
        title: "MASTER DATA MODEL",
        microcopy: "SYS.03 / OPENPYXL · WEASYPRINT",
        body: "Multiple vendor feeds, one master model. 200+ unique ISINs consolidated into a single workbook that generates client-ready Excel, PDF and HTML deliverables from one source of truth, ending manual cross-source comparison.",
        chips: ["XLSX", "PDF", "HTML"],
        metrics: [{ label: "ISINS UNIFIED", value: 200, suffix: "+" }],
        status: "PRIVATE · IN PRODUCTION",
      },
      {
        id: "compliance-catch",
        index: "04",
        title: "THE COMPLIANCE CATCH",
        microcopy: "RISK.01 / SEBI ALGO FRAMEWORK",
        body: "Ahead of the desk's shift to systematic execution, I identified that every client API key requires its own registered static IP under SEBI's algo-trading rules, and specified the hosting fix before it became a breach. The cheapest trade is the fine you never pay.",
        status: "PREVENTED · PRE-DEPLOYMENT",
      },
    ],
    curve: {
      points: [
        100, 102.1, 99.4, 104.8, 108.2, 106.1, 111.9, 115.4, 113.0, 118.6,
        123.9, 121.2, 127.5, 132.8, 129.6, 136.2, 141.8, 138.9, 146.0, 151.7,
        148.2, 155.9, 162.4, 158.8, 165.3, 170.9, 167.4, 172.8, 175.4,
      ],
      startLabel: "JAN 2024",
      endLabel: "APR 2026",
      description:
        "Normalized backtest equity curve of the multifactor EMA options-selling strategy, indexed to 100, rising to about 175 over 28 months. A backtest, not live performance.",
    },
  },

  record: {
    num: "04",
    eyebrow: "04 · TRACK RECORD / 2024-2026",
    heading: "THE RECORD",
    anchor: "record",
    roles: [
      {
        company: "AL'S & JO'S",
        role: "DIGITAL & E-COMMERCE LEAD · CONTRACT",
        period: "APR 2026 · PRESENT",
        line: "Translating an established offline home decor retailer into an online storefront.",
        bullets: [
          "Cut time-to-publish for new catalogue items by about 60% by structuring the WooCommerce content model and standardising listing templates across 4 to 6 categories.",
          "Automating catalogue updates through a custom Model Context Protocol integration against the WordPress API.",
        ],
        link: { label: "ALSANDJOS.COM", href: "https://alsandjos.com", external: true },
      },
      {
        company: "DEEPSEA FINVEST",
        role: "DEVELOPER · AUTOMATED SYSTEMS & AI WORKFLOWS · CONTRACT",
        period: "APR 2026 · JUN 2026",
        line: "Private wealth desk, Mumbai. Bond monitoring, backtesting and deliverable pipelines.",
        bullets: [
          "Moved a fixed-income operation from manual screening and hand-assembled documents to automated monitoring and repeatable deliverable production.",
        ],
        crossRef: "SYSTEMS → CH.03",
      },
      {
        company: "SOLAS MODU",
        role: "ASSOCIATE ANALYST · BUSINESS & OPERATIONS",
        period: "JUN 2024 · MAR 2026",
        line: "Marine and offshore consultancy serving ONGC, Reliance, Indian Oil and Mazagon Dock.",
        bullets: [
          "Led the full redesign and rebuild of the corporate website, giving each of 6 service divisions a dedicated page.",
          "Structured a decade of offshore history into an operations log covering 11+ campaigns for ONGC, IOCL and Jagson, 2013 through contracts running to 2029.",
          "Built a certificates and approvals registry covering 45+ certificates and 16 class society and client relationships.",
          "Replaced manual performance compilation with interactive KPI dashboards across 3 strategic initiatives.",
        ],
        link: { label: "SOLASMODU.IN", href: "https://solasmodu.in", external: true },
      },
      {
        company: "WOODSMAN",
        role: "DATA ANALYTICS INTERN",
        period: "MAR 2024 · MAY 2024",
        line: "Revenue, subscription and product reporting across 2 departments; customer segmentation for targeted marketing.",
        bullets: [],
      },
    ],
    photoBand: {
      src: "/images/field-record.jpg",
      alt: "Shriansh Jena in offshore gear on a vessel deck at sea",
      caption: "FIELD RECORD · MODU CAMPAIGN · OFFSHORE INDIA",
    },
  },

  production: {
    num: "05",
    eyebrow: "05 · PUBLIC DEPLOYMENTS / 04 LIVE",
    heading: "IN PRODUCTION",
    anchor: "production",
    platforms: [
      {
        title: "BRAHMOS CAPITAL",
        tagline: "25 DEFENCE STOCKS · AI ANALYST · GEOPOLITICAL RISK",
        description:
          "Equity research platform tracking 25 listed Indian defence stocks with live pricing, analyst target consensus, an AI conversational analyst and a geopolitical risk tracker mapping events to portfolio impact.",
        url: "https://brahmos-capital.vercel.app",
        image: "/images/projects/project-brahmos.png",
        status: "LIVE",
      },
      {
        title: "OPTIONS ACADEMY",
        tagline: "INR PAYOFF CALCULATORS · DERIVATIVES EDUCATION",
        description:
          "Interactive platform simplifying derivatives for beginner and intermediate traders. Calls, puts and buy-versus-sell mechanics through worked Indian-market examples and interactive payoff calculators.",
        url: "https://options-academy.vercel.app",
        image: "/images/projects/project-options-academy.png",
        status: "LIVE",
      },
      {
        title: "MARKET SENTINEL",
        tagline: "AI EQUITY RESEARCH · 0-100 SCORING",
        description:
          "AI-powered equity research with real-time NSE data and a proprietary 0 to 100 scoring algorithm across Indian equities.",
        url: "https://marketsentinel-gamma.vercel.app",
        image: "/images/projects/project-market-sentinel.png",
        status: "LIVE",
      },
      {
        title: "CARLTSOLAS",
        tagline: "MARINE TECHNOLOGY VENTURE",
        description:
          "Technology venture delivering modern software and AI-integrated solutions to the marine and maritime industry, with expansion into fintech. Designed and shipped the production launch platform.",
        url: "https://carltsolas.com",
        image: "/images/projects/project-carltsolas.png",
        status: "LIVE",
      },
    ],
    archiveLabel: "ARCHIVE · ANALYTICS & RESEARCH",
    archive: [
      {
        title: "UBER RIDE FREQUENCY & DEMAND",
        meta: "POWER BI · 30% EVENING SURGE · FLEET +25%",
        url: "https://app.powerbi.com/view?r=eyJrIjoiN2YzNzhiMGYtNTA3OS00NzM3LWIxNzktMjVlOGQzZDc2YWJhIiwidCI6IjQ4NTVhOGE2LThkMWMtNDFkMS04M2I4LWQ4MjYwYjBjMmU4ZCJ9",
        image: "/images/projects/project-uber.png",
      },
      {
        title: "ZOMATO ENGAGEMENT & PERFORMANCE",
        meta: "POWER BI · 125,000+ RECORDS · CITY-WISE",
        url: "https://app.powerbi.com/view?r=eyJrIjoiNTZhNjYzYzUtZjRlZi00YmQyLTk2MTEtY2VmZWYxOTAxMDMwIiwidCI6IjQ4NTVhOGE2LThkMWMtNDFkMS04M2I4LWQ4MjYwYjBjMmU4ZCJ9",
        image: "/images/projects/project-zomato.png",
      },
      {
        title: "NIKE JORDAN VISUAL EXPERIENCE",
        meta: "POWER BI · VISUAL STORYTELLING DASHBOARD",
        url: "https://app.powerbi.com/view?r=eyJrIjoiMjhkZTEwYjgtYzczNC00ZDlkLWIwN2YtYmJmYzNjM2I1ZjcyIiwidCI6IjQ4NTVhOGE2LThkMWMtNDFkMS04M2I4LWQ4MjYwYjBjMmU4ZCJ9",
        image: "/images/projects/project-nike.png",
      },
      {
        title: "EARLY SEPSIS PREDICTION",
        meta: "LSTM · 82.15% ACCURACY · 10-FOLD CV",
        image: "/images/projects/project-sepsis.png",
      },
    ],
  },

  loop: {
    num: "06",
    eyebrow: "06 · OPERATING SYSTEM / HUMAN + MACHINE",
    heading: "THE LOOP",
    anchor: "loop",
    intro:
      "AI-augmented delivery with human-owned judgement. Agents compress the build; architecture, review and validation never leave my hands.",
    detents: [
      { label: "RESEARCH", description: "Markets first. Filings, flows and the questions a desk actually asks." },
      { label: "BUILD", description: "Claude Code, MCP integrations, agent skills, harnesses and swarms." },
      { label: "BACKTEST", description: "No idea ships without surviving the full India cost model." },
      { label: "DEPLOY", description: "Production systems on broker APIs, alert channels and Vercel." },
      { label: "REVIEW", description: "Architecture, code and output validated by hand, every stage." },
    ],
    skills: [
      {
        category: "DATA & BI",
        items: ["SQL", "PYTHON · PANDAS · NUMPY", "ADVANCED EXCEL", "POWER BI", "TABLEAU", "KPI DESIGN", "EDA"],
      },
      {
        category: "FINANCIAL MARKETS",
        items: [
          "INDEX OPTIONS",
          "STRATEGY DESIGN",
          "BACKTESTING",
          "EQUITY RESEARCH",
          "FIXED INCOME",
          "YIELD & CREDIT ANALYSIS",
          "FINANCIAL MODELLING",
        ],
      },
      {
        category: "ENGINEERING & AUTOMATION",
        items: [
          "PYTHON",
          "BROKER APIS · DHAN · ICICI BREEZE",
          "OPENPYXL · WEASYPRINT",
          "TELEGRAM & DISCORD BOTS",
          "WORDPRESS · WOOCOMMERCE",
          "AUTOMATION SCRIPTING",
        ],
      },
      {
        category: "AI ENGINEERING",
        items: [
          "CLAUDE CODE",
          "MODEL CONTEXT PROTOCOL",
          "AGENTIC SKILLS",
          "AGENT HARNESS",
          "AGENT SWARM",
          "PROMPT ENGINEERING",
        ],
      },
    ],
  },

  foundations: {
    num: "07",
    eyebrow: "07 · EDUCATION + CERTIFICATIONS",
    heading: "FOUNDATIONS",
    anchor: "foundations",
    education: [
      {
        institution: "FR. AGNEL, BANDRA",
        credential: "B.E. ARTIFICIAL INTELLIGENCE & DATA SCIENCE",
        detail: "8.6 CGPA",
        period: "2020 · 2024",
      },
      {
        institution: "RAJHANS VIDYALAYA",
        credential: "GRADE XII · CBSE",
        detail: "85%",
        period: "2020",
      },
      {
        institution: "R.N. PODAR SCHOOL",
        credential: "GRADE X · CBSE",
        detail: "95%",
        period: "2018",
      },
    ],
    certifications: [
      {
        title: "GOOGLE DATA ANALYTICS PROFESSIONAL",
        issuer: "GOOGLE",
        url: "https://coursera.org/share/78db8e4f8d3c7032b542be5f918e7f30",
        image: "/images/certs/cert-google-data-analytics.png",
      },
      {
        title: "AWS FUNDAMENTALS",
        issuer: "AMAZON WEB SERVICES",
        url: "https://coursera.org/share/5c8ea127d6aa3c38803ae1647f415dfb",
        image: "/images/certs/cert-aws.png",
      },
      {
        title: "DATA ANALYSIS & VISUALIZATION WITH POWER BI",
        issuer: "MICROSOFT",
        url: "https://coursera.org/share/8c499acd4a0d45dca915dd4b22a42721",
        image: "/images/certs/cert-power-bi.png",
      },
      {
        title: "PROGRAMMING IN PYTHON",
        issuer: "META",
        url: "https://coursera.org/share/7d14160ccc105fe44c37874948bd6f59",
        image: "/images/certs/cert-python.png",
      },
      {
        title: "INTRODUCTION TO STATISTICS",
        issuer: "STANFORD UNIVERSITY",
        url: "https://coursera.org/share/ecffa9eb5ec25322207a0e7250757444",
        image: "/images/certs/cert-statistics.png",
      },
      {
        title: "PREPARING DATA FOR ANALYSIS WITH EXCEL",
        issuer: "MICROSOFT",
        url: "https://coursera.org/share/07f9a3db70c51bc57e533e252d9f044e",
        image: "/images/certs/cert-excel.png",
      },
    ],
  },

  contact: {
    num: "08",
    eyebrow: "08 · CONTACT / THE CLOSE",
    heading: "THE MARKET IS OPEN",
    anchor: "contact",
    lead: "Building in capital markets or fintech, or running a financial operation that still moves by hand. Either way, let's talk.",
    email: "shriansh.jena05@gmail.com",
    phone: "+919372040230",
    phoneDisplay: "+91 93720 40230",
    ctaLabel: "GET IN TOUCH",
    form: {
      nameLabel: "FULL NAME",
      emailLabel: "EMAIL ADDRESS",
      messageLabel: "MESSAGE",
      submitLabel: "SEND MESSAGE",
      submittingLabel: "SENDING...",
      successTitle: "MESSAGE RECEIVED.",
      successBody: "I will reach out shortly.",
      errorBody: "Something went wrong. Email me directly instead.",
    },
  },

  footer: {
    channels: [
      { label: "GITHUB / SHRIANSHJENA", href: "https://github.com/shrianshjena", external: true },
      { label: "LINKEDIN / SHRIANSHJENA", href: "https://www.linkedin.com/in/shrianshjena", external: true },
      { label: "+91 93720 40230", href: "tel:+919372040230" },
      { label: "DOWNLOAD CV", href: "/docs/Shriansh_Jena_Resume.pdf", external: true },
    ],
    telemetry: ["DESK · MUMBAI, IN", "NEXT.JS · GSAP · LENIS · SPLINE", "GENERAL SANS + JETBRAINS MONO"],
    signoff: "YOU VS YOU · EVERY SESSION",
    copyright: "© 2026 SHRIANSH JENA",
  },

  audio: [
    { src: "/audio/stronger.mp3", title: "STRONGER" },
    { src: "/audio/calling.mp3", title: "CALLING" },
    { src: "/audio/pray-for-me.mp3", title: "PRAY FOR ME" },
  ],

  socials: [
    { label: "GITHUB", href: "https://github.com/shrianshjena", external: true },
    { label: "LINKEDIN", href: "https://www.linkedin.com/in/shrianshjena", external: true },
  ],

  resumeHref: "/docs/Shriansh_Jena_Resume.pdf",
} as const;
