import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combina múltiplas classes do Tailwind CSS de forma inteligente.
 * - `clsx`: Permite passar classes condicionalmente (ex: { 'bg-red-500': hasError }).
 * - `twMerge`: Resolve conflitos de classes do Tailwind. Se você tiver 'p-2' e 'p-4',
 * ela garante que apenas a última ('p-4') seja aplicada, evitando estilos inconsistentes.
 *
 * @param {...ClassValue[]} inputs - Uma lista de strings de classe ou objetos.
 * @returns {string} As classes do Tailwind CSS combinadas e sem conflitos.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
