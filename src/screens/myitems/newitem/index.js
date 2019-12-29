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
import { Image, View } from 'react-native';

import styles from "./styles";
import { withFirebase } from '../../../components/firebase';
import axios from 'axios'
import Camera from 'react-html5-camera-photo';
import 'react-html5-camera-photo/build/css/index.css';

const no_image_available = require("../../../assets/no_image_available.jpeg");


const INITIAL_STATE = {

  name: '',
  beschreibung: '',
  owner: '',
  id: '',
  fridge:'',
  uri:'',
  changePicturetrigger:false
};





class NewItem extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
      this.changePicture = this.changePicture.bind(this)
      this.changePictureRender = this.changePictureRender.bind(this)
  }

  componentDidMount() {
    var key = this.props.firebase.addnewItem("", "")
    this.setState({id: key})
    this.props.firebase.citem(key).on('value', snapshot => {
      const usersObject = snapshot.val();
        if (usersObject){
          this.setState({
            owner: usersObject.Owner,
            beschreibung: usersObject.Beschreibung,
            name: usersObject.Name,
            fridge: usersObject.Fridge,
            anzahl: usersObject.Count
            })
            if(usersObject.uri==undefined){
              this.state.uri = no_image_available}
            this.props.firebase.cfridge(usersObject.Fridge).on('value', snapshot => {
              const usersObject = snapshot.val();
                this.setState({
                  fname: usersObject.Name,
                  })
            });
          }
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
    updates['/items/' +this.state.id + "/Beschreibung"] = value;
    this.props.firebase.updateDB(updates);

  }

  addItem = event => {
    console.log("user add new Item: " )
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
    }).then((response) => {
      console.log(response);
    }, (error) => {
      console.log(error);
    });
  }

  changePicture(){
    if (this.state.changePicturetrigger==false){
      this.state.changePicturetrigger=true
    } else {
      this.state.changePicturetrigger=false
    }
      this.forceUpdate();
  }

  changePictureRender(){
      this.state.changePicturetrigger=false
     return (
       <Camera idealResolution = {{width: 300, height: 300}}
         onTakePhoto = { (dataUri) => { this.onTakePhoto(dataUri, this.id);}}
       />
     )
  }

  onTakePhoto (dataUri) {
    // Do stuff with the dataUri photo...
    this.setState({uri: dataUri})
    this.props.firebase.addPicture(dataUri, this.state.id)
  }

  render() {
    const { id, owner, name, beschreibung, fridge, changePicturetrigger } = this.state;


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
          <Label style={styles.label}>ID:</Label>
            <Input
              style={styles.input}
              disable='true'
              name="id"
              value={this.state.id}
              type="text"
            />

          <Label style={styles.label}>Artikel:</Label>
            <Input
              style={styles.input}
              name="item"
              value={this.state.name}
              type="text"
              onChange={e => this.onNameChange(e.target.value)}
            />

          <Label style={styles.label}>Beschreibung:</Label>
            <Input
              style={styles.input}
              name="beschreibung"
              value={this.state.beschreibung}
              type="text"
              onChange={e => this.onBeschreibungChange(e.target.value)}

            />

          <Label style={styles.label}>Anzahl:</Label>
            <Input
              style={styles.input}
              name="anzahl"
              value={this.state.count}
              type="number"
              onChange={e => this.onCountChange(e.target.value)}
            />

          <Label style={styles.label}>Owner:</Label>
            <Input
              style={styles.input}
              disabled='true'
              name="Owner"
              value={this.state.owner}
              type="text"
            />

          <Label style={styles.label}>Fridge:</Label>
              <Input
                style={styles.input}
                disabled='true'
                name="fridge"
                value={this.state.fname}
                type="text"
              />

          <Label style={styles.label}>Picture:</Label>
          <View style={{paddingLeft: 15, paddingTop: 15}}>
            <Image source={this.state.uri} style={{height: 400, width: 400  }}/>
          </View>

          <View style={{paddingLeft: 15, paddingTop: 15, paddingbottom: 30}}>
            <Button bordered onPress={()=>{this.changePicture()}}>
              <Text>Change Picture</Text>
            </Button>
          </View>
          <View style={{paddingLeft: 15, paddingTop: 15, paddingbottom: 30}}>
            {this.state.changePicturetrigger ? this.changePictureRender():<text></text>}
          </View>
        </Form>
        </Content>

        <Footer>
          <FooterTab>
            <Button success onPress={() => {this.drucken(this.state.id, this.state.name, this.state.count, this.state.datum)}}>
              <Text>Print & Safe</Text>
            </Button>
            <Button warning onPress={() => {this.props.navigation.navigate(this.props.navigation.state.params.route)}}>
              <Text>Safe</Text>
            </Button>
            <Button danger onPress={() => {this.deleteItem(this.state.id)}}>
              <Text>Discard</Text>
            </Button>
          </FooterTab>
        </Footer>
      </Container>
    );
  }
}



export default withFirebase(NewItem);
