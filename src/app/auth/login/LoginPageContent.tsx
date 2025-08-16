// // src/app/auth/login/LoginPageContent.tsx

// 'use client';

// import { useEffect } from 'react';
// import { useRouter, useSearchParams } from 'next/navigation';
// import { useAppSelector } from '@/store';
// import { useAuthActions } from '@/hooks/useAuth';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { Github, Chrome, AlertCircle, Code, Sparkles, Shield, Users, BookOpen } from 'lucide-react';

// export default function LoginPageContent() {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const { isAuthenticated, isLoading } = useAppSelector(state => state.auth);
//   const { initiateGoogleLogin, initiateGithubLogin } = useAuthActions();
  
//   const error = searchParams.get('error');

//   // Redirect if already authenticated
//   useEffect(() => {
//     if (isAuthenticated && !isLoading) {
//       router.push('/dashboard');
//     }
//   }, [isAuthenticated, isLoading, router]);

//   if (isLoading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
//         <div className="text-center">
//           <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
//             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
//           </div>
//           <p className="text-gray-600 font-medium">Loading...</p>
//         </div>
//       </div>
//     );
//   }

//   if (isAuthenticated) {
//     return null; // Will redirect
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col">
//       {/* Background Pattern */}
//       <div className="absolute inset-0 overflow-hidden">
//         <div className="absolute -top-40 -right-32 w-80 h-80 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full opacity-10 blur-3xl"></div>
//         <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-gradient-to-br from-purple-400 to-pink-600 rounded-full opacity-10 blur-3xl"></div>
//       </div>

//       <div className="relative flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
//         <div className="max-w-6xl w-full">
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            
//             {/* Left Side - Branding */}
//             <div className="text-center lg:text-left space-y-8">
//               <div className="space-y-4">
//                 <div className="flex items-center justify-center lg:justify-start space-x-3">
//                   <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl">
//                     <Code className="h-8 w-8 text-white" />
//                   </div>
//                   <div>
//                     <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
//                       AlgoArena
//                     </h1>
//                     <p className="text-gray-600 text-lg">Master Data Structures & Algorithms</p>
//                   </div>
//                 </div>
                
//                 <div className="space-y-3">
//                   <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">
//                     Welcome to the Future of 
//                     <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Coding Education</span>
//                   </h2>
//                   <p className="text-lg text-gray-600 leading-relaxed max-w-2xl">
//                     Join thousands of developers mastering algorithms, solving challenging problems, 
//                     and building their coding skills with our comprehensive DSA platform.
//                   </p>
//                 </div>
//               </div>

//               {/* Features */}
//               <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto lg:mx-0">
//                 <div className="text-center space-y-2">
//                   <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center mx-auto shadow-lg">
//                     <BookOpen className="h-6 w-6 text-white" />
//                   </div>
//                   <h3 className="font-semibold text-gray-900">Rich Content</h3>
//                   <p className="text-sm text-gray-600">Detailed explanations & solutions</p>
//                 </div>
                
//                 <div className="text-center space-y-2">
//                   <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center mx-auto shadow-lg">
//                     <Users className="h-6 w-6 text-white" />
//                   </div>
//                   <h3 className="font-semibold text-gray-900">Community</h3>
//                   <p className="text-sm text-gray-600">Learn with fellow developers</p>
//                 </div>
                
//                 <div className="text-center space-y-2">
//                   <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center mx-auto shadow-lg">
//                     <Shield className="h-6 w-6 text-white" />
//                   </div>
//                   <h3 className="font-semibold text-gray-900">Progress Tracking</h3>
//                   <p className="text-sm text-gray-600">Monitor your growth</p>
//                 </div>
//               </div>

//               {/* Stats */}
//               <div className="hidden lg:flex items-center justify-center lg:justify-start space-x-8 text-center lg:text-left">
//                 <div>
//                   <div className="text-2xl font-bold text-gray-900">1000+</div>
//                   <div className="text-sm text-gray-600">Problems Solved</div>
//                 </div>
//                 <div>
//                   <div className="text-2xl font-bold text-gray-900">500+</div>
//                   <div className="text-sm text-gray-600">Active Users</div>
//                 </div>
//                 <div>
//                   <div className="text-2xl font-bold text-gray-900">50+</div>
//                   <div className="text-sm text-gray-600">Categories</div>
//                 </div>
//               </div>
//             </div>

