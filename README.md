# react-native-expo-facebook-and-firebase-login
A basic template showing the steps necessary to implement Facebook login authorization on a react-native app using Expo IDE's Facebook module and Firebase.

App.js contains all of the code necessary, except for app specific IDs.  Follow these steps to link your firebase app with your corresponding facebook app.

1. Create a Firebase App and click on Add Firebase To Your Web App to access the configuration settings.
2. Open the App.js file and copy the config settings from Firebase to the const config object.
3. Create an App on your Facebook developer profile
4. Back on the Firebase Console access Authentication > Sign-In Method and enable Facebook sign-in
5. Copy your App ID and App Secret from the Facebook dashboard over to the corresponding fields in the Firebase Facebook Sign In Panel.
6. Copy your Oauth Redirect URI from Firebase and enter it in the Valid Oauth Redirect URIs field found on Facebook Dashboard under Products > Facebook Login > Settings
