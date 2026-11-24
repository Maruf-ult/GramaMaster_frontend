import { FeatureCard } from "@/components/cards/FeatureCard";
import { Stat } from "@/components/cards/Stat";
import { Step } from "@/components/cards/Step";
import { ArrowRight, BarChart2, BookOpen, Brain, GraduationCap, Link, MessageSquare, Sparkles, Trophy, Users, Zap } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">

      <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">G</span>
            </div>
            <span className="font-bold text-lg tracking-tight">GramaMaster</span>
          </div>

          <div className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-foreground transition-colors">How it works</a>
            <a href="#who-is-it-for" className="hover:text-foreground transition-colors">For whom?</a>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5"
            >
              Sign In
            </Link>
            <Link
              href="/register/student"
              className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </nav>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-20 pb-16 text-center">

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/8 text-primary text-xs font-medium mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          AI-powered English Grammar Learning
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground leading-tight max-w-4xl mx-auto">
          Master English Grammar
          <br />
          <span className="text-primary">the Smart Way</span>
        </h1>
        <p className="mt-5 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          GramaMaster helps SSC and HSC students practice grammar topics through
          AI-generated questions, live contests, and personalized feedback — all
          in one platform.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/register/student"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors shadow-sm"
          >
            Start Learning Free
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/register/teacher"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-border text-sm font-medium hover:bg-accent transition-colors"
          >
            <GraduationCap className="w-4 h-4" />
            I&apos;m a Teacher
          </Link>
        </div>

        <div className="mt-10 flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <div className="flex -space-x-2">
            {["A", "R", "S", "M", "F"].map((l, i) => (
              <div
                key={i}
                className="w-7 h-7 rounded-full border-2 border-background bg-primary flex items-center justify-center text-primary-foreground text-[10px] font-bold"
              >
                {l}
              </div>
            ))}
          </div>
          <span>Trusted by <strong className="text-foreground">500+</strong> students across Bangladesh</span>
        </div>
      </section>

      <section className="border-y border-border bg-muted/30 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          <Stat value="10,000+" label="Practice questions" />
          <Stat value="500+" label="Active students" />
          <Stat value="98%" label="Exam pass rate" />
          <Stat value="50+" label="Grammar topics" />
        </div>
      </section>

      <section id="features" className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold">Everything you need to excel</h2>
          <p className="text-muted-foreground mt-2 text-sm max-w-xl mx-auto">
            From AI-powered practice to live competitions — GramaMaster covers every aspect of grammar mastery.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <FeatureCard
            icon={Brain}
            color="bg-blue-500/15 text-blue-500"
            title="AI-Generated Questions"
            description="Our AI creates unlimited, topic-specific grammar questions tailored to your difficulty level and curriculum."
          />
          <FeatureCard
            icon={Trophy}
            color="bg-violet-500/15 text-violet-500"
            title="Live Contests"
            description="Compete in timed grammar contests with real-time leaderboards. Challenge classmates or join global competitions."
          />
          <FeatureCard
            icon={BarChart2}
            color="bg-green-500/15 text-green-500"
            title="Progress Analytics"
            description="Detailed charts show your accuracy trends, weak topics, and improvement over time — so you study smarter."
          />
          <FeatureCard
            icon={MessageSquare}
            color="bg-orange-500/15 text-orange-500"
            title="AI Grammar Tutor"
            description="Ask any grammar question and get instant, detailed explanations from our AI chatbot available 24/7."
          />
          <FeatureCard
            icon={BookOpen}
            color="bg-pink-500/15 text-pink-500"
            title="Grammar Rules Library"
            description="Comprehensive grammar rule cards covering Narration, Modifiers, Connectors, Right Form of Verbs and more."
          />
          <FeatureCard
            icon={Users}
            color="bg-cyan-500/15 text-cyan-500"
            title="Teacher Classrooms"
            description="Teachers can create teams, generate AI questions, track student progress, and run class-specific contests."
          />
        </div>
      </section>

      <section id="how-it-works" className="bg-muted/30 border-y border-border py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">How it works</h2>
            <p className="text-muted-foreground mt-2 text-sm">Start improving in under 5 minutes.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-12">

            <div className="space-y-6">
              <h3 className="font-bold flex items-center gap-2 text-sm uppercase tracking-wide text-muted-foreground">
                <GraduationCap className="w-4 h-4" />
                For Students
              </h3>
              <div className="space-y-5">
                <Step num="1" title="Register & set your curriculum" description="Choose SSC or HSC, select your board and study group." />
                <Step num="2" title="Pick a topic & difficulty" description="Browse grammar topics and choose Easy, Medium, or Hard questions." />
                <Step num="3" title="Practice & get AI feedback" description="Submit answers and receive instant AI explanations for each question." />
                <Step num="4" title="Join contests & track progress" description="Compete live, view leaderboards, and watch your accuracy improve over time." />
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="font-bold flex items-center gap-2 text-sm uppercase tracking-wide text-muted-foreground">
                <Users className="w-4 h-4" />
                For Teachers
              </h3>
              <div className="space-y-5">
                <Step num="1" title="Create your classroom" description="Set up a team and share the unique join code with your students." />
                <Step num="2" title="Generate AI questions" description="Use the AI engine to generate topic-specific questions instantly." />
                <Step num="3" title="Run timed contests" description="Schedule contests with custom durations, topics, and difficulty levels." />
                <Step num="4" title="Analyse student performance" description="See per-student accuracy, weak topics, and class-wide analytics." />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="who-is-it-for" className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold">Built for Bangladeshi students</h2>
          <p className="text-muted-foreground mt-2 text-sm">
            Aligned with SSC and HSC English syllabi — Narration, Modifiers, Right Form of Verbs, and more.
          </p>
        </div>
        <div className="grid sm:grid-cols-3 gap-5">
          {[
            {
              icon: GraduationCap,
              title: "SSC Students",
              desc: "Master the grammar topics that appear in your board exam. Practice Narration, Modifiers, Connectors and more.",
              badge: "Class 9–10",
              color: "text-blue-500",
              bg: "bg-blue-500/15",
            },
            {
              icon: Brain,
              title: "HSC Students",
              desc: "Advance your grammar skills with harder problems and AI-generated practice tailored to your curriculum.",
              badge: "Class 11–12",
              color: "text-violet-500",
              bg: "bg-violet-500/15",
            },
            {
              icon: Zap,
              title: "Teachers",
              desc: "Save hours of question creation with AI. Run live competitions and track every student's progress.",
              badge: "Educators",
              color: "text-orange-500",
              bg: "bg-orange-500/15",
            },
          ].map((card) => (
            <div
              key={card.title}
              className="rounded-2xl border border-border bg-card p-6 space-y-3 text-center"
            >
              <div className={`w-12 h-12 rounded-2xl ${card.bg} flex items-center justify-center mx-auto`}>
                <card.icon className={`w-6 h-6 ${card.color}`} />
              </div>
              <div>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${card.bg} ${card.color}`}>
                  {card.badge}
                </span>
              </div>
              <h3 className="font-bold">{card.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{card.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-primary py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center space-y-5">
          <h2 className="text-3xl font-bold text-primary-foreground">
            Ready to master English Grammar?
          </h2>
          <p className="text-primary-foreground/80 text-sm leading-relaxed">
            Join thousands of students already improving with GramaMaster. Free to get started — no credit card needed.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/register/student"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-background text-foreground font-semibold text-sm hover:bg-background/90 transition-colors"
            >
              Start as Student
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/register/teacher"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-primary-foreground/30 text-primary-foreground text-sm font-medium hover:bg-primary-foreground/10 transition-colors"
            >
              Join as Teacher
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-border py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
              <span className="text-primary-foreground text-xs font-bold">G</span>
            </div>
            <span className="font-semibold text-foreground">GramaMaster</span>
          </div>
          <p>© {new Date().getFullYear()} GramaMaster. Built for Bangladeshi students.</p>
          <div className="flex gap-4">
            <Link href="/login" className="hover:text-foreground transition-colors">Sign In</Link>
            <Link href="/register/student" className="hover:text-foreground transition-colors">Register</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}