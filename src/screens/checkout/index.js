import React, { Component } from "react";
import {
  Container,
  Header,
  Title,
  Content,
  Text,
  Button,
  Icon,
  Footer,
  FooterTab,
  Left,
  Right,
  Body
} from "native-base";
import Camera from 'react-html5-camera-photo';
import 'react-html5-camera-photo/build/css/index.css';


import styles from "./styles";

class Home extends Component {
  addItem() {
    console.log('new Item')
    this.props.navigation.navigate("NewItem", {route: 'Home'})
    //event.preventDefault();
  };

  onTakePhoto (dataUri) {
    // Do stuff with the dataUri photo...
    console.log('takePhoto');
  }



  render() {
    return (
      <Container style={styles.container}>
        <Header>
          <Left>
            <Button
              transparent
              onPress={() => this.props.navigation.navigate("DrawerOpen")}
            >
              <Icon name="ios-menu" />
            </Button>
          </Left>
          <Body>
            <Title>Welcome to tFridge!</Title>
          </Body>
          <Right />
        </Header>

        <Content padder>

        <Text><b>Please select an action:</b></Text>
        <Text> </Text>

        <Text>  </Text>

        <Button danger full onClick={() => {this.props.navigation.navigate("CheckOut")}}>
          <Text>Check Out Item</Text>
        </Button>

        <Camera
          onTakePhoto = { (dataUri) => { this.onTakePhoto(dataUri); } }
        />

        <Text> </Text>

        </Content>

        <Footer>
          <FooterTab>
            <Button active full danger >
              <Text>Delete</Text>
            </Button>
          </FooterTab>
        </Footer>
      </Container>
    );
  }
}

export default Home;
