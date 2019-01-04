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
  Body,
  Form,
  Label,
  Item,
  Picker,
  Input
} from "native-base";

import styles from "./styles";
import { withFirebase } from '../../components/firebase';

const INITIAL_STATE = {
  email: '',
  password: '',
  dfridge: null,
  selected: "key1",
  fridges: []
};



class MyProfile extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };

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
        fridges: fridgeList,
      });
    });

  }

  componentWillUnmount() {
    this.props.firebase.fridges().off();
  }

  onValueChange(value: string) {
    this.setState({
      selected: value
    });
    var updates = {};
        updates['/user/' + this.auth.currentUser.uid + "/mydfridge"] = value;
    this.props.firebase.updateDB(updates);

  }

  render() {
    const { email, password, dfridge, fridges } = this.state;
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
            <Title>Header</Title>
          </Body>
          <Right />
        </Header>

        <Content padder>
        <Form>

        <Item inlineLabel disabled>
          <Label>Username</Label>
            <Input
              name="email"
              value={email}
              type="text"
            />
          </Item>

          <Item inlineLabel disabled>
            <Label>Email Address:</Label>
              <Input
                name="email"
                value={email}
                type="text"
              />
            </Item>

            <Item inlineLabel>
              <Label>Default Fridge:</Label>

              <Right>
                <Picker
                  mode="dropdown"
                  iosHeader="Select your SIM"
                  iosIcon={<Icon name="arrow-dropdown-circle" style={{ color: "#007aff", fontSize: 25 }} />}
                  style={{ width: 250 }}
                  selectedValue={this.state.selected}
                  onValueChange={this.onValueChange.bind(this)}
                >
                {fridges.map((data) => (
                      <Picker.Item label={data} value="key0" />

                    ))
                }
                </Picker>
              </Right>
            </Item>



          <Item inlineLabel disabled>
            <Label>Password:        </Label>
              <Input
                name="password"
                value={password}
                type="password"
                secureTextEntry
              />
          </Item>
        </Form>
        </Content>

        <Footer>
          <FooterTab>
            <Button active full>
              <Text>Footer</Text>
            </Button>
          </FooterTab>
        </Footer>
      </Container>
    );
  }
}



export default withFirebase(MyProfile);
