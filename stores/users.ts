import { defineStore } from "pinia";
import { UserInfo } from "~~/library/interfaces";
export const userStore = defineStore("user", () => {
  // state
  const userAccount = reactive({} as UserInfo);

  // action
  function createUsername(username: string) {
    userAccount.username = username;
  }

  function createUserProfile(profile: string) {
    userAccount.image = profile;
  }

  function setUserId(userId: string) {
    userAccount.id = userId;
  }

  return { userAccount, createUsername, createUserProfile, setUserId };
});
