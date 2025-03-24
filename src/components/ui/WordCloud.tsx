import React from 'react';

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
  
  // Calculate weight for font sizes (min: 0.75rem, max: 3rem)
  const maxValue = Math.max(...sortedWords.map(word => word.value), 1);
  
  const getWordStyle = (value: number) => {
    // Create a logarithmic scale for word sizes
    const minSize = 0.75;
    const maxSize = 3;
    const normalizedValue = value / maxValue;
    
    // Using logarithmic scale to prevent very large words from dominating
    const fontSize = minSize + (maxSize - minSize) * Math.log1p(normalizedValue * 9) / Math.log(10);
    
    // Generate a color based on value - using a blue/green palette
    // Higher values get more saturated colors
    const colorClasses = [
      'text-gray-500', // lowest
      'text-gray-600',
      'text-gray-800',
      'text-blue-500',
      'text-green-500',
      'text-green-600',
      'text-blue-600',
      'text-green-700',
      'text-primary-600',
      'text-primary-700', // highest
    ];
    
    const colorIndex = Math.min(
      Math.floor(normalizedValue * colorClasses.length),
      colorClasses.length - 1
    );
    
    const fontWeight = normalizedValue > 0.6 ? 'font-bold' : 
                        normalizedValue > 0.3 ? 'font-semibold' : 'font-medium';
    
    return {
      className: `${colorClasses[colorIndex]} ${fontWeight} mx-2 inline-block`,
      style: { fontSize: `${fontSize}rem` }
    };
  };

  return (
    <div className="bg-gray-50 rounded-xl p-5 text-center">
      {sortedWords.map((word, index) => {
        const { className, style } = getWordStyle(word.value);
        return (
          <span key={index} className={className} style={style}>
            {word.text}
          </span>
        );
      })}
    </div>
  );
};

export default WordCloud; 