import type React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Brain, Share2, Search, BarChart3, ChevronRight, FileText, Edit3, Sparkles, Zap } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { cn } from "@/lib/utils"

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(120,120,120,0.05)_0,rgba(120,120,120,0)_50%)] dark:bg-[radial-gradient(circle_at_center,rgba(200,200,200,0.03)_0,rgba(200,200,200,0)_50%)]" />
          <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-br from-zinc-100/20 via-zinc-100/0 to-zinc-100/0 dark:from-zinc-900/20 dark:via-zinc-900/0 dark:to-zinc-900/0" />
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-zinc-200/0 via-zinc-200 to-zinc-200/0 dark:from-zinc-800/0 dark:via-zinc-800 dark:to-zinc-800/0" />
        </div>

        <div className="container relative px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center text-center space-y-8 max-w-3xl mx-auto">
            <div className="inline-flex items-center justify-center px-3 py-1 rounded-full border border-zinc-200 bg-zinc-50 text-sm text-zinc-600 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
            <span className="flex items-center">
                <span className="relative flex h-2 w-2 mr-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-zinc-400 opacity-75 dark:bg-zinc-600"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-zinc-500 dark:bg-zinc-500"></span>
                </span>
                <span className="mr-1">Revolutionizing Research with AI</span>
                <Sparkles className="h-3.5 w-3.5 ml-1 text-zinc-500" />
              </span>
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl/none">
                <span className="block bg-clip-text text-transparent bg-gradient-to-r from-zinc-800 via-zinc-500 to-zinc-900 dark:from-zinc-100 dark:via-zinc-400 dark:to-zinc-200">
                  Unlock the Power of
                </span>
                <span className="block bg-clip-text text-transparent bg-gradient-to-r from-zinc-900 via-zinc-700 to-zinc-800 dark:from-zinc-200 dark:via-zinc-300 dark:to-zinc-100">
                  Research Papers
                </span>
              </h1>
              <p className="mx-auto max-w-[700px] text-zinc-600 md:text-xl dark:text-zinc-400">
                Your AI-powered research assistant that summarizes, searches, and helps you collaborate on academic
                papers with unprecedented ease.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-4 min-[400px]:gap-3 w-full max-w-md">
              <Link href="/signin" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto gap-1.5 h-12 px-6">
                  Get Started <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
              <Link href="/signup" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full sm:w-auto h-12 px-6">
                  Sign Up Free
                </Button>
              </Link>
            </div>

            <div className="pt-8 w-full max-w-4xl">
            <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden border border-zinc-200 shadow-xl dark:border-zinc-800 group">
                <div className="absolute inset-0 bg-white dark:bg-black flex items-center justify-center">
                  {/* Animated grid lines */}
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.05)_1px,transparent_1px)] bg-[size:24px_24px] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  {/* App UI Mockup */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div
                      className="w-[85%] h-[85%] rounded-lg bg-white/95 dark:bg-black/95 shadow-2xl backdrop-blur-sm p-4 flex flex-col"
                    >
                      {/* App Header */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-zinc-300 dark:bg-zinc-600 mr-2"></div>
                          <div className="w-3 h-3 rounded-full bg-zinc-300 dark:bg-zinc-600 mr-2"></div>
                          <div className="w-3 h-3 rounded-full bg-zinc-300 dark:bg-zinc-600"></div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="h-6 w-6 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                            <Brain className="h-3.5 w-3.5 text-zinc-500 dark:text-zinc-400" />
                          </div>
                          <div className="h-5 w-24 bg-zinc-100 dark:bg-zinc-800 rounded"></div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="h-7 w-7 rounded-full bg-zinc-100 dark:bg-zinc-800"></div>
                        </div>
                      </div>

                      {/* App Content - more refined */}
                      <div className="flex-1 flex">
                        {/* Sidebar */}
                        <div className="w-1/4 border-r border-zinc-200 dark:border-zinc-800 p-3">
                          <div className="h-8 w-full bg-zinc-100 dark:bg-zinc-800 rounded-lg mb-4 flex items-center px-3">
                            <div className="h-3 w-3/4 bg-zinc-200 dark:bg-zinc-700 rounded"></div>
                            <Search className="h-3.5 w-3.5 ml-auto text-zinc-400 dark:text-zinc-500" />
                          </div>

                          <div className="space-y-3">
                            <SidebarItem active />
                            <SidebarItem />
                            <SidebarItem />
                            <SidebarItem />
                          </div>

                          <div className="mt-6 pt-6 border-t border-zinc-200 dark:border-zinc-800">
                            <div className="h-5 w-3/4 bg-zinc-100 dark:bg-zinc-800 rounded mb-3"></div>
                            <div className="space-y-3">
                              <SidebarItem isFolder />
                              <SidebarItem isFolder />
                            </div>
                          </div>
                        </div>

                        {/* Main Content - more refined */}
                        <div className="flex-1 p-4">
                          <div className="flex items-center justify-between mb-6">
                            <div className="h-7 w-1/3 bg-zinc-100 dark:bg-zinc-800 rounded-lg"></div>
                            <div className="flex items-center space-x-2">
                              <div className="h-8 w-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                                <Share2 className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
                              </div>
                              <div className="h-8 w-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                                <Edit3 className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
                              </div>
                            </div>
                          </div>

                          <div className="space-y-4">
                            <div className="h-10 w-full bg-zinc-100 dark:bg-zinc-800 rounded-lg"></div>

                            <div className="flex items-start space-x-3">
                              <div className="h-5 w-5 rounded-full bg-zinc-200 dark:bg-zinc-700 flex-shrink-0 mt-1"></div>
                              <div className="flex-1 space-y-2">
                                <div className="h-4 w-1/4 bg-zinc-200 dark:bg-zinc-700 rounded"></div>
                                <div className="h-3 w-full bg-zinc-100 dark:bg-zinc-800 rounded"></div>
                                <div className="h-3 w-full bg-zinc-100 dark:bg-zinc-800 rounded"></div>
                                <div className="h-3 w-3/4 bg-zinc-100 dark:bg-zinc-800 rounded"></div>
                              </div>
                            </div>

                            <div className="flex items-start space-x-3">
                              <div className="h-5 w-5 rounded-full bg-zinc-200 dark:bg-zinc-700 flex-shrink-0 mt-1"></div>
                              <div className="flex-1 space-y-2">
                                <div className="h-4 w-1/5 bg-zinc-200 dark:bg-zinc-700 rounded"></div>
                                <div className="h-3 w-full bg-zinc-100 dark:bg-zinc-800 rounded"></div>
                                <div className="h-3 w-full bg-zinc-100 dark:bg-zinc-800 rounded"></div>
                              </div>
                            </div>

                            <div className="h-32 w-full bg-zinc-100 dark:bg-zinc-800 rounded-lg mt-6 p-3">
                              <div className="flex justify-between items-start">
                                <div className="h-4 w-1/3 bg-zinc-200 dark:bg-zinc-700 rounded"></div>
                                <div className="h-6 w-6 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center">
                                  <Zap className="h-3 w-3 text-zinc-500 dark:text-zinc-400" />
                                </div>
                              </div>
                              <div className="mt-3 space-y-2">
                                <div className="h-3 w-full bg-zinc-200/70 dark:bg-zinc-700/70 rounded"></div>
                                <div className="h-3 w-full bg-zinc-200/70 dark:bg-zinc-700/70 rounded"></div>
                                <div className="h-3 w-2/3 bg-zinc-200/70 dark:bg-zinc-700/70 rounded"></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 md:py-24 relative">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(120,120,120,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(120,120,120,0.05)_1px,transparent_1px)] bg-[size:24px_24px] dark:bg-[linear-gradient(to_right,rgba(200,200,200,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(200,200,200,0.03)_1px,transparent_1px)]" />
        </div>

        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <div className="inline-flex items-center justify-center px-3 py-1 rounded-full border border-zinc-200 bg-zinc-50 text-sm text-zinc-600 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 mb-2">
              <span>Features</span>
            </div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">Powerful Research Tools</h2>
            <p className="mx-auto max-w-[700px] text-zinc-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-zinc-400">
              Streamline your research workflow with our comprehensive suite of tools.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<FileText className="h-6 w-6" />}
              title="Paper Summarization"
              description="Upload research papers and receive segmented summaries with key findings, methodology, and conclusions."
            />
            <FeatureCard
              icon={<Edit3 className="h-6 w-6" />}
              title="Editing & Annotation"
              description="Modify and personalize summaries with comments and organize them into custom collections."
              isHighlighted
            />
            <FeatureCard
              icon={<Search className="h-6 w-6" />}
              title="Natural Language Search"
              description="Find relevant research papers using everyday language queries powered by advanced AI."
            />
            <FeatureCard
              icon={<BarChart3 className="h-6 w-6" />}
              title="Research Insights"
              description="Visualize your research metrics and trends with personalized analytics and dashboards."
            />
            <FeatureCard
              icon={<Share2 className="h-6 w-6" />}
              title="Collaboration & Sharing"
              description="Share summaries and collaborate with peers on research papers with granular access controls."
            />
            <FeatureCard
              icon={<Brain className="h-6 w-6" />}
              title="AI-Powered Analysis"
              description="Get intelligent recommendations and connections between papers based on your research interests."
              isComingSoon
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="workflow" className="py-16 md:py-24 bg-zinc-50 dark:bg-zinc-900/50 relative">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-zinc-200/0 via-zinc-200 to-zinc-200/0 dark:from-zinc-800/0 dark:via-zinc-800 dark:to-zinc-800/0" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-zinc-200/0 via-zinc-200 to-zinc-200/0 dark:from-zinc-800/0 dark:via-zinc-800 dark:to-zinc-800/0" />

        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <div className="inline-flex items-center justify-center px-3 py-1 rounded-full border border-zinc-200 bg-zinc-100 text-sm text-zinc-600 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 mb-2">
              <span>How It Works</span>
            </div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Simple Research Workflow</h2>
            <p className="mx-auto max-w-[700px] text-zinc-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-zinc-400">
              From paper to insights in just a few steps
            </p>
          </div>

          <div className="relative max-w-5xl mx-auto">
            {/* Connection line for desktop */}
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-zinc-300 to-zinc-400 dark:from-zinc-700 dark:to-zinc-600 -translate-y-1/2 hidden md:block"></div>

            {/* Workflow Steps */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 relative">
              <div className="h-full flex">
                <WorkflowStep
                  number="01"
                  title="Upload Paper"
                  description="Upload your research paper in PDF format or paste text directly."
                  icon={<FileText className="h-6 w-6 text-zinc-700 dark:text-zinc-300" />}
                  details={["Supports PDF, DOC, and TXT formats", "Drag & drop interface", "Extract from URL"]}
                />
              </div>
              <div className="h-full flex">
                <WorkflowStep
                  number="02"
                  title="AI Processing"
                  description="Our AI analyzes and extracts key information from the paper."
                  icon={<Brain className="h-6 w-6 text-zinc-700 dark:text-zinc-300" />}
                  details={["Identifies key sections", "Extracts methodology & findings", "Generates concise summary"]}
                />
              </div>
              <div className="h-full flex">
                <WorkflowStep
                  number="03"
                  title="Review & Share"
                  description="Edit the summary, add annotations, and share with colleagues."
                  icon={<Share2 className="h-6 w-6 text-zinc-700 dark:text-zinc-300" />}
                  details={["Customize summaries", "Add personal notes", "Share via link or export"]}
                />
              </div>
            </div>

            {/* Interactive Demo Button */}
            <div className="mt-16 text-center">
              <Button size="lg" variant="outline" className="group">
                <span>See Interactive Demo</span>
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.03)_0,rgba(0,0,0,0)_50%)] dark:bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_0,rgba(255,255,255,0)_50%)]" />
        </div>

        <div className="container px-4 md:px-6 relative mx-auto">
          <div
            className="max-w-3xl mx-auto"
        
          >
            <div className="relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-8 shadow-lg dark:border-zinc-800 dark:bg-black">
              <div className="absolute -top-16 -right-16 h-40 w-40 rounded-full bg-gradient-to-br from-zinc-100 to-zinc-200 blur-3xl dark:from-zinc-800 dark:to-zinc-900"></div>
              <div className="absolute -bottom-16 -left-16 h-40 w-40 rounded-full bg-gradient-to-br from-zinc-200 to-zinc-100 blur-3xl dark:from-zinc-900 dark:to-zinc-800"></div>

              <div className="relative">
                <div className="flex flex-col items-center justify-center space-y-4 text-center">
                  <div className="space-y-2">
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-zinc-900 dark:text-zinc-100">
                      Ready to Transform Your Research?
                    </h2>
                    <p className="mx-auto max-w-[600px] text-zinc-500 md:text-xl/relaxed dark:text-zinc-400">
                      Join thousands of researchers who are already using Inquiro to streamline their workflow.
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4 min-[400px]:gap-3 pt-4">
                    <Link href="/signup">
                      <Button
                        size="lg"
                        className="gap-1.5 h-12 px-6 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-zinc-200 dark:text-zinc-900 text-zinc-100 border-0 shadow-sm transition-all duration-200"
                      >
                        <span>Sign Up Now</span>
                        <div
                          
                        >
                          <ArrowRight className="h-4 w-4 ml-1" />
                        </div>
                      </Button>
                    </Link>
                    <Link href="/signin">
                      <Button
                        size="lg"
                        variant="outline"
                        className="h-12 px-6 border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all duration-200"
                      >
                        Sign In
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="border-t py-12 bg-zinc-50 dark:bg-zinc-900">
              <div className="container px-4 md:px-6 mx-auto">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                  <div>
                    <h3 className="text-sm font-medium mb-3">Product</h3>
                    <ul className="space-y-2 text-sm">
                      <li>
                        <a
                          href="#"
                          className="text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                        >
                          Features
                        </a>
                      </li>
                      <li>
                        <a
                          href="#"
                          className="text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                        >
                          Pricing
                        </a>
                      </li>
                      <li>
                        <a
                          href="#"
                          className="text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                        >
                          FAQ
                        </a>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium mb-3">Company</h3>
                    <ul className="space-y-2 text-sm">
                      <li>
                        <a
                          href="#"
                          className="text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                        >
                          About
                        </a>
                      </li>
                      <li>
                        <a
                          href="#"
                          className="text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                        >
                          Blog
                        </a>
                      </li>
                      <li>
                        <a
                          href="#"
                          className="text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                        >
                          Careers
                        </a>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium mb-3">Resources</h3>
                    <ul className="space-y-2 text-sm">
                      <li>
                        <a
                          href="#"
                          className="text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                        >
                          Documentation
                        </a>
                      </li>
                      <li>
                        <a
                          href="#"
                          className="text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                        >
                          Help Center
                        </a>
                      </li>
                      <li>
                        <a
                          href="#"
                          className="text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                        >
                          Community
                        </a>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium mb-3">Legal</h3>
                    <ul className="space-y-2 text-sm">
                      <li>
                        <a
                          href="#"
                          className="text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                        >
                          Privacy Policy
                        </a>
                      </li>
                      <li>
                        <a
                          href="#"
                          className="text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                        >
                          Terms of Service
                        </a>
                      </li>
                      <li>
                        <a
                          href="#"
                          className="text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                        >
                          Cookie Policy
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="mt-12 pt-8 border-t border-zinc-200 dark:border-zinc-800 flex flex-col md:flex-row justify-between items-center">
                  <div className="flex items-center mb-4 md:mb-0">
                    <div className="relative flex items-center">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-900">
                        <Brain className="w-4 h-4 text-zinc-800 dark:text-zinc-200" />
                      </div>
                      <span className="ml-2 text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-zinc-800 to-zinc-600 dark:from-zinc-200 dark:to-zinc-400">
                        Inquiro
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">© 2025 Inquiro. All rights reserved.</p>
                </div>
              </div>
      </footer>
      
    </div>
  )
}

