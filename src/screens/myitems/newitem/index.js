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
  fridge:'',
};



class NewItem extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };

  }

  componentDidMount() {

  this.setState({id: this.props.firebase.addnewItem("Beschreibung", "Name")})
  //console.log('newkey: ',this.state.id)

  }

  componentWillUnmount() {
    this.props.firebase.myfridges().off();
  }

  onBeschreibungChange(value: string) {
    this.setState({
      beschreibung: value,
    });

    var updates = {};
    updates['/items/' +this.state.id + "/Beschreibung"] = value;
    this.props.firebase.updateDB(updates);

  }

  addItem = event => {
    console.log("user add new Item: " )
    //this.gotoDetails(this.props.firebase.addnewItem("Beschreibung", "Name"));
    event.preventDefault();
  };

  onNameChange(value: string) {
    this.setState({
      name: value
    });
    var updates = {};
    updates['/items/' +this.state.id + "/Name"] = value;
    this.props.firebase.updateDB(updates);

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
              value={this.state.id}
              type="text"
            />
          </Item>

        <Item fixedLabel>
          <Label>Artikel:          </Label>
            <Input
              name="item"
              value={this.state.name}
              type="text"
              onChange={e => this.onNameChange(e.target.value)}
            />
          </Item>

          <Item fixedLabel >
            <Label>Beschreibung:  </Label>
              <Input
                name="beschreibung"
                value={this.state.beschreibung}
                type="text"
                onChange={e => this.onBeschreibungChange(e.target.value)}

              />
            </Item>

            <Item fixedLabel>
              <Label>Owner:           </Label>
                <Input
                disabled='true'
                  name="owner"
                  value='n/a'
                  type="text"
                />
              </Item>

              <Item fixedLabel>
                <Label>Fridge:           </Label>
                  <Input
                  disabled='true'
                    name="fridge"
                    value='n/a'
                    type="text"
                  />
                </Item>

        </Form>
        </Content>

        <Footer>
          <FooterTab>
            <Button active full onClick={this.addItem}>
              <Text>Item Detail</Text>
            </Button>
          </FooterTab>
        </Footer>
      </Container>
    );
  }
}



export default withFirebase(NewItem);
