// // src/app/auth/callback/AuthCallbackContent.tsx

// 'use client';

// import { useEffect, useRef } from 'react';
// import { useRouter, useSearchParams } from 'next/navigation';
// import { useOAuthCallback } from '@/hooks/useAuth';
// import { AlertCircle, CheckCircle, Loader2 } from 'lucide-react';

// export default function AuthCallbackContent() {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const oauthCallback = useOAuthCallback();
  
//   // Use ref to prevent multiple executions in React Strict Mode
//   const hasProcessedRef = useRef(false);
  
//   const token = searchParams.get('token');
//   const userId = searchParams.get('user');
//   const error = searchParams.get('error');

//   useEffect(() => {
//     // Prevent multiple executions (React Strict Mode causes double execution)
//     if (hasProcessedRef.current) {
//       // console.log('AuthCallback: Already processed, skipping...');
//       return;
//     }

//     // console.log('AuthCallback: Processing with params:', {
//     //   hasToken: !!token,
//     //   hasUserId: !!userId,
//     //   hasError: !!error,
//     //   tokenPreview: token?.substring(0, 20) + '...'
//     // });

//     if (error) {
//       // console.log('AuthCallback: Error in URL params:', error);
//       hasProcessedRef.current = true;
//       setTimeout(() => {
//         router.push('/auth/login?error=oauth_failed');
//       }, 2000);
//       return;
//     }

//     if (token && userId) {
//       // console.log('AuthCallback: Processing successful OAuth callback');
//       hasProcessedRef.current = true;
      
//       // Process successful OAuth callback
//       oauthCallback.mutate({ token, userId });
//     } else {
//       // console.log('AuthCallback: Missing required parameters');
//       hasProcessedRef.current = true;
//       setTimeout(() => {
//         router.push('/auth/login?error=invalid_callback');
//       }, 2000);
//     }
//   }, [token, userId, error, oauthCallback, router]);

//   // Handle different states
//   if (error) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50">
//         <div className="text-center space-y-4">
//           <div className="flex justify-center">
//             <AlertCircle className="h-12 w-12 text-red-500" />
//           </div>
//           <h1 className="text-xl font-semibold text-gray-900">Authentication Failed</h1>
//           <p className="text-gray-600">
//             There was an error during the authentication process.
//           </p>
//           <p className="text-sm text-gray-500">
//             Redirecting to login page...
//           </p>
//         </div>
//       </div>
//     );
//   }

//   if (oauthCallback.isError) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50">
//         <div className="text-center space-y-4">
//           <div className="flex justify-center">
//             <AlertCircle className="h-12 w-12 text-red-500" />
//           </div>
//           <h1 className="text-xl font-semibold text-gray-900">Login Failed</h1>
//           <p className="text-gray-600">
//             Unable to complete the authentication process.
//           </p>
//           <p className="text-sm text-gray-500 mb-4">
//             Error: {oauthCallback.error?.message || 'Unknown error'}
//           </p>
//           <button
//             onClick={() => router.push('/auth/login')}
//             className="text-blue-600 hover:text-blue-800 underline"
//           >
//             Try Again
//           </button>
//         </div>
//       </div>
//     );
//   }

//   if (oauthCallback.isSuccess) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50">
//         <div className="text-center space-y-4">
//           <div className="flex justify-center">
//             <CheckCircle className="h-12 w-12 text-green-500" />
//           </div>
//           <h1 className="text-xl font-semibold text-gray-900">Login Successful!</h1>
//           <p className="text-gray-600">
//             Welcome to AlgoArena. Redirecting to dashboard...
//           </p>
//         </div>
//       </div>
//     );
//   }

//   // Default loading state
//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50">
//       <div className="text-center space-y-4">
//         <div className="flex justify-center">
//           <Loader2 className="h-12 w-12 text-blue-500 animate-spin" />
//         </div>
//         <h1 className="text-xl font-semibold text-gray-900">Processing Authentication</h1>
//         <p className="text-gray-600">
//           Please wait while we complete your login...
//         </p>
//         {process.env.NODE_ENV === 'development' && (
//           <div className="text-xs text-gray-400 space-y-1">
//             <p>Status: {oauthCallback.isPending ? 'Processing...' : 'Initializing...'}</p>
//             <p>Token: {token ? 'Present' : 'Missing'}</p>
//             <p>User ID: {userId ? 'Present' : 'Missing'}</p>
//             <p>Processed: {hasProcessedRef.current ? 'Yes' : 'No'}</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// src/app/auth/callback/AuthCallbackContent.tsx

