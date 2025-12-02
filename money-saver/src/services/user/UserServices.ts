import { API_ENDPOINTS, apiRequest } from "@/lib/api"

// User-related types
export interface RegisterUserPayload {
  first_name: string
  last_name: string
  password: string
  email: string
  income: number | null
  budget_types: Array<{
    id: number
    total_amount: number
  }>
}

export interface LoginUserPayload {
  email: string
  password: string
}

export function UserServices() {
  const registerUser = async (registerUserPayload: RegisterUserPayload) => {
    try {
      const response = await apiRequest(API_ENDPOINTS.REGISTER_USER, {
        method: "POST",
        body: JSON.stringify(registerUserPayload),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      // console.error("Error registering user:", error)
      throw error
    }
  }

  const loginUser = async (loginUserPayload: LoginUserPayload) => {
    try {
      const response = await apiRequest(API_ENDPOINTS.LOGIN_USER, {
        method: "POST",
        body: JSON.stringify(loginUserPayload),
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      return data
    } catch (error) {
      // // console.error("Error logging in user:", error)
      throw error
    }
  }

  return {
    registerUser,
    loginUser,
  }
}
