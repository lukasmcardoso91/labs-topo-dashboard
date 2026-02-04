import { createContext, useContext, useState, ReactNode } from 'react';
import { YouTubeMetric } from '@/types/youtube';
import { processYouTubeData } from '@/utils/youtubeDataProcessor';

interface YouTubeDataContextType {
  rawData: YouTubeMetric[];
  setRawData: (data: YouTubeMetric[]) => void;
  processedData: ReturnType<typeof processYouTubeData> | null;
}

const YouTubeDataContext = createContext<YouTubeDataContextType | undefined>(undefined);

export function YouTubeDataProvider({ children }: { children: ReactNode }) {
  const [rawData, setRawDataState] = useState<YouTubeMetric[]>([]);
  const [processedData, setProcessedData] = useState<ReturnType<typeof processYouTubeData> | null>(null);

  const setRawData = (data: YouTubeMetric[]) => {
    setRawDataState(data);
    if (data.length > 0) {
      const processed = processYouTubeData(data);
      setProcessedData(processed);
    }
  };

  return (
    <YouTubeDataContext.Provider value={{ rawData, setRawData, processedData }}>
      {children}
    </YouTubeDataContext.Provider>
  );
}

export function useYouTubeData() {
  const context = useContext(YouTubeDataContext);
  if (context === undefined) {
    throw new Error('useYouTubeData must be used within a YouTubeDataProvider');
  }
  return context;
}
