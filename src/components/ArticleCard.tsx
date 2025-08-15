'use client';

import { faImage } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Image from 'next/image';
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

/**
 * Remove tags HTML de uma string para exibir texto puro.
 * @param html A string contendo HTML.
 * @returns A string sem as tags HTML.
 */
function stripHtml(html: string) {
  if (!html) return '';
  return html.replace(/<[^>]*>?/gm, '').replace(/&nbsp;/g, ' ');
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

  // Verifica se a imagem é um favicon ou não existe para decidir se deve mostrar o fallback.
  const showImageFallback = !preview?.image || preview.image.includes('favicon');

  return (
    <a href={article.link} target="_blank" rel="noopener noreferrer">
      <Card className="glassmorphism-strong hover:bg-white/10 transition-colors duration-300">
        <CardContent className="flex gap-4 p-4 items-center">
          {/* Lógica de Imagem/Fallback */}
          <div className="w-32 h-20 flex-shrink-0">
            {isLoading ? (
              <div className="w-full h-full bg-[rgb(var(--border))] rounded-lg animate-pulse"></div>
            ) : showImageFallback ? (
              <div className="w-full h-full bg-[rgb(var(--muted))] rounded-lg flex items-center justify-center text-[rgb(var(--text-muted))]">
                <FontAwesomeIcon icon={faImage} className="text-3xl" />
              </div>
            ) : (
              <Image
                src={preview.image || ''}
                alt={`Preview for ${article.title}`}
                className="w-full h-full object-cover rounded-lg"
                width={300}
                height={200}
                unoptimized
              />
            )}
          </div>

          {/* Conteúdo do Artigo */}
          <div className="flex-1 min-w-0">
            {' '}
            {/* Adicionado min-w-0 para ajudar no overflow */}
            <h4 className="font-semibold text-[rgb(var(--text-primary))] truncate">
              {article.title}
            </h4>
            <p className="text-sm text-[rgb(var(--text-muted))] mt-1 line-clamp-2">
              {stripHtml(article.summary)}
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