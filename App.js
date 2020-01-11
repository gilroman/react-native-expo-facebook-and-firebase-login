import React, { useReducer, useEffect, useCallback } from "react";
import {
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  SafeAreaView,
  ActivityIndicator
} from "react-native";
import * as Facebook from "expo-facebook";
import firebase from "firebase";

// Enter your Facebooko app ID here.
const FACEBOOK_APP_ID = "<YOUR-FACEBOOK-APP-ID>";

// Enter your Firebase app web configuration settings here.
const config = {
  apiKey: "<YOUR-API-KEY>",
  authDomain: "<YOUR-AUTH-DOMAIN>",
  databaseURL: "<YOUR-DATABASE-URL>",
  storageBucket: "<YOUR-STORAGE-BUCKET>"
};

firebase.apps.length !== 0 || firebase.initializeApp(config);

const auth = firebase.auth();

function useFacebookLogin() {
  const [state, setState] = useReducer((s, a) => ({ ...s, ...a }), {
    initialized: false,
    errorMessage: undefined,
    data: undefined,
    logInStatus: "You are currently logged out.",
    loading: true
  });

  useEffect(() => {
    Facebook.initializeAsync(FACEBOOK_APP_ID).then(res => {
      setState({ initialized: true });
    });

    auth.onAuthStateChanged(user => {
      if (user != null) {
        setState({
          logInStatus: "We are authenticated now!",
          loading: false
        });
      } else {
        setState({
          logInStatus: "You are currently logged out.",
          loading: false
        });
      }
    });
  }, []);

  const handleSubmit = useCallback(async () => {
    const { type, token } = await Facebook.logInWithReadPermissionsAsync({
      permissions: ["public_profile", "email"]
    }).catch(e => {
      setState({ error: e.message });
    });
    switch (type) {
      case "success":
        setState({ data: token });
        //Firebase credential is created with the Facebook access token.
        const credential = firebase.auth.FacebookAuthProvider.credential(token);
        await auth.signInWithCredential(credential).catch(error => {
          this.setState({ errorMessage: error.message });
        });
        break;
      case "cancel":
        setState({ errorMessage: "User canceled" });
        break;
      default:
        setState({ errorMessage: "Unknown error" });
        break;
    }
  });

  return {
    ...state,
    handleSubmit
  };
}

function App() {
  const {
    handleSubmit,
    errorMessage,
    logInStatus,
    loading
  } = useFacebookLogin();

  return (
    <SafeAreaView style={styles.container}>
      {loading && <ActivityIndicator size="large" />}
      <TouchableHighlight
        style={styles.facebookButton}
        name="Facebook"
        underlayColor={styles.facebookButton.backgroundColor}
        onPress={handleSubmit}
      >
        <Text style={styles.facebookButtonText}>Log in with Facebook</Text>
      </TouchableHighlight>
      <View style={styles.space} />
      <Text>Logged In Status: {logInStatus}</Text>
      <View style={styles.space} />
      <Text> Log In Error Messages: {errorMessage}</Text>
    </SafeAreaView>
  );
}

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  },
  facebookButton: {
    width: 375 * 0.75,
    height: 48,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#3B5998"
  },
  facebookButtonText: {
    color: "#fff"
  },
  space: {
    height: 17
  }
});
