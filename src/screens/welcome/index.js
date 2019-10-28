import React, { Component } from "react";
import { ImageBackground, View, StatusBar } from "react-native";
import { Container, Button, H3, Text } from "native-base";
import { withFirebase } from '../../components/firebase';

import styles from "./styles";

const launchscreenBg = require("../../assets/splashscreen3.jpg");
const launchscreenLogo = require("../../assets/logo-kitchen-sink.png");

const INITIAL_STATE = {
  email: '',
  password: '',
  error: null,
};


class Welcome extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
    //this.onSubmit = this.onSubmit.bind(this);
    //this.props.firebase = this.props.firebase.bind(this);
  }

  componentDidMount() {

  }

  checkNav = params => {
    //in case of Item is given - jump to item
    //should check if item is valid
    //shoudl chek if user is 22cVGuA57H28BxlUoxvFhVKYia4J8Lr4Dt8CQ8KohWik29onKxXI5Edha
    //if item is valid and belongs to users
    //console.log("Params sind: ", params);
    var item = params.substring(params.search("item="),params.search("&"));
    var owner = params.substring(params.search("owner=")+6);
    var validcombination =false;
    //var url ="";

    //console.log("Item to check: ", item);
    //console.log("Owner to check: ", owner);

    this.props.firebase.itemOwner(item).on('value', snapshot => {
      const usersObject = snapshot.val();
      //console.log("Owner ist", usersObject);
      validcombination = (usersObject==owner)
      if(validcombination){
        //console.log("in klammer:", item, "0 ist", item.charAt(0))
        this.props.navigation.navigate("DeleteItem", {itemId: item, route: 'MyItems'})
      }
    })
  }


  onSubmit = event => {
    const { email, password } = this.state;
    this.props.firebase
      .doSignInWithEmailAndPassword(process.env.REACT_APP_TBLI, process.env.REACT_APP_TBPW)
      .then(() => {
        this.setState({ ...INITIAL_STATE });
        this.props.navigation.navigate("Home")
      })
      .catch(error => {
        this.setState({ error });
      });
    event.preventDefault();
  };

  render() {
    const { email, password, error } = this.state;



    //console.log(window.location.search.substring(6))
    //if item is given jump to details
    this.checkNav(window.location.search.substring(6))

    return (
      <Container>
        <StatusBar barStyle="light-content" />
        <ImageBackground source={launchscreenBg} style={styles.imageContainer}>
          <View style={styles.logoContainer}>
            <ImageBackground source={launchscreenLogo} style={styles.logo} />
          </View>
          <View
            style={{
              alignItems: "center",
              marginBottom: 50,
              backgroundColor: "transparent"
            }}
          >
            <H3 style={styles.text}>Start organizing yourself</H3>
            <View style={{ marginTop: 8 }} />
            <H3 style={styles.text}>Welcome to tFridge</H3>
            <View style={{ marginTop: 8 }} />
          </View>
          <View style={{ marginBottom: 40 }}>
            <Button
              style={{ backgroundColor: "#6FAF98", alignSelf: "center" }}
              onPress={() => this.props.navigation.navigate("Signup")}
            >
              <Text>Sign Up!</Text>
            </Button>
          </View>
          <View style={{ marginBottom: 40 }}>
            <Button
              style={{ backgroundColor: "#6FAF98", alignSelf: "center" }}
              onClick={this.onSubmit}
            >
              <Text>TB Login</Text>
            </Button>
            {error && <p>{error.message}</p>}
          </View>
          <View style={{ marginBottom: 80 }}>
            <Button
              style={{ backgroundColor: "#6FAF98", alignSelf: "center" }}
              onPress={() => this.props.navigation.navigate("Login")}
            >
              <Text>  Log In! </Text>

            </Button>
          </View>
        </ImageBackground>
      </Container>



    );

  }
}

export default withFirebase(Welcome);
