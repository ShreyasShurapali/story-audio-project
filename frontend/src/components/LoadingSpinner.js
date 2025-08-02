import React from 'react';
import { motion } from 'framer-motion';

const LoadingSpinner = () => {
  return (
    <div className="flex flex-col items-center justify-center mt-10">
      <motion.div
        className="w-16 h-16 border-8 border-gray-200 border-t-blue-600 rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
      <p className="mt-4 text-lg text-gray-600">Creating your story... please wait.</p>
    </div>
  );
};

export default LoadingSpinner;