'use client';

import { useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, type Variants } from 'framer-motion';
import { useOAuthCallback } from '@/hooks/useAuth';
import { AlertCircle, CheckCircle, Loader2, Code, Sparkles } from 'lucide-react';

export default function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const oauthCallback = useOAuthCallback();
  
  // Use ref to prevent multiple executions in React Strict Mode
  const hasProcessedRef = useRef(false);
  
  const token = searchParams.get('token');
  const userId = searchParams.get('user');
  const error = searchParams.get('error');

  useEffect(() => {
    // Prevent multiple executions (React Strict Mode causes double execution)
    if (hasProcessedRef.current) {
      return;
    }

    if (error) {
      hasProcessedRef.current = true;
      setTimeout(() => {
        router.push('/auth/login?error=oauth_failed');
      }, 2000);
      return;
    }

    if (token && userId) {
      hasProcessedRef.current = true;
      oauthCallback.mutate({ token, userId });
    } else {
      hasProcessedRef.current = true;
      setTimeout(() => {
        router.push('/auth/login?error=invalid_callback');
      }, 2000);
    }
  }, [token, userId, error, oauthCallback, router]);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.3,
        staggerChildren: 0.1
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

  // Handle different states
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-white to-pink-50 relative overflow-hidden">
        {/* Background Elements */}
        <motion.div 
          className="absolute -top-40 -right-32 w-80 h-80 bg-gradient-to-br from-red-400 to-pink-600 rounded-full opacity-10 blur-3xl"
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        
        <motion.div 
          className="text-center space-y-6 z-10 relative"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div 
            className="flex justify-center"
            variants={itemVariants}
            animate={{
              scale: [1, 1.1, 1],
              transition: {
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }
            }}
          >
            <div className="w-20 h-20 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center shadow-2xl">
              <AlertCircle className="h-10 w-10 text-white" />
            </div>
          </motion.div>
          <motion.h1 
            className="text-2xl font-bold text-gray-900"
            variants={itemVariants}
          >
            Authentication Failed
          </motion.h1>
          <motion.p 
            className="text-gray-600 text-lg"
            variants={itemVariants}
          >
            There was an error during the authentication process.
          </motion.p>
          <motion.div 
            className="flex items-center justify-center space-x-2"
            variants={itemVariants}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Loader2 className="h-5 w-5 text-blue-500" />
            </motion.div>
            <p className="text-sm text-gray-500">
              Redirecting to login page...
            </p>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  if (oauthCallback.isError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-white to-orange-50 relative overflow-hidden">
        {/* Background Elements */}
        <motion.div 
          className="absolute -bottom-40 -left-32 w-80 h-80 bg-gradient-to-br from-orange-400 to-red-600 rounded-full opacity-10 blur-3xl"
          animate={{ y: [0, 15, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
        
        <motion.div 
          className="text-center space-y-6 z-10 relative max-w-md mx-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div 
            className="flex justify-center"
            variants={itemVariants}
            animate={{
              scale: [1, 1.1, 1],
              transition: {
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }
            }}
          >
            <div className="w-20 h-20 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center shadow-2xl">
              <AlertCircle className="h-10 w-10 text-white" />
            </div>
          </motion.div>
          <motion.h1 
            className="text-2xl font-bold text-gray-900"
            variants={itemVariants}
          >
            Login Failed
          </motion.h1>
          <motion.p 
            className="text-gray-600 text-lg"
            variants={itemVariants}
          >
            Unable to complete the authentication process.
          </motion.p>
          <motion.p 
            className="text-sm text-gray-500 bg-gray-100 p-3 rounded-lg"
            variants={itemVariants}
          >
            Error: {oauthCallback.error?.message || 'Unknown error'}
          </motion.p>
          <motion.button
            onClick={() => router.push('/auth/login')}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            variants={itemVariants}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            Try Again
          </motion.button>
        </motion.div>
      </div>
    );
  }

  if (oauthCallback.isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-emerald-50 relative overflow-hidden">
        {/* Background Elements */}
        <motion.div 
          className="absolute -top-40 -right-32 w-80 h-80 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full opacity-10 blur-3xl"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute -bottom-40 -left-32 w-80 h-80 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-full opacity-10 blur-3xl"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Success Sparkles */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full"
            style={{
              left: `${20 + i * 10}%`,
              top: `${15 + i * 8}%`,
            }}
            animate={{
              scale: [0, 1, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.2,
              ease: "easeInOut",
            }}
          />
        ))}
        
        <motion.div 
          className="text-center space-y-6 z-10 relative"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div 
            className="flex justify-center"
            variants={itemVariants}
          >
            <motion.div 
              className="w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center shadow-2xl relative"
              animate={{ 
                scale: [1, 1.1, 1],
                boxShadow: [
                  "0 0 0 0 rgba(34, 197, 94, 0.7)",
                  "0 0 0 20px rgba(34, 197, 94, 0)",
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <CheckCircle className="h-12 w-12 text-white" />
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full opacity-20"
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <motion.h1 
              className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent"
              animate={{ 
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{ duration: 3, repeat: Infinity }}
              style={{ backgroundSize: "200% 200%" }}
            >
              Login Successful! 🎉
            </motion.h1>
          </motion.div>
          
          <motion.p 
            className="text-gray-600 text-lg"
            variants={itemVariants}
          >
            Welcome to AlgoArena. Redirecting to dashboard...
          </motion.p>
          
          <motion.div 
            className="flex items-center justify-center space-x-2"
            variants={itemVariants}
          >
            <Sparkles className="h-5 w-5 text-yellow-500" />
            <span className="text-sm text-gray-500 font-medium">Get ready for an amazing coding journey!</span>
            <Sparkles className="h-5 w-5 text-yellow-500" />
          </motion.div>
        </motion.div>
      </div>
    );
  }

  // Default loading state
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 relative overflow-hidden">
      {/* Background Elements */}
      <motion.div 
        className="absolute -top-40 -right-32 w-80 h-80 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full opacity-10 blur-3xl"
        animate={{ y: [0, -15, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div 
        className="absolute -bottom-40 -left-32 w-80 h-80 bg-gradient-to-br from-purple-400 to-pink-600 rounded-full opacity-10 blur-3xl"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
      
      {/* Loading Particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-30"
          style={{
            left: `${10 + i * 15}%`,
            top: `${20 + i * 10}%`,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: 2 + i * 0.3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
      
      <motion.div 
        className="text-center space-y-6 z-10 relative"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div 
          className="flex justify-center"
          variants={itemVariants}
        >
          <motion.div 
            className="w-20 h-20 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-2xl relative"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Code className="h-10 w-10 text-white" />
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-30"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </motion.div>
        </motion.div>
        
        <motion.h1 
          className="text-2xl font-bold text-gray-900"
          variants={itemVariants}
        >
          Processing Authentication
        </motion.h1>
        
        <motion.p 
          className="text-gray-600 text-lg"
          variants={itemVariants}
        >
          Please wait while we complete your login...
        </motion.p>
        
        <motion.div 
          className="flex items-center justify-center space-x-2"
          variants={itemVariants}
        >
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <Loader2 className="h-6 w-6 text-blue-500" />
          </motion.div>
          <span className="text-sm text-gray-500 font-medium">Authenticating securely...</span>
        </motion.div>
        
        {process.env.NODE_ENV === 'development' && (
          <motion.div 
            className="text-xs text-gray-400 space-y-1 bg-gray-50 p-4 rounded-lg border"
            variants={itemVariants}
          >
            <p>Status: {oauthCallback.isPending ? 'Processing...' : 'Initializing...'}</p>
            <p>Token: {token ? 'Present' : 'Missing'}</p>
            <p>User ID: {userId ? 'Present' : 'Missing'}</p>
            <p>Processed: {hasProcessedRef.current ? 'Yes' : 'No'}</p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}