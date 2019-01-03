import React from "react";
import { Root } from "native-base";
import {
  StackNavigator,
  DrawerNavigator
} from "react-navigation/lib/react-navigation.js";
import Firebase, { FirebaseContext } from './components/firebase';

//Navigation

import Home from "./screens/home/";
import SideBar from "./screens/sidebar";
import Welcome from "./screens/welcome/"
import Login from "./screens/login/"
import Signup from "./screens/signup/"

//import { withAuthentication } from './components/Session';
import { withFirebase } from './components/firebase';


//Menü
const Drawer = DrawerNavigator(
  {
    Home: { screen: Home },
    Welcome: {screen: Welcome},
    Login: {screen: Login},
    Signup: {screen: Signup},

  },
  {
    initialRouteName: "Welcome",
    contentOptions: {
      activeTintColor: "#e91e63"
    },
    contentComponent: props => <SideBar {...props} />
  }
);

const AppNavigator = StackNavigator(
  {
    Drawer: { screen: Drawer },
  },
  {
    initialRouteName: "Drawer",
    headerMode: "none"
  }
);

const App = () =>
 (
  <Root>
    <FirebaseContext.Provider value={new Firebase()}>
      <AppNavigator />
    </FirebaseContext.Provider>
  </Root>
);

export default withFirebase(App);
