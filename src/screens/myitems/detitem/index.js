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
  oname: '',
  fname: '',
  beschreibung: '',
  owner: '',
  id: '',
  fridge:'',
  datum: ''
};



class detItem extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
    this.onNameChange = this.onNameChange.bind(this)

  }

  componentDidMount() {


    this.props.firebase.citem(this.props.navigation.state.params.itemId).on('value', snapshot => {
      const usersObject = snapshot.val();

        this.setState({
                      id:this.props.navigation.state.params.itemId,
                      owner: usersObject.Owner,
                      beschreibung: usersObject.Beschreibung,
                      name: usersObject.Name,
                      fridge: usersObject.Fridge,
                      datum: usersObject.Date,
                      count: usersObject.Count
                      })

                      this.props.firebase.cfridge(usersObject.Fridge).on('value', snapshot => {
                        const usersObject = snapshot.val();
                          this.setState({
                                        fname: usersObject.Name,
                                        })
                      });

    });
    this.props.firebase.username().on('value', snapshot => {
      const usersObject = snapshot.val();
      this.setState({oname: usersObject})
    });


  }

  componentWillUnmount() {
    this.props.firebase.myfridges().off();
  }

  onBeschreibungChange(value: string) {
    this.setState({
      beschreibung: value,
    });

    var updates = {};
    updates['/items/' +this.props.navigation.state.params.itemId + "/Beschreibung"] = value;
    this.props.firebase.updateDB(updates);

  }

  onNameChange(value: string) {
    this.setState({
      name: value
    });
    var updates = {};
    updates['/items/' +this.props.navigation.state.params.itemId + "/Name"] = value;
    this.props.firebase.updateDB(updates);

  }

  onCountChange(value: string) {
    this.setState({
      count: value
    });
    var updates = {};
    updates['/items/' +this.props.navigation.state.params.itemId + "/Count"] = value;
    this.props.firebase.updateDB(updates);

  }

  onDatumChange(value: string) {
    this.setState({
      datum: value
    });
    var updates = {};
    updates['/items/' +this.props.navigation.state.params.itemId + "/Datum"] = value;
    this.props.firebase.updateDB(updates);

  }

  drucken(id: string, item: string, count: string, datum: string) {
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
      var QRCode = require('qrcode.react');
    //const { itemID } = this.props.navigation.state.params
    return (
      <Container style={styles.container}>
        <Header>
          <Left>
            <Button
              transparent
              onPress={() => this.props.navigation.navigate(this.props.navigation.state.params.route)}
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


          <Label style={styles.label}>ID:               </Label>
            <Input
              style={styles.input}
              disable='true'
              name="id"
              value={this.props.navigation.state.params.itemId}
              type="text"
            />



          <Label style={styles.label}>Artikel:          </Label>
            <Input
              style={styles.input}
              name="item"
              value={this.state.oname}
              type="text"
              onChange={e => this.onNameChange(e.target.value)}
            />



            <Label style={styles.label}>Beschreibung:  </Label>
              <Input
                style={styles.input}
                name="beschreibung"
                value={this.state.beschreibung}
                type="text"
                onChange={e => this.onBeschreibungChange(e.target.value)}
              />

              <Label style={styles.label}>Anzahl:  </Label>
                <Input
                  style={styles.input}
                  name="beschreibung"
                  value={this.state.count}
                  type="text"
                  onChange={e => this.onCountChange(e.target.value)}

                />

              <Label style={styles.label}>Eingefroren am:  </Label>
                <Input
                  style={styles.input}
                  name="Datum"
                  value={this.state.datum}
                  type="date"
                  onChange={e => this.onDatumChange(e.target.value)}

                />

              <Label style={styles.label}>Owner:           </Label>
                <Input
                  style={styles.input}
                  disabled='true'
                  name="owner"
                  value={this.state.oname}
                  type="text"
                />

                <Label style={styles.label}>Fridge:           </Label>
                  <Input
                    style={styles.input}
                    disabled='true'
                    name="fridge"
                    value={this.state.fname}
                    type="text"
                  />

                  <Label style={styles.label}>QR Code:           </Label>
                    <QRCode style={styles.label} id="code" value={process.env.REACT_APP_HOST+'?id='+this.state.id} />


        </Form>
        </Content>

        <Footer>
          <FooterTab>
            <Button active success full onPress={() => {this.props.navigation.navigate(this.props.navigation.state.params.route)}}>
              <Text>Speichern</Text>
            </Button>
            <Button active warning full onPress={() => {this.drucken(this.state.id, this.state.name, this.state.count, this.state.datum)}}>
              <Text>Drucken</Text>
            </Button>

          </FooterTab>
        </Footer>
      </Container>
    );
  }
}



export default withFirebase(detItem);
