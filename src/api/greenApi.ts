import type { CheckAccountRequest, CheckAccountResponse, ContactInfoResponse, DeleteNotificationResponse, GreenApiCredentials, ReceiveNotificationResponse, SendMessageRequest, SendMessageResponse, StateInstanceResponse } from './types';

class GreenApiError extends Error {
  constructor(
    message: string,
    status?: number,
  ) {
    super(message);
    this.name = 'GreenApiError';
    console.log('status =', status);
  }
}

export class GreenApiClient {
  private readonly apiUrl: string;
  private readonly idInstance: string;
  private readonly apiTokenInstance: string;

  constructor(credentials: GreenApiCredentials) {
    const apiUrl = credentials.apiUrl.trim().replace(/\/+$/, '');
    const idInstance = credentials.idInstance.trim();
    const apiTokenInstance = credentials.apiTokenInstance.trim();

    if (!apiUrl || !idInstance || !apiTokenInstance) {
      throw new Error('заполните учетные данные GreenApi')
    }

    this.apiUrl = apiUrl;
    this.idInstance = idInstance;
    this.apiTokenInstance = apiTokenInstance;
  }

  private async request<T>(
      method: string,
      options?: {
        httpMethod?: 'GET' | 'POST' | 'DELETE';
        body?: unknown;
        query?: Record<string, string | number | undefined>;
        pathSuffix?: string;
      },
    ): Promise<T> {
    const {
      httpMethod = 'GET',
      body,
      query,
    } = options ?? {};

    const url = new URL(
      `${this.apiUrl}/waInstance${this.idInstance}/${method}/${this.apiTokenInstance}${options?.pathSuffix ? `/${options.pathSuffix}` : ''}`
    );

    if (query) {
      Object.entries(query).forEach(([key, value]) => {
        if (value !== undefined) {
          url.searchParams.set(key, String(value));
        }
      });
    }

    const response = await fetch(url, {
      method: httpMethod,
      headers: body
        ? {
          'Content-Type': 'application/json',
        }
        : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });

    const text = await response.text();

    let data: unknown;

    try {
      data = text ? JSON.parse(text) : undefined;
    } catch {
      throw new GreenApiError(
        'GREEN-API returned invalid JSON',
        response.status,
      );
    }

    if (!response.ok) {
      throw new GreenApiError(
        `GREEN-API request failed: ${response.status}`,
        response.status,
      );
    }

    return data as T;
  }

  getStatusInstance() {
    return this.request<StateInstanceResponse>('getStateInstance');
  }

  checkAccount({ phoneNumber, force = false, }: CheckAccountRequest) {
    return this.request<CheckAccountResponse>('checkAccount', {
      httpMethod: 'POST',
      body: {
        phoneNumber,
        force,
      }
    });
  }

  getContactInfo(chatId: string) {
    return this.request<ContactInfoResponse>('getContactInfo', {
      httpMethod: 'POST',
      body: {
        chatId
      }
    });
  }

  sendMessage({ chatId, message }: SendMessageRequest) {
    return this.request<SendMessageResponse>('sendMessage', {
      httpMethod: 'POST',
      body: {
        chatId,
        message,
      }
    });
  }

  receiveNotification(
    receiveTimeout = 10,
  ) {
    return this.request<ReceiveNotificationResponse>(
      'receiveNotification',
      {
        query: {
          receiveTimeout,
        },
      },
    );
  }
  
  deleteNotification(receiptId: number) {
    return this.request<DeleteNotificationResponse>(`deleteNotification`, {
      httpMethod: 'DELETE',
      pathSuffix: String(receiptId)
    });
  }
}

export function createGreenApiClient(credentials?: GreenApiCredentials): GreenApiClient {
  const resolvedCredentials = credentials ?? {
    apiUrl: import.meta.env.VITE_GREEN_API_URL ?? '',
    idInstance: import.meta.env.VITE_GREEN_API_ID_INSTANCE ?? '',
    apiTokenInstance: import.meta.env.VITE_GREEN_API_TOKEN_INSTANCE ?? ''
  };

  return new GreenApiClient(resolvedCredentials);
}
