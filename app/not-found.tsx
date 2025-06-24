"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { useRef } from "react"

export default function NotFound() {
  const linkRef = useRef<HTMLAnchorElement>(null)

  // Move the link away from the cursor on hover
  const handleMouseMove = (e: React.MouseEvent) => {
    const link = linkRef.current
    if (!link) return
    const rect = link.getBoundingClientRect()
    const offsetX = e.clientX - rect.left - rect.width / 2
    const offsetY = e.clientY - rect.top - rect.height / 2
    // Move the link in the opposite direction of the cursor
    link.style.transform = `translate(${offsetX * 1.5}px, ${offsetY * 1.5}px)`
  }
  const handleMouseLeave = () => {
    const link = linkRef.current
    if (link) link.style.transform = "none"
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-900 via-purple-900 to-black text-white p-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, type: "spring" }}
        className="text-center"
      >
        <h1 className="text-7xl font-extrabold mb-4 animate-bounce">404</h1>
        <p className="text-2xl mb-6 font-bold">Oops! You found a secret void in Valor Network...</p>
        <p className="mb-8 text-lg text-purple-200">The page you’re looking for doesn’t exist, or maybe it’s just hiding from you.</p>
        <Link href="/" className="inline-block px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 rounded-full text-lg font-semibold shadow-lg transition-all">
          Return Home
        </Link>
        <div className="mt-10 animate-spin-slow">
          <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="40" cy="40" r="35" stroke="#fff" strokeWidth="6" strokeDasharray="20 10" />
          </svg>
        </div>
        <p className="mt-8 text-purple-300 italic">
          If this is a bug, just contact someone on discord,{' '}
          <a
            ref={linkRef}
            href="https://discord.com/users/1091375944524120125"
            target="_blank"
            rel="noopener noreferrer"
            className="underline text-cyan-300 hover:text-cyan-400 relative cursor-pointer"
            title="i dare u"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            Astralyix
          </a>{' '}is tired
        </p>
      </motion.div>
    </div>
  )
}
