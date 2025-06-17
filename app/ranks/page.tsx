"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Crown, Star, Zap, Shield } from "lucide-react"

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
}

const ranks = [
  {
    name: "VIP",
    price: "$9.99",
    color: "from-green-400 to-green-600",
    icon: Star,
    popular: false,
    features: [
      "Colored name in chat",
      "Access to /kit vip",
      "Priority queue access",
      "2x daily rewards",
      "Access to VIP lounge",
    ],
  },
  {
    name: "VIP+",
    price: "$19.99",
    color: "from-blue-400 to-blue-600",
    icon: Zap,
    popular: true,
    features: [
      "All VIP features",
      "Access to /kit vipplus",
      "Fly in spawn areas",
      "3x daily rewards",
      "Custom join messages",
      "Access to exclusive events",
    ],
  },
  {
    name: "MVP",
    price: "$39.99",
    color: "from-purple-400 to-purple-600",
    icon: Crown,
    popular: false,
    features: [
      "All VIP+ features",
      "Access to /kit mvp",
      "Teleportation commands",
      "5x daily rewards",
      "Custom death messages",
      "Priority support",
      "Exclusive cosmetics",
    ],
  },
  {
    name: "LEGEND",
    price: "$79.99",
    color: "from-orange-400 to-red-600",
    icon: Shield,
    popular: false,
    features: [
      "All MVP features",
      "Access to /kit legend",
      "World edit permissions",
      "10x daily rewards",
      "Custom particle effects",
      "Beta feature access",
      "Exclusive titles",
      "Monthly bonus crates",
    ],
  },
]

export default function RanksPage() {
  return (
    <div className="min-h-screen py-20 px-4">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold mb-6">
            <span className="valor-gradient">Valor</span> <span className="network-text">Network</span> Ranks
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Unlock exclusive features, perks, and privileges with our premium ranks. Support the server while enhancing
            your gameplay experience.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {ranks.map((rank, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="relative"
            >
              {rank.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                  <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-1">
                    Most Popular
                  </Badge>
                </div>
              )}
              <Card
                className={`h-full ${rank.popular ? "ring-2 ring-yellow-400 shadow-xl" : "hover:shadow-lg"} transition-all duration-300`}
              >
                <CardHeader className="text-center pb-4">
                  <div
                    className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${rank.color} flex items-center justify-center`}
                  >
                    <rank.icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl font-bold">{rank.name}</CardTitle>
                  <CardDescription className="text-3xl font-bold text-gray-900">{rank.price}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-3">
                    {rank.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-600 dark:text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className={`w-full bg-gradient-to-r ${rank.color} hover:opacity-90 text-white font-semibold py-3`}
                    size="lg"
                  >
                    Purchase {rank.name}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-16 text-center"
        >
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl">Important Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-left">
              <div className="space-y-2">
                <h4 className="font-semibold">Payment & Delivery</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  All purchases are processed securely through Tebex. Ranks are delivered instantly after payment
                  confirmation.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">Refund Policy</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Refunds are available within 7 days of purchase if no benefits have been used. Contact support for
                  assistance.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">Terms of Service</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  By purchasing a rank, you agree to our Terms of Service. Ranks are non-transferable and subject to our
                  community guidelines.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
