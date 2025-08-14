import { api } from '@/lib/http-client';
import { endpoints } from '../endpoints';
import { Article } from '../types';

export interface ListArticlesParams {
  feedId: string;
  page?: number;
  limit?: number;
  q?: string;
  startDate?: string;
  endDate?: string;
}

// A interface de resposta foi atualizada aqui
export interface ListArticlesResponse {
  articles: Article[]; // Alterado de 'data' para 'articles'
  total: number;
  // page e limit não estão no seu JSON, então foram removidos para evitar erros.
  // Se eles existirem, pode adicioná-los de volta.
}

export async function listArticles(params: ListArticlesParams) {
  const { data } = await api.get<ListArticlesResponse>(endpoints.news.articles.list(), {
    params,
  });
  return data;
}