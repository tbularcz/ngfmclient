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
    this.state = {
      loading: false,
      items: [],
    };
  }

  componentDidMount() {
    this.setState({ fridges: [], loading: true });
    this.props.firebase.myitems().on('value', snapshot => {
      const usersObject = snapshot.val();
      const itemList = [];
      if (usersObject!=null){
        Object.entries(usersObject).map(([key,value])=>{
          itemList.push(key);
        });
        this.setState({
          loading: false,
          items: itemList,
        });
      }else{
        this.setState({
          loading: false
        });
      };
    });
  }

  componentWillUnmount() {
    this.props.firebase.myitems().off();
  }

  //gotoDetails = event => {
    //event.preventDefault();
  //};

  addItem = event => {
    console.log("user add new Item: " )
    this.props.firebase.addnewItem()
    event.preventDefault();
  };



  gotoDetails(data){
    console.log("show details of Item: ", data.data )
    //this.props.navigation.navigate("DrawerOpen")
    this.props.navigation.navigate("DetItem", {itemId: data.data})
    //this.props.firebase.addnewItem()
  }




  render() {
    //const { navigation } = this.props;
    //const itemId = navigation.getParam('itemId', 'NO-ID');
    const ItemsList = ({items}) => (
      <div>
        {items.map((data) => (
          <ListItem>
            <Left>
              <Text >{data}</Text>
            </Left>
            <Right>
              <Button onClick= {() => this.gotoDetails({data})}>
                <Text>+</Text>
              </Button>
            </Right>
          </ListItem>
        ))}
      </div>
    );

    const { items, loading } = this.state;
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
          <ItemsList  items={items} />
          </List>
        </Content>

        <Footer>
          <FooterTab>
            <Button active full onClick={this.addItem}>
              <Text>Add Item</Text>
            </Button>
          </FooterTab>
        </Footer>
      </Container>
    );
  }

}



export default withFirebase(myItems);
