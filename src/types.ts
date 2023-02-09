export type genderValuesType = 0 | 1 | 2 | 3 | 4 | undefined

export interface UserType {
  name: string
  bio: string
  age: number
  uid: string
  gender: genderValuesType
  profilePicture: string
  authenticated: boolean
  lastPerfilEdit?: Date
  matchingConfig: {
    from: number
    to: number
    lang: string
    genders: Array<genderValuesType>
  }
}

export interface UserSocketType {
  user: UserType,
  id: any
}

export interface langsBucketType {
  [k: string]: Array<UserSocketType>
}
