'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import Sidebar from '@/components/layout/Sidebar'

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50">
      {/* Background watermark image */}
      <div className="fixed inset-0 pointer-events-none select-none">
        <Image
          src="/kcip.png"
          alt=""
          fill
          className="object-cover opacity-60"
        />
      </div>
      
      <Sidebar />
      
      <main className="flex-1 flex flex-col items-center justify-center p-8 relative">
        {/* Glassmorphism card */}
        <motion.div

          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="bg-white/70 backdrop-blur-md border border-white/50 
                     shadow-xl rounded-2xl p-12 text-center max-w-2xl"
        >
          {/* Logo */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
            className="relative w-40 h-40 mx-auto mb-8"
          >
            <Image
              src="/PIDC-Logo.png"
              alt="PIDC Logo"
              fill
              className="object-contain"
            />
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
            className="text-3xl md:text-4xl font-bold text-gray-900 max-w-2xl"
          >
            Pakistan Industrial Development Corporation
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-lg text-gray-500 mt-4"
          >
            Statistics Portal
          </motion.p>
        </motion.div>

        {/* Animated indicator dots */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-12 flex gap-2"
        >
          <div className="w-2 h-2 rounded-full bg-blue-600" />
          <div className="w-2 h-2 rounded-full bg-blue-600" />
          <div className="w-2 h-2 rounded-full bg-blue-600" />
        </motion.div>
      </main>
    </div>
  )
}