//             {/* Right Side - Login Form */}
//             <div className="flex justify-center lg:justify-end">
//               <Card className="w-full max-w-md bg-white/80 backdrop-blur-sm shadow-2xl border-0 overflow-hidden">
//                 <CardHeader className="text-center space-y-4 bg-gradient-to-r from-white to-gray-50 pb-8">
//                   <div className="space-y-2">
//                     <CardTitle className="text-2xl font-bold text-gray-900">Sign in to your account</CardTitle>
//                     <CardDescription className="text-gray-600">
//                       Choose your preferred sign-in method to continue
//                     </CardDescription>
//                   </div>
                  
//                   <div className="flex items-center justify-center space-x-2">
//                     <Sparkles className="h-5 w-5 text-yellow-500" />
//                     <span className="text-sm font-medium text-gray-700">Quick & Secure Access</span>
//                     <Sparkles className="h-5 w-5 text-yellow-500" />
//                   </div>
//                 </CardHeader>

//                 <CardContent className="p-8 space-y-6">
//                   {error && (
//                     <div className="flex items-center space-x-3 text-red-600 bg-red-50 p-4 rounded-xl border border-red-200">
//                       <AlertCircle className="h-5 w-5 flex-shrink-0" />
//                       <div>
//                         <div className="font-medium text-sm">Authentication Failed</div>
//                         <div className="text-sm">
//                           {error === 'oauth_failed' ? 'Please try again with a different method.' : 'An unexpected error occurred.'}
//                         </div>
//                       </div>
//                     </div>
//                   )}
                  
//                   <div className="space-y-4">
//                     <Button
//                       onClick={initiateGoogleLogin}
//                       className="w-full h-12 bg-white hover:bg-gray-50 text-gray-700 border-2 border-gray-200 hover:border-gray-300 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
//                       variant="outline"
//                     >
//                       <div className="flex items-center justify-center space-x-3">
//                         <div className="w-6 h-6 bg-gradient-to-r from-red-500 to-yellow-500 rounded-full flex items-center justify-center">
//                           <Chrome className="h-4 w-4 text-white" />
//                         </div>
//                         <span className="font-medium">Continue with Google</span>
//                       </div>
//                     </Button>
                    
//                     <Button
//                       onClick={initiateGithubLogin}
//                       className="w-full h-12 bg-gray-900 hover:bg-gray-800 text-white border-0 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
//                     >
//                       <div className="flex items-center justify-center space-x-3">
//                         <Github className="h-5 w-5" />
//                         <span className="font-medium">Continue with GitHub</span>
//                       </div>
//                     </Button>
//                   </div>

//                   <div className="relative">
//                     <div className="absolute inset-0 flex items-center">
//                       <div className="w-full border-t border-gray-200"></div>
//                     </div>
//                     <div className="relative flex justify-center text-sm">
//                       <span className="px-4 bg-white text-gray-500 font-medium">Secure Authentication</span>
//                     </div>
//                   </div>
                  
//                   <div className="text-center space-y-2">
//                     <p className="text-xs text-gray-500 leading-relaxed">
//                       By signing in, you agree to our{' '}
//                       <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">Terms of Service</a>
//                       {' '}and{' '}
//                       <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">Privacy Policy</a>
//                     </p>
//                     <div className="flex items-center justify-center space-x-2">
//                       <Shield className="h-4 w-4 text-green-500" />
//                       <span className="text-xs text-gray-600 font-medium">Protected by industry-standard security</span>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Footer */}
//       <footer className="relative py-6 text-center">
//         <p className="text-sm text-gray-500">
//           © 2024 AlgoArena. Empowering developers worldwide 🚀
//         </p>
//       </footer>
//     </div>
//   );
// }

// src/app/auth/login/LoginPageContent.tsx

'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { useAppSelector } from '@/store';
import { useAuthActions } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Github, Chrome, AlertCircle, Code, Sparkles, Shield, Users, BookOpen, Zap, Star, TrendingUp } from 'lucide-react';

