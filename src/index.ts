import io from './server'

import { langsBucketType, UserSocketType, UserType } from './types'
import { insideOfRange } from './utils'

let langsBucket: langsBucketType = {}

const removeFromBucket = (id: string, lang?: string) => {
  if (lang) {
    const index = langsBucket[lang].findIndex(obj => obj.id === id);
    if (index === -1) return;
    langsBucket[lang].splice(index, 1);
  } else {
    // Remover o usuário de todas as linguagens no bucket
    Object.values(langsBucket).forEach(lang => {
      const index = lang.findIndex(obj => obj.id === id);
      if (index !== -1) {
        lang.splice(index, 1);
      }
    });
  }
};


const onUserAdd = (user: UserType, socketId: string) => {

  console.log('init user add')
  
  const lang = user.matchingConfig.lang
  const {from, to} = user.matchingConfig
  
  langsBucket[`${lang}`].push({id: socketId, user})

  const filteredLang = langsBucket[`${lang}`].filter(p => p.user.uid !== user.uid)
  
  const filteredAge = filteredLang.filter(p => {
    const f = p.user.matchingConfig.from;
    const t = p.user.matchingConfig.to;
    return insideOfRange(p.user.age, [from, to]) && insideOfRange(user.age, [f, t])
  })

  const filteredGender = filteredAge.filter(p => {
    console.log(p.user.matchingConfig.genders, p.user.gender)
    console.log(user.matchingConfig.genders, user.gender)
    if(p.user.matchingConfig.genders.includes(user.gender)){
      if(user.matchingConfig.genders.includes(p.user.gender)){
        return true
      }
    }
    return false
  })

  console.log('filterde gender', filteredGender)

  if(!!filteredGender[0]){
    removeFromBucket(filteredGender[0].id, lang);
    removeFromBucket(socketId, lang);
    io.to(filteredGender[0].id).emit('match', user);
    io.to(socketId).emit('match', filteredGender[0].user);
  }
}

io.on('connection', (socket: any) => {

  socket.once('add_user', (user: UserType) => {
    if(!user?.uid || user?.age < 18) return;
    if(!user?.matchingConfig?.lang) user.matchingConfig['lang'] = 'none'
    if(!langsBucket[user?.matchingConfig.lang]) langsBucket[user?.matchingConfig.lang] = [];
    console.log(`
    new user: 
    socket id: ${socket.id}
    firebase uid: ${user.uid}
    `);
    onUserAdd(user, socket.id);
    console.log(user);
  })

  socket.on("disconnect", (reason: any) => {
    console.log(`
    user exist: ${socket.id}
    `);
    removeFromBucket(socket.id);
  })
});
