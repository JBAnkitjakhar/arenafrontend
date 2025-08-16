// src/app/page.tsx

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, type Variants } from 'framer-motion';
import { useAppSelector } from '@/store';
import { Code, Sparkles } from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAppSelector(state => state.auth);

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        router.push('/dashboard');
      } else {
        router.push('/auth/login');
      }
    }
  }, [isAuthenticated, isLoading, router]);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  const dotsVariants: Variants = {
    hidden: { scale: 0.8, opacity: 0.5 },
    visible: { scale: 1, opacity: 1 }
  };

  // Show loading while determining auth state
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <motion.div 
        className="absolute -top-40 -right-32 w-96 h-96 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full opacity-10 blur-3xl"
        animate={{
          y: [0, -10, 0],
          transition: {
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }
        }}
      />
      <motion.div 
        className="absolute -bottom-40 -left-32 w-96 h-96 bg-gradient-to-br from-purple-400 to-pink-600 rounded-full opacity-10 blur-3xl"
        animate={{
          y: [0, 15, 0],
          transition: {
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }
        }}
      />
      
      {/* Floating Particles */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-20"
          style={{
            left: `${10 + i * 12}%`,
            top: `${15 + i * 8}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.8, 0.2],
          }}
          transition={{
            duration: 3 + i * 0.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      <motion.div 
        className="text-center space-y-8 z-10 relative"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Logo */}
        <motion.div 
          className="flex items-center justify-center space-x-4"
          variants={itemVariants}
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <motion.div 
            className="w-24 h-24 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-3xl flex items-center justify-center shadow-2xl relative overflow-hidden"
            animate={{ 
              boxShadow: [
                "0 0 0 0 rgba(59, 130, 246, 0.7)",
                "0 0 0 20px rgba(59, 130, 246, 0)",
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Code className="h-12 w-12 text-white relative z-10" />
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400"
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-white to-transparent opacity-20"
              animate={{ x: ["-100%", "100%"] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />
          </motion.div>
        </motion.div>

        {/* Title */}
        <motion.div className="space-y-4" variants={itemVariants}>
          <motion.h1 
            className="text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"
            animate={{ 
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            transition={{ duration: 4, repeat: Infinity }}
            style={{ backgroundSize: "200% 200%" }}
          >
            AlgoArena
          </motion.h1>
          
          <motion.p 
            className="text-2xl text-gray-600 font-medium"
            variants={itemVariants}
          >
            Master Data Structures & Algorithms
          </motion.p>
        </motion.div>

        {/* Loading Animation */}
        <motion.div 
          className="flex flex-col items-center space-y-4"
          variants={itemVariants}
        >
          <motion.div 
            className="flex space-x-2"
            variants={containerVariants}
          >
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                variants={dotsVariants}
                animate={{
                  scale: [0.8, 1.2, 0.8],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </motion.div>
          
          <motion.p 
            className="text-lg text-gray-600 font-medium flex items-center space-x-2"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Sparkles className="h-5 w-5 text-yellow-500" />
            <span>Loading your coding journey...</span>
            <Sparkles className="h-5 w-5 text-yellow-500" />
          </motion.p>
        </motion.div>

        {/* Features Preview */}
        <motion.div 
          className="grid grid-cols-3 gap-8 mt-12 max-w-md mx-auto"
          variants={itemVariants}
        >
          {[
            { label: "Problems", value: "1000+", color: "from-blue-500 to-cyan-500" },
            { label: "Languages", value: "8+", color: "from-green-500 to-emerald-500" },
            { label: "Users", value: "500+", color: "from-purple-500 to-pink-500" },
          ].map((stat, index) => (
            <motion.div 
              key={index}
              className="text-center"
              whileHover={{ scale: 1.1, y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <motion.div 
                className={`text-3xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}
                animate={{ 
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{ duration: 3 + index, repeat: Infinity }}
                style={{ backgroundSize: "200% 200%" }}
              >
                {stat.value}
              </motion.div>
              <div className="text-sm text-gray-500 font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Motivational Message */}
        <motion.div 
          className="mt-12"
          variants={itemVariants}
        >
          <motion.p 
            className="text-gray-500 italic text-lg"
            animate={{ 
              opacity: [0.6, 1, 0.6],
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            Every expert was once a beginner.
          </motion.p>
        </motion.div>
      </motion.div>

      {/* Decorative Elements */}
      <motion.div
        className="absolute top-20 left-20 text-6xl opacity-5"
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      >
        ⚡
      </motion.div>
      <motion.div
        className="absolute bottom-20 right-20 text-5xl opacity-5"
        animate={{ 
          y: [0, -20, 0],
          rotate: [0, 5, -5, 0]
        }}
        transition={{ duration: 4, repeat: Infinity }}
      >
        🎯
      </motion.div>
      <motion.div
        className="absolute top-1/2 left-10 text-4xl opacity-5"
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.05, 0.15, 0.05]
        }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        💻
      </motion.div>
      <motion.div
        className="absolute top-1/4 right-10 text-4xl opacity-5"
        animate={{ 
          rotate: [0, 180, 360],
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
      >
        🧠
      </motion.div>
    </div>
  );
}
 