export default function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, isLoading } = useAppSelector(state => state.auth);
  const { initiateGoogleLogin, initiateGithubLogin } = useAuthActions();
  
  const error = searchParams.get('error');

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, isLoading, router]);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div 
            className="w-20 h-20 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl"
            animate={{ rotate: [0, 180, 360] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Code className="h-10 w-10 text-white" />
          </motion.div>
          <motion.p 
            className="text-gray-600 font-medium text-lg"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            Loading AlgoArena...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  if (isAuthenticated) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <motion.div 
        className="absolute -top-40 -right-32 w-96 h-96 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full opacity-10 blur-3xl"
        animate={{
          y: [0, -10, 0],
          transition: {
            duration: 6,
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
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-20"
          style={{
            left: `${15 + i * 15}%`,
            top: `${20 + i * 10}%`,
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
        className="relative flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 min-h-screen"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="max-w-7xl w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            
            {/* Left Side - Enhanced Branding */}
            <motion.div className="text-center lg:text-left space-y-8" variants={itemVariants}>
              <div className="space-y-6">
                <motion.div 
                  className="flex items-center justify-center lg:justify-start space-x-4"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <motion.div 
                    className="w-20 h-20 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-3xl flex items-center justify-center shadow-2xl relative overflow-hidden"
                    animate={{ 
                      boxShadow: [
                        "0 0 0 0 rgba(59, 130, 246, 0.7)",
                        "0 0 0 20px rgba(59, 130, 246, 0)",
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Code className="h-10 w-10 text-white relative z-10" />
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    />
                  </motion.div>
                  <div>
                    <motion.h1 
                      className="text-5xl lg:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"
                      animate={{ 
                        backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                      }}
                      transition={{ duration: 3, repeat: Infinity }}
                      style={{ backgroundSize: "200% 200%" }}
                    >
                      AlgoArena
                    </motion.h1>
                    <p className="text-gray-600 text-xl font-medium">Master Data Structures & Algorithms</p>
                  </div>
                </motion.div>
                
                <div className="space-y-4">
                  <motion.h2 
                    className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight"
                    variants={itemVariants}
                  >
                    Welcome to the Future of{' '}
                    <motion.span 
                      className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"
                      animate={{ 
                        backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                      }}
                      transition={{ duration: 4, repeat: Infinity }}
                      style={{ backgroundSize: "200% 200%" }}
                    >
                      Coding Education
                    </motion.span>
                  </motion.h2>
                  <motion.p 
                    className="text-xl text-gray-600 leading-relaxed max-w-2xl"
                    variants={itemVariants}
                  >
                    Join thousands of developers mastering algorithms, solving challenging problems, 
                    and building their coding skills with our comprehensive DSA platform.
                  </motion.p>
                </div>
              </div>

              {/* Enhanced Features */}
              <motion.div 
                className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto lg:mx-0"
                variants={containerVariants}
              >
                {[
                  { icon: BookOpen, title: "Rich Content", desc: "Detailed explanations & solutions", color: "from-green-500 to-emerald-600" },
                  { icon: Users, title: "Community", desc: "Learn with fellow developers", color: "from-blue-500 to-cyan-600" },
                  { icon: Shield, title: "Progress Tracking", desc: "Monitor your growth", color: "from-purple-500 to-pink-600" }
                ].map((feature, index) => (
                  <motion.div 
                    key={index}
                    className="text-center space-y-3 p-4 rounded-xl hover:bg-white/50 transition-all duration-300"
                    variants={itemVariants}
                    whileHover={{ scale: 1.05, y: -5 }}
                  >
                    <motion.div 
                      className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mx-auto shadow-xl`}
                      whileHover={{ rotate: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <feature.icon className="h-8 w-8 text-white" />
                    </motion.div>
                    <h3 className="font-bold text-gray-900 text-lg">{feature.title}</h3>
                    <p className="text-gray-600">{feature.desc}</p>
                  </motion.div>
                ))}
              </motion.div>

              {/* Enhanced Stats */}
              <motion.div 
                className="hidden lg:flex items-center justify-center lg:justify-start space-x-12 text-center lg:text-left"
                variants={itemVariants}
              >
                {[
                  { value: "1000+", label: "Problems Solved", icon: Zap },
                  { value: "500+", label: "Active Users", icon: Star },
                  { value: "50+", label: "Categories", icon: TrendingUp }
                ].map((stat, index) => (
                  <motion.div 
                    key={index}
                    className="flex flex-col items-center lg:items-start space-y-2"
                    whileHover={{ scale: 1.1 }}
                  >
                    <div className="flex items-center space-x-2">
                      <stat.icon className="h-5 w-5 text-blue-600" />
                      <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        {stat.value}
                      </div>
                    </div>
                    <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right Side - Enhanced Login Form */}
            <div className="flex justify-center lg:justify-end">
              <motion.div
                variants={itemVariants}
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Card 
                  variant="glass" 
                  className="w-full max-w-md shadow-2xl backdrop-blur-lg bg-white/80 border-white/30 overflow-hidden"
                >
                  <CardHeader className="text-center space-y-4 bg-gradient-to-br from-white/50 to-gray-50/50 pb-8 backdrop-blur-sm">
                    <motion.div 
                      className="space-y-3"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <CardTitle className="text-2xl font-bold text-gray-900">
                        Sign in to your account
                      </CardTitle>
                      <CardDescription className="text-gray-600 text-base">
                        Choose your preferred sign-in method to continue
                      </CardDescription>
                    </motion.div>
                    
                    <motion.div 
                      className="flex items-center justify-center space-x-2 bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent"
                      animate={{ 
                        scale: [1, 1.05, 1],
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Sparkles className="h-5 w-5 text-yellow-500" />
                      <span className="text-sm font-bold">Quick & Secure Access</span>
                      <Sparkles className="h-5 w-5 text-yellow-500" />
                    </motion.div>
                  </CardHeader>

                  <CardContent className="p-8 space-y-6">
                    <AnimatePresence>
                      {error && (
                        <motion.div 
                          className="flex items-center space-x-3 text-red-600 bg-red-50 p-4 rounded-xl border border-red-200"
                          initial={{ opacity: 0, scale: 0.95, y: -10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95, y: -10 }}
                          transition={{ duration: 0.3 }}
                        >
                          <AlertCircle className="h-5 w-5 flex-shrink-0" />
                          <div>
                            <div className="font-medium text-sm">Authentication Failed</div>
                            <div className="text-sm">
                              {error === 'oauth_failed' ? 'Please try again with a different method.' : 'An unexpected error occurred.'}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    
                    <motion.div 
                      className="space-y-4"
                      variants={containerVariants}
                    >
                      <motion.div variants={itemVariants}>
                        <Button
                          onClick={initiateGoogleLogin}
                          variant="outline"
                          className="w-full h-14 bg-white/80 hover:bg-white hover:scale-105 text-gray-700 border-2 border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300 backdrop-blur-sm"
                          animate={true}
                        >
                          <div className="flex items-center justify-center space-x-3">
                            <motion.div 
                              className="w-6 h-6 bg-gradient-to-r from-red-500 to-yellow-500 rounded-full flex items-center justify-center"
                              whileHover={{ rotate: 360 }}
                              transition={{ duration: 0.5 }}
                            >
                              <Chrome className="h-4 w-4 text-white" />
                            </motion.div>
                            <span className="font-semibold">Continue with Google</span>
                          </div>
                        </Button>
                      </motion.div>
                      
                      <motion.div variants={itemVariants}>
                        <Button
                          onClick={initiateGithubLogin}
                          className="w-full h-14 bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 text-white border-0 hover:scale-105 hover:shadow-xl transition-all duration-300"
                          animate={true}
                        >
                          <div className="flex items-center justify-center space-x-3">
                            <motion.div
                              whileHover={{ scale: 1.2 }}
                              transition={{ type: "spring", stiffness: 300 }}
                            >
                              <Github className="h-5 w-5" />
                            </motion.div>
                            <span className="font-semibold">Continue with GitHub</span>
                          </div>
                        </Button>
                      </motion.div>
                    </motion.div>

                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200"></div>
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-4 bg-white/80 text-gray-500 font-medium backdrop-blur-sm">Secure Authentication</span>
                      </div>
                    </div>
                    
                    <motion.div 
                      className="text-center space-y-3"
                      variants={itemVariants}
                    >
                      <p className="text-xs text-gray-500 leading-relaxed">
                        By signing in, you agree to our{' '}
                        <a href="#" className="text-blue-600 hover:text-blue-700 font-medium underline">Terms of Service</a>
                        {' '}and{' '}
                        <a href="#" className="text-blue-600 hover:text-blue-700 font-medium underline">Privacy Policy</a>
                      </p>
                      <motion.div 
                        className="flex items-center justify-center space-x-2"
                        animate={{ 
                          opacity: [0.7, 1, 0.7],
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Shield className="h-4 w-4 text-green-500" />
                        <span className="text-xs text-gray-600 font-medium">Protected by industry-standard security</span>
                      </motion.div>
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Enhanced Footer */}
      <motion.footer 
        className="relative py-8 text-center"
        variants={itemVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.p 
          className="text-gray-500 flex items-center justify-center space-x-2"
          whileHover={{ scale: 1.05 }}
        >
          <span>© 2024 AlgoArena. Empowering developers worldwide</span>
          <motion.span
            animate={{ rotate: [0, 15, -15, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: 1 }}
          >
            🚀
          </motion.span>
        </motion.p>
      </motion.footer>
    </div>
  );
}