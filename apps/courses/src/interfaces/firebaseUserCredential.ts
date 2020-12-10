interface profile {
  [key: string]: string;
}

interface credential extends firebase.auth.AuthCredential {
  accessToken: string;
}

interface additionalUserInfo extends firebase.auth.AdditionalUserInfo {
  profile: profile;
}

interface firebaseUserCredentialInterface extends firebase.auth.UserCredential {
  additionalUserInfo: additionalUserInfo;
  credential: credential;
}

export default firebaseUserCredentialInterface;
