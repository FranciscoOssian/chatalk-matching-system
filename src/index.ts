import io from './server'

import { insideOfRange } from './utils'
import { UserConnectionType, UserType } from './types'

let langsBucket: {
  [k: string]: Array<UserConnectionType>
} = {}

const removeFromBucket = (id: number, lang: string) => {
  const index = langsBucket[lang].findIndex(obj => obj.id === id);
  if (index === -1) return;
  langsBucket[lang].splice(index, 1);
}

io.on('connection', (socket: any) => {

  socket.once('add_user', (user: UserType & {id: any}) => {

    const { profilePicture, name, age, bio, authenticated, matchingConfig } = user;

    const userConection = {
      id: socket.id,
      user: {
        name: name ?? '',
        bio: bio ?? '',
        age: age ?? 50,
        profilePicture: profilePicture ?? '',
        authenticated: authenticated ?? false,
        matchingConfig: {
          from: matchingConfig?.from ?? 50,
          to: matchingConfig?.to ?? 50,
          lang: matchingConfig?.lang ?? 'noOne'
        }
      }
    }

    console.log('a user connected', userConection);

    const {lang, from, to} = userConection.user.matchingConfig

    if (!langsBucket[`${lang}`]) langsBucket[`${lang}`] = [];

    langsBucket[`${lang}`].push(userConection);

    console.log(langsBucket);

    try {
      const filtered = langsBucket[`${lang}`].filter(
        person =>
          insideOfRange(userConection.user.age, [from, to])
          &&
          insideOfRange(userConection.user.age, [person.user.matchingConfig.to, person.user.matchingConfig.from])
          &&
          person.id !== userConection.id
      )
      console.log(filtered);
      if(!!filtered[0]){
        removeFromBucket(filtered[0].id, filtered[0].user.matchingConfig.lang)
        removeFromBucket(socket.id, userConection.user.matchingConfig.lang)
        io.to(filtered[0].id).emit('match', userConection.user);
        io.to(userConection.id).emit('match', filtered[0].user);
      }
    }
    catch (e) { console.log(e) }

  })

  socket.on("disconnect", (reason: any) => {
    console.log("a user disconnect", socket.id);
    for (const lang of Object.keys(langsBucket)) {
      removeFromBucket(socket.id, lang);
    }
  })
});
