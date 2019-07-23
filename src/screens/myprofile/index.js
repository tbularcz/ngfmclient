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
  username: '',
  email: '',
  password: '',
  dfridge: null,
  selected: "key1",
  fridges: [],
  dfridge: []
};



class MyProfile extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };

  }

  componentDidMount() {
    this.setState({ fridges: [], loading: true });

    this.props.firebase.username().on('value', snapshot => {
      const usersObject = snapshot.val();
      this.setState({username: usersObject})
    });
    this.props.firebase.email().on('value', snapshot => {
      const usersObject = snapshot.val();
      this.setState({email: usersObject})
    });


    this.props.firebase.myfridges().on('value', snapshot => {
      const usersObject = snapshot.val();
      const fridgeList = [];
      Object.entries(usersObject).map(([key,value])=>{
        fridgeList.push(key);
      });
      this.setState({
        fridges: fridgeList,
      });
    });
    this.props.firebase.mydfridge().on('value', snapshot => {
      const usersObject = snapshot.val();
      this.setState({selected: usersObject})
    });

  }

  componentWillUnmount() {
    this.props.firebase.myfridges().off();
  } 

  onValueChange(value: string) {
    this.setState({
      selected: value
    });
    var updates = {};
        updates['/users/' + this.props.firebase.cuser() + "/mydfridge"] = value;
    this.props.firebase.updateDB(updates);
    //force reload fehlt

  }

  render() {
    const { username, email, password, dfridge, fridges } = this.state;
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
          <Label>Username:         </Label>
            <Input
              disabled ="true"
              name="Username"
              value={username}
              type="text"
            />
          </Item>

          <Item inlineLabel disabled>
            <Label>Email Address:   </Label>
              <Input
                disabled ="true"
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
                      <Picker.Item label={data} value={data} />

                    ))
                }
                </Picker>
              </Right>
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
