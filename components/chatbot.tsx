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
} from "lucide-react"

type Step = "greeting" | "stage" | "support" | "user-type" | "results"

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
}

const STEPS_ORDER: Step[] = ["stage", "support", "user-type", "results"]
const STEP_LABELS = ["Stage", "Support", "Status", "Results"]

// Friendly encouragement messages
const STAGE_RESPONSES = [
  "Awesome! Love to hear it.",
  "Great choice!",
  "Perfect, got it!",
]
const SUPPORT_RESPONSES = [
  "That's a great area to focus on!",
  "Smart thinking!",
  "Good call!",
]

function getRandomResponse(arr: string[]) {
  return arr[Math.floor(Math.random() * arr.length)]
}

// ── Step Progress Indicator ──────────────────────────────────────────────

function StepIndicator({ currentStep }: { currentStep: Step }) {
  const currentIndex = STEPS_ORDER.indexOf(currentStep)

  return (
    <div className="flex items-center gap-1 px-5 py-3 border-b border-border/40 bg-gradient-to-r from-card to-secondary/30">
      {STEPS_ORDER.map((step, i) => {
        const isComplete = i < currentIndex
        const isCurrent = step === currentStep
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
        "Hi there! I'm Mac, your friendly startup guide. I'm excited to help you discover amazing resources at McMaster!",
    },
    {
      id: "stage-question",
      role: "bot",
      content: "First up - where are you on your startup journey?",
    },
  ])
  const [currentStep, setCurrentStep] = useState<Step>("stage")
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

  const addMessages = useCallback(
    (botContent: string, nextStep: Step) => {
      setIsTyping(true)
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { id: `bot-${Date.now()}`, role: "bot", content: botContent },
        ])
        setIsTyping(false)
        setCurrentStep(nextStep)
      }, 800)
    },
    []
  )

  function handleStageSelect(selected: StartupStage) {
    const label = STARTUP_STAGES.find((s) => s.value === selected)?.label ?? ""
    setStage(selected)
    setMessages((prev) => [
      ...prev,
      { id: `user-stage-${Date.now()}`, role: "user", content: label },
    ])
    setCurrentStep("greeting")
    addMessages(
      `${getRandomResponse(STAGE_RESPONSES)} Now, what kind of support would be most helpful for you right now?`,
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
    setCurrentStep("greeting")
    addMessages(
      `${getRandomResponse(SUPPORT_RESPONSES)} One last thing - are you currently a student or an alum?`,
      "user-type"
    )
  }

  function handleUserTypeSelect(selected: UserType) {
    const label = USER_TYPES.find((u) => u.value === selected)?.label ?? ""
    setMessages((prev) => [
      ...prev,
      { id: `user-type-${Date.now()}`, role: "user", content: label },
    ])
    setCurrentStep("greeting")
    setIsTyping(true)

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
        resultMsg = `Wonderful! I found ${count} ${catLabel}${count > 1 ? "s" : ""} that I think you'll love!`
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
    }, 1000)
  }

  function handleRestart() {
    setStage(null)
    setSupport(null)
    setResults([])
    setOtherResults([])
    setShowOther(false)
    setCurrentStep("stage")
    setMessages([
      {
        id: `restart-${Date.now()}`,
        role: "bot",
        content:
          "Ready for another round? Let's find you even more amazing resources! What stage is your startup at?",
      },
    ])
  }

  const showOptions = !isTyping && currentStep !== "greeting"

  const displayPrimary = results
  const displayOther = otherResults

  return (
    <div className="flex flex-col h-full max-h-[760px] bg-card rounded-3xl border border-border/60 shadow-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 bg-gradient-to-r from-primary to-primary/90 text-primary-foreground">
        <div className="relative">
          <div className="flex items-center justify-center size-11 rounded-2xl bg-primary-foreground/20 backdrop-blur-sm shadow-inner">
            <span className="text-xl">M</span>
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 text-sm">👋</span>
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-base font-semibold leading-tight">
            Mac Startup Guide
          </h2>
          <p className="text-xs text-primary-foreground/80">
            Here to help you succeed!
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
        {showOptions && currentStep === "stage" && (
          <OptionGrid>
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
          <OptionGrid>
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

        {(isTyping || currentStep === "greeting") && (
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground py-2 select-none">
            <span className="inline-flex gap-0.5">
              <span className="size-1 rounded-full bg-primary animate-bounce [animation-delay:0ms]" />
              <span className="size-1 rounded-full bg-primary animate-bounce [animation-delay:100ms]" />
              <span className="size-1 rounded-full bg-primary animate-bounce [animation-delay:200ms]" />
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
          M
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
      <div className="flex items-center justify-center size-8 shrink-0 rounded-xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground text-xs font-bold shadow-sm">
        M
      </div>
      <div className="flex gap-1.5 px-4 py-3.5 rounded-2xl rounded-bl-lg bg-secondary shadow-sm">
        <span className="size-2 rounded-full bg-muted-foreground/60 animate-bounce [animation-delay:0ms]" />
        <span className="size-2 rounded-full bg-muted-foreground/60 animate-bounce [animation-delay:150ms]" />
        <span className="size-2 rounded-full bg-muted-foreground/60 animate-bounce [animation-delay:300ms]" />
      </div>
    </div>
  )
}

function OptionGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 animate-in fade-in slide-in-from-bottom-2 duration-300">
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
        <p className="text-xs text-muted-foreground mt-0.5 leading-snug">
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
  const catMeta = CATEGORY_META[resource.category]
  return (
    <a
      href={resource.link}
      target="_blank"
      rel="noopener noreferrer"
      className="group block rounded-2xl border-2 border-border bg-card p-4 transition-all hover:border-primary/50 hover:shadow-lg hover:-translate-y-0.5 animate-in fade-in slide-in-from-bottom-1 duration-300"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
              {resource.name}
            </h3>
            <span
              className={cn(
                "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-semibold leading-none shrink-0",
                catMeta.color
              )}
            >
              {SUPPORT_ICONS[resource.category]}
              {catMeta.label}
            </span>
          </div>
        </div>
        <div className="flex items-center justify-center size-7 rounded-lg bg-muted/50 group-hover:bg-primary group-hover:text-primary-foreground transition-all shrink-0">
          <ExternalLink className="size-3.5" />
        </div>
      </div>

      <p className="text-xs text-muted-foreground mt-2.5 leading-relaxed">
        {resource.description}
      </p>

      {/* Metadata row */}
      <div className="flex flex-wrap items-center gap-3 mt-3 pt-3 border-t border-border/50">
        <span className="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <Calendar className="size-3" />
          {resource.deadline}
        </span>
        <span className="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <Users className="size-3" />
          {resource.audience}
        </span>
        <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
          {resource.stage === "All" ? "All Stages" : resource.stage}
        </span>
      </div>
    </a>
  )
}
