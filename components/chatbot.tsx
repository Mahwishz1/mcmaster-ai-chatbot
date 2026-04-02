"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { cn } from "@/lib/utils"
import {
  STARTUP_STAGES,
  SUPPORT_TYPES,
  USER_TYPES,
  CATEGORY_META,
  getRecommendations,
  getAllMatchingResources,
  type StartupStage,
  type SupportType,
  type UserType,
  type Resource,
} from "@/lib/resources"
import {
  Lightbulb,
  Rocket,
  TrendingUp,
  DollarSign,
  Users,
  GraduationCap,
  ExternalLink,
  RotateCcw,
  ArrowRight,
  BookOpen,
  Mic,
  Calendar,
  ChevronDown,
  Sparkles,
  Heart,
  PartyPopper,
  Handshake,
  MessageCircle,
} from "lucide-react"

type Step = "intro" | "stage" | "support" | "user-type" | "results" | "typing"

interface Message {
  id: string
  role: "bot" | "user"
  content: string
}

const STAGE_ICONS: Record<StartupStage, React.ReactNode> = {
  idea: <Lightbulb className="size-4" />,
  "early-stage": <Rocket className="size-4" />,
  scaling: <TrendingUp className="size-4" />,
}

const SUPPORT_ICONS: Record<SupportType, React.ReactNode> = {
  workshop: <BookOpen className="size-4" />,
  funding: <DollarSign className="size-4" />,
  event: <Users className="size-4" />,
  pitch: <Mic className="size-4" />,
  mentorship: <Handshake className="size-4" />,
}

const INTRO_OPTIONS = [
  { value: "explore", label: "Just exploring", description: "I want to see what's available" },
  { value: "specific", label: "Looking for something specific", description: "I know what I need" },
  { value: "stuck", label: "Feeling stuck", description: "I need some guidance" },
  { value: "grow", label: "Ready to grow", description: "I want to take my startup further" },
]

const STEPS_ORDER: Step[] = ["intro", "stage", "support", "user-type", "results"]
const STEP_LABELS = ["Hello", "Stage", "Resources", "Status", "Results"]

// Friendly encouragement messages
const INTRO_RESPONSES: Record<string, string> = {
  explore: "Love that curiosity! Let's discover what McMaster has to offer.",
  specific: "Great, you know what you want! Let's find it together.",
  stuck: "We've all been there! Don't worry, I'll help you find your way.",
  grow: "That's the spirit! Let's fuel that growth.",
}

const STAGE_RESPONSES = [
  "Awesome! Every journey starts somewhere.",
  "Great! That's a fantastic stage to be at.",
  "Perfect, I know just what might help!",
]

const SUPPORT_RESPONSES = [
  "Great choice! This is so important.",
  "Love it! Let's find the best options for you.",
  "Smart thinking! I've got some ideas.",
]

function getRandomResponse(arr: string[]) {
  return arr[Math.floor(Math.random() * arr.length)]
}

// ── Step Progress Indicator ──────────────────────────────────────────────

