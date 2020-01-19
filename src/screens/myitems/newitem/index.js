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
//import Camera from 'react-html5-camera-photo';
import 'react-html5-camera-photo/build/css/index.css';
import Camera, { FACING_MODES, IMAGE_TYPES } from 'react-html5-camera-photo';



const no_image_available = require("../../../assets/no_image_available.jpeg");


const INITIAL_STATE = {

  name: '',
  beschreibung: '',
  owner: '',
  id: '',
  fridge:'',
  imageuri:'',
  changePicturetrigger:false,
  addBarcodetrigger:false,
  barcodeuri:'',


};





class NewItem extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
      this.changePicture = this.changePicture.bind(this)
      this.changePictureRender = this.changePictureRender.bind(this)
      this.addBarcodeRender = this.addBarcodeRender.bind(this)
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
            anzahl: usersObject.Count,
            barcode:usersObject.Barcode,
            imageuri: no_image_available
            })

            if (usersObject.Barcode){
              console.log("aaa",this.state.id)
                const link = this.props.firebase.barcoderef(this.state.id).getDownloadURL().then(urlb=> {
                  console.log("bbb",urlb)
                  this.setState({
                      loading: false,
                      barcodeuri: urlb
                  });
                })
            }else{
              this.state.barcodeuri = no_image_available
            }

            this.props.firebase.cfridge(usersObject.Fridge).on('value', snapshot => {
              const usersObject = snapshot.val();
                this.setState({
                  fname: usersObject.Name,
                  })
            });
          };
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
    this.props.firebase.removeItem(data);
  }

  async drucken(id: string, item: string, count: string, datum: string) {
  //erst IP Adresse vom rasperry bekommen und dann Drucken

  let iptoprint =''
  try {
     await axios.get('https://us-central1-ngtfridge.cloudfunctions.net/getIP', {
       ///hier könnte man noch den User mitgeben damit es userspezifisch wird
     }).then(res => {
       //console.log(res);
       iptoprint =res.data.ip.config.ip
       console.log(res.data.ip.config.ip);
     })
   }
   catch(error){
     console.log("error in catch: ", error)
   }

  //console.out("ip to print is")

   const link = process.env.REACT_APP_HOST+'?id='+this.state.id
     try {

        await axios.get("https://us-central1-ngtfridge.cloudfunctions.net/print", {params:{
          'id': id,
          'item': item,
          'count': count,
          'datum': datum,
          'link': link
        }}).then(res => {
          console.log(res);
          console.log(res.data);
        })
      }
      catch(error){
        console.log("error in catch: ", error.response)


      }
  }

  changePicture(){
    if (this.state.changePicturetrigger==false){
      this.state.changePicturetrigger=true
    } else {
      this.state.changePicturetrigger=false
    }
      this.forceUpdate();
  }

  addBarcode(){
    if (this.state.addBarcodetrigger==false){
      this.state.addBarcodetrigger=true
    } else {
      this.state.addBarcodetrigger=false
    }
      this.forceUpdate();
  }

  changePictureRender(){
      this.state.changePicturetrigger=false
     return (
       <Camera isImageMirror = {false} idealFacingMode = {FACING_MODES.ENVIRONMENT} idealResolution = {{width: 300, height: 300}}
         onTakePhoto = { (dataUri) => { this.onTakePhoto(dataUri, this.id);}}
       />
     )
  }
  addBarcodeRender(){
      this.state.addBarcodetrigger=false
     return (
       <Camera isImageMirror = {false} idealResolution = {{width: 300, height: 300}}
         onTakePhoto = { (barcodeUri) => { this.onTakeBarcode(barcodeUri, this.id);}}
       />
     )
  }

  onTakePhoto (dataUri) {
    this.setState({imageuri: dataUri})
    this.props.firebase.addPicture(dataUri, this.state.id)
  }

  onTakeBarcode (barcodeUri) {
    this.setState({barcodeuri: barcodeUri})

    //const codeReader = new BrowserQRCodeReader();
    //const img = barcodeUri;
    this.props.firebase.addBarcode(barcodeUri, this.state.id)

    //const result = codeReader.decodeFromImage(this.state.barcode);
    //console.log(result);

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
            <Image source={this.state.imageuri} style={{height: 400, width: 400  }}/>
          </View>

          <View style={{paddingLeft: 15, paddingTop: 15, paddingbottom: 30}}>
            <Button bordered onPress={()=>{this.changePicture()}}>
              <Text>Change Picture</Text>
            </Button>
          </View>
          <View style={{paddingLeft: 15, paddingTop: 15, paddingbottom: 30}}>
            {this.state.changePicturetrigger ? this.changePictureRender():<text></text>}
          </View>


          <Label style={styles.label}>Barcode:</Label>
          <View style={{paddingLeft: 15, paddingTop: 15}}>
            <Image source={this.state.barcodeuri} style={{height: 400, width: 400  }}/>
          </View>

          <View style={{paddingLeft: 15, paddingTop: 15, paddingbottom: 30}}>
            <Button bordered onPress={()=>{this.addBarcode()}}>
              <Text>Add Barcode</Text>
            </Button>
          </View>


          <View style={{paddingLeft: 15, paddingTop: 15, paddingbottom: 30}}>
            {this.state.addBarcodetrigger ? this.addBarcodeRender():<text></text>}
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
