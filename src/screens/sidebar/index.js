import React, { Component } from "react";
import { Image } from "react-native";
import {
  Content,
  Text,
  List,
  ListItem,
  Icon,
  Container,
  Left,
  Right,
  Badge
} from "native-base";
import styles from "./style";

const drawerCover = require("../../assets/splashscreen4.png");
const drawerImage = require("../../assets/logo-kitchen-sink.png");
const datas = [
  {
    name: "Home",
    route: "Home",
    icon: "phone-portrait",
    bg: "#C5F442"
  },
  {
    name: "My Profile",
    route: "MyProfile",
    icon: "phone-portrait",
    bg: "#C5F442"
  },
  {
    name: "My Fridges",
    route: "MyFridges",
    icon: "phone-portrait",
    bg: "#C5F442"
  },
  {
    name: "My Items",
    route: "MyItems",
    icon: "phone-portrait",
    bg: "#C5F442"
  },
  {
    name: "Checkout",
    route: "CheckOut",
    icon: "phone-portrait",
    bg: "#C5F442"
  },
  {
    name: "Logout",
    route: "Welcome",
    icon: "phone-portrait",
    bg: "#C5F442"
  },

  // {
  //   name: "Actionsheet",
  //   route: "Actionsheet",
  //   icon: "easel",
  //   bg: "#C5F442"
  // },

];

class SideBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      shadowOffsetWidth: 1,
      shadowRadius: 4
    };
  }

  render() {
    return (
      <Container>
        <Content
          bounces={false}
          style={{ flex: 1, backgroundColor: "#fff", top: -1 }}
        >
          <Image source={drawerCover} style={styles.drawerCover} />
          <Image square style={styles.drawerImage} source={drawerImage} />

          <List
            dataArray={datas}
            renderRow={data => (
              <ListItem
                button
                noBorder
                onPress={() => this.props.navigation.navigate(data.route)}
              >
                <Left>
                  <Icon
                    active
                    name={data.icon}
                    style={{ color: "#777", fontSize: 26, width: 30 }}
                  />
                  <Text style={styles.text}>{data.name}</Text>
                </Left>
                {data.types && (
                  <Right style={{ flex: 1 }}>
                    <Badge
                      style={{
                        borderRadius: 3,
                        height: 25,
                        width: 72,
                        backgroundColor: data.bg
                      }}
                    >
                      <Text style={styles.badgeText}>{`${
                        data.types
                      } Types`}</Text>
                    </Badge>
                  </Right>
                )}
              </ListItem>
            )}
          />
        </Content>
      </Container>
    );
  }
}

export default SideBar;
