import React from 'react';
import { motion } from 'framer-motion';

const StoryForm = ({ prompt, setPrompt, handleSubmit, isLoading }) => {
  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="e.g., A brave cat exploring a mysterious, abandoned spaceship"
        rows="4"
        className="w-full p-4 text-gray-800 bg-white border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
        disabled={isLoading}
      />
      <motion.button
        type="submit"
        disabled={isLoading}
        className="w-full mt-4 px-6 py-3 text-lg font-semibold text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isLoading ? 'Generating...' : 'Generate Story'}
      </motion.button>
    </form>
  );
};

export default StoryForm;
