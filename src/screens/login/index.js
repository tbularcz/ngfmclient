import React, { Component } from "react";
import { withFirebase } from '../../components/firebase';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
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
    Left,
    Right,
    Icon,
    Form,
    Text
} from "native-base";

import styles from "./styles";

const INITIAL_STATE = {
  email: '',
  password: '',
  error: null,
};

const SignInPage = () => (
  <div>
    <h1>SignIn</h1>
    <SignInForm />
  </div>
);

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };

  }

  onSubmit = event => {
    const { email, password } = this.state;
    //console.log("User:", this.props.firebase )
    this.props.firebase
      .doSignInWithEmailAndPassword(email, password)
      .then(() => {
        this.setState({ ...INITIAL_STATE });
        this.props.navigation.navigate("Home")
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
    const { email, password, error } = this.state;
    const isInvalid = password === '' || email === '';

    return (
      <Container style={styles.container}>
        <Header>
          <Body>
            <Title>Log In to tFridge</Title>
          </Body>

        </Header>

        <Content>

          <Form>

          <Item inlineLabel>
            <Label>Email Address:</Label>
              <Input
                name="email"
                value={email}
                onChange={this.onChange}
                type="text"
              />
            </Item>

            <Item inlineLabel last>
              <Label>Password:        </Label>
                <Input
                  name="password"
                  value={password}
                  onChange={this.onChange}
                  type="password"
                  secureTextEntry
                />
            </Item>

            <Button disabled={isInvalid} onClick={this.onSubmit} block style={{ margin: 15, marginTop: 50 }}>
              <Text>Sign In</Text>
            </Button>

            {error && <p>{error.message}</p>}
          </Form>
        </Content>
      </Container>
    );
  }
}
const SignInForm = compose(
  withFirebase
)(Login);

export default withFirebase(Login);
