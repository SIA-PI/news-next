'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from './ui/Card';

interface Article {
  id: string;
  title: string;
  link: string;
  summary: string;
  pubDate: string;
}

interface PreviewData {
  image?: string;
}

export default function ArticleCard({ article }: { article: Article }) {
  const [preview, setPreview] = useState<PreviewData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPreview = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `/api/preview?url=${encodeURIComponent(article.link)}`,
        );
        if (response.ok) {
          const data = await response.json();
          setPreview(data);
        } else {
          setPreview(null);
        }
      } catch (error) {
        setPreview(null);
        console.error('Failed to fetch article preview', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPreview();
  }, [article.link]);

  return (
    <a href={article.link} target="_blank" rel="noopener noreferrer">
      <Card className="glassmorphism-strong hover:bg-white/10 transition-colors">
        <CardContent className="flex gap-4">
          {isLoading ? (
            <div className="w-32 h-20 bg-gray-700 rounded-lg animate-pulse"></div>
          ) : (
            preview?.image && (
              <img
                src={preview.image}
                alt={`Preview for ${article.title}`}
                className="w-32 h-20 object-cover rounded-lg"
              />
            )
          )}
          <div className="flex-1">
            <h4 className="font-semibold text-[rgb(var(--text-primary))] line-clamp-2">
              {article.title}
            </h4>
            <p className="text-sm text-[rgb(var(--text-muted))] mt-1 line-clamp-2">
              {article.summary}
            </p>
            <p className="text-xs text-gray-500 mt-2">
              {new Date(article.pubDate).toLocaleDateString()}
            </p>
          </div>
        </CardContent>
      </Card>
    </a>
  );
}
