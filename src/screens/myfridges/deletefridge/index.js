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
import { withFirebase } from '../../../components/firebase';

const INITIAL_STATE = {
  name: '',
  beschreibung: '',
  owner: '',
  id: '',

};

class deleteFridge extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };

  }

  componentDidMount() {

    this.props.firebase.cfridge(this.props.navigation.state.params.fridgeId).on('value', snapshot => {
      const usersObject = snapshot.val();
        this.setState({owner: usersObject.Owner,
                      beschreibung: usersObject.Beschreibung,
                      name: usersObject.Name,
                      })
    });
  }

  componentWillUnmount() {
    this.props.firebase.myfridges().off();
  }

  deleteItem(data) {
    this.props.navigation.navigate("MyFridges");
    console.log('remove: ', data)
    this.props.firebase.removeFridge(data);

  }



  render() {
    const { id, owner, name, beschreibung, fridge } = this.state;
    //const { itemID } = this.props.navigation.state.params
    return (
      <Container style={styles.container}>
        <Header>
          <Left>
            <Button
              transparent
              onPress={() => this.props.navigation.navigate("MyItems")}
            >
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>{this.state.name}</Title>
          </Body>
          <Right />
        </Header>

        <Content padder>
        <Form>

        <Item fixedLabel>
          <Label>ID:               </Label>
            <Input
              disable='true'
              name="id"
              value={this.props.navigation.state.params.fridgeId}
              type="text"
            />
          </Item>

        <Item fixedLabel>
          <Label>Artikel:          </Label>
            <Input
              name="item"
              value={this.state.name}
              type="text"
              disabled='true'
            />
          </Item>

          <Item fixedLabel >
            <Label>Beschreibung:  </Label>
              <Input
                name="beschreibung"
                value={this.state.beschreibung}
                type="text"
                disabled='true'

              />
            </Item>

            <Item fixedLabel>
              <Label>Owner:           </Label>
                <Input
                disabled='true'
                  name="owner"
                  value={owner}
                  type="text"
                />
              </Item>

        </Form>
        </Content>

        <Footer>
          <FooterTab>
            <Button active full onClick={() => {this.deleteItem(this.props.navigation.state.params.fridgeId)}}>
              <Text>Delete Fridge</Text>
            </Button>
          </FooterTab>
        </Footer>
      </Container>
    );
  }
}



export default withFirebase(deleteFridge);
