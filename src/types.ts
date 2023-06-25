export interface UserType {
  name: string
  bio: string
  age: number
  uid: string
  gender: string
  profilePicture: string
  authenticated: boolean
  matchingConfig: {
    from: number
    to: number
    lang: string
    genders: string[]
  }
}

export interface UserSocketType {
  user: UserType,
  id: any
}

export interface langsBucketType {
  [k: string]: Array<UserSocketType>
}
