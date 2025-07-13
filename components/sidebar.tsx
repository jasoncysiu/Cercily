"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { X, Brain, BookOpen, Target, ChevronDown, ChevronRight, Info, History, Plus, Trash2, Loader2, Settings } from "lucide-react"
import { MentalModelLibrary } from "@/components/mental-model-library"
import Link from "next/link" // Ensure Link is imported
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { toast } from "sonner"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select" // Import Select components
import { Label } from "@/components/ui/label" // Import Label
import { useUserMode } from "@/providers/UserModeProvider" // Import useUserMode

interface Session {
  id: string; // This is the Notion page ID
  problem: string;
  context: string;
  activeModels: string[];
  analysis: any;
  timestamp: number;
  selectedAiModel: string;
}

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
  activeModels: string[]
  onModelToggle: (modelId: string) => void
  sessions: Session[];
  // onLoadSession: (session: Session) => void; // Removed as Link will handle navigation
  onNewSession: () => void;
  onDeleteSession: (sessionId: string) => void;
  isSessionsLoading: boolean;
  shareableLink?: string;
}

export function Sidebar({ isOpen, onClose, activeModels, onModelToggle, sessions, onNewSession, onDeleteSession, isSessionsLoading, shareableLink }: SidebarProps) {
  const [sessionsExpanded, setSessionsExpanded] = useState(true)
  const [caseStudiesExpanded, setCaseStudiesExpanded] = useState(false)
  const [quickActionsExpanded, setQuickActionsExpanded] = useState(true) // Keep Quick Actions expanded by default
  const { userMode, setUserMode } = useUserMode(); // Get userMode and setUserMode from context

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleShare = () => {
    if (shareableLink) {
      navigator.clipboard.writeText(shareableLink)
        .then(() => {
          toast.success("Link copied to clipboard!", {
            description: "Share this URL to let others view your session.",
          });
        })
        .catch((err) => {
          toast.error("Failed to copy link.", {
            description: "Please copy the link manually: " + shareableLink,
          });
          console.error("Failed to copy link:", err);
        });
    } else {
      toast.info("No shareable link available for the current view.");
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={onClose} />}

      {/* Sidebar */}
      <div
        className={`
        fixed inset-y-0 left-0 z-50 w-[65vw] max-w-[250px] sm:max-w-[280px] bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out flex flex-col
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        {/* Fixed Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0">
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 space-y-4">
            {/* Sessions Section */}
            <div>
              <Button
                variant="ghost"
                className="w-full justify-between p-2 h-auto"
                onClick={() => setSessionsExpanded(!sessionsExpanded)}
              >
                <div className="flex items-center gap-2">
                  <History className="h-4 w-4" />
                  <span className="font-semibold">Sessions</span>
                  {sessions.length > 0 && (
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                      {sessions.length} saved
                    </span>
                  )}
                </div>
                {sessionsExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </Button>

              {sessionsExpanded && (
                <div className="mt-2 space-y-2">
                  <Button variant="outline" size="sm" className="w-full justify-start gap-2" onClick={onNewSession}>
                    <Plus className="h-4 w-4" />
                    New Session
                  </Button>
                  {isSessionsLoading ? (
                    <div className="flex items-center justify-center p-4 text-gray-500">
                      <Loader2 className="h-5 w-5 animate-spin mr-2" /> Loading sessions...
                    </div>
                  ) : sessions.length === 0 ? (
                    <p className="text-sm text-gray-500 p-2">No sessions saved yet.</p>
                  ) : (
                    sessions.map((session) => (
                      <Tooltip key={session.id}>
                        <TooltipTrigger asChild>
                          <Link href={`/session/${session.id}`} passHref legacyBehavior>
                            <div
                              className="p-3 bg-gray-50 rounded-lg text-sm cursor-pointer hover:bg-gray-100 transition-colors flex items-center justify-between group"
                            >
                              <div className="flex-1 min-w-0 pr-2 select-none">
                                <div className="font-medium truncate">{session.problem}</div>
                                <div className="text-gray-600 text-xs mt-1">
                                  {session.activeModels.length} models • {formatDate(session.timestamp)}
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:bg-red-100"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onDeleteSession(session.id);
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </Link>
                        </TooltipTrigger>
                        <TooltipContent side="right" className="text-xs">
                          Session ID: {session.id}
                        </TooltipContent>
                      </Tooltip>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Mental Models Section - Now a navigation link */}
            <div>
              <Link href="/mental-models" passHref>
                <Button
                  variant="ghost"
                  className="w-full justify-between p-2 h-auto"
                  onClick={onClose}
                >
                  <div className="flex items-center gap-2">
                    <Brain className="h-4 w-4" />
                    <span className="font-semibold">Mental Model Library</span>
                  </div>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>

            {/* Case Studies Section */}
            <div>
              <Button
                variant="ghost"
                className="w-full justify-between p-2 h-auto"
                onClick={() => setCaseStudiesExpanded(!caseStudiesExpanded)}
              >
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  <span className="font-semibold">Case Studies</span>
                </div>
                {caseStudiesExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </Button>

              {caseStudiesExpanded && (
                <div className="mt-2 space-y-2">
                  <div className="p-3 bg-gray-50 rounded-lg text-sm">
                    <div className="font-medium">Naval's Career Pivot</div>
                    <div className="text-gray-600">From employee to entrepreneur</div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg text-sm">
                    <div className="font-medium">Bezos' Regret Framework</div>
                    <div className="text-gray-600">Leaving Wall Street for Amazon</div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg text-sm">
                    <div className="font-medium">Jobs' Simplicity Principle</div>
                    <div className="text-gray-600">Focus on essential features only</div>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Actions Section */}
            <div>
              <Button
                variant="ghost"
                className="w-full justify-between p-2 h-auto"
                onClick={() => setQuickActionsExpanded(!quickActionsExpanded)}
              >
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  <span className="font-semibold">Quick Actions</span>
                </div>
                {quickActionsExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </Button>

              {quickActionsExpanded && (
                <div className="mt-2 space-y-3">
                  {/* User Mode Selection */}
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <Label htmlFor="user-mode-select" className="text-sm font-medium mb-2 block">
                      User Mode:
                    </Label>
                    <Select value={userMode} onValueChange={(value) => setUserMode(value as "QuickThinker" | "OverThinker")}>
                      <SelectTrigger id="user-mode-select" className="w-full">
                        <SelectValue placeholder="Select user mode" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="QuickThinker">QuickThinker (Simple)</SelectItem>
                        <SelectItem value="OverThinker">OverThinker (Detailed)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                    <Settings className="h-4 w-4" />
                    Settings
                  </Button>
                  {/* Instructions */}
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Info className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm text-blue-900 mb-2">How Cercily Works</h4>
                        <p className="text-xs text-blue-800 mb-3 leading-relaxed">
                          <strong>Value:</strong> Transform any decision into a structured framework with AI-powered
                          mental models and Naval's wisdom.
                        </p>

                        <div className="space-y-2 text-xs text-blue-700">
                          <div className="flex items-start gap-2">
                            <span className="w-4 h-4 bg-blue-200 rounded-full flex items-center justify-center text-blue-800 font-bold text-[10px] flex-shrink-0 mt-0.5">
                              1
                            </span>
                            <span>Describe your problem in the main input</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <span className="w-4 h-4 bg-blue-200 rounded-full flex items-center justify-center text-blue-800 font-bold text-[10px] flex-shrink-0 mt-0.5">
                              2
                            </span>
                            <span>AI analyzes and suggests relevant mental models with % match</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <span className="w-4 h-4 bg-blue-200 rounded-full flex items-center justify-center text-blue-800 font-bold text-[10px] flex-shrink-0 mt-0.5">
                              3
                            </span>
                            <span>Select models to customize your decision framework</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <span className="w-4 h-4 bg-blue-200 rounded-full flex items-center justify-center text-blue-800 font-bold text-[10px] flex-shrink-0 mt-0.5">
                              4
                            </span>
                            <span>Explore visual canvas, pro/con analysis, and Naval's case studies</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}