"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var import_server = __toESM(require("./server"));
var import_utils = require("./utils");
let langsBucket = {};
const removeFromBucket = (id, lang) => {
  if (lang) {
    const index = langsBucket[lang].findIndex((obj) => obj.id === id);
    if (index === -1)
      return;
    langsBucket[lang].splice(index, 1);
  } else {
    Object.values(langsBucket).forEach((lang2) => {
      const index = lang2.findIndex((obj) => obj.id === id);
      if (index !== -1) {
        lang2.splice(index, 1);
      }
    });
  }
};
const onUserAdd = (user, socketId) => {
  console.log("init user add");
  const lang = user.matchingConfig.lang;
  const { from, to } = user.matchingConfig;
  langsBucket[`${lang}`].push({ id: socketId, user });
  const filteredLang = langsBucket[`${lang}`].filter((p) => p.user.uid !== user.uid);
  const filteredAge = filteredLang.filter((p) => {
    const f = p.user.matchingConfig.from;
    const t = p.user.matchingConfig.to;
    return (0, import_utils.insideOfRange)(p.user.age, [from, to]) && (0, import_utils.insideOfRange)(user.age, [f, t]);
  });
  const filteredGender = filteredAge.filter((p) => {
    console.log(p.user.matchingConfig.genders, p.user.gender);
    console.log(user.matchingConfig.genders, user.gender);
    if (p.user.matchingConfig.genders.includes(user.gender)) {
      if (user.matchingConfig.genders.includes(p.user.gender)) {
        return true;
      }
    }
    return false;
  });
  console.log("filterde gender", filteredGender);
  if (!!filteredGender[0]) {
    removeFromBucket(filteredGender[0].id, lang);
    removeFromBucket(socketId, lang);
    import_server.default.to(filteredGender[0].id).emit("match", user);
    import_server.default.to(socketId).emit("match", filteredGender[0].user);
  }
};
import_server.default.on("connection", (socket) => {
  socket.once("add_user", (user) => {
    if (!(user == null ? void 0 : user.uid) || (user == null ? void 0 : user.age) < 18 || !(user == null ? void 0 : user.matchingConfig.lang))
      return;
    if (!langsBucket[user == null ? void 0 : user.matchingConfig.lang])
      langsBucket[user == null ? void 0 : user.matchingConfig.lang] = [];
    console.log(`
    new user: 
    socket id: ${socket.id}
    firebase uid: ${user.uid}
    `);
    onUserAdd(user, socket.id);
    console.log(user);
  });
  socket.on("disconnect", (reason) => {
    console.log(`
    user exist: ${socket.id}
    `);
    removeFromBucket(socket.id);
  });
});
//# sourceMappingURL=index.js.map
