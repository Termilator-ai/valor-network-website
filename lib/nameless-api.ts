interface NamelessResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

interface NamelessUser {
  id: number
  username: string
  displayname: string
  uuid?: string
  group_id: number
  group_name: string
  registered: number
  profile_views: number
  last_online: number
  exists: boolean
  validated: boolean
  reputation: number
  avatar: string
}

interface ForumCategory {
  id: number
  name: string
  description: string
  display_order: number
  parent_category_id?: number
  latest_post?: {
    id: number
    topic_title: string
    username: string
    created: number
  }
  topics_count: number
  posts_count: number
}

interface ForumTopic {
  id: number
  title: string
  author: string
  author_id: number
  created: number
  last_reply_created: number
  last_reply_username: string
  posts: number
  views: number
  locked: boolean
  sticky: boolean
  forum_id: number
}

interface ForumPost {
  id: number
  content: string
  author: string
  author_id: number
  created: number
  topic_id: number
}

class NamelessAPI {
  private baseUrl: string
  private apiKey: string

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_NAMELESS_API_URL || ""
    this.apiKey = process.env.NAMELESS_API_KEY || ""
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<NamelessResponse<T>> {
    try {
      const url = `${this.baseUrl}${endpoint}`
      const response = await fetch(url, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
          ...options.headers,
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error("NamelessMC API Error:", error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
      }
    }
  }

  // Authentication
  async login(username: string, password: string): Promise<NamelessResponse<{ user: NamelessUser; token?: string }>> {
    return this.request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    })
  }

  async register(username: string, email: string, password: string): Promise<NamelessResponse> {
    return this.request("/auth/register", {
      method: "POST",
      body: JSON.stringify({ username, email, password }),
    })
  }

  async validateUser(token: string): Promise<NamelessResponse<NamelessUser>> {
    return this.request("/auth/validate", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  }

  // User methods
  async getUser(identifier: string | number): Promise<NamelessResponse<NamelessUser>> {
    const endpoint =
      typeof identifier === "number" ? `/users/${identifier}` : `/users?username=${encodeURIComponent(identifier)}`
    return this.request(endpoint)
  }

  // Forum methods
  async getForumCategories(): Promise<NamelessResponse<ForumCategory[]>> {
    return this.request("/forum/categories")
  }

  async getForumTopics(categoryId?: number, page = 1): Promise<NamelessResponse<ForumTopic[]>> {
    const params = new URLSearchParams({ page: page.toString() })
    if (categoryId) params.append("category", categoryId.toString())
    return this.request(`/forum/topics?${params}`)
  }

  async getForumTopic(topicId: number): Promise<NamelessResponse<{ topic: ForumTopic; posts: ForumPost[] }>> {
    return this.request(`/forum/topics/${topicId}`)
  }

  async createForumTopic(categoryId: number, title: string, content: string, token: string): Promise<NamelessResponse> {
    return this.request("/forum/topics", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        category_id: categoryId,
        title,
        content,
      }),
    })
  }

  async createForumPost(topicId: number, content: string, token: string): Promise<NamelessResponse> {
    return this.request("/forum/posts", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        topic_id: topicId,
        content,
      }),
    })
  }

  // Server stats
  async getServerInfo(): Promise<
    NamelessResponse<{
      users: { count: number; online: number }
      forum: { topics: number; posts: number }
    }>
  > {
    return this.request("/server/info")
  }
}

export const namelessAPI = new NamelessAPI()
export type { NamelessUser, ForumCategory, ForumTopic, ForumPost, NamelessResponse }
