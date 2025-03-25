import React from 'react';
import WordCloud from '../ui/WordCloud';
import ReactMarkdown from 'react-markdown';

interface SummaryCardProps {
  wordFrequencies: Array<{ text: string; value: number }>;
  aiSummary: string;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ wordFrequencies, aiSummary }) => {
  return (
    <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200">
      {/* Word Map */}
      <h4 className="text-black font-bold mb-4">Word Map</h4>
      <WordCloud words={wordFrequencies} />
      
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h4 className="text-black font-bold mb-3">AI Summary</h4>
        <div className="text-black prose prose-sm max-w-none">
          <ReactMarkdown>
            {aiSummary.replace(/\n\n/g, '\n\n&nbsp;\n\n')}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

export default SummaryCard; 