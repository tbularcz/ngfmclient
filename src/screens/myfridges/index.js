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
  List,
  ListItem,
  Body
} from "native-base";

import styles from "./styles";
import { withFirebase } from '../../components/firebase';

//const usersList = [];


class myFridges extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      fridges: [],
};
  }

  componentDidMount() {
    this.setState({ fridges: [], loading: true });
    this.props.firebase.fridges().on('value', snapshot => {
      const usersObject = snapshot.val();
      const fridgeList = [];
      Object.entries(usersObject).map(([key,value])=>{
        fridgeList.push(key);
      });
      this.setState({
        loading: false,
        fridges: fridgeList,
      });
    });
  }

  componentWillUnmount() {
    this.props.firebase.fridges().off();
  }

  addFridge = event => {
    this.props.firebase.addnewFridge()
    event.preventDefault();
  };

  render() {
    const { fridges, loading } = this.state;
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
            <Title>Your Fridges</Title>
          </Body>
          <Right />
        </Header>

        <Content>
          <List>
          {loading && <div>Loading ...</div>}
          <FridgesList fridges={fridges} />
            <Button onClick={this.addFridge} block style={{ margin: 15, marginTop: 50 }}>
              <Text>Add Fridge </Text>
            </Button>
          </List>
        </Content>

        <Footer>
          <FooterTab>
            <Button active full>
              <Text>Manage Your Fridges</Text>
            </Button>
          </FooterTab>
        </Footer>
      </Container>
    );
  }
}

const FridgesList = ({ fridges }) => (
<div>
  {fridges.map((data) => (
    <ListItem>
      <Left>
        <Text>{data}</Text>
      </Left>
      <Right>
        <Icon name="arrow-forward" />
      </Right>
    </ListItem>
  ))}
  </div>
);

export default withFirebase(myFridges);
