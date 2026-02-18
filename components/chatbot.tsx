"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { cn } from "@/lib/utils"
import {
  STARTUP_STAGES,
  SUPPORT_TYPES,
  USER_TYPES,
  getRecommendations,
  type StartupStage,
  type SupportType,
  type UserType,
  type Resource,
} from "@/lib/resources"
import {
  Lightbulb,
  Rocket,
  TrendingUp,
  Zap,
  DollarSign,
  Users,
  Building2,
  Globe,
  GraduationCap,
  ExternalLink,
  RotateCcw,
  ArrowRight,
  BookOpen,
} from "lucide-react"

type Step = "greeting" | "stage" | "support" | "user-type" | "results"

interface Message {
  id: string
  role: "bot" | "user"
  content: string
}

const STAGE_ICONS: Record<StartupStage, React.ReactNode> = {
  idea: <Lightbulb className="size-4" />,
  early: <Rocket className="size-4" />,
  growth: <TrendingUp className="size-4" />,
  scaling: <Zap className="size-4" />,
}

const SUPPORT_ICONS: Record<SupportType, React.ReactNode> = {
  funding: <DollarSign className="size-4" />,
  mentorship: <Users className="size-4" />,
  workspace: <Building2 className="size-4" />,
  networking: <Globe className="size-4" />,
  education: <GraduationCap className="size-4" />,
}

const STEPS_ORDER: Step[] = ["stage", "support", "user-type", "results"]
const STEP_LABELS = ["Stage", "Support", "Status", "Results"]

