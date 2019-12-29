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

const no_image_available = require("../../../assets/no_image_available.jpeg");
const INITIAL_STATE = {
  name: '',
  fname: '',
  beschreibung: '',
  owner: '',
  id: '',
  fridge:'',
};

class DetItem extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };

  }

  componentDidMount() {

    this.props.firebase.citem(this.props.navigation.state.params.itemId).on('value', snapshot => {
      const usersObject = snapshot.val();
      if (usersObject!=null){
        this.setState({owner: usersObject.Owner,
          beschreibung: usersObject.Beschreibung,
          name: usersObject.Name,
          fridge: usersObject.Fridge
          })
          if (usersObject.Image){
            console.log('image available')

            const link = this.props.firebase.imageref(this.props.navigation.state.params.itemId).getDownloadURL().then(url=> {
              console.log("return",url)
              this.setState({
                  loading: false,
                  uri: url
              });
          })
        }else{this.state.uri = no_image_available}
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

  deleteItem(data) {
    this.props.navigation.navigate("MyItems");
    console.log('remove: ', data)
    this.props.firebase.removeItem(data);

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
              value={this.props.navigation.state.params.itemId}
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

              <Item fixedLabel>
                <Label>Fridge:           </Label>
                  <Input
                  disabled='true'
                    name="fridge"
                    value={this.state.fname}
                    type="text"
                  />
                </Item>
                <Label style={styles.label}>Picture:</Label>
                <View style={{paddingLeft: 15, paddingTop: 15}}>
                  <Image source={this.state.uri} style={{height: 400, width: 400  }}/>
                </View>

        </Form>
        </Content>

        <Footer>
          <FooterTab>
            <Button active full danger onPress={() => {this.deleteItem(this.props.navigation.state.params.itemId)}}>
              <Text>Delete Item</Text>
            </Button>
          </FooterTab>
        </Footer>
      </Container>
    );
  }
}



export default withFirebase(DetItem);
