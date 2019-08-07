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

  this.setState({id: this.props.firebase.addnewFridge("Beschreibung", "Name")})
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
    updates['/fridges/' +this.state.id + "/Beschreibung"] = value;
    this.props.firebase.updateDB(updates);

  }

  addFridge = event => {
    console.log("user add new Fridge: " )
    //this.gotoDetails(this.props.firebase.addnewItem("Beschreibung", "Name"));
    event.preventDefault();
  };

  onNameChange(value: string) {
    this.setState({
      name: value
    });
    var updates = {};
    updates['/fridges/' +this.state.id + "/Name"] = value;
    this.props.firebase.updateDB(updates);
  }

  changeDFridge(value: string) {
    var updates = {};
        updates['/users/' + this.props.firebase.cuser() + "/mydfridge"] = value;
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
              onPress={() => this.props.navigation.navigate("MyFridges")}
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
          <Label>Name:          </Label>
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


        </Form>
        </Content>

        <Footer>
          <FooterTab>
          <Button active full onClick={() => {this.changeDFridge(this.state.id)}}>
            <Text>Set as Default Fridge</Text>
          </Button>
          </FooterTab>
        </Footer>
      </Container>
    );
  }
}



export default withFirebase(NewItem);
