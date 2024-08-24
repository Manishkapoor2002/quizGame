import { atom } from "recoil";
import { userStateType } from "../global/types";

const authState = atom({
  key: "authState",
  default: false,
});
const userState = atom<userStateType | null>({
  key: "userState",
  default: null,
});

export { authState, userState };
