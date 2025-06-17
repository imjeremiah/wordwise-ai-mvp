import { UsageStats } from "@/actions/ai-suggestions-actions"

/**
 * Utility: Calculate readability score for display
 */
export function getReadabilityDescription(score: number): {
  level: string
  description: string
  color: string
} {
  console.log(
    "[getReadabilityDescription] Calculating description for score:",
    score
  )

  if (score <= 6) {
    return {
      level: "Very Easy",
      description: "5th grade reading level",
      color: "text-green-600"
    }
  }

  if (score <= 9) {
    return {
      level: "Easy",
      description: "8th-9th grade reading level",
      color: "text-green-500"
    }
  }

  if (score <= 13) {
    return {
      level: "Standard",
      description: "High school reading level",
      color: "text-yellow-500"
    }
  }

  if (score <= 16) {
    return {
      level: "Difficult",
      description: "College reading level",
      color: "text-orange-500"
    }
  }

  return {
    level: "Very Difficult",
    description: "Graduate reading level",
    color: "text-red-500"
  }
}

/**
 * Utility: Format processing time for display
 */
export function formatProcessingTime(milliseconds: number): string {
  if (milliseconds < 1000) {
    return `${milliseconds}ms`
  }

  const seconds = (milliseconds / 1000).toFixed(1)
  return `${seconds}s`
}

/**
 * Utility: Check if user is near rate limit
 */
export function isNearRateLimit(usage: UsageStats): {
  warning: boolean
  message?: string
  urgency: "none" | "low" | "medium" | "high"
} {
  console.log("[isNearRateLimit] Checking rate limit status")

  const monthlyPercent = (usage.monthly.used / usage.monthly.limit) * 100
  const dailyPercent = (usage.daily.used / usage.daily.limit) * 100
  const hourlyPercent = (usage.hourly.used / usage.hourly.limit) * 100

  console.log(
    "[isNearRateLimit] Usage percentages - Monthly:",
    monthlyPercent,
    "Daily:",
    dailyPercent,
    "Hourly:",
    hourlyPercent
  )

  if (monthlyPercent >= 95 || dailyPercent >= 95 || hourlyPercent >= 95) {
    return {
      warning: true,
      message: "You're very close to your usage limit",
      urgency: "high"
    }
  }

  if (monthlyPercent >= 80 || dailyPercent >= 80 || hourlyPercent >= 80) {
    return {
      warning: true,
      message: "You've used most of your suggestions for this period",
      urgency: "medium"
    }
  }

  if (monthlyPercent >= 60 || dailyPercent >= 60 || hourlyPercent >= 60) {
    return {
      warning: true,
      message: "You're approaching your usage limit",
      urgency: "low"
    }
  }

  return {
    warning: false,
    urgency: "none"
  }
}