function StepIndicator({ currentStep }: { currentStep: Step }) {
  const effectiveStep = currentStep === "typing" ? "results" : currentStep
  const currentIndex = STEPS_ORDER.indexOf(effectiveStep)

  return (
    <div className="flex items-center gap-1 px-5 py-3 border-b border-border/40 bg-gradient-to-r from-card to-secondary/30">
      {STEPS_ORDER.map((step, i) => {
        const isComplete = i < currentIndex
        const isCurrent = step === effectiveStep
        return (
          <div key={step} className="flex items-center gap-1 flex-1">
            <div className="flex items-center gap-1.5 flex-1">
              <div
                className={cn(
                  "size-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all duration-300 shrink-0",
                  isComplete && "bg-primary text-primary-foreground",
                  isCurrent &&
                    "bg-primary text-primary-foreground ring-2 ring-primary/30 ring-offset-2 ring-offset-card shadow-sm",
                  !isComplete && !isCurrent && "bg-muted text-muted-foreground"
                )}
              >
                {isComplete ? (
                  <svg className="size-3" viewBox="0 0 12 12" fill="none">
                    <path
                      d="M2.5 6L5 8.5L9.5 3.5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  i + 1
                )}
              </div>
              <span
                className={cn(
                  "text-[11px] font-medium transition-colors hidden sm:block",
                  isCurrent
                    ? "text-foreground"
                    : isComplete
                      ? "text-primary"
                      : "text-muted-foreground"
                )}
              >
                {STEP_LABELS[i]}
              </span>
            </div>
            {i < STEPS_ORDER.length - 1 && (
              <div
                className={cn(
                  "h-px flex-1 min-w-3 mr-1 transition-colors duration-300",
                  i < currentIndex ? "bg-primary" : "bg-border"
                )}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

// ── Main chatbot component ───────────────────────────────────────────────

export function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "greeting",
      role: "bot",
      content:
        "Hey there! I'm Mac, your friendly startup guide at McMaster. I'm here to help you find the perfect resources for your entrepreneurial journey.",
    },
    {
      id: "intro-question",
      role: "bot",
      content: "First, tell me - what brings you here today? What are you hoping to find help with?",
    },
  ])
  const [currentStep, setCurrentStep] = useState<Step>("intro")
  const [stage, setStage] = useState<StartupStage | null>(null)
  const [support, setSupport] = useState<SupportType | null>(null)
  const [results, setResults] = useState<Resource[]>([])
  const [otherResults, setOtherResults] = useState<Resource[]>([])
  const [showOther, setShowOther] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isTyping, results, showOther])

  const addBotMessage = useCallback((content: string, nextStep: Step) => {
    setIsTyping(true)
    setCurrentStep("typing")
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { id: `bot-${Date.now()}`, role: "bot", content },
      ])
      setIsTyping(false)
      setCurrentStep(nextStep)
    }, 900)
  }, [])

  function handleIntroSelect(value: string) {
    const option = INTRO_OPTIONS.find((o) => o.value === value)
    setMessages((prev) => [
      ...prev,
      { id: `user-intro-${Date.now()}`, role: "user", content: option?.label ?? value },
    ])
    const response = INTRO_RESPONSES[value] ?? "Great! Let's get started."
    addBotMessage(
      `${response} Now, what stage are you in your entrepreneurial journey?`,
      "stage"
    )
  }

  function handleStageSelect(selected: StartupStage) {
    const label = STARTUP_STAGES.find((s) => s.value === selected)?.label ?? ""
    setStage(selected)
    setMessages((prev) => [
      ...prev,
      { id: `user-stage-${Date.now()}`, role: "user", content: label },
    ])
    addBotMessage(
      `${getRandomResponse(STAGE_RESPONSES)} Now, what resources would you need to move forward?`,
      "support"
    )
  }

  function handleSupportSelect(selected: SupportType) {
    const label = SUPPORT_TYPES.find((s) => s.value === selected)?.label ?? ""
    setSupport(selected)
    setMessages((prev) => [
      ...prev,
      { id: `user-support-${Date.now()}`, role: "user", content: label },
    ])
    addBotMessage(
      `${getRandomResponse(SUPPORT_RESPONSES)} Last question - are you currently a McMaster student or an alum?`,
      "user-type"
    )
  }

  function handleUserTypeSelect(selected: UserType) {
    const label = USER_TYPES.find((u) => u.value === selected)?.label ?? ""
    setMessages((prev) => [
      ...prev,
      { id: `user-type-${Date.now()}`, role: "user", content: label },
    ])
    setIsTyping(true)
    setCurrentStep("typing")

    setTimeout(() => {
      const primary = getRecommendations(stage!, support!, selected)
      const all = getAllMatchingResources(stage!, selected)
      const other = all.filter(
        (r) => !primary.some((p) => p.name === r.name)
      )

      setResults(primary)
      setOtherResults(other)
      setShowOther(false)

      const catLabel =
        CATEGORY_META[support!]?.label.toLowerCase() ?? "resource"
      const count = primary.length

      let resultMsg: string
      if (count > 0) {
        resultMsg = `Wonderful! I found ${count} ${catLabel}${count > 1 ? " options" : ""} that I think you'll love!`
        if (other.length > 0) {
          resultMsg += ` Plus ${other.length} bonus resource${other.length > 1 ? "s" : ""} you might want to check out.`
        }
      } else if (other.length > 0) {
        resultMsg = `I didn't find exact ${catLabel} matches, but don't worry - here are ${other.length} other great resource${other.length > 1 ? "s" : ""} for you:`
      } else {
        resultMsg =
          "Hmm, I couldn't find resources matching that exact combo. But don't give up! Try different options - there's something for everyone."
      }

      setMessages((prev) => [
        ...prev,
        { id: `bot-results-${Date.now()}`, role: "bot", content: resultMsg },
      ])
      setIsTyping(false)
      setCurrentStep("results")
    }, 1200)
  }

  function handleRestart() {
    setStage(null)
    setSupport(null)
    setResults([])
    setOtherResults([])
    setShowOther(false)
    setCurrentStep("intro")
    setMessages([
      {
        id: `restart-${Date.now()}`,
        role: "bot",
        content:
          "Ready for another round? I love your enthusiasm! Let's find you even more amazing resources.",
      },
      {
        id: `restart-question-${Date.now()}`,
        role: "bot",
        content: "What are you looking to explore this time?",
      },
    ])
  }

  const showOptions = !isTyping && currentStep !== "typing"

  const displayPrimary = results
  const displayOther = otherResults

  return (
    <div className="flex flex-col h-full max-h-[800px] bg-card rounded-3xl border border-border/60 shadow-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 bg-gradient-to-r from-primary to-primary/90 text-primary-foreground">
        <div className="relative">
          <div className="flex items-center justify-center size-12 rounded-2xl bg-primary-foreground/20 backdrop-blur-sm shadow-inner">
            <MessageCircle className="size-6" />
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 text-base">👋</span>
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-semibold leading-tight">
            Mac
          </h2>
          <p className="text-xs text-primary-foreground/80">
            Your McMaster Startup Guide
          </p>
        </div>
        <div className="flex items-center gap-1.5 bg-primary-foreground/15 rounded-full px-2.5 py-1">
          <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs text-primary-foreground/90">Online</span>
        </div>
      </div>

      {/* Step Progress */}
      <StepIndicator currentStep={currentStep} />

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-5 flex flex-col gap-3 bg-gradient-to-b from-background/50 to-background"
      >
        {messages.map((msg, index) => (
          <ChatBubble
            key={msg.id}
            role={msg.role}
            isLatest={index === messages.length - 1}
          >
            {msg.content}
          </ChatBubble>
        ))}

        {/* Typing indicator */}
        {isTyping && <TypingIndicator />}

        {/* Resource Results */}
        {currentStep === "results" && !isTyping && (
          <div className="flex flex-col gap-3 pt-2 animate-in fade-in slide-in-from-bottom-2 duration-400">
            {/* Success celebration for results */}
            {displayPrimary.length > 0 && (
              <div className="flex items-center justify-center gap-2 py-2">
                <PartyPopper className="size-4 text-accent" />
                <span className="text-xs font-medium text-muted-foreground">
                  Here are your personalized recommendations
                </span>
                <PartyPopper className="size-4 text-accent scale-x-[-1]" />
              </div>
            )}

            {/* Primary results */}
            {displayPrimary.length > 0 && (
              <>
                {displayPrimary.map((resource, i) => (
                  <ResourceCard
                    key={resource.name}
                    resource={resource}
                    index={i}
                  />
                ))}
              </>
            )}

            {/* No results message */}
            {displayPrimary.length === 0 && displayOther.length === 0 && (
              <div className="text-center py-8 px-4">
                <div className="inline-flex items-center justify-center size-14 rounded-2xl bg-muted mb-4">
                  <Sparkles className="size-6 text-muted-foreground" />
                </div>
                <p className="text-sm font-medium text-foreground mb-1">
                  No matches found
                </p>
                <p className="text-xs text-muted-foreground max-w-[240px] mx-auto">
                  Try a different combination - your perfect resource is out there!
                </p>
              </div>
            )}

            {/* Other matching resources toggle */}
            {displayOther.length > 0 && (
              <div className="mt-1">
                <button
                  onClick={() => setShowOther(!showOther)}
                  className="flex items-center gap-2 w-full rounded-2xl border border-dashed border-primary/30 bg-primary/5 px-4 py-3.5 text-xs font-medium text-primary transition-all hover:bg-primary/10 hover:border-primary/50 cursor-pointer"
                >
                  <Sparkles className="size-3.5" />
                  <span className="flex-1 text-left">
                    {showOther ? "Hide" : "Discover"} {displayOther.length} more
                    resource{displayOther.length > 1 ? "s" : ""}
                  </span>
                  <ChevronDown
                    className={cn(
                      "size-4 transition-transform duration-200",
                      showOther && "rotate-180"
                    )}
                  />
                </button>

                {showOther && (
                  <div className="flex flex-col gap-3 mt-3 animate-in fade-in slide-in-from-top-2 duration-300">
                    {displayOther.map((resource, i) => (
                      <ResourceCard
                        key={resource.name}
                        resource={resource}
                        index={i}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Input / Option Area */}
      <div className="border-t border-border/50 bg-gradient-to-t from-muted/50 to-card px-4 py-4">
        {showOptions && currentStep === "intro" && (
          <OptionGrid cols={2}>
            {INTRO_OPTIONS.map((o) => (
              <OptionButton
                key={o.value}
                icon={
                  o.value === "explore" ? <Sparkles className="size-4" /> :
                  o.value === "specific" ? <ArrowRight className="size-4" /> :
                  o.value === "stuck" ? <Heart className="size-4" /> :
                  <Rocket className="size-4" />
                }
                label={o.label}
                description={o.description}
                onClick={() => handleIntroSelect(o.value)}
              />
            ))}
          </OptionGrid>
        )}

        {showOptions && currentStep === "stage" && (
          <OptionGrid cols={3}>
            {STARTUP_STAGES.map((s) => (
              <OptionButton
                key={s.value}
                icon={STAGE_ICONS[s.value]}
                label={s.label}
                description={s.description}
                onClick={() => handleStageSelect(s.value)}
              />
            ))}
          </OptionGrid>
        )}

        {showOptions && currentStep === "support" && (
          <OptionGrid cols={3}>
            {SUPPORT_TYPES.map((s) => (
              <OptionButton
                key={s.value}
                icon={SUPPORT_ICONS[s.value]}
                label={s.label}
                description={s.description}
                onClick={() => handleSupportSelect(s.value)}
              />
            ))}
          </OptionGrid>
        )}

        {showOptions && currentStep === "user-type" && (
          <div className="flex gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {USER_TYPES.map((u) => (
              <button
                key={u.value}
                onClick={() => handleUserTypeSelect(u.value)}
                className="flex-1 flex items-center justify-center gap-2.5 rounded-2xl border-2 border-border bg-card px-4 py-4 text-sm font-medium text-foreground transition-all hover:border-primary hover:bg-primary/5 hover:shadow-md active:scale-[0.98] cursor-pointer"
              >
                {u.value === "student" ? (
                  <GraduationCap className="size-5 text-primary" />
                ) : (
                  <Heart className="size-5 text-primary" />
                )}
                {u.label}
              </button>
            ))}
          </div>
        )}

        {showOptions && currentStep === "results" && (
          <button
            onClick={handleRestart}
            className="flex items-center justify-center gap-2 w-full rounded-2xl bg-gradient-to-r from-primary to-primary/90 text-primary-foreground px-4 py-3.5 text-sm font-semibold transition-all hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
          >
            <RotateCcw className="size-4" />
            Explore more resources
          </button>
        )}

        {(isTyping || currentStep === "typing") && (
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground py-2 select-none">
            <span className="inline-flex gap-0.5">
              <span className="size-1.5 rounded-full bg-primary animate-bounce [animation-delay:0ms]" />
              <span className="size-1.5 rounded-full bg-primary animate-bounce [animation-delay:100ms]" />
              <span className="size-1.5 rounded-full bg-primary animate-bounce [animation-delay:200ms]" />
            </span>
            Mac is thinking...
          </div>
        )}
      </div>
    </div>
  )
}

// ── Sub-components ───────────────────────────────────────────────────────

function ChatBubble({
  role,
  children,
  isLatest,
}: {
  role: "bot" | "user"
  children: React.ReactNode
  isLatest: boolean
}) {
  const isBot = role === "bot"
  return (
    <div
      className={cn(
        "flex items-end gap-2.5",
        !isBot && "flex-row-reverse",
        isLatest && "animate-in fade-in slide-in-from-bottom-1 duration-300"
      )}
    >
      {isBot && (
        <div className="flex items-center justify-center size-8 shrink-0 rounded-xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground text-xs font-bold shadow-sm">
          <MessageCircle className="size-4" />
        </div>
      )}
      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm",
          isBot
            ? "bg-secondary text-secondary-foreground rounded-bl-lg"
            : "bg-gradient-to-br from-primary to-primary/90 text-primary-foreground rounded-br-lg"
        )}
      >
        {children}
      </div>
    </div>
  )
}

function TypingIndicator() {
  return (
    <div className="flex items-end gap-2.5 animate-in fade-in duration-200">
      <div className="flex items-center justify-center size-8 shrink-0 rounded-xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-sm">
        <MessageCircle className="size-4" />
      </div>
      <div className="flex gap-1.5 px-4 py-3.5 rounded-2xl rounded-bl-lg bg-secondary shadow-sm">
        <span className="size-2 rounded-full bg-muted-foreground/60 animate-bounce [animation-delay:0ms]" />
        <span className="size-2 rounded-full bg-muted-foreground/60 animate-bounce [animation-delay:150ms]" />
        <span className="size-2 rounded-full bg-muted-foreground/60 animate-bounce [animation-delay:300ms]" />
      </div>
    </div>
  )
}

function OptionGrid({ children, cols = 2 }: { children: React.ReactNode; cols?: 2 | 3 }) {
  return (
    <div className={cn(
      "grid gap-2.5 animate-in fade-in slide-in-from-bottom-2 duration-300",
      cols === 2 ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1 sm:grid-cols-3"
    )}>
      {children}
    </div>
  )
}

function OptionButton({
  icon,
  label,
  description,
  onClick,
}: {
  icon: React.ReactNode
  label: string
  description: string
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="group flex items-start gap-3 rounded-2xl border-2 border-border bg-card p-3.5 text-left transition-all hover:border-primary hover:bg-primary/5 hover:shadow-md active:scale-[0.98] cursor-pointer"
    >
      <div className="flex items-center justify-center size-9 shrink-0 rounded-xl bg-primary/10 text-primary transition-all group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-105">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-foreground flex items-center gap-1.5">
          {label}
          <ArrowRight className="size-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-primary" />
        </p>
        <p className="text-xs text-muted-foreground mt-0.5 leading-snug line-clamp-2">
          {description}
        </p>
      </div>
    </button>
  )
}

function ResourceCard({
  resource,
  index,
}: {
  resource: Resource
  index: number
}) {
  const meta = CATEGORY_META[resource.category]

  return (
    <div
      className="rounded-2xl border border-border bg-card p-4 shadow-sm transition-all hover:shadow-md hover:border-primary/30 animate-in fade-in slide-in-from-bottom-2 duration-300"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <h4 className="text-sm font-semibold text-foreground leading-tight">
          {resource.name}
        </h4>
        <span
          className={cn(
            "shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full",
            meta?.color ?? "bg-muted text-muted-foreground"
          )}
        >
          {meta?.label ?? resource.category}
        </span>
      </div>

      <p className="text-xs text-muted-foreground leading-relaxed mb-3">
        {resource.description}
      </p>

      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
          <span className="flex items-center gap-1">
            <Calendar className="size-3" />
            {resource.deadline}
          </span>
          <span className="flex items-center gap-1">
            <Users className="size-3" />
            {resource.audience}
          </span>
        </div>

        <a
          href={resource.link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline underline-offset-2"
        >
          Learn more
          <ExternalLink className="size-3" />
        </a>
      </div>
    </div>
  )
}
