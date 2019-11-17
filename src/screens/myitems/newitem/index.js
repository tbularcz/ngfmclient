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
import axios from 'axios'


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
    var key = this.props.firebase.addnewItem("", "")
    this.setState({id: key})

    //console.log('newkey: '+key)

    this.props.firebase.citem(key).on('value', snapshot => {
      const usersObject = snapshot.val();
        if (usersObject){
        this.setState({owner: usersObject.Owner,
                      beschreibung: usersObject.Beschreibung,
                      name: usersObject.Name,
                      fridge: usersObject.Fridge,
                      anzahl: usersObject.Count
                      })
                    }});


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
  onCountChange(value: string) {
    this.setState({
      count: value
    });
    var updates = {};
    updates['/items/' +this.state.id + "/Count"] = value;
    this.props.firebase.updateDB(updates);

  }

  deleteItem(data) {
    this.props.navigation.navigate(this.props.navigation.state.params.route);
    console.log('remove: ', data)
    this.props.firebase.removeItem(data);

  }



  drucken(id: string, item: string, count: string, datum: string) {
    this.props.navigation.navigate(this.props.navigation.state.params.route);
    axios.post(process.env.REACT_APP_LOCALAPI+'/print', {
        'id': id,
        'item': item,
        'date': datum,
        'count': count,
        'link': process.env.REACT_APP_HOST
  })
    .then((response) => {
      console.log(response);
    }, (error) => {
      console.log(error);
    });
  }




  render() {
    const { id, owner, name, beschreibung, fridge } = this.state;
    //const { itemID } = this.props.navigation.state.params
    var QRCode = require('qrcode.react');
    return (
      <Container style={styles.container}>
        <Header>

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

            <Item fixedLabel >
              <Label>Anzahl:  </Label>
                <Input
                  name="anzahl"
                  value={this.state.count}
                  type="number"
                  onChange={e => this.onCountChange(e.target.value)}

                />
              </Item>

            <Item fixedLabel>
              <Label>Owner:           </Label>
                <Input
                disabled='true'
                  name="Owner"
                  value={this.state.owner}
                  type="text"
                />
              </Item>

              <Item fixedLabel>
                <Label>Fridge:           </Label>
                  <Input
                  disabled='true'
                    name="fridge"
                    value={this.state.fridge}
                    type="text"
                  />
                </Item>

                <Item fixedLabel>
                  <Label>QR Code:           </Label>
                    <QRCode value={process.env.REACT_APP_LOCALAPI+'?item='+this.state.id+'?user='+this.state.fridge} />
                </Item>


        </Form>
        </Content>

        <Footer>
          <FooterTab>
            <Button success onClick={() => {this.drucken(this.state.id, this.state.name, this.state.count, this.state.datum)}}>
              <Text>Print & Safe</Text>
            </Button>
            <Button warning onClick={() => {this.props.navigation.navigate(this.props.navigation.state.params.route)}}>
              <Text>Safe</Text>
            </Button>
            <Button danger onClick={() => {this.deleteItem(this.state.id)}}>
              <Text>Discard</Text>
            </Button>
          </FooterTab>
        </Footer>
      </Container>
    );
  }
}



export default withFirebase(NewItem);
