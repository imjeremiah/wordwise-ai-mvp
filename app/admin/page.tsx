"use client"

/*
<ai_context>
Admin Dashboard for WordWise AI
Monitors AI usage, performance metrics, rate limiting, and system health
Shows Firestore quota usage and GPT-4o token consumption
</ai_context>
*/

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import {
  BarChart3,
  Clock,
  TrendingUp,
  AlertTriangle,
  Zap,
  Database,
  Users,
  Activity,
  RefreshCw,
  Eye,
  Cpu
} from "lucide-react"
import {
  getUserUsageAction,
  type UsageStats
} from "@/actions/ai-suggestions-actions"
import { getRecentLogsAction } from "@/actions/db/logs-actions"
import { useAuthState } from "react-firebase-hooks/auth"
import { auth } from "@/lib/firebase-client"

interface PerformanceMetrics {
  averageResponseTime: number
  cacheHitRate: number
  totalRequests: number
  errorRate: number
  activeUsers: number
}

interface SystemHealth {
  firestoreQuota: {
    reads: { used: number; limit: number }
    writes: { used: number; limit: number }
    deletes: { used: number; limit: number }
  }
  aiTokenUsage: {
    totalTokens: number
    promptTokens: number
    completionTokens: number
    cost: number
  }
  errorCount: number
  uptime: string
}

