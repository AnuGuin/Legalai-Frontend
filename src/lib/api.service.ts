const NEXT_PUBLIC_API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:10000').replace(/\/api$/, '');

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  provider: string;
  preferences?: any;
  createdAt: string;
  lastLoginAt?: string;
}

interface Message {
  id: string;
  content: string;
  role: "USER" | "ASSISTANT";
  createdAt: string;
  attachments?: string[];
  metadata?: any;
}

interface Conversation {
  id: string;
  userId: string;
  title: string;
  mode: "NORMAL" | "AGENTIC";
  documentId?: string;
  documentName?: string;
  sessionId?: string;
  createdAt: string;
  updatedAt: string;
  messages?: Message[];
}

interface SendMessageResponse {
  message: Message;
  conversation: {
    id: string;
    sessionId?: string;
    documentId?: string;
  };
}

interface ShareConversationResponse {
  link?: string;
  message?: string;
}

interface Translation {
  id: string;
  userId: string;
  sourceText: string;
  translatedText: string;
  sourceLang: string;
  targetLang: string;
  createdAt: string;
}

interface UserStats {
  documentAnalysisCount: number;
  translationCount: number;
}

class ApiService {
  private ApiError = class ApiError extends Error {
    status: number
    body: any
    constructor(status: number, message: string, body?: any) {
      super(message)
      this.name = 'ApiError'
      this.status = status
      this.body = body
    }
  }

  private getAuthToken(): string | null {
    return localStorage.getItem('authToken');
  }

  private getLocalStats(): UserStats {
    try {
      const stats = localStorage.getItem('userStats');
      return stats ? JSON.parse(stats) : { documentAnalysisCount: 0, translationCount: 0 };
    } catch {
      return { documentAnalysisCount: 0, translationCount: 0 };
    }
  }

  private updateLocalStats(type: 'doc' | 'trans') {
    const stats = this.getLocalStats();
    if (type === 'doc') stats.documentAnalysisCount++;
    if (type === 'trans') stats.translationCount++;
    localStorage.setItem('userStats', JSON.stringify(stats));
  }
  
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = this.getAuthToken();
    
    const headers: Record<string, string> = {
      ...options.headers as Record<string, string>,
    };

