export interface UserType {
  name: string
  bio: string
  age: number
  profilePicture: string
  authenticated: boolean
  matchingConfig: {
      from: number
      to: number
      lang: string
  }
}


export interface UserConnectionType {
  user: UserType,
  id: any
}
