export interface UserInfo {
  id?: string;
  username?: string;
  image?: string;
}

export interface ChatInfo {
  user?: UserInfo;
  message?: string;
  type?: "ActivityLog" | "MessageLog";
  time?: string;
}
