"use client"

import { motion } from "framer-motion"

export default function RanksPage() {
  return (
    <div className="min-h-screen flex items-center justify-center py-20 px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center"
      >
        <h1 className="text-2xl font-bold mb-4">Ranks have moved!</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
          The Valor Network store and ranks have moved to a new platform. Please visit the new store to view and purchase ranks.
        </p>
        <a
          href="https://forum.ismaeltech.com/store"
          className="inline-block px-6 py-3 text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-all"
          target="_blank"
          rel="noopener noreferrer"
        >
          Go to Store
        </a>
      </motion.div>
    </div>
  )
}
