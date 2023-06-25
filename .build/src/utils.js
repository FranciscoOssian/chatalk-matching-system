"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var utils_exports = {};
__export(utils_exports, {
  defaultUser: () => defaultUser,
  insideOfRange: () => insideOfRange
});
module.exports = __toCommonJS(utils_exports);
const insideOfRange = (value, range) => {
  if (value >= range[0] && value <= range[1])
    return true;
  else
    return false;
};
const defaultUser = {
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  defaultUser,
  insideOfRange
});
//# sourceMappingURL=utils.js.map
