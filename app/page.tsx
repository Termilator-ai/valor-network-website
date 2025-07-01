"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Zap, Shield, Trophy, MessageCircle, Vote, Crown } from "lucide-react"
import { useEffect, useState } from "react"
import Link from "next/link"
import AdBanner from "@/components/AdBanner"

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

const features = [
  {
    icon: Users,
    title: "Cross-Platform",
    description: "Play with friends across Java, eagler and Bedrock editions",
  },
  {
    icon: Zap,
    title: "High Performance",
    description: "Optimized servers for lag-free gameplay",
  },
  {
    icon: Shield,
    title: "Anti-Cheat",
    description: "Advanced protection against cheaters and exploits",
  },
  {
    icon: Trophy,
    title: "Competitive",
    description: "Ranked factions with seasonal rewards",
  },
]

export default function HomePage() {
  const [playerCount, setPlayerCount] = useState<number | null>(null)
const [maxPlayers, setMaxPlayers] = useState<number | null>(null)

useEffect(() => {
  const fetchPlayerData = async () => {
    try {
      const res = await fetch("https://mcapi.us/server/status?ip=valormc.lol")
      const data = await res.json()
      if (data && data.online) {
        setPlayerCount(data.players.now)
        setMaxPlayers(data.players.max)
      } else {
        setPlayerCount(null)
        setMaxPlayers(null)
      }
    } catch (err) {
      console.error("Error fetching player data:", err)
      setPlayerCount(null)
      setMaxPlayers(null)
    }
  }

  fetchPlayerData()

  // Optional auto-refresh every 30 seconds
  const interval = setInterval(fetchPlayerData, 30000)
  return () => clearInterval(interval)
}, [])

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="hero-bg py-20 px-4">
        <div className="container mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <h1 className="text-5xl md:text-7xl font-bold mb-4">
              Welcome to <span className="valor-gradient">Valor</span> <span className="network-text">Network</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              The Ultimate Cross-Platform Factions Server
            </p>
                       <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <a href="https://valormc.lol/discord" target="_blank" rel="noopener noreferrer" >
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-8 py-3"
                  >
                    <MessageCircle className="mr-2 h-5 w-5" />
                    Join Discord
                  </Button>
                </a>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <a href="https://valormc.lol/vote/" target="_blank" rel="noopener noreferrer" >
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-purple-500 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 px-8 py-3"
                  >
                    <Vote className="mr-2 h-5 w-5" />
                    Vote for Us
                  </Button>
                </a>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <a href="https://valormc.lol/store/" target="_blank" rel="noopener noreferrer" >
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-8 py-3"
                  >
                    <Crown className="mr-2 h-5 w-5" />
                    Buy Ranks
                  </Button>
                </a>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeInUp} className="text-4xl font-bold mb-4">
              Why Choose <span className="valor-gradient">Valor</span> <span className="network-text">Network</span>?
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Experience the ultimate factions gameplay with cutting-edge features and a thriving community
            </motion.p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {features.map((feature, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardHeader className="text-center">
                    <feature.icon className="h-12 w-12 mx-auto mb-4 text-blue-500" />
                    <CardTitle>{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-center dark:text-gray-300">{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Server Info Section */}
      <section className="py-20 px-4 bg-gray-50 dark:bg-gray-800/50">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h2 className="text-4xl font-bold mb-8">Server Information</h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle>Java Edition</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-mono font-bold text-blue-600 mb-3">valormc.lol</p>
                  <div className="flex gap-2 justify-center">
                    <Badge
                      variant="secondary"
                      className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                    >
                      v1.9-1.21.5
                    </Badge>
                    <Badge
                      variant="secondary"
                      className="bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                    >
                      Port 25565
                    </Badge>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Eaglercraft Edition</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-mono font-bold text-purple-600 mb-3">wss://valormc.lol</p>
                  <div className="flex gap-2 justify-center">
                    <Badge
                      variant="secondary"
                      className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
                    >
                      v1.8.8
                    </Badge>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Players Online</CardTitle>
                </CardHeader>
                <CardContent>
                  {playerCount !== null && maxPlayers !== null ? (
                    <p className="text-3xl font-bold text-green-600">
                      {playerCount.toLocaleString()} / {maxPlayers}
                    </p>
                  ) : (
                    <p className="text-lg text-red-500">network unreachable</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
