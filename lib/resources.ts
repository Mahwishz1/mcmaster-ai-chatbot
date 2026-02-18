export type StartupStage = "idea" | "early" | "growth" | "scaling"
export type SupportType = "funding" | "mentorship" | "workspace" | "networking" | "education"
export type UserType = "student" | "alumni"
export type ResourceCategory =
  | "workshop"
  | "funding"
  | "community-event"
  | "pitch-competition"
  | "program"
  | "workspace"

export interface Resource {
  name: string
  description: string
  url: string
  category: ResourceCategory
  tags: {
    stages: StartupStage[]
    support: SupportType[]
    eligibility: UserType[]
  }
}

export const CATEGORY_META: Record<
  ResourceCategory,
  { label: string; color: string }
> = {
  workshop: { label: "Workshop", color: "bg-blue-100 text-blue-800" },
  funding: { label: "Funding Opportunity", color: "bg-emerald-100 text-emerald-800" },
  "community-event": { label: "Community Event", color: "bg-amber-100 text-amber-800" },
  "pitch-competition": { label: "Pitch Competition", color: "bg-rose-100 text-rose-800" },
  program: { label: "Program", color: "bg-indigo-100 text-indigo-800" },
  workspace: { label: "Workspace", color: "bg-teal-100 text-teal-800" },
}

export const STARTUP_STAGES: {
  value: StartupStage
  label: string
  description: string
}[] = [
  {
    value: "idea",
    label: "Idea Stage",
    description: "I have a concept but haven't started building yet",
  },
  {
    value: "early",
    label: "Early Stage",
    description: "I'm building an MVP or early prototype",
  },
  {
    value: "growth",
    label: "Growth Stage",
    description: "I have customers and am looking to grow",
  },
  {
    value: "scaling",
    label: "Scaling",
    description: "I'm ready to scale operations and raise capital",
  },
]

export const SUPPORT_TYPES: {
  value: SupportType
  label: string
  description: string
}[] = [
  {
    value: "funding",
    label: "Funding",
    description: "Grants, pitch competitions, and investment",
  },
  {
    value: "mentorship",
    label: "Mentorship",
    description: "1-on-1 guidance from experienced founders",
  },
  {
    value: "workspace",
    label: "Workspace",
    description: "Co-working spaces and labs",
  },
  {
    value: "networking",
    label: "Networking",
    description: "Events, communities, and connections",
  },
  {
    value: "education",
    label: "Education",
    description: "Courses, workshops, and training programs",
  },
]

export const USER_TYPES: { value: UserType; label: string }[] = [
  { value: "student", label: "Current Student" },
  { value: "alumni", label: "Alumni" },
]

// ---------------------------------------------------------------------------
// Predefined resource database
// Includes workshops, funding opportunities, community events, pitch
// competitions, programs, and workspaces tied to McMaster's ecosystem.
// ---------------------------------------------------------------------------

