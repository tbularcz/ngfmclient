import React, {Component} from "react";
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
  Body} from "native-base";

import styles from "./styles";
import {withFirebase} from '../../components/firebase';
import {createStackNavigator, createAppContainer} from 'react-navigation';

class myFridges extends Component {

  constructor(props) {
    super(props);
    this.state = {
      fridgesList:[],
      loading: false,
      fridges: [],
      key: [],
    };
  }

  componentDidMount() {
    this.setState({ fridges: [], loading: true, });
    var fList = [];
    var fridgeList = [];

    this.props.firebase.allfridges().orderByChild('Owner').equalTo(this.props.firebase.cuser()).on('value', snapshot => {
      const usersObject = snapshot.val();
      console.log('FL' ,usersObject)
      if (usersObject != null) {
        Object.entries(usersObject).map(([key, value]) => {
          fList = ({
            key: key, // 'test'//value.Name
            name: value.Name
          });
          fridgeList.push(fList);
        });
        this.setState({
          loading: false,
          key: fridgeList,
        });
      } else {
        this.setState({
          loading: false
        });
      };
    });
    console.log('asdasd', fridgeList)
  }

  /* OLD this.setState({ fridges: [], loading: true });
    this.props.firebase.myfridges().on('value', snapshot => {
      const usersObject = snapshot.val();
      const fridgeList = [];
      Object.entries(usersObject).map(([key,value])=>{
        fridgeList.push(key);
      });
      this.setState({
        loading: false,
        fridges: fridgeList,
      });
    });
  }*/

  componentWillUnmount() {
    this.props.firebase.myfridges().off();
  }
  getName = data => {
    console.log('getName: ', data);
    let rvalue = data.name;
    return rvalue;
  };

  gotoFDetails = data => {
    console.log("show details of Fridge: ", data.key)

    this.props.navigation.navigate("DetFridge", {
      fridgeId: data.key
    })
    //this.props.firebase.addnewItem()
  }

  addFridge() {
    console.log('new Fridge')
    this.props.navigation.navigate("NewFridge")
    //event.preventDefault();
  };

  render() {
    const FridgeList = ({fridges}) => (
      <div>
        {fridges.map((data) => (
          <ListItem>
            <Left>
              <Text >{this.getName(data)}</Text>
            </Left>

            <Right>
              <Button onPress= {() => this.props.navigation.navigate("DeleteFridge", {fridgeId: data.key})}>
                <Text>-</Text>
              </Button>
            </Right>
            <Right>
              <Button onPress= {() => this.gotoFDetails(data)}>
                <Text>></Text>
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
            <Title>Your Fridges</Title>
          </Body>
          <Right />
        </Header>

        <Content>
          <List >
          {loading && <div>Loading ...</div>}
          <FridgeList  fridges={key} />
          </List>
        </Content>

        <Footer>
          <FooterTab>
            <Button active full onPress={() => {this.addFridge()}}>
              <Text>Add New Fridge</Text>
            </Button>
          </FooterTab>
        </Footer>
      </Container>
    );
  }

}



  export default withFirebase(myFridges);