function StepIndicator({ currentStep }: { currentStep: Step }) {
  const currentIndex = STEPS_ORDER.indexOf(currentStep)

  return (
    <div className="flex items-center gap-1 px-5 py-3 border-b border-border/50 bg-card">
      {STEPS_ORDER.map((step, i) => {
        const isComplete = i < currentIndex
        const isCurrent = step === currentStep
        return (
          <div key={step} className="flex items-center gap-1 flex-1">
            <div className="flex items-center gap-1.5 flex-1">
              <div
                className={cn(
                  "size-5 rounded-full flex items-center justify-center text-[10px] font-bold transition-all duration-300 shrink-0",
                  isComplete && "bg-primary text-primary-foreground",
                  isCurrent && "bg-primary text-primary-foreground ring-2 ring-primary/30 ring-offset-1 ring-offset-card",
                  !isComplete && !isCurrent && "bg-muted text-muted-foreground"
                )}
              >
                {isComplete ? (
                  <svg className="size-3" viewBox="0 0 12 12" fill="none">
                    <path d="M2.5 6L5 8.5L9.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  i + 1
                )}
              </div>
              <span
                className={cn(
                  "text-[11px] font-medium transition-colors hidden sm:block",
                  isCurrent ? "text-foreground" : isComplete ? "text-primary" : "text-muted-foreground"
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

export function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "greeting",
      role: "bot",
      content: "Hey there! I'm here to help you find the best McMaster resources for your startup journey. Let's get started!",
    },
    {
      id: "stage-question",
      role: "bot",
      content: "What stage is your startup at?",
    },
  ])
  const [currentStep, setCurrentStep] = useState<Step>("stage")
  const [stage, setStage] = useState<StartupStage | null>(null)
  const [support, setSupport] = useState<SupportType | null>(null)
  const [results, setResults] = useState<Resource[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isTyping, results])

  const addMessages = useCallback((botContent: string, nextStep: Step) => {
    setIsTyping(true)
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { id: `bot-${Date.now()}`, role: "bot", content: botContent },
      ])
      setIsTyping(false)
      setCurrentStep(nextStep)
    }, 700)
  }, [])

  function handleStageSelect(selected: StartupStage) {
    const label = STARTUP_STAGES.find((s) => s.value === selected)?.label ?? ""
    setStage(selected)
    setMessages((prev) => [
      ...prev,
      { id: `user-stage-${Date.now()}`, role: "user", content: label },
    ])
    setCurrentStep("greeting")
    addMessages("Nice! Now, what type of support would help you most right now?", "support")
  }

  function handleSupportSelect(selected: SupportType) {
    const label = SUPPORT_TYPES.find((s) => s.value === selected)?.label ?? ""
    setSupport(selected)
    setMessages((prev) => [
      ...prev,
      { id: `user-support-${Date.now()}`, role: "user", content: label },
    ])
    setCurrentStep("greeting")
    addMessages("Last question -- are you a current McMaster student or alumni?", "user-type")
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
      const recs = getRecommendations(stage!, support!, selected)
      setResults(recs)
      const count = recs.length
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-results-${Date.now()}`,
          role: "bot",
          content:
            count > 0
              ? `I found ${count} resource${count > 1 ? "s" : ""} tailored to your profile. Here they are:`
              : "I couldn't find exact matches for your criteria. Try broadening your search!",
        },
      ])
      setIsTyping(false)
      setCurrentStep("results")
    }, 900)
  }

  function handleRestart() {
    setStage(null)
    setSupport(null)
    setResults([])
    setCurrentStep("stage")
    setMessages([
      {
        id: `restart-${Date.now()}`,
        role: "bot",
        content: "Let's explore more resources! What stage is your startup at?",
      },
    ])
  }

  const showOptions = !isTyping && currentStep !== "greeting"

  return (
    <div className="flex flex-col h-full max-h-[720px] bg-card rounded-2xl border border-border shadow-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-3.5 bg-primary text-primary-foreground">
        <div className="flex items-center justify-center size-9 rounded-full bg-primary-foreground/15 backdrop-blur-sm">
          <Rocket className="size-5" />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-sm font-semibold leading-tight">Mac Startup Guide</h2>
          <p className="text-xs text-primary-foreground/70">McMaster Entrepreneur Resources</p>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-xs text-primary-foreground/70">Online</span>
        </div>
      </div>

      {/* Step Progress */}
      <StepIndicator currentStep={currentStep} />

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-5 flex flex-col gap-3">
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
        {currentStep === "results" && !isTyping && results.length > 0 && (
          <div className="flex flex-col gap-2.5 pt-1 animate-in fade-in slide-in-from-bottom-2 duration-400">
            {results.map((resource, i) => (
              <ResourceCard key={resource.name} resource={resource} index={i} />
            ))}
          </div>
        )}
      </div>

      {/* Input / Option Area */}
      <div className="border-t border-border bg-muted/30 px-4 py-3.5">
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
          <OptionGrid columns={2}>
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
          <div className="flex gap-3">
            {USER_TYPES.map((u) => (
              <button
                key={u.value}
                onClick={() => handleUserTypeSelect(u.value)}
                className="flex-1 flex items-center justify-center gap-2.5 rounded-xl border border-border bg-card px-4 py-3.5 text-sm font-medium text-foreground transition-all hover:border-primary hover:bg-primary/5 hover:shadow-sm active:scale-[0.98] cursor-pointer"
              >
                {u.value === "student" ? (
                  <GraduationCap className="size-5 text-primary" />
                ) : (
                  <BookOpen className="size-5 text-primary" />
                )}
                {u.label}
              </button>
            ))}
          </div>
        )}

        {showOptions && currentStep === "results" && (
          <button
            onClick={handleRestart}
            className="flex items-center justify-center gap-2 w-full rounded-xl bg-primary text-primary-foreground px-4 py-3 text-sm font-medium transition-all hover:opacity-90 active:scale-[0.98] cursor-pointer"
          >
            <RotateCcw className="size-4" />
            Search for more resources
          </button>
        )}

        {(isTyping || currentStep === "greeting") && (
          <div className="text-center text-xs text-muted-foreground py-1.5 select-none">
            Mac Startup Guide is typing...
          </div>
        )}
      </div>
    </div>
  )
}

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
        "flex items-end gap-2",
        !isBot && "flex-row-reverse",
        isLatest && "animate-in fade-in slide-in-from-bottom-1 duration-300"
      )}
    >
      {isBot && (
        <div className="flex items-center justify-center size-7 shrink-0 rounded-full bg-primary text-primary-foreground text-[10px] font-bold">
          M
        </div>
      )}
      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
          isBot
            ? "bg-secondary text-secondary-foreground rounded-bl-md"
            : "bg-primary text-primary-foreground rounded-br-md"
        )}
      >
        {children}
      </div>
    </div>
  )
}

function TypingIndicator() {
  return (
    <div className="flex items-end gap-2 animate-in fade-in duration-200">
      <div className="flex items-center justify-center size-7 shrink-0 rounded-full bg-primary text-primary-foreground text-[10px] font-bold">
        M
      </div>
      <div className="flex gap-1 px-4 py-3 rounded-2xl rounded-bl-md bg-secondary">
        <span className="size-1.5 rounded-full bg-muted-foreground animate-bounce [animation-delay:0ms]" />
        <span className="size-1.5 rounded-full bg-muted-foreground animate-bounce [animation-delay:150ms]" />
        <span className="size-1.5 rounded-full bg-muted-foreground animate-bounce [animation-delay:300ms]" />
      </div>
    </div>
  )
}

function OptionGrid({ children, columns = 2 }: { children: React.ReactNode; columns?: number }) {
  return (
    <div
      className={cn(
        "grid gap-2 animate-in fade-in slide-in-from-bottom-2 duration-300",
        columns === 2 ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1 sm:grid-cols-2"
      )}
    >
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
      className="group flex items-start gap-3 rounded-xl border border-border bg-card p-3 text-left transition-all hover:border-primary hover:bg-primary/5 hover:shadow-sm active:scale-[0.98] cursor-pointer"
    >
      <div className="flex items-center justify-center size-8 shrink-0 rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-sm font-medium text-foreground flex items-center gap-1">
          {label}
          <ArrowRight className="size-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-primary" />
        </p>
        <p className="text-xs text-muted-foreground mt-0.5 leading-snug">{description}</p>
      </div>
    </button>
  )
}

function ResourceCard({ resource, index }: { resource: Resource; index: number }) {
  return (
    <a
      href={resource.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/40 hover:shadow-md"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
          {resource.name}
        </h3>
        <ExternalLink className="size-3.5 shrink-0 text-muted-foreground group-hover:text-primary transition-colors mt-0.5" />
      </div>
      <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
        {resource.description}
      </p>
      <div className="flex flex-wrap gap-1.5 mt-3">
        {resource.tags.support.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 rounded-full bg-primary/8 px-2.5 py-0.5 text-[10px] font-medium text-primary capitalize"
          >
            {SUPPORT_ICONS[tag]}
            {tag}
          </span>
        ))}
        {resource.tags.stages.map((stg) => (
          <span
            key={stg}
            className="inline-flex items-center gap-1 rounded-full bg-accent/15 px-2.5 py-0.5 text-[10px] font-medium text-accent-foreground capitalize"
          >
            {STAGE_ICONS[stg]}
            {stg}
          </span>
        ))}
      </div>
    </a>
  )
}
