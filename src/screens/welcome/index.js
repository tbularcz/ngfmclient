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