interface FeatureCardProps {
  icon: React.ReactNode
  title: string
  description: string
  isHighlighted?: boolean
  isComingSoon?: boolean
}

function FeatureCard({ icon, title, description, isHighlighted, isComingSoon }: FeatureCardProps) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-xl border p-6 shadow-sm transition-all duration-300 hover:shadow-md",
        isHighlighted
          ? "border-zinc-300 dark:border-zinc-700 bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-zinc-800"
          : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950",
        isComingSoon && "border-dashed",
      )}
    >
      <div className="absolute top-0 right-0 h-20 w-20 translate-x-8 -translate-y-8 transform rounded-full bg-zinc-100 opacity-20 transition-transform group-hover:translate-x-6 group-hover:-translate-y-6 dark:bg-zinc-800"></div>

      <div className="relative space-y-4">
        <div
          className={cn(
            "inline-flex h-10 w-10 items-center justify-center rounded-lg",
            isHighlighted
              ? "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100"
              : "bg-zinc-100 text-zinc-800 dark:bg-zinc-900 dark:text-zinc-200",
          )}
        >
          {icon}
        </div>

        <div className="space-y-2">
          <h3 className="text-xl font-bold">
            {title}
            {isComingSoon && (
              <span className="ml-2 inline-flex items-center rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-800 dark:bg-zinc-800 dark:text-zinc-300">
                Soon
              </span>
            )}
          </h3>
          <p className="text-zinc-500 dark:text-zinc-400">{description}</p>
        </div>

        <div className="pt-2">
          <Link
            href="#"
            className="inline-flex items-center text-sm font-medium text-zinc-900 hover:text-zinc-700 dark:text-zinc-100 dark:hover:text-zinc-300"
          >
            Learn more <ChevronRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}

