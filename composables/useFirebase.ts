import {
  User,
  UserInfo,
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { useConfirmDialog, onClickOutside } from "@vueuse/core";

export default function () {
  const { $auth } = useNuxtApp();
  const user = useState<User | null>("firebase-user", () => null);

  $auth?.onAuthStateChanged((_user: User) => {
    user.value = _user;
  });

  async function errorHandler(error: any) {
    const errorCode = error.code;
    const errorMessage = error.message;
    alert(errorMessage);
  }

  async function registerUser(email: string, password: string) {
    try {
      await createUserWithEmailAndPassword($auth, email, password);
      navigateTo("/joinGroup");
    } catch (error: any) {
      errorHandler(error);
    }
  }

  async function loginUser(email: string, password: string) {
    try {
      const userCredential = await signInWithEmailAndPassword(
        $auth,
        email,
        password
      );
      navigateTo("/joinGroup");
    } catch (error: any) {
      errorHandler(error);
    }
  }

  async function logout() {
    try {
      await signOut($auth);
      user.value = null;
      navigateTo("/");
    } catch (error: any) {
      errorHandler(error);
    }
  }

  async function googleLogin() {
    try {
      await signInWithPopup($auth, new GoogleAuthProvider());
      navigateTo("/joinGroup");
    } catch (error: any) {
      errorHandler(error);
    }
  }
  return { user, registerUser, loginUser, logout, googleLogin };
}
