"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, Users, MessageCircle, Eye, Ban, ImageIcon, Smile, ExternalLink } from "lucide-react"

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const rules = [
  {
    icon: Shield,
    title: "Follow Discord's TOS",
    description: "All members must follow Discord's Terms of Service and Community Guidelines.",
    details: [
      "Discord Terms of Service: https://discordapp.com/terms",
      "Discord Community Guidelines: https://discordapp.com/guidelines",
    ],
    severity: "critical",
  },
  {
    icon: Users,
    title: "Be Respectful with All Members",
    description: "Treat everyone with respect and maintain a positive environment.",
    details: [
      "No death threats, sexism, hate speech, or racism",
      "NO N WORD (this includes soft N)",
      "No doxxing, swatting, or witch hunting",
    ],
    severity: "high",
  },
  {
    icon: Eye,
    title: "No NSFW Content",
    description: "Keep all content appropriate and safe for work.",
    details: [
      "No gore or sexual content allowed",
      "NSFW = Not Safe for Work",
      "This applies to all channels and content",
    ],
    severity: "high",
  },
  {
    icon: MessageCircle,
    title: "No Spamming in Text or VC",
    description: "Avoid disrupting conversations with spam or excessive noise.",
    details: [
      "Do not spam messages in any channel",
      "No soundboards, voice changers, or earrape in voice channels",
      "Keep conversations meaningful and on-topic",
    ],
    severity: "medium",
  },
  {
    icon: Ban,
    title: "No Sensitive Topics",
    description: "Keep controversial discussions out of the server.",
    details: [
      "This isn't a debating server",
      "Avoid sensitive topics to prevent arguments",
      "Focus on gaming and community discussions",
    ],
    severity: "medium",
  },
  {
    icon: Shield,
    title: "No Malicious Content",
    description: "Sharing harmful content will result in immediate action.",
    details: [
      "No grabify links, viruses, or crash videos",
      "No links to viruses or token grabbers",
      "These violations result in automated bans",
    ],
    severity: "critical",
  },
  {
    icon: Ban,
    title: "No Self Bots",
    description: "Automated accounts and bots are strictly prohibited.",
    details: [
      "No nitro snipers or selfbots like nighty",
      "No auto-changing statuses",
      "All kinds of selfbots are banned",
    ],
    severity: "high",
  },
  {
    icon: ImageIcon,
    title: "Profile Picture / Banner Rules",
    description: "Keep your profile appropriate and safe.",
    details: [
      "No NSFW content allowed",
      "No racist imagery",
      "No brightly flashing pictures that could induce epileptic attacks",
    ],
    severity: "medium",
  },
  {
    icon: Smile,
    title: "Emoji Rules",
    description: "Custom emojis must follow the same guidelines.",
    details: [
      "No NSFW content allowed",
      "No racist imagery",
      "No brightly flashing pictures that could induce epileptic attacks",
    ],
    severity: "medium",
  },
]

const getSeverityBadge = (severity: string) => {
  const badges = {
    critical: "bg-red-500 text-white",
    high: "bg-orange-500 text-white",
    medium: "bg-yellow-500 text-black",
    low: "bg-green-500 text-white",
  }
  return badges[severity as keyof typeof badges] || badges.medium
}

export default function RulesPage() {
  return (
    <div className="min-h-screen py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold mb-6">
            <span className="valor-gradient">Valor</span> <span className="network-text">Network</span> Rules
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Please read and follow these rules to maintain a positive and safe community for everyone.
          </p>
        </motion.div>

        {/* Important Notice */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12"
        >
          <Card className="border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20">
            <CardHeader>
              <CardTitle className="text-red-700 dark:text-red-300 flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Important Notice
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-red-600 dark:text-red-400">
                Violation of these rules may result in warnings, temporary mutes, kicks, or permanent bans depending on
                the severity. All staff decisions are final. If you have questions about the rules, please contact a
                staff member.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Rules Grid */}
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
        >
          {rules.map((rule, index) => (
            <motion.div key={index} variants={fadeInUp}>
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <rule.icon className="h-8 w-8 text-blue-500" />
                    <Badge className={getSeverityBadge(rule.severity)}>{rule.severity.toUpperCase()}</Badge>
                  </div>
                  <CardTitle className="text-lg">{rule.title}</CardTitle>
                  <CardDescription>{rule.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {rule.details.map((detail, detailIndex) => (
                      <li key={detailIndex} className="text-sm text-gray-600 dark:text-gray-300 flex items-start">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        {detail.includes("http") ? (
                          <a
                            href={detail}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                          >
                            {detail}
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        ) : (
                          detail
                        )}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Discord Links */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center"
        >
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
            <CardHeader>
              <CardTitle>Discord Community Guidelines</CardTitle>
              <CardDescription>Make sure to also review Discord's official policies</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="https://discordapp.com/terms"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2 justify-center"
                >
                  <ExternalLink className="w-4 h-4" />
                  Discord Terms of Service
                </a>
                <a
                  href="https://discordapp.com/guidelines"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2 justify-center"
                >
                  <ExternalLink className="w-4 h-4" />
                  Community Guidelines
                </a>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                By participating in our community, you agree to follow both our server rules and Discord's official
                policies.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
