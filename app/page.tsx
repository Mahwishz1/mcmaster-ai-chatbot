import { Chatbot } from "@/components/chatbot"
import { Rocket } from "lucide-react"

export default function Page() {
  return (
    <main className="min-h-screen bg-background">
      {/* Top bar */}
      <header className="border-b border-border bg-card">
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

      {/* Hero section */}
      <section className="mx-auto max-w-5xl px-4 pt-12 pb-8 text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-medium text-primary mb-6">
          <span className="size-1.5 rounded-full bg-primary" />
          Powered by McMaster Innovation
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground text-balance leading-tight">
          Find the Right Resources for
          <br />
          <span className="text-primary">Your Startup Journey</span>
        </h1>
        <p className="mt-4 text-muted-foreground max-w-md mx-auto leading-relaxed text-pretty">
          Answer three quick questions and our chatbot will match you with
          McMaster programs, funding, mentorship, and more.
        </p>
      </section>

      {/* Chatbot */}
      <section className="mx-auto max-w-lg px-4 pb-16">
        <Chatbot />
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-6 text-center text-xs text-muted-foreground">
        McMaster University &middot; Hamilton, ON &middot; Entrepreneur Resource Finder
      </footer>
    </main>
  )
}
