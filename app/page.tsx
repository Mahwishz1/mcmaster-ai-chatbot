import { Chatbot } from "@/components/chatbot"
import { Sparkles } from "lucide-react"

export default function Page() {
  return (
    <main className="min-h-screen bg-background flex flex-col">
      {/* Top bar */}
      <header className="border-b border-border/50 bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-3">
          <div className="flex items-center justify-center size-9 rounded-xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-sm">
            <span className="text-sm font-bold">M</span>
          </div>
          <div>
            <span className="text-sm font-semibold text-foreground">McMaster</span>
            <span className="text-sm text-muted-foreground ml-1.5">Entrepreneur Hub</span>
          </div>
        </div>
      </header>

      <div className="flex-1 flex flex-col">
        {/* Hero section */}
        <section className="mx-auto max-w-5xl px-4 pt-10 md:pt-14 pb-6 md:pb-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-medium text-primary mb-5">
            <Sparkles className="size-3.5" />
            Your startup journey starts here
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground text-balance leading-tight">
            Hey, Future Founder!
            <br />
            <span className="text-primary">{"Let's Find Your Resources"}</span>
          </h1>
          <p className="mt-4 text-muted-foreground max-w-md mx-auto leading-relaxed text-sm text-pretty">
            Chat with Mac, our friendly guide, and discover workshops, funding,
            events, and more - all tailored just for you.
          </p>
        </section>

        {/* Chatbot */}
        <section className="mx-auto w-full max-w-lg px-4 pb-12 md:pb-16">
          <Chatbot />
        </section>
      </div>

      {/* Footer */}
      <footer className="border-t border-border/50 py-6 text-center">
        <p className="text-xs text-muted-foreground">
          Made with care for McMaster entrepreneurs
        </p>
        <p className="text-[11px] text-muted-foreground/70 mt-1">
          Hamilton, ON
        </p>
      </footer>
    </main>
  )
}
