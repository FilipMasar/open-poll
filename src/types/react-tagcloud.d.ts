declare module 'react-tagcloud' {
  export interface TagCloudProps {
    tags: Array<{ text: string; value: number }>;
    minSize?: number;
    maxSize?: number;
    shuffle?: boolean;
    colorOptions?: {
      luminosity?: 'bright' | 'light' | 'dark';
      hue?: string | number;
    };
    renderer?: (tag: { text: string; value: number }, size: number, color: string) => JSX.Element;
    className?: string;
    onClick?: (tag: { text: string; value: number }) => void;
  }
  
  export const TagCloud: React.FC<TagCloudProps>;
  export const RandomColorCloud: React.FC<TagCloudProps>;
} 