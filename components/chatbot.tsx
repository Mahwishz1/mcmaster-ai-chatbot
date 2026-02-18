"use client"

import { useState, useRef, useEffect } from "react"
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
import { Lightbulb, Rocket, TrendingUp, Zap, DollarSign, Users, Building2, Globe, GraduationCap, ExternalLink, RotateCcw, ArrowRight } from "lucide-react"

type Step = "greeting" | "stage" | "support" | "user-type" | "results"

interface Message {
  id: string
  role: "bot" | "user"
  content: string
  step: Step
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

export function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "greeting",
      role: "bot",
      content: "Welcome to the McMaster Entrepreneur Resource Finder! I'll help you discover the best resources for your startup journey. Let's start with a quick question.",
      step: "greeting",
    },
    {
      id: "stage-question",
      role: "bot",
      content: "What stage is your startup at?",
      step: "stage",
    },
  ])
  const [currentStep, setCurrentStep] = useState<Step>("stage")
  const [stage, setStage] = useState<StartupStage | null>(null)
  const [support, setSupport] = useState<SupportType | null>(null)
  const [userType, setUserType] = useState<UserType | null>(null)
  const [results, setResults] = useState<Resource[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isTyping])

  function addBotMessage(content: string, step: Step) {
    setIsTyping(true)
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { id: `bot-${Date.now()}`, role: "bot", content, step },
      ])
      setIsTyping(false)
      setCurrentStep(step)
    }, 600)
  }

  function handleStageSelect(selected: StartupStage) {
    const label = STARTUP_STAGES.find((s) => s.value === selected)?.label ?? ""
    setStage(selected)
    setMessages((prev) => [
      ...prev,
      { id: `user-${Date.now()}`, role: "user", content: label, step: "stage" },
    ])
    setCurrentStep("support")
    addBotMessage("Great choice! What type of support are you looking for?", "support")
  }

  function handleSupportSelect(selected: SupportType) {
    const label = SUPPORT_TYPES.find((s) => s.value === selected)?.label ?? ""
    setSupport(selected)
    setMessages((prev) => [
      ...prev,
      { id: `user-${Date.now()}`, role: "user", content: label, step: "support" },
    ])
    setCurrentStep("user-type")
    addBotMessage("Almost there! Are you a current McMaster student or alumni?", "user-type")
  }

  function handleUserTypeSelect(selected: UserType) {
    const label = USER_TYPES.find((u) => u.value === selected)?.label ?? ""
    setUserType(selected)
    setMessages((prev) => [
      ...prev,
      { id: `user-${Date.now()}`, role: "user", content: label, step: "user-type" },
    ])
    const recs = getRecommendations(stage!, support!, selected)
    setResults(recs)
    setCurrentStep("results")
    const count = recs.length
    addBotMessage(
      count > 0
        ? `I found ${count} resource${count > 1 ? "s" : ""} that match your profile. Here are my recommendations:`
        : "I couldn't find specific resources matching all your criteria, but here are some general resources that may help:",
      "results"
    )
  }

  function handleRestart() {
    setStage(null)
    setSupport(null)
    setUserType(null)
    setResults([])
    setCurrentStep("stage")
    setMessages([
      {
        id: "greeting-new",
        role: "bot",
        content: "Let's find more resources for you! What stage is your startup at?",
        step: "stage",
      },
    ])
  }

  return (
    <div className="flex flex-col h-full max-h-[700px] bg-card rounded-2xl border border-border shadow-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 bg-primary text-primary-foreground">
        <div className="flex items-center justify-center size-9 rounded-full bg-primary-foreground/15">
          <Rocket className="size-5" />
        </div>
        <div>
          <h2 className="text-sm font-semibold leading-tight">Mac Startup Guide</h2>
          <p className="text-xs text-primary-foreground/70">Find your next resource</p>
        </div>
        <div className="ml-auto flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-xs text-primary-foreground/70">Online</span>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-5 space-y-4">
        {messages.map((msg) => (
          <ChatBubble key={msg.id} role={msg.role}>
            {msg.content}
          </ChatBubble>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <div className="flex items-center justify-center size-7 rounded-full bg-primary text-primary-foreground text-xs font-semibold">
              M
            </div>
            <div className="flex gap-1 px-4 py-3 rounded-2xl bg-secondary">
              <span className="size-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="size-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="size-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          </div>
        )}

        {/* Resource Results */}
        {currentStep === "results" && !isTyping && results.length > 0 && (
          <div className="space-y-3 pt-1">
            {results.map((resource) => (
              <ResourceCard key={resource.name} resource={resource} />
            ))}
          </div>
        )}
        {currentStep === "results" && !isTyping && results.length === 0 && (
          <div className="rounded-xl bg-secondary p-4 text-sm text-muted-foreground">
            No exact matches found. Try adjusting your criteria for broader results.
          </div>
        )}
      </div>

      {/* Input / Option Area */}
      <div className="border-t border-border bg-secondary/50 px-4 py-4">
        {currentStep === "stage" && !isTyping && (
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

        {currentStep === "support" && !isTyping && (
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

        {currentStep === "user-type" && !isTyping && (
          <div className="flex gap-3">
            {USER_TYPES.map((u) => (
              <button
                key={u.value}
                onClick={() => handleUserTypeSelect(u.value)}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 py-3 text-sm font-medium text-foreground transition-all hover:border-primary hover:bg-primary/5 hover:shadow-sm cursor-pointer"
              >
                {u.value === "student" ? <GraduationCap className="size-4 text-primary" /> : <Users className="size-4 text-primary" />}
                {u.label}
              </button>
            ))}
          </div>
        )}

        {currentStep === "results" && !isTyping && (
          <button
            onClick={handleRestart}
            className="flex items-center justify-center gap-2 w-full rounded-xl bg-primary text-primary-foreground px-4 py-3 text-sm font-medium transition-all hover:opacity-90 cursor-pointer"
          >
            <RotateCcw className="size-4" />
            Search for more resources
          </button>
        )}

        {isTyping && (
          <div className="text-center text-xs text-muted-foreground py-2">
            Mac Startup Guide is typing...
          </div>
        )}
      </div>
    </div>
  )
}

function ChatBubble({ role, children }: { role: "bot" | "user"; children: React.ReactNode }) {
  const isBot = role === "bot"
  return (
    <div className={cn("flex items-end gap-2", !isBot && "flex-row-reverse")}>
      {isBot && (
        <div className="flex items-center justify-center size-7 shrink-0 rounded-full bg-primary text-primary-foreground text-xs font-bold">
          M
        </div>
      )}
      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
          isBot
            ? "bg-secondary text-secondary-foreground rounded-bl-sm"
            : "bg-primary text-primary-foreground rounded-br-sm"
        )}
      >
        {children}
      </div>
    </div>
  )
}

function OptionGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">{children}</div>
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
      className="group flex items-start gap-3 rounded-xl border border-border bg-card p-3 text-left transition-all hover:border-primary hover:bg-primary/5 hover:shadow-sm cursor-pointer"
    >
      <div className="flex items-center justify-center size-8 shrink-0 rounded-lg bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
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

function ResourceCard({ resource }: { resource: Resource }) {
  return (
    <a
      href={resource.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/40 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
          {resource.name}
        </h3>
        <ExternalLink className="size-4 shrink-0 text-muted-foreground group-hover:text-primary transition-colors mt-0.5" />
      </div>
      <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
        {resource.description}
      </p>
      <div className="flex flex-wrap gap-1.5 mt-3">
        {resource.tags.support.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary capitalize"
          >
            {SUPPORT_ICONS[tag]}
            {tag}
          </span>
        ))}
      </div>
    </a>
  )
}
