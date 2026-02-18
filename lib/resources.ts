export type StartupStage = "idea" | "early" | "growth" | "scaling"
export type SupportType = "funding" | "mentorship" | "workspace" | "networking" | "education"
export type UserType = "student" | "alumni"

export interface Resource {
  name: string
  description: string
  url: string
  tags: {
    stages: StartupStage[]
    support: SupportType[]
    eligibility: UserType[]
  }
}

export const STARTUP_STAGES: { value: StartupStage; label: string; description: string }[] = [
  { value: "idea", label: "Idea Stage", description: "I have a concept but haven't started building yet" },
  { value: "early", label: "Early Stage", description: "I'm building an MVP or early prototype" },
  { value: "growth", label: "Growth Stage", description: "I have customers and am looking to grow" },
  { value: "scaling", label: "Scaling", description: "I'm ready to scale operations and raise capital" },
]

export const SUPPORT_TYPES: { value: SupportType; label: string; description: string }[] = [
  { value: "funding", label: "Funding", description: "Grants, pitch competitions, and investment" },
  { value: "mentorship", label: "Mentorship", description: "1-on-1 guidance from experienced founders" },
  { value: "workspace", label: "Workspace", description: "Co-working spaces and labs" },
  { value: "networking", label: "Networking", description: "Events, communities, and connections" },
  { value: "education", label: "Education", description: "Courses, workshops, and training programs" },
]

export const USER_TYPES: { value: UserType; label: string }[] = [
  { value: "student", label: "Current Student" },
  { value: "alumni", label: "Alumni" },
]

export const RESOURCES: Resource[] = [
  {
    name: "The Forge",
    description:
      "McMaster's startup incubator offering mentorship, workspace, and programming to help early-stage startups launch and grow.",
    url: "https://theforge.mcmaster.ca",
    tags: {
      stages: ["idea", "early", "growth"],
      support: ["mentorship", "workspace", "networking", "education"],
      eligibility: ["student", "alumni"],
    },
  },
  {
    name: "McMaster Industry Liaison Office (MILO)",
    description:
      "Helps researchers and entrepreneurs commercialize innovations with IP guidance, licensing support, and industry partnerships.",
    url: "https://research.mcmaster.ca/industry-and-investors",
    tags: {
      stages: ["early", "growth", "scaling"],
      support: ["mentorship", "funding", "networking"],
      eligibility: ["student", "alumni"],
    },
  },
  {
    name: "Startup Pitch Competition",
    description:
      "Annual pitch competition for McMaster students with cash prizes up to $25,000 and exposure to local investors.",
    url: "https://theforge.mcmaster.ca",
    tags: {
      stages: ["idea", "early"],
      support: ["funding", "networking"],
      eligibility: ["student"],
    },
  },
  {
    name: "McMaster Engineering Entrepreneurship Program",
    description:
      "A certificate program in entrepreneurship for engineering students covering lean startup methodology, design thinking, and business model validation.",
    url: "https://www.eng.mcmaster.ca",
    tags: {
      stages: ["idea", "early"],
      support: ["education"],
      eligibility: ["student"],
    },
  },
  {
    name: "Innovation Factory",
    description:
      "Hamilton's regional innovation centre offering business advisory services, mentoring, and connections to funding.",
    url: "https://innovationfactory.ca",
    tags: {
      stages: ["early", "growth", "scaling"],
      support: ["mentorship", "funding", "networking"],
      eligibility: ["student", "alumni"],
    },
  },
  {
    name: "McMaster Alumni Network",
    description:
      "A network of 200,000+ alumni worldwide offering mentoring, connections, and collaboration opportunities for entrepreneur graduates.",
    url: "https://alumni.mcmaster.ca",
    tags: {
      stages: ["idea", "early", "growth", "scaling"],
      support: ["networking", "mentorship"],
      eligibility: ["alumni"],
    },
  },
  {
    name: "Synapse Life Science Competition",
    description:
      "A prestigious national life sciences business case competition hosted at McMaster, providing funding and industry exposure.",
    url: "https://www.synapseconsortium.com",
    tags: {
      stages: ["idea", "early"],
      support: ["funding", "networking", "education"],
      eligibility: ["student"],
    },
  },
  {
    name: "McMaster DeGroote EMBA Entrepreneurship Stream",
    description:
      "Executive MBA stream focused on entrepreneurship with real venture development, expert faculty, and peer networks.",
    url: "https://emba.degroote.mcmaster.ca",
    tags: {
      stages: ["growth", "scaling"],
      support: ["education", "networking", "mentorship"],
      eligibility: ["alumni"],
    },
  },
  {
    name: "Hamilton Hive Co-working",
    description:
      "Affordable co-working space in downtown Hamilton with high-speed internet, meeting rooms, and a collaborative community.",
    url: "https://innovationfactory.ca",
    tags: {
      stages: ["idea", "early", "growth"],
      support: ["workspace", "networking"],
      eligibility: ["student", "alumni"],
    },
  },
  {
    name: "Ontario Centres of Excellence (OCE) Grants",
    description:
      "Provincial grants supporting innovative startups with matching funds for R&D projects and industry partnerships.",
    url: "https://www.oc-innovation.ca",
    tags: {
      stages: ["early", "growth", "scaling"],
      support: ["funding"],
      eligibility: ["student", "alumni"],
    },
  },
  {
    name: "McMaster Venture Mentoring Service",
    description:
      "Volunteer-driven mentoring service connecting entrepreneurs with experienced business leaders for ongoing guidance.",
    url: "https://theforge.mcmaster.ca",
    tags: {
      stages: ["idea", "early", "growth"],
      support: ["mentorship"],
      eligibility: ["student", "alumni"],
    },
  },
  {
    name: "Lean Startup Workshop Series",
    description:
      "Free monthly workshops at The Forge covering lean canvas, customer discovery, MVPs, and go-to-market strategies.",
    url: "https://theforge.mcmaster.ca",
    tags: {
      stages: ["idea", "early"],
      support: ["education"],
      eligibility: ["student"],
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
  )
}
