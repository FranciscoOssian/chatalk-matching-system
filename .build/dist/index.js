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
var import_express = __toESM(require("express"));
var import_http = __toESM(require("http"));
var import_socket = require("socket.io");
var app = (0, import_express.default)();
var server = import_http.default.createServer(app);
var io = new import_socket.Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "DELETE"],
    allowedHeaders: ["my-custom-header"],
    credentials: true
  },
  maxHttpBufferSize: 1e8
});
var port = process.env.PORT || 8e3;
server.listen(port, () => {
  console.log(`listening on *:${port}`);
});
var server_default = io;
var insideOfRange = (value, range) => {
  if (value >= range[0] && value <= range[1])
    return true;
  else
    return false;
};
var defaultUser = {
  id: "",
  user: {
    name: "",
    bio: "",
    age: 50,
    profilePicture: "",
    uid: "",
    gender: void 0,
    authenticated: false,
    matchingConfig: {
      from: 50,
      to: 50,
      lang: "noOne",
      genders: [void 0]
    }
  }
};
var langsBucket = {};
var removeFromBucket = (id, lang) => {
  const index = langsBucket[lang].findIndex((obj) => obj.id === id);
  if (index === -1)
    return;
  langsBucket[lang].splice(index, 1);
};
server_default.on("connection", (socket) => {
  socket.once("add_user", (user) => {
    if (!(user == null ? void 0 : user.uid))
      return;
    console.log(`
      a user connected: ${user.age}y ${user.gender}
      that search for ${user.matchingConfig.genders.join(";")}
      with age [${user.matchingConfig.from} - ${user.matchingConfig.to}]
    `);
    let userConection;
    userConection = {
      id: socket.id,
      user: {
        ...defaultUser.user,
        ...user,
        matchingConfig: {
          ...user.matchingConfig
        }
      }
    };
    const { lang, from, to } = userConection.user.matchingConfig;
    if (!langsBucket[`${lang}`])
      langsBucket[`${lang}`] = [];
    langsBucket[`${lang}`].push(userConection);
    try {
      let filtered = langsBucket[`${lang}`].filter((p) => p.id !== userConection.id);
      filtered = filtered.filter(
        (person) => insideOfRange(person.user.age, [from, to]) && insideOfRange(userConection.user.age, [person.user.matchingConfig.from, person.user.matchingConfig.to])
      );
      filtered = filtered.filter(
        (person) => person.user.matchingConfig.genders.includes(userConection.user.gender) && userConection.user.matchingConfig.genders.includes(person.user.gender)
      );
      if (!!filtered[0]) {
        removeFromBucket(filtered[0].id, filtered[0].user.matchingConfig.lang);
        removeFromBucket(userConection.id, userConection.user.matchingConfig.lang);
        server_default.to(filtered[0].id).emit("match", userConection.user);
        server_default.to(userConection.id).emit("match", filtered[0].user);
      }
    } catch (e) {
      console.log(e);
    }
  });
  socket.on("disconnect", (reason) => {
    console.log("a user disconnect", socket.id);
    for (const lang of Object.keys(langsBucket)) {
      removeFromBucket(socket.id, lang);
    }
  });
});
//# sourceMappingURL=index.js.map
