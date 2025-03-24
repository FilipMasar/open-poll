import React from 'react';
import WordCloud from '../ui/WordCloud';

interface SummaryCardProps {
  wordFrequencies: Array<{ text: string; value: number }>;
  aiSummary: string;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ wordFrequencies, aiSummary }) => {
  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200">
      {/* Word Map */}
      <h4 className="text-black font-bold mb-4">Word Map</h4>
      <WordCloud words={wordFrequencies} />
      
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h4 className="text-black font-bold mb-3">AI Summary</h4>
        <p className="text-black">{aiSummary}</p>
      </div>
    </div>
  );
};

export default SummaryCard; 