export default function AdminPage() {
  const [user] = useAuthState(auth)
  const [userUsage, setUserUsage] = useState<UsageStats | null>(null)
  const [performanceMetrics, setPerformanceMetrics] =
    useState<PerformanceMetrics | null>(null)
  const [systemHealth, setSystemHealth] = useState<SystemHealth | null>(null)
  const [recentLogs, setRecentLogs] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const { toast } = useToast()

  console.log("[AdminPage] Component mounted")

  // Load admin data
  const loadAdminData = async () => {
    if (!user) {
      console.log("[AdminPage] No authenticated user")
      return
    }

    console.log("[AdminPage] Loading admin data for user:", user.uid)
    setIsLoading(true)

    try {
      // Get user usage stats
      const usageResult = await getUserUsageAction()
      if (usageResult.isSuccess) {
        console.log("[AdminPage] User usage loaded:", usageResult.data)
        setUserUsage(usageResult.data)
      }

      // Get recent logs for performance analysis
      const logsResult = await getRecentLogsAction("suggestion", 100)
      if (logsResult.isSuccess) {
        console.log(
          "[AdminPage] Recent logs loaded:",
          logsResult.data?.length,
          "entries"
        )
        setRecentLogs(logsResult.data || [])

        // Calculate performance metrics from logs
        const logs = logsResult.data || []
        const suggestionLogs = logs.filter(
          log =>
            log.eventType === "suggestion" &&
            log.payload?.action === "request" &&
            log.payload?.metadata?.processingTime
        )

        if (suggestionLogs.length > 0) {
          const totalTime = suggestionLogs.reduce(
            (sum, log) => sum + (log.payload?.metadata?.processingTime || 0),
            0
          )
          const avgTime = totalTime / suggestionLogs.length

          const cachedRequests = suggestionLogs.filter(
            log => log.payload?.metadata?.cached
          ).length
          const cacheRate = (cachedRequests / suggestionLogs.length) * 100

          const errorLogs = logs.filter(
            log =>
              log.eventType === "error" ||
              (log.eventType === "suggestion" && log.payload?.error)
          ).length
          const errorRate = (errorLogs / logs.length) * 100

          const uniqueUsers = new Set(logs.map(log => log.uid)).size

          const metrics: PerformanceMetrics = {
            averageResponseTime: Math.round(avgTime),
            cacheHitRate: Math.round(cacheRate),
            totalRequests: suggestionLogs.length,
            errorRate: Math.round(errorRate * 10) / 10,
            activeUsers: uniqueUsers
          }

          console.log("[AdminPage] Performance metrics calculated:", metrics)
          setPerformanceMetrics(metrics)
        }

        // Calculate AI token usage
        const tokenUsage = suggestionLogs.reduce(
          (total, log) => {
            const usage = log.payload?.metadata?.usage
            if (usage) {
              return {
                totalTokens: total.totalTokens + (usage.totalTokens || 0),
                promptTokens: total.promptTokens + (usage.promptTokens || 0),
                completionTokens:
                  total.completionTokens + (usage.completionTokens || 0)
              }
            }
            return total
          },
          { totalTokens: 0, promptTokens: 0, completionTokens: 0 }
        )

        // GPT-4o pricing: ~$0.01 per 1K tokens (rough estimate)
        const estimatedCost = (tokenUsage.totalTokens / 1000) * 0.01

        const health: SystemHealth = {
          firestoreQuota: {
            reads: { used: logs.length * 2, limit: 50000 }, // Rough estimates
            writes: {
              used: logs.filter(l => l.eventType !== "suggestion").length,
              limit: 20000
            },
            deletes: { used: 0, limit: 20000 }
          },
          aiTokenUsage: {
            ...tokenUsage,
            cost: Math.round(estimatedCost * 100) / 100
          },
          errorCount: logs.filter(l => l.eventType === "error").length,
          uptime: "99.9%" // Mock uptime
        }

        console.log("[AdminPage] System health calculated:", health)
        setSystemHealth(health)
      }

      setLastUpdated(new Date())
    } catch (error) {
      console.error("[AdminPage] Error loading admin data:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load admin data"
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadAdminData()
  }, [user])

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      console.log("[AdminPage] Auto-refreshing data")
      loadAdminData()
    }, 30000)

    return () => clearInterval(interval)
  }, [user])

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <Card className="w-96">
          <CardContent className="pt-6 text-center">
            <AlertTriangle className="mx-auto mb-4 size-12 text-yellow-500" />
            <h2 className="mb-2 text-lg font-semibold">
              Authentication Required
            </h2>
            <p className="text-gray-600">
              Please sign in to access the admin dashboard.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Admin Dashboard
            </h1>
            <p className="text-gray-600">WordWise AI System Monitoring</p>
            {lastUpdated && (
              <p className="mt-1 text-xs text-gray-500">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </p>
            )}
          </div>
          <Button
            onClick={loadAdminData}
            disabled={isLoading}
            variant="outline"
          >
            <RefreshCw
              className={`mr-2 size-4 ${isLoading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>

        {/* System Status */}
        <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                System Health
              </CardTitle>
              <Activity className="size-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {systemHealth?.uptime || "Loading..."}
              </div>
              <p className="text-xs text-green-600">Uptime</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Requests
              </CardTitle>
              <BarChart3 className="size-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {performanceMetrics?.totalRequests || 0}
              </div>
              <p className="text-xs text-blue-600">AI Suggestions</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Users
              </CardTitle>
              <Users className="size-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {performanceMetrics?.activeUsers || 0}
              </div>
              <p className="text-xs text-purple-600">Last 24h</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Error Rate</CardTitle>
              <AlertTriangle className="size-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {performanceMetrics?.errorRate || 0}%
              </div>
              <p className="text-xs text-red-600">System Errors</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Performance Metrics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Cpu className="size-5 text-blue-600" />
                Performance Metrics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="mb-1 flex justify-between text-sm">
                  <span>Average Response Time</span>
                  <span>{performanceMetrics?.averageResponseTime || 0}ms</span>
                </div>
                <Progress
                  value={Math.min(
                    100,
                    (performanceMetrics?.averageResponseTime || 0) / 30
                  )}
                  className="h-2"
                />
              </div>

              <div>
                <div className="mb-1 flex justify-between text-sm">
                  <span>Cache Hit Rate</span>
                  <span>{performanceMetrics?.cacheHitRate || 0}%</span>
                </div>
                <Progress
                  value={performanceMetrics?.cacheHitRate || 0}
                  className="h-2"
                />
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-blue-600">
                    {performanceMetrics?.totalRequests || 0}
                  </div>
                  <div className="text-xs text-gray-600">Total Requests</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    {performanceMetrics?.cacheHitRate || 0}%
                  </div>
                  <div className="text-xs text-gray-600">Cache Efficiency</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* User Rate Limiting */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="size-5 text-orange-600" />
                Rate Limiting Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {userUsage ? (
                <>
                  <div>
                    <div className="mb-1 flex justify-between text-sm">
                      <span>Monthly Usage</span>
                      <span>
                        {userUsage.monthly.used}/{userUsage.monthly.limit}
                      </span>
                    </div>
                    <Progress
                      value={
                        (userUsage.monthly.used / userUsage.monthly.limit) * 100
                      }
                      className="h-2"
                    />
                  </div>

                  <div>
                    <div className="mb-1 flex justify-between text-sm">
                      <span>Daily Usage</span>
                      <span>
                        {userUsage.daily.used}/{userUsage.daily.limit}
                      </span>
                    </div>
                    <Progress
                      value={
                        (userUsage.daily.used / userUsage.daily.limit) * 100
                      }
                      className="h-2"
                    />
                  </div>

                  <div>
                    <div className="mb-1 flex justify-between text-sm">
                      <span>Hourly Usage</span>
                      <span>
                        {userUsage.hourly.used}/{userUsage.hourly.limit}
                      </span>
                    </div>
                    <Progress
                      value={
                        (userUsage.hourly.used / userUsage.hourly.limit) * 100
                      }
                      className="h-2"
                    />
                  </div>

                  <Separator />

                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div>
                      <div className="text-lg font-bold text-blue-600">
                        {userUsage.monthly.remaining}
                      </div>
                      <div className="text-xs text-gray-600">Monthly Left</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-green-600">
                        {userUsage.daily.remaining}
                      </div>
                      <div className="text-xs text-gray-600">Daily Left</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-orange-600">
                        {userUsage.hourly.remaining}
                      </div>
                      <div className="text-xs text-gray-600">Hourly Left</div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="py-8 text-center">
                  <div className="mx-auto mb-2 size-8 animate-spin rounded-full border-b-2 border-orange-600"></div>
                  <p className="text-sm text-gray-600">Loading usage data...</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* AI Token Usage */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="size-5 text-purple-600" />
                AI Token Usage
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {systemHealth ? (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-xl font-bold text-purple-600">
                        {systemHealth.aiTokenUsage.totalTokens.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-600">Total Tokens</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-green-600">
                        ${systemHealth.aiTokenUsage.cost}
                      </div>
                      <div className="text-xs text-gray-600">
                        Estimated Cost
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Prompt Tokens</span>
                      <span>
                        {systemHealth.aiTokenUsage.promptTokens.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Completion Tokens</span>
                      <span>
                        {systemHealth.aiTokenUsage.completionTokens.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="py-8 text-center">
                  <div className="mx-auto mb-2 size-8 animate-spin rounded-full border-b-2 border-purple-600"></div>
                  <p className="text-sm text-gray-600">Calculating usage...</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Firestore Quota */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="size-5 text-blue-600" />
                Firestore Quota
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {systemHealth ? (
                <>
                  <div>
                    <div className="mb-1 flex justify-between text-sm">
                      <span>Reads</span>
                      <span>
                        {systemHealth.firestoreQuota.reads.used.toLocaleString()}
                        /
                        {systemHealth.firestoreQuota.reads.limit.toLocaleString()}
                      </span>
                    </div>
                    <Progress
                      value={
                        (systemHealth.firestoreQuota.reads.used /
                          systemHealth.firestoreQuota.reads.limit) *
                        100
                      }
                      className="h-2"
                    />
                  </div>

                  <div>
                    <div className="mb-1 flex justify-between text-sm">
                      <span>Writes</span>
                      <span>
                        {systemHealth.firestoreQuota.writes.used.toLocaleString()}
                        /
                        {systemHealth.firestoreQuota.writes.limit.toLocaleString()}
                      </span>
                    </div>
                    <Progress
                      value={
                        (systemHealth.firestoreQuota.writes.used /
                          systemHealth.firestoreQuota.writes.limit) *
                        100
                      }
                      className="h-2"
                    />
                  </div>

                  <div>
                    <div className="mb-1 flex justify-between text-sm">
                      <span>Deletes</span>
                      <span>
                        {systemHealth.firestoreQuota.deletes.used.toLocaleString()}
                        /
                        {systemHealth.firestoreQuota.deletes.limit.toLocaleString()}
                      </span>
                    </div>
                    <Progress
                      value={
                        (systemHealth.firestoreQuota.deletes.used /
                          systemHealth.firestoreQuota.deletes.limit) *
                        100
                      }
                      className="h-2"
                    />
                  </div>
                </>
              ) : (
                <div className="py-8 text-center">
                  <div className="mx-auto mb-2 size-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
                  <p className="text-sm text-gray-600">Loading quota data...</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="size-5 text-gray-600" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentLogs.length > 0 ? (
              <div className="max-h-96 space-y-2 overflow-y-auto">
                {recentLogs.slice(0, 20).map((log, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between border-b border-gray-100 pb-2 text-sm"
                  >
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          log.eventType === "error"
                            ? "destructive"
                            : "secondary"
                        }
                      >
                        {log.eventType}
                      </Badge>
                      <span className="text-gray-600">
                        {log.payload?.action || "unknown"}
                      </span>
                      {log.payload?.metadata?.processingTime && (
                        <span className="text-xs text-gray-500">
                          ({log.payload.metadata.processingTime}ms)
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center">
                <p className="text-gray-600">No recent activity</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
