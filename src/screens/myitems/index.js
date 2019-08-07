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
  List,
  ListItem,
  Body
} from "native-base";

import styles from "./styles";
import { withFirebase } from '../../components/firebase';
import { createStackNavigator, createAppContainer } from 'react-navigation';


//const usersList = [];




class myItems extends Component {


constructor(props) {
    super(props);
    this.gotoDetails = this.gotoDetails.bind(this);
    this.getName = this.getName.bind(this);
    this.state = {
      itemList:[],
      loading: false,
      items: [],
      key: [],
      dfridge: '',
    };
  }

  componentDidMount() {
    this.setState({ dfridge:'', fridges: [], loading: true, items: []});
    var iList = [];
    var itemList = [];


    this.props.firebase.user(this.props.firebase.cuser()).child('/mydfridge').on('value', snapshot => {
      const usersObject = snapshot.val();
      this.state.dfridge= usersObject;
      console.log('halo',this.state.dfridge)


    console.log('sort:', this.state.dfridge)
    this.props.firebase.allitems().orderByChild('Fridge').equalTo(this.state.dfridge).on('value', snapshot => {
      const usersObject = snapshot.val();
      //const itemList = [];
      //console.log('uO' ,usersObject)
      if (usersObject!=null){
        Object.entries(usersObject).map(([key, value])=>{
          iList = ({
            key: key,// 'test'//value.Name
            name: value.Name
          });
          itemList.push(iList);
          //console.log('asdasd' ,itemList)
        });
        this.setState({
          loading: false,
          key: itemList,
        });
      }else{
        this.setState({
          loading: false
        });
      };
    });
    console.log('asdasd' ,itemList)
    });
  }

  componentWillUnmount() {
    this.props.firebase.myitems().off();
  }

  //gotoDetails = event => {
    //event.preventDefault();
  //};

  addItem() {
    console.log('new Item')
    this.props.navigation.navigate("NewItem")
    //event.preventDefault();
  };

  getName = data => {
    console.log('getName: ',data);
    let rvalue=data.name;
    return rvalue;
  };

  gotoDetails = data => {
    console.log("show details of Item: ", data.key )
    //this.props.navigation.navigate("DrawerOpen")
    this.props.navigation.navigate("DetItem", {itemId: data.key})
    //this.props.firebase.addnewItem()
  }

  deleteItem = data => {
    console.log('remove(myitems): ', data.key)
    this.props.navigation.navigate("DeleteItem", {itemId: data.key})
}



  render() {
    //const { navigation } = this.props;
    //const itemId = navigation.getParam('itemId', 'NO-ID');
    const ItemsList = ({items}) => (
      <div>
        {items.map((data) => (
          <ListItem>
            <Left>
              <Text >{this.getName(data)}</Text>
            </Left>
            <Right>
              <Button onClick= {() => this.gotoDetails(data)}>
                <Text>+</Text>
              </Button>
            </Right>
            <Right>
              <Button onClick= {() => this.props.navigation.navigate("DeleteItem", {itemId: data.key})}>
                <Text>-</Text>
              </Button>
            </Right>
          </ListItem>
        ))}
      </div>
    );

    const { key, loading } = this.state;

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
            <Title>Your Items</Title>
          </Body>
          <Right />
        </Header>

        <Content>
          <List >
          {loading && <div>Loading ...</div>}
          <ItemsList  items={key} />
          </List>
        </Content>

        <Footer>
          <FooterTab>
            <Button active full onClick={() => {this.addItem()}}>
              <Text>Add New Item</Text>
            </Button>
          </FooterTab>
        </Footer>
      </Container>
    );
  }

}



export default withFirebase(myItems);