    if (!(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const url = `${NEXT_PUBLIC_API_URL}${endpoint}`;
      let requestBodyForLog: any = undefined;
      try {
        if (options.body instanceof FormData) {
          requestBodyForLog = Array.from((options.body as FormData).keys());
        } else if (typeof options.body === 'string') {
          try {
            requestBodyForLog = JSON.parse(options.body as string);
          } catch {
            requestBodyForLog = (options.body as string).slice(0, 1000);
          }
        }
      } catch (e) {
        requestBodyForLog = 'Unable to inspect body for log';
      }

      console.log('API Request:', { method: options.method || 'GET', url, headers, body: requestBodyForLog });
      
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const responseText = await response.text().catch(() => '');
        let errorData: any = undefined;
        try {
          errorData = responseText ? JSON.parse(responseText) : undefined;
        } catch {
          //error
        }

        const errorMessageFromBody = (errorData && (errorData.message || errorData.error)) || responseText || `HTTP error! status: ${response.status}`;
        console.error('API Error: url=', url, ' status=', response.status, ' statusText=', response.statusText)
        throw new this.ApiError(response.status, `HTTP ${response.status}: ${errorMessageFromBody}`, errorData ?? responseText);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // ==================== User Profile APIs ====================

  async getUserProfile(): Promise<UserProfile> {
    const response = await this.request<ApiResponse<UserProfile>>('/api/user/profile');
    if (!response.success || !response.data) {
      throw new Error('Failed to fetch user profile');
    }
    return response.data;
  }

  async updateUserProfile(data: { name?: string; avatar?: string; preferences?: any }): Promise<UserProfile> {
    const response = await this.request<ApiResponse<UserProfile>>(
      '/api/user/profile',
      {
        method: 'PUT',
        body: JSON.stringify(data)
      }
    );
    if (!response.success || !response.data) {
      throw new Error('Failed to update profile');
    }
    return response.data;
  }

  async getUserStats(): Promise<UserStats> {
    try {
      const response = await this.request<ApiResponse<any>>('/api/user/stats');
      const localStats = this.getLocalStats();
      return {
        documentAnalysisCount: (response.data?.documentAnalysisCount || 0) + localStats.documentAnalysisCount,
        translationCount: (response.data?.translationCount || 0) + localStats.translationCount
      };
    } catch (e) {
      console.warn('Failed to fetch server stats, using local stats', e);
      return this.getLocalStats();
    }
  }

  async deleteAccount(): Promise<void> {
    const response = await this.request<ApiResponse<void>>(
      '/api/user/profile', 
      { method: 'DELETE' }
    );
    if (!response.success) {
      throw new Error('Failed to delete account');
    }
  }

  // ==================== Conversation APIs ====================

  async createConversation(
    mode: 'NORMAL' | 'AGENTIC',
    title?: string,
    documentId?: string,
    documentName?: string,
    sessionId?: string
  ): Promise<Conversation> {
    const response = await this.request<ApiResponse<Conversation>>(
      '/api/chat/conversations',
      {
        method: 'POST',
        body: JSON.stringify({
          mode,
          title,
          documentId,
          documentName,
          sessionId,
        }),
      }
    );

    if (!response.success || !response.data) {
      throw new Error('Failed to create conversation');
    }

    return response.data;
  }

  async getConversations(): Promise<Conversation[]> {
    const response = await this.request<ApiResponse<Conversation[]>>(
      '/api/chat/conversations'
    );

    if (!response.success || !response.data) {
      throw new Error('Failed to fetch conversations');
    }
    return response.data;
  }

  async getConversationMessages(conversationId: string): Promise<Conversation> {
    const response = await this.request<ApiResponse<Conversation>>(
      `/api/chat/conversations/${conversationId}`
    );

    if (!response.success || !response.data) {
      throw new Error('Failed to fetch conversation messages');
    }
    return response.data;
  }

  async getConversationInfo(conversationId: string): Promise<Conversation> {
    const response = await this.request<ApiResponse<Conversation>>(
      `/api/chat/conversations/${conversationId}/info`
    );

    if (!response.success || !response.data) {
      throw new Error('Failed to fetch conversation info');
    }

    return response.data;
  }

  async sendMessage(
    conversationId: string,
    message: string,
    mode: 'NORMAL' | 'AGENTIC',
    file?: File
  ): Promise<SendMessageResponse> {
    let body: FormData | string;
    let headers: HeadersInit = {};

    if (file) {
      const formData = new FormData();
      formData.append('message', message);
      formData.append('mode', mode);
      formData.append('file', file);
      body = formData;
    } else {
      body = JSON.stringify({ message, mode });
      headers['Content-Type'] = 'application/json';
    }

    const response = await this.request<ApiResponse<SendMessageResponse>>(
      `/api/chat/conversations/${conversationId}/messages`,
      {
        method: 'POST',
        headers,
        body,
      }
    );

    if (!response.success || !response.data) {
      throw new Error('Failed to send message');
    }

    // Track usage locally
    if (file || mode === 'AGENTIC') {
       this.updateLocalStats('doc');
    }

    return response.data;
  }

  async deleteConversation(conversationId: string): Promise<void> {
    const response = await this.request<ApiResponse<void>>(
      `/api/chat/conversations/${conversationId}`,
      {
        method: 'DELETE',
      }
    );

    if (!response.success) {
      throw new Error('Failed to delete conversation');
    }
  }

  async deleteAllConversations(): Promise<{ deletedCount: number }> {
    const response = await this.request<ApiResponse<{ deletedCount: number }>>(
      '/api/chat/conversations',
      {
        method: 'DELETE',
      }
    );

    if (!response.success || !response.data) {
      throw new Error('Failed to delete conversations');
    }

    return response.data;
  }

  async shareConversation(conversationId: string, share: boolean): Promise<ShareConversationResponse> {
    const response = await this.request<ApiResponse<ShareConversationResponse>>(
      `/api/chat/conversations/${conversationId}/share`,
      {
        method: 'POST',
        body: JSON.stringify({ share }),
      }
    );

    if (!response.success || !response.data) {
      throw new Error('Failed to update sharing status');
    }

    return response.data;
  }

  async getSharedConversation(shareLink: string): Promise<{ userName: string; conversation: Conversation }> {
    const response = await this.request<ApiResponse<{ userName: string; conversation: Conversation }>>(
      `/api/chat/shared/${encodeURIComponent(shareLink)}`
    );

    if (!response.success || !response.data) {
      throw new Error('Failed to fetch shared conversation');
    }

    return response.data;
  }

  // ==================== Translation APIs ====================

  async translateText(params: {
    text: string;
    sourceLang: string;
    targetLang: string;
  }): Promise<ApiResponse<Translation>> {
    const response = await this.request<ApiResponse<Translation>>(
      '/api/translation/translate',
      {
        method: 'POST',
        body: JSON.stringify(params),
      }
    );
    
    if (response.success) {
        this.updateLocalStats('trans');
    }
    
    return response;
  }

  async detectLanguage(text: string): Promise<ApiResponse<{ language: string; display_name: string }>> {
    return await this.request<ApiResponse<{ language: string; display_name: string }>>(
      '/api/translation/detect-language',
      {
        method: 'POST',
        body: JSON.stringify({ text }),
      }
    );
  }

  async getTranslationHistory(): Promise<ApiResponse<Translation[]>> {
    return await this.request<ApiResponse<Translation[]>>('/api/translation/history');
  }
}

export const apiService = new ApiService();
export type { UserProfile, Conversation, Message, SendMessageResponse, Translation, UserStats };