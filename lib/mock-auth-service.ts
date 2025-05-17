// This is a mock authentication service for development/testing
// It simulates Firebase authentication when the real Firebase isn't properly configured

// Mock user data
const mockUsers = [
    {
      email: "test@example.com",
      password: "password123",
      uid: "mock-user-1",
      displayName: "Test User",
    },
  ]
  
  // Mock token generation
  const generateMockToken = (uid: string) => {
    return `mock-token-${uid}-${Date.now()}`
  }
  
  // Mock login function
  export const mockLogin = async (email: string, password: string): Promise<string> => {
    console.log("Using mock authentication service")
  
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000))
  
    // Find user
    const user = mockUsers.find((u) => u.email === email && u.password === password)
  
    if (!user) {
      throw new Error("Firebase: Error (auth/user-not-found).")
    }
  
    // Generate and return mock token
    const token = generateMockToken(user.uid)
    localStorage.setItem("mockUser", JSON.stringify(user))
    return token
  }
  
  // Mock register function
  export const mockRegister = async (email: string, password: string): Promise<string> => {
    console.log("Using mock authentication service")
  
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000))
  
    // Check if user already exists
    if (mockUsers.some((u) => u.email === email)) {
      throw new Error("Firebase: Error (auth/email-already-in-use).")
    }
  
    // Create new user
    const newUser = {
      email,
      password,
      uid: `mock-user-${Date.now()}`,
      displayName: email.split("@")[0],
    }
  
    mockUsers.push(newUser)
  
    // Generate and return mock token
    const token = generateMockToken(newUser.uid)
    localStorage.setItem("mockUser", JSON.stringify(newUser))
    return token
  }
  
  // Mock sign out function
  export const mockSignOut = async (): Promise<void> => {
    console.log("Using mock authentication service")
  
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500))
  
    // Clear mock user from local storage
    localStorage.removeItem("mockUser")
  }
  
  // Mock current user
  export const getMockCurrentUser = () => {
    const userJson = localStorage.getItem("mockUser")
    if (!userJson) return null
  
    try {
      return JSON.parse(userJson)
    } catch (e) {
      return null
    }
  }
  