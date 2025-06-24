"use client"

import { motion } from "framer-motion"

export default function ForumsPage() {
  return (
    <div className="min-h-screen flex items-center justify-center py-20 px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center"
      >
        <h1 className="text-2xl font-bold mb-4">Forums have moved!</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
          The community forums have been moved to a new platform. Please visit the new forums to continue the discussion and connect with other members.
        </p>
        <a
          href="https://forum.ismaeltech.com"
          className="inline-block px-6 py-3 text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-all"
        >
          Go to Forums
        </a>
      </motion.div>
    </div>
  )
}
