// ---------------------------------------------------------------------------
// McMaster Entrepreneur Resource Database
// Categories: Workshop, Funding, Event, Pitch
// ---------------------------------------------------------------------------

export type StartupStage = "idea" | "early-stage" | "scaling"
export type SupportType = "workshop" | "funding" | "event" | "pitch" | "mentorship"
export type UserType = "student" | "alumni"

export interface Resource {
  name: string
  category: SupportType
  stage: string // "Idea" | "Early-stage" | "Scaling" | "All"
  audience: string // "Students" | "Alumni" | "Students & Alumni"
  description: string
  link: string
  deadline: string
}

export const CATEGORY_META: Record<
  SupportType,
  { label: string; color: string; icon: string }
> = {
  workshop: {
    label: "Workshop",
    color: "bg-blue-100 text-blue-800",
    icon: "book",
  },
  funding: {
    label: "Funding",
    color: "bg-emerald-100 text-emerald-800",
    icon: "dollar",
  },
  event: {
    label: "Community Event",
    color: "bg-amber-100 text-amber-800",
    icon: "users",
  },
  pitch: {
    label: "Pitch Competition",
    color: "bg-rose-100 text-rose-800",
    icon: "mic",
  },
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
    value: "early-stage",
    label: "Early Stage",
    description: "I'm building an MVP or early prototype",
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
    value: "workshop",
    label: "Workshops",
    description: "Skill-building sessions and hands-on training",
  },
  {
    value: "funding",
    label: "Funding",
    description: "Grants, seed funding, and investment opportunities",
  },
  {
    value: "event",
    label: "Community Events",
    description: "Networking mixers, meetups, and conferences",
  },
  {
    value: "pitch",
    label: "Pitch Competitions",
    description: "Present your startup to judges for prizes and feedback",
  },
]

export const USER_TYPES: { value: UserType; label: string }[] = [
  { value: "student", label: "Current Student" },
  { value: "alumni", label: "Alumni" },
]

// ---------------------------------------------------------------------------
// Predefined resource data (provided by user)
// ---------------------------------------------------------------------------

export const RESOURCES: Resource[] = [
  {
    name: "McMaster Innovation Park Workshops",
    category: "workshop",
    stage: "Idea",
    audience: "Students",
    description:
      "Skill-building sessions for early-stage student founders.",
    link: "https://www.mcmasterinnovationpark.ca/workshops",
    deadline: "Monthly",
  },
  {
    name: "Student Startup Pitch Competition",
    category: "pitch",
    stage: "Early-stage",
    audience: "Students",
    description:
      "Pitch your startup idea to judges and mentors for feedback and prizes.",
    link: "https://www.mcmasterentrepreneurs.ca/pitch",
    deadline: "April 30, 2026",
  },
  {
    name: "Entrepreneurship Funding Info Session",
    category: "funding",
    stage: "Early-stage",
    audience: "Students & Alumni",
    description:
      "Learn about grants, seed funding, and funding opportunities for startups.",
    link: "https://www.mcmaster.ca/funding-info",
    deadline: "Ongoing",
  },
  {
    name: "McMaster Startup Networking Night",
    category: "event",
    stage: "All",
    audience: "Students & Alumni",
    description:
      "Monthly networking event connecting entrepreneurs with mentors and peers.",
    link: "https://www.mcmaster.ca/networking-night",
    deadline: "Monthly",
  },
  {
    name: "Advanced Pitch Workshop",
    category: "workshop",
    stage: "Early-stage",
    audience: "Students & Alumni",
    description:
      "Learn advanced pitching techniques and storytelling for investors.",
    link: "https://www.mcmaster.ca/advanced-pitch",
    deadline: "May 15, 2026",
  },
  {
    name: "Student Incubator Program",
    category: "funding",
    stage: "Idea",
    audience: "Students",
    description:
      "Access mentorship, workspace, and small funding for your idea-stage startup.",
    link: "https://www.mcmaster.ca/incubator",
    deadline: "June 1, 2026",
  },
  {
    name: "Alumni Startup Mixer",
    category: "event",
    stage: "Scaling",
    audience: "Alumni",
    description:
      "Connect with experienced alumni entrepreneurs for collaboration and advice.",
    link: "https://www.mcmaster.ca/alumni-mixer",
    deadline: "Quarterly",
  },
  {
    name: "Tech Innovation Pitch Contest",
    category: "pitch",
    stage: "Scaling",
    audience: "Students & Alumni",
    description:
      "Pitch your growing tech startup for funding and mentorship opportunities.",
    link: "https://www.mcmaster.ca/tech-pitch",
    deadline: "July 10, 2026",
  },
]

// ---------------------------------------------------------------------------
// Filtering logic
// ---------------------------------------------------------------------------

/** Map our stage keys to the dataset's stage strings */
const STAGE_MAP: Record<StartupStage, string> = {
  idea: "Idea",
  "early-stage": "Early-stage",
  scaling: "Scaling",
}

/** Check if a resource matches the selected audience */
function matchesAudience(
  resourceAudience: string,
  userType: UserType
): boolean {
  if (resourceAudience === "Students & Alumni") return true
  if (userType === "student" && resourceAudience === "Students") return true
  if (userType === "alumni" && resourceAudience === "Alumni") return true
  return false
}

/** Check if a resource matches the selected stage */
function matchesStage(
  resourceStage: string,
  selectedStage: StartupStage
): boolean {
  if (resourceStage === "All") return true
  return resourceStage === STAGE_MAP[selectedStage]
}

export function getRecommendations(
  stage: StartupStage,
  support: SupportType,
  userType: UserType
): Resource[] {
  return RESOURCES.filter(
    (r) =>
      matchesStage(r.stage, stage) &&
      r.category === support &&
      matchesAudience(r.audience, userType)
  )
}

/** Get all resources matching stage + userType (ignoring support type) */
export function getAllMatchingResources(
  stage: StartupStage,
  userType: UserType
): Resource[] {
  return RESOURCES.filter(
    (r) =>
      matchesStage(r.stage, stage) && matchesAudience(r.audience, userType)
  )
}
