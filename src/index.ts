import io from './server'

import { defaultUser, insideOfRange } from './utils'
import { langsBucketType, UserSocketType, UserType, genderValuesType } from './types'

let langsBucket: langsBucketType = {}

const removeFromBucket = (id: number, lang: string) => {
  const index = langsBucket[lang].findIndex(obj => obj.id === id);
  if (index === -1) return;
  langsBucket[lang].splice(index, 1);
}

const getGender = (gender: genderValuesType) => {
  if(gender === 0) return 'woman'
  if(gender === 1) return 'men'
  if(gender === 2) return 'trans'
}

io.on('connection', (socket: any) => {

  socket.once('add_user', (user: UserType) => {

    if(!user?.uid) return
    console.log(`a user connected: ${user.age}y ${getGender(user.gender)} that search for ${user.matchingConfig.genders.map(g => getGender(g)).join(';')} with age ${user.matchingConfig.from} - ${user.matchingConfig.to}`);

    let userConection: UserSocketType;

    userConection = {
      id: socket.id,
      user: {
        ...defaultUser.user,
        ...user,
        matchingConfig: {
          ...user.matchingConfig
        }
      }
    }

    console.log(userConection)

    const {lang, from, to} = userConection.user.matchingConfig;

    if (!langsBucket[`${lang}`]) langsBucket[`${lang}`] = [];

    langsBucket[`${lang}`].push(userConection);

    try {
      let filtered = langsBucket[`${lang}`].filter( p => p.id !== userConection.id )
      filtered = filtered.filter(
        person =>
          insideOfRange(person.user.age, [from, to])
          &&
          insideOfRange(userConection.user.age, [person.user.matchingConfig.from, person.user.matchingConfig.to])
      )
      filtered = filtered.filter(
        person =>
          person.user.matchingConfig.genders.includes(userConection.user.gender)
          &&
          userConection.user.matchingConfig.genders.includes(person.user.gender)
      )
      if(!!filtered[0]){
        removeFromBucket(filtered[0].id, filtered[0].user.matchingConfig.lang)
        removeFromBucket(userConection.id, userConection.user.matchingConfig.lang)
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
