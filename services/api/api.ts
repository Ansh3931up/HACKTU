const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3014/api/v1'

export const api = {
  get: async (endpoint: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`)
      
      // Check content type
      const contentType = response.headers.get("content-type");
      if (!contentType?.includes("application/json")) {
        return {
          statusCode: response.status,
          data: { error: 'Invalid response format - Expected JSON' }
        }
      }

      if (!response.ok) {
        return {
          statusCode: response.status,
          data: { error: response.statusText || 'Request failed' }
        }
      }

      const data = await response.json()
      return { statusCode: response.status, data }
    } catch (error) {
      return {
        statusCode: 500,
        data: { error: 'Failed to fetch data' }
      }
    }
  },

  post: async (endpoint: string, body: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })

      // Check content type
      const contentType = response.headers.get("content-type");
      if (!contentType?.includes("application/json")) {
        return {
          statusCode: response.status,
          data: { error: 'Invalid response format - Expected JSON' }
        }
      }

      if (!response.ok) {
        return {
          statusCode: response.status,
          data: { error: response.statusText || 'Request failed' }
        }
      }

      const data = await response.json()
      return { statusCode: response.status, data }
    } catch (error) {
      return {
        statusCode: 500,
        data: { error: 'Failed to fetch data' }
      }
    }
  }
} 