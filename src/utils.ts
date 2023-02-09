import { UserSocketType } from "./types";

export const insideOfRange = (value: number, range: Array<number>) => {
  if(value >= range[0] && value <= range[1]) return true;
  else return false;
}

export const defaultUser: UserSocketType = {
  id: '',
  user: {
    name: '',
    bio: '',
    age: 50,
    profilePicture: '',
    uid: '',
    gender: undefined,
    authenticated: false,
    matchingConfig: {
      from: 50,
      to: 50,
      lang: 'noOne',
      genders: [undefined],
    }
  }
}
