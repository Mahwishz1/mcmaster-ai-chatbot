import { Chatbot } from "@/components/chatbot"
import { Rocket } from "lucide-react"

export default function Page() {
  return (
    <main className="min-h-screen bg-background flex flex-col">
      {/* Top bar */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-3">
          <div className="flex items-center justify-center size-8 rounded-lg bg-primary text-primary-foreground">
            <Rocket className="size-4" />
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
            <span className="size-1.5 rounded-full bg-primary animate-pulse" />
            Powered by McMaster Innovation
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground text-balance leading-tight">
            Find the Right Resources for
            <br />
            <span className="text-primary">Your Startup Journey</span>
          </h1>
          <p className="mt-3 text-muted-foreground max-w-md mx-auto leading-relaxed text-sm text-pretty">
            Answer three quick questions and our chatbot will match you with
            McMaster programs, funding, mentorship, and more.
          </p>
        </section>

        {/* Chatbot */}
        <section className="mx-auto w-full max-w-lg px-4 pb-12 md:pb-16">
          <Chatbot />
        </section>
      </div>

      {/* Footer */}
      <footer className="border-t border-border py-5 text-center text-xs text-muted-foreground">
        McMaster University &middot; Hamilton, ON &middot; Entrepreneur Resource Finder
      </footer>
    </main>
  )
}
