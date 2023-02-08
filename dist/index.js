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
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// src/server.ts
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

// src/utils.ts
var insideOfRange = (value, range) => {
  if (value >= range[0] && value <= range[1])
    return true;
  else
    return false;
};

// src/index.ts
var langsBucket = {};
var removeFromBucket = (id, lang) => {
  const index = langsBucket[lang].findIndex((obj) => obj.id === id);
  if (index === -1)
    return;
  langsBucket[lang].splice(index, 1);
};
server_default.on("connection", (socket) => {
  socket.once("add_user", (user) => {
    const { profilePicture, name, age, bio, authenticated, matchingConfig } = user;
    const userConection = {
      id: socket.id,
      user: {
        name: name ?? "",
        bio: bio ?? "",
        age: age ?? 50,
        profilePicture: profilePicture ?? "",
        authenticated: authenticated ?? false,
        matchingConfig: {
          from: matchingConfig?.from ?? 50,
          to: matchingConfig?.to ?? 50,
          lang: matchingConfig?.lang ?? "noOne"
        }
      }
    };
    console.log("a user connected", userConection);
    const { lang, from, to } = userConection.user.matchingConfig;
    if (!langsBucket[`${lang}`])
      langsBucket[`${lang}`] = [];
    langsBucket[`${lang}`].push(userConection);
    console.log(langsBucket);
    try {
      const filtered = langsBucket[`${lang}`].filter(
        (person) => insideOfRange(userConection.user.age, [from, to]) && insideOfRange(userConection.user.age, [person.user.matchingConfig.to, person.user.matchingConfig.from]) && person.id !== userConection.id
      );
      console.log(filtered);
      if (!!filtered[0]) {
        removeFromBucket(filtered[0].id, filtered[0].user.matchingConfig.lang);
        removeFromBucket(socket.id, userConection.user.matchingConfig.lang);
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
