import React from 'react';
import { TagCloud } from 'react-tagcloud';

interface WordData {
  text: string;
  value: number;
}

interface WordCloudProps {
  words: WordData[];
  maxWords?: number;
}

const WordCloud: React.FC<WordCloudProps> = ({ words, maxWords = 50 }) => {
  // Sort words by value and limit to maxWords
  const sortedWords = [...words]
    .sort((a, b) => b.value - a.value)
    .slice(0, maxWords);
  
  // Custom renderer for each tag
  const customRenderer = (tag: WordData, size: number, color: string) => (
    <span
      key={tag.text}
      style={{
        animation: 'blinker 3s linear infinite',
        animationDelay: `${Math.random() * 2}s`,
        fontSize: `${size / 2}em`,
        margin: '3px',
        padding: '3px',
        display: 'inline-block',
        color: color,
      }}
    >
      {tag.text}
    </span>
  );

  // Color options
  const options = {
    luminosity: 'dark' as const,
    hue: 'blue',
  };

  return (
    <div className="bg-gray-50 rounded-xl p-3 sm:p-5 text-center overflow-hidden">
      {sortedWords.length > 0 ? (
        <TagCloud
          minSize={1}
          maxSize={5}
          tags={sortedWords}
          colorOptions={options}
          renderer={customRenderer}
        />
      ) : (
        <p className="text-gray-500 italic">No data available</p>
      )}
    </div>
  );
};

export default WordCloud; 