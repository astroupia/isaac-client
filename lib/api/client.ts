const API_BASE_URL = 'https://isaac-api-uilf.onrender.com';

export class ApiError extends Error {
  status: number;
  details?: any;

  constructor(message: string, status: number, details?: any) {
    super(message);
    this.status = status;
    this.details = details;
    this.name = 'ApiError';
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch (e) {
      throw new ApiError(response.statusText, response.status);
    }
    throw new ApiError(
      errorData.message || 'An error occurred',
      response.status,
      errorData
    );
  }


  if (response.status === 204) {
    return undefined as unknown as T;
  }

  return response.json();
}

export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const headers = new Headers(options.headers);
  headers.set('Content-Type', 'application/json');
  
  const config: RequestInit = {
    ...options,
    headers,
    credentials: 'include',
  };

  const response = await fetch(url, config);
  return handleResponse<T>(response);
}
