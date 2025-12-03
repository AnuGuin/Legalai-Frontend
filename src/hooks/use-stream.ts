import { useState, useCallback, useRef, useEffect } from 'react';

export function useStream() {
  const [streamingContent, setStreamingContent] = useState<string>("");
  const [isStreaming, setIsStreaming] = useState(false);
  const streamInterval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (streamInterval.current) {
        clearInterval(streamInterval.current);
      }
    };
  }, []);

  const startStreaming = useCallback((
    text: string, 
    onUpdate?: (chunk: string) => void, 
    onComplete?: () => void
  ) => {
    if (streamInterval.current) {
      clearInterval(streamInterval.current);
    }
    
    setIsStreaming(true);
    const words = text.split(' ');
    let currentIndex = 0;
    
    streamInterval.current = setInterval(() => {
      if (currentIndex >= words.length) {
        if (streamInterval.current) {
          clearInterval(streamInterval.current);
        }
        setIsStreaming(false);
        setStreamingContent("");
        if (onComplete) {
          onComplete();
        }
        return;
      }

      const wordsToAdd = Math.min(3, words.length - currentIndex);
      currentIndex += wordsToAdd;
      const nextChunk = words.slice(0, currentIndex).join(' ');
      
      setStreamingContent(nextChunk);
      if (onUpdate) {
        onUpdate(nextChunk);
      }
      
    }, 60);
  }, []);

  const stopStreaming = useCallback(() => {
    if (streamInterval.current) {
      clearInterval(streamInterval.current);
    }
    setIsStreaming(false);
    setStreamingContent("");
  }, []);

  return { 
    streamingContent, 
    isStreaming, 
    startStreaming, 
    stopStreaming 
  };
}
