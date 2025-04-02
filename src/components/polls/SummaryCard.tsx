import React from 'react';
import WordCloud from '../ui/WordCloud';

interface SummaryCardProps {
  wordFrequencies: Array<{ text: string; value: number }>;
  responses?: Array<{ text: string; createdAt: Date }>; 
}

const SummaryCard: React.FC<SummaryCardProps> = ({ wordFrequencies, responses = [] }) => {
  return (
    <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200">
      {/* Word Cloud */}
      <h4 className="text-black font-bold mb-4">Word Cloud</h4>
      <WordCloud words={wordFrequencies} />
      
      {responses.length > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h4 className="text-black font-bold mb-3">Raw Responses</h4>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {responses.map((response, index) => (
              <div key={index} className="border border-gray-200 rounded-xl p-4">
                <p className="text-sm text-gray-500 mb-2">
                  {new Date(response.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
                <p className="text-black">{response.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SummaryCard; 