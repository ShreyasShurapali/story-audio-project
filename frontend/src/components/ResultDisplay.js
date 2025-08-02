import React from 'react';
import { motion } from 'framer-motion';

const ResultDisplay = ({ story, storyUrl, audioUrl }) => {
  if (!story) return null;

  return (
    <motion.div
      className="w-full max-w-2xl p-6 mt-10 bg-white rounded-lg shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Generated Story</h2>
      <p className="text-gray-600 whitespace-pre-wrap leading-relaxed">{story}</p>

      {/* --- NEW AUDIO PLAYER SECTION --- */}
      {audioUrl && (
        <>
          <h3 className="text-xl font-bold text-gray-700 mt-6 mb-2">Listen to the Narration</h3>
          <audio controls className="w-full">
            <source src={audioUrl} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        </>
      )}
      {/* --- END OF NEW AUDIO PLAYER SECTION --- */}
      
      <div className="flex flex-wrap gap-4 mt-6">
        <a href={storyUrl} download="story.txt" className="px-4 py-2 font-semibold text-white bg-green-600 rounded-md hover:bg-green-700 transition">
          Download Story (.txt)
        </a>
        <a href={audioUrl} download="story.mp3" className="px-4 py-2 font-semibold text-white bg-purple-600 rounded-md hover:bg-purple-700 transition">
          Download Audio (.mp3)
        </a>
      </div>
    </motion.div>
  );
};

export default ResultDisplay;