export const RESOURCES: Resource[] = [
  // ── Workshops ──────────────────────────────────────────────────────────
  {
    name: "Lean Startup Bootcamp",
    description:
      "A two-day intensive workshop at The Forge covering lean canvas, customer discovery interviews, and MVP planning with hands-on exercises.",
    url: "https://theforge.mcmaster.ca",
    category: "workshop",
    tags: {
      stages: ["idea", "early"],
      support: ["education"],
      eligibility: ["student"],
    },
  },
  {
    name: "Pitch Perfect Workshop",
    description:
      "Weekly sessions focused on crafting your investor pitch. Get live feedback from entrepreneurs-in-residence and refine your storytelling.",
    url: "https://theforge.mcmaster.ca",
    category: "workshop",
    tags: {
      stages: ["idea", "early", "growth"],
      support: ["education", "mentorship"],
      eligibility: ["student", "alumni"],
    },
  },
  {
    name: "Financial Modelling for Founders",
    description:
      "A hands-on workshop run by DeGroote faculty covering revenue forecasting, unit economics, and building investor-ready financial models.",
    url: "https://degroote.mcmaster.ca",
    category: "workshop",
    tags: {
      stages: ["early", "growth", "scaling"],
      support: ["education"],
      eligibility: ["student", "alumni"],
    },
  },
  {
    name: "Design Thinking Sprint",
    description:
      "A three-hour workshop applying Stanford's design thinking framework to validate your startup idea through rapid prototyping and user testing.",
    url: "https://theforge.mcmaster.ca",
    category: "workshop",
    tags: {
      stages: ["idea"],
      support: ["education"],
      eligibility: ["student"],
    },
  },
  {
    name: "IP & Patents 101",
    description:
      "Workshop by McMaster's Industry Liaison Office covering intellectual property basics, patent strategy, and protecting your innovations.",
    url: "https://research.mcmaster.ca/industry-and-investors",
    category: "workshop",
    tags: {
      stages: ["early", "growth"],
      support: ["education"],
      eligibility: ["student", "alumni"],
    },
  },
  {
    name: "Growth Marketing Masterclass",
    description:
      "Alumni-led workshop series covering SEO, paid acquisition, content marketing, and analytics dashboards for scaling startups.",
    url: "https://alumni.mcmaster.ca",
    category: "workshop",
    tags: {
      stages: ["growth", "scaling"],
      support: ["education"],
      eligibility: ["alumni"],
    },
  },

  // ── Funding Opportunities ─────────────────────────────────────────────
  {
    name: "Forge Startup Fund",
    description:
      "Up to $25,000 in non-dilutive seed funding for McMaster student startups that have completed The Forge's incubation program.",
    url: "https://theforge.mcmaster.ca",
    category: "funding",
    tags: {
      stages: ["early", "growth"],
      support: ["funding"],
      eligibility: ["student"],
    },
  },
  {
    name: "Ontario Centre of Innovation Grant",
    description:
      "Provincial grants of $50K-$500K supporting innovative startups with matching funds for R&D projects and industry partnerships.",
    url: "https://www.oc-innovation.ca",
    category: "funding",
    tags: {
      stages: ["growth", "scaling"],
      support: ["funding"],
      eligibility: ["student", "alumni"],
    },
  },
  {
    name: "McMaster Social Impact Grant",
    description:
      "A $10,000 grant for student-led ventures solving social or environmental challenges in the Hamilton community.",
    url: "https://theforge.mcmaster.ca",
    category: "funding",
    tags: {
      stages: ["idea", "early"],
      support: ["funding"],
      eligibility: ["student"],
    },
  },
  {
    name: "Hamilton Angels Investment Network",
    description:
      "Angel investment group with McMaster alumni connections offering $50K-$250K investments in early-to-growth stage tech startups.",
    url: "https://innovationfactory.ca",
    category: "funding",
    tags: {
      stages: ["growth", "scaling"],
      support: ["funding", "networking"],
      eligibility: ["student", "alumni"],
    },
  },
  {
    name: "NSERC I2I Grant",
    description:
      "Federal Idea to Innovation grant supporting the development of university research with commercial potential, up to $350K.",
    url: "https://www.nserc-crsng.gc.ca",
    category: "funding",
    tags: {
      stages: ["early", "growth"],
      support: ["funding"],
      eligibility: ["student", "alumni"],
    },
  },
  {
    name: "DeGroote Alumni Venture Fund",
    description:
      "A $2M fund managed by DeGroote alumni providing convertible notes between $25K-$100K for McMaster-connected startups.",
    url: "https://degroote.mcmaster.ca",
    category: "funding",
    tags: {
      stages: ["early", "growth", "scaling"],
      support: ["funding", "mentorship"],
      eligibility: ["alumni"],
    },
  },

  // ── Pitch Competitions ────────────────────────────────────────────────
  {
    name: "McMaster Startup Pitch Competition",
    description:
      "Annual campus-wide competition with $25,000 in prizes. Open to all McMaster students with a validated business concept.",
    url: "https://theforge.mcmaster.ca",
    category: "pitch-competition",
    tags: {
      stages: ["idea", "early"],
      support: ["funding", "networking"],
      eligibility: ["student"],
    },
  },
  {
    name: "Synapse Life Science Competition",
    description:
      "National life sciences case competition hosted at McMaster. Win up to $15,000 and gain exposure to biotech investors.",
    url: "https://www.synapseconsortium.com",
    category: "pitch-competition",
    tags: {
      stages: ["idea", "early"],
      support: ["funding", "networking", "education"],
      eligibility: ["student"],
    },
  },
  {
    name: "Innovation Factory Demo Day",
    description:
      "Quarterly demo day where cohort startups pitch to a panel of investors and industry leaders in downtown Hamilton.",
    url: "https://innovationfactory.ca",
    category: "pitch-competition",
    tags: {
      stages: ["early", "growth"],
      support: ["funding", "networking"],
      eligibility: ["student", "alumni"],
    },
  },
  {
    name: "Hatch Pitch Night",
    description:
      "Monthly evening pitch event at The Forge where three startups present to peers, mentors, and a live audience Q&A.",
    url: "https://theforge.mcmaster.ca",
    category: "pitch-competition",
    tags: {
      stages: ["idea", "early", "growth"],
      support: ["networking", "mentorship"],
      eligibility: ["student"],
    },
  },
  {
    name: "Great Lakes Startup Showdown",
    description:
      "Regional multi-university competition with $50K grand prize. McMaster sends its top two teams to compete annually.",
    url: "https://theforge.mcmaster.ca",
    category: "pitch-competition",
    tags: {
      stages: ["early", "growth"],
      support: ["funding", "networking"],
      eligibility: ["student", "alumni"],
    },
  },

  // ── Community Events ──────────────────────────────────────────────────
  {
    name: "Founder Fireside Chats",
    description:
      "Monthly speaker series featuring successful McMaster alumni founders sharing candid stories and lessons learned over coffee.",
    url: "https://theforge.mcmaster.ca",
    category: "community-event",
    tags: {
      stages: ["idea", "early", "growth", "scaling"],
      support: ["networking", "mentorship"],
      eligibility: ["student", "alumni"],
    },
  },
  {
    name: "McMaster Startup Mixer",
    description:
      "Semester kickoff networking event connecting aspiring founders, mentors, investors, and campus partners at MUSC.",
    url: "https://theforge.mcmaster.ca",
    category: "community-event",
    tags: {
      stages: ["idea", "early", "growth"],
      support: ["networking"],
      eligibility: ["student"],
    },
  },
  {
    name: "Hamilton Innovation Week",
    description:
      "Week-long citywide festival of panels, workshops, and networking. McMaster hosts dedicated sessions on campus ventures.",
    url: "https://innovationfactory.ca",
    category: "community-event",
    tags: {
      stages: ["idea", "early", "growth", "scaling"],
      support: ["networking", "education"],
      eligibility: ["student", "alumni"],
    },
  },
  {
    name: "Alumni Entrepreneur Summit",
    description:
      "Annual two-day summit for McMaster alumni entrepreneurs featuring keynotes, breakout sessions, and a curated networking dinner.",
    url: "https://alumni.mcmaster.ca",
    category: "community-event",
    tags: {
      stages: ["growth", "scaling"],
      support: ["networking", "mentorship"],
      eligibility: ["alumni"],
    },
  },
  {
    name: "Women in Startups Breakfast",
    description:
      "Quarterly breakfast series spotlighting women founders in the McMaster community with panel discussions and mentoring circles.",
    url: "https://theforge.mcmaster.ca",
    category: "community-event",
    tags: {
      stages: ["idea", "early", "growth"],
      support: ["networking", "mentorship"],
      eligibility: ["student", "alumni"],
    },
  },
  {
    name: "Tech Meetup Hamilton",
    description:
      "Bi-weekly casual meetup for Hamilton and McMaster tech builders. Lightning talks, demos, and open networking at The Forge.",
    url: "https://theforge.mcmaster.ca",
    category: "community-event",
    tags: {
      stages: ["idea", "early"],
      support: ["networking"],
      eligibility: ["student", "alumni"],
    },
  },

  // ── Programs ──────────────────────────────────────────────────────────
  {
    name: "The Forge Incubator",
    description:
      "McMaster's flagship 16-week incubation program with mentorship, workspace, weekly check-ins, and up to $25K in follow-on funding.",
    url: "https://theforge.mcmaster.ca",
    category: "program",
    tags: {
      stages: ["idea", "early", "growth"],
      support: ["mentorship", "workspace", "education", "funding"],
      eligibility: ["student", "alumni"],
    },
  },
  {
    name: "Innovation Factory Accelerator",
    description:
      "Hamilton's six-month accelerator with business coaching, investor introductions, and market-readiness training for growth-stage ventures.",
    url: "https://innovationfactory.ca",
    category: "program",
    tags: {
      stages: ["early", "growth", "scaling"],
      support: ["mentorship", "funding", "networking"],
      eligibility: ["student", "alumni"],
    },
  },
  {
    name: "Engineering Entrepreneurship Certificate",
    description:
      "A for-credit certificate covering lean startup methodology, design thinking, and business model validation for engineering students.",
    url: "https://www.eng.mcmaster.ca",
    category: "program",
    tags: {
      stages: ["idea", "early"],
      support: ["education"],
      eligibility: ["student"],
    },
  },
  {
    name: "DeGroote EMBA Entrepreneurship Stream",
    description:
      "Executive MBA stream focused on venture development with expert faculty, real case work, and peer networks of seasoned professionals.",
    url: "https://emba.degroote.mcmaster.ca",
    category: "program",
    tags: {
      stages: ["growth", "scaling"],
      support: ["education", "networking", "mentorship"],
      eligibility: ["alumni"],
    },
  },
  {
    name: "McMaster Venture Mentoring Service",
    description:
      "Volunteer-driven mentoring program pairing entrepreneurs with panels of experienced business leaders for ongoing one-on-one guidance.",
    url: "https://theforge.mcmaster.ca",
    category: "program",
    tags: {
      stages: ["idea", "early", "growth"],
      support: ["mentorship"],
      eligibility: ["student", "alumni"],
    },
  },
  {
    name: "MILO Commercialization Program",
    description:
      "McMaster Industry Liaison Office program that helps researchers bring innovations to market through IP strategy, licensing, and partnerships.",
    url: "https://research.mcmaster.ca/industry-and-investors",
    category: "program",
    tags: {
      stages: ["early", "growth", "scaling"],
      support: ["mentorship", "funding"],
      eligibility: ["student", "alumni"],
    },
  },

  // ── Workspaces ────────────────────────────────────────────────────────
  {
    name: "The Forge Co-Working Space",
    description:
      "Free hot-desking and dedicated desks at McMaster's campus incubator with high-speed internet, printers, and meeting rooms.",
    url: "https://theforge.mcmaster.ca",
    category: "workspace",
    tags: {
      stages: ["idea", "early", "growth"],
      support: ["workspace"],
      eligibility: ["student"],
    },
  },
  {
    name: "Hamilton Hive Co-Working",
    description:
      "Affordable downtown co-working space with day passes, private offices, meeting rooms, and a vibrant startup community.",
    url: "https://innovationfactory.ca",
    category: "workspace",
    tags: {
      stages: ["idea", "early", "growth", "scaling"],
      support: ["workspace", "networking"],
      eligibility: ["student", "alumni"],
    },
  },
  {
    name: "McMaster Innovation Park Labs",
    description:
      "Wet-lab and dry-lab space for science and engineering startups at McMaster Innovation Park, with shared equipment access.",
    url: "https://mcmaster.ca",
    category: "workspace",
    tags: {
      stages: ["early", "growth"],
      support: ["workspace"],
      eligibility: ["student", "alumni"],
    },
  },
]

export function getRecommendations(
  stage: StartupStage,
  support: SupportType,
  userType: UserType
): Resource[] {
  return RESOURCES.filter(
    (r) =>
      r.tags.stages.includes(stage) &&
      r.tags.support.includes(support) &&
      r.tags.eligibility.includes(userType)
  ).sort((a, b) => {
    // Sort by relevance: more matching support tags first
    const aScore = a.tags.support.filter((s) => s === support).length
    const bScore = b.tags.support.filter((s) => s === support).length
    return bScore - aScore
  })
}
