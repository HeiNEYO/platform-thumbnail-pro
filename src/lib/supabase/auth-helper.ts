/**
 * Helper pour l'authentification Supabase avec fallback sur API REST directe
 * Résout les problèmes de timeout avec le client Supabase
 */

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  expires_in?: number;
}

export async function signInWithPasswordDirect(
  url: string,
  key: string,
  email: string,
  password: string,
  timeoutMs: number = 10000
): Promise<{ data: AuthTokens | null; error: Error | null }> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(`${url}/auth/v1/token?grant_type=password`, {
      method: 'POST',
      headers: {
        'apikey': key,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email.trim(),
        password: password,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        data: null,
        error: new Error(errorData.error_description || errorData.error || `Erreur ${response.status}: ${response.statusText}`),
      };
    }

    const data: AuthTokens = await response.json();
    return { data, error: null };
  } catch (err: any) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      return {
        data: null,
        error: new Error('Timeout: La connexion a pris trop de temps. Vérifiez votre connexion internet.'),
      };
    }
    return {
      data: null,
      error: err instanceof Error ? err : new Error('Erreur inconnue lors de la connexion'),
    };
  }
}
