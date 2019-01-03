import React, { Component } from "react";
import { withFirebase } from '../../components/firebase';
import {
  Container,
    Header,
    Title,
    Content,
    Button,
    Item,
    Label,
    Input,
    Body,
    Form,
    Text
} from "native-base";

import styles from "./styles";

const INITIAL_STATE = {
  username: '',
  email: '',
  passwordOne: '',
  passwordTwo: '',
  error: null,
};




class Signup extends Component {

  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = event => {
    const { username, email, passwordOne } = this.state;

    this.props.firebase
      .doCreateUserWithEmailAndPassword(email, passwordOne)
      .then(authUser => {
        // Create a user in your Firebase realtime database
        this.props.firebase
          .user(authUser.user.uid)
          .set({
            username,
            email,
          })
          .then(() => {
            this.props.firebase.addfirstFridge(authUser.user.uid);
            this.setState({ ...INITIAL_STATE });
            this.props.navigation.navigate("Home")
          })
          .catch(error => {
            this.setState({ error });
          });
      })
      .catch(error => {
        this.setState({ error });
      });

    event.preventDefault();
  };

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const {
      username,
      email,
      passwordOne,
      passwordTwo,
      error,
    } = this.state;



    const isInvalid = passwordOne !== passwordTwo || passwordOne === '' || email === '' || username === '';

    return (
      <Container style={styles.container}>

        <Header>
          <Body>
            <Title>Sign Up to tFridge</Title>
          </Body>
        </Header>

        <Content>
          <Form onSubmit={this.onSubmit}>
            <Item inlineLabel>
              <Label>Username:              </Label>
              <Input
                name="username"
                value={username}
                onChange={this.onChange}
                type="text"
              />
            </Item>

            <Item inlineLabel>
              <Label>Email Address:       </Label>
              <Input
                name="email"
                value={email}
                onChange={this.onChange}
                type="text"
              />
            </Item>
            <Item inlineLabel>
              <Label>Password:               </Label>
              <Input
                name="passwordOne"
                value={passwordOne}
                onChange={this.onChange}
                type="password"
                secureTextEntry
              />
            </Item>
            <Item inlineLabel>
              <Label>Confirm Password:</Label>
              <Input
                name="passwordTwo"
                value={passwordTwo}
                onChange={this.onChange}
                type="password"
                secureTextEntry
              />
            </Item>
            <Button disabled={isInvalid} onClick={this.onSubmit} block style={{ margin: 15, marginTop: 50 }}>
              <Text>Sign Up </Text>
            </Button>
            {error && <p>{error.message}</p>}
          </Form>
        </Content>
      </Container>
    );
  }
}

export default withFirebase(Signup);