interface WorkflowStepProps {
  number: string
  title: string
  description: string
  icon: React.ReactNode
  details: string[]
}

function WorkflowStep({ number, title, description, icon, details }: WorkflowStepProps) {
  return (
    <div className="flex flex-col items-center text-center relative group">
      {/* Number Circle with Glow */}
      <div className="relative mb-6 z-10">
        <div className="absolute inset-0 rounded-full bg-zinc-300 dark:bg-zinc-700 blur-md opacity-70 group-hover:opacity-100 transition-opacity"></div>
        <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-md dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 group-hover:shadow-lg transition-all">
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-zinc-700 to-zinc-900 dark:from-zinc-300 dark:to-zinc-100">
            {number}
          </span>
        </div>
      </div>

      {/* Content Card - Fixed height with flex-grow for content */}
      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm group-hover:shadow-md transition-all w-full h-full flex flex-col">
        <div className="flex justify-center mb-4">
          <div className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800">{icon}</div>
        </div>
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-zinc-500 dark:text-zinc-400 mb-4">{description}</p>

        {/* Details List - Using flex-grow to push it to the bottom */}
        <ul className="space-y-2 text-left text-sm mt-auto">
          {details.map((detail, index) => (
            <li key={index} className="flex items-start">
              <div className="mr-2 mt-1 h-1.5 w-1.5 rounded-full bg-zinc-400 dark:bg-zinc-600 flex-shrink-0"></div>
              <span className="text-zinc-700 dark:text-zinc-300">{detail}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

function SidebarItem({ active, isFolder }: { active?: boolean; isFolder?: boolean }) {
  return (
    <div
      className={cn(
        "flex items-center p-2 rounded-lg transition-all duration-200",
        active ? "bg-zinc-100 dark:bg-zinc-800" : "hover:bg-zinc-50 dark:hover:bg-zinc-900/50",
        isFolder && "mt-1",
      )}
    >
      <div
        className={cn(
          "h-4 w-4 rounded mr-2",
          isFolder ? "bg-zinc-200 dark:bg-zinc-700" : "bg-zinc-200 dark:bg-zinc-700",
        )}
      ></div>
      <div className="h-3 w-full bg-zinc-100 dark:bg-zinc-800 rounded"></div>
      {active && <div className="h-3 w-3 rounded-full bg-zinc-400 dark:bg-zinc-600 ml-auto"></div>}
    </div>
  )
}
