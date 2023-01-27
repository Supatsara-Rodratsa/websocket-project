export interface UserInfo {
  id?: string;
  username?: string;
  image?: string;
  isOnline?: boolean;
}

export interface ChatInfo {
  user?: UserInfo;
  message?: string;
  type?: "ActivityLog" | "MessageLog" | "ImageLog";
  time?: string;
}
