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
import Welcome from "./screens/welcome/";
import Login from "./screens/login/";
import Signup from "./screens/signup/";
import MyFridges from "./screens/myfridges/";
import DetFridge from "./screens/myfridges/detfridge/";
import NewFridge from "./screens/myfridges/newfridge/";
import DeleteFridge from "./screens/myfridges/deletefridge/";
import MyProfile from "./screens/myprofile/";
import MyItems from "./screens/myitems/";
import DetItem from "./screens/myitems/detitem/";
import NewItem from "./screens/myitems/newitem/";
import DeleteItem from "./screens/myitems/deleteitem/";
import CheckOut from "./screens/checkout/";

//import { withAuthentication } from './components/Session';
import { withFirebase } from './components/firebase';


//Menü
const Drawer = DrawerNavigator(
  {
    Home: { screen: Home },
    Welcome: {screen: Welcome},
    Login: {screen: Login},
    Signup: {screen: Signup},
    MyFridges: {screen: MyFridges},
    DetFridge: {screen: DetFridge},
    NewFridge: {screen: NewFridge},
    DeleteFridge: {screen: DeleteFridge},
    MyProfile: {screen: MyProfile},
    MyItems: {screen: MyItems},
    DetItem: {screen: DetItem},
    NewItem: {screen: NewItem},
    DeleteItem: {screen: DeleteItem},
    CheckOut: {screen: CheckOut},

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
