import React, { useState } from 'react';
import StoryForm from './components/StoryForm';
import ResultDisplay from './components/ResultDisplay';
import LoadingSpinner from './components/LoadingSpinner';

// Helper function to convert a Base64 string to a downloadable Blob
const base64ToBlob = (base64, contentType = 'audio/mpeg') => {
  const byteCharacters = atob(base64);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: contentType });
};

function App() {
  const [prompt, setPrompt] = useState('');
  const [story, setStory] = useState('');
  const [audioUrl, setAudioUrl] = useState('');
  const [storyUrl, setStoryUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) {
      setError('Prompt cannot be empty.');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setStory('');

    try {
      // --- REAL API CALL TO SPRING BOOT BACKEND ---
      const response = await fetch('http://localhost:8080/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: prompt }), // Send prompt as JSON
      });

      if (!response.ok) {
        // Handle server-side errors (e.g., 500 Internal Server Error)
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json(); // Parse the JSON response from the backend

      // Set the story text to be displayed on the page
      setStory(data.story);

      // Create a downloadable Blob for the story text file
      const storyBlob = new Blob([data.story], { type: 'text/plain' });
      setStoryUrl(URL.createObjectURL(storyBlob));
      
      // Decode the Base64 audio string and create a downloadable Blob
      const audioBlob = base64ToBlob(data.audioBase64);
      setAudioUrl(URL.createObjectURL(audioBlob));
      
    } catch (err) {
      console.error("API call failed:", err);
      setError('Failed to generate story. Please ensure the backend is running and reachable.');
    } finally {
      setIsLoading(false);
    }
    // --- END OF REAL API CALL ---
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <header className="bg-gray-800 text-white p-6 shadow-md">
        <h1 className="text-4xl font-bold text-center">AI Story & Audio Generator</h1>
        <p className="text-center text-gray-300 mt-2">Bring your imagination to life with a single prompt.</p>
      </header>

      <main className="flex flex-col items-center p-6">
        <StoryForm
          prompt={prompt}
          setPrompt={setPrompt}
          handleSubmit={handleSubmit}
          isLoading={isLoading}
        />

        {error && (
          <div className="mt-4 p-4 text-red-700 bg-red-100 border border-red-400 rounded-lg">
            {error}
          </div>
        )}

        {isLoading && <LoadingSpinner />}
        
        <ResultDisplay story={story} storyUrl={storyUrl} audioUrl={audioUrl} />
      </main>
    </div>
  );
}

export default App;
