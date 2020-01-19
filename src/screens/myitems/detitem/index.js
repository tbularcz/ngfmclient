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
import { Image, View, } from 'react-native';

import styles from "./styles";
import { withFirebase } from '../../../components/firebase';
import axios from 'axios'
import { cacheAdapterEnhancer } from 'axios-extensions'
//import Camera from 'react-html5-camera-photo';
import Quagga from 'quagga'
import Camera, { FACING_MODES, IMAGE_TYPES } from 'react-html5-camera-photo';



const no_image_available = require("../../../assets/no_image_available.jpeg");
const testbarcode = require("../../../assets/test1.png");
const INITIAL_STATE = {
  name: '',
  oname: '',
  fname: '',
  beschreibung: '',
  owner: '',
  id: '',
  fridge:'',
  datum: '',
  image: '',
  loading:true,
  barcodeuri:'',
  addBarcodetrigger:false,
  barcoderaw:'',
};

class detItem extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
      this.state.changePicturetrigger=false
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
        count: usersObject.Count,
        image:usersObject.Image,
        barcode:usersObject.Barcode,
        imageuri: no_image_available
        })
        if (usersObject.Image){
          const link = this.props.firebase.imageref(this.props.navigation.state.params.itemId).getDownloadURL().then(url=> {
            this.setState({
                loading: false,
                imageuri: url
            });
        })
      }else{this.state.uri = no_image_available}

      if (usersObject.Barcode){
          const link = this.props.firebase.barcoderef(this.props.navigation.state.params.itemId).getDownloadURL().then(urlb=> {
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
        })
      })

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

  async olddrucken(id: string, item: string, count: string, datum: string) {
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
        await axios.post("http://"+iptoprint+":8081"+'/print', {
          headers:{
            'Content-Type': 'application/xml',
            'Accept': 'application/json',
            'Accept-Language': '*',
            'Content-Language': '*',
          },
        data:{
          'id': id,
          'item': item,
          'count': count,
          'datum': datum,
          'link': link
        },
      }).then(res => {
          console.log(res);
          console.log(res.data);
        })
      }
      catch(error){
        console.log("error in catch: ", error)
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
         onTakePhoto = { (dataUri) => { this.onTakePhoto(dataUri, this.props.navigation.state.params.itemId);}}
       />
     )
  }

  addBarcodeRender(){
      this.state.addBarcodetrigger=false
     return (
       <Camera isImageMirror = {false} idealResolution = {{width: 300, height: 300}}
         onTakePhoto = { (barcodeUri) => { this.onTakeBarcode(barcodeUri, this.props.navigation.state.params.itemId);}}
       />
     )
  }

  onTakePhoto (dataUri) {
    // Do stuff with the dataUri photo...
    this.setState({imageuri: dataUri})
    this.props.firebase.addPicture(dataUri, this.props.navigation.state.params.itemId)
  }

  onTakeBarcode (barcodeUri) {
    this.setState({barcodeuri: barcodeUri})
    this.props.firebase.addBarcode(barcodeUri, this.props.navigation.state.params.itemId)
    this.state.barcoderaw = barcodeUri
  }



  checkBarcode(){
    var url = this.state.barcoderaw;
    //console.log(document.getElementById("barcode"))


  Quagga.decodeSingle({
    decoder: {
        readers: ["code_128_reader"] // List of active readers
    },
    locate: true, // try to locate the barcode in the image
    //multiple: true,
    //patchSize: "small", // x-small, small, medium, large, x-large
    //halfSample: true,
    src: url // or 'data:image/jpg;base64,' + data
    }, function(result){
    if(result.codeResult) {
        console.log("result", result.codeResult.code);
    } else {
        console.log("not detected for: ", url);
    }
});

  }

  render() {
    const { id, owner, name, beschreibung, fridge, imageuri } = this.state;

    var QRCode = require('qrcode.react');

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
              value={this.state.name}
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


          <View id="barcode" style={{paddingLeft: 15, paddingTop: 15}}>
            <Image  source={this.state.barcodeuri} style={{height: 400, width: 400  }}/>
          </View>


          <View style={{paddingLeft: 15, paddingTop: 15, paddingbottom: 30}}>
            <Button bordered onPress={()=>{this.addBarcode()}}>
              <Text>Add Barcode</Text>
            </Button>
          </View>


          <View style={{paddingLeft: 15, paddingTop: 15, paddingbottom: 30}}>
            {this.state.addBarcodetrigger ? this.addBarcodeRender():<text></text>}
          </View>


          <View style={{paddingLeft: 15, paddingTop: 15, paddingbottom: 30}}>
            <Button bordered onPress={()=>{this.checkBarcode()}}>
              <Text>Check Barcode</Text>
            </Button>
          </View>

          <Label style={styles.label}>QR Code:</Label>
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
