import React from 'react';
//import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';

import AuthUserContext from './context';
import { withFirebase } from '../firebase';
//import * as ROUTES from '../../constants/routes';

const withAuthorization = condition => Component => {
  class WithAuthorization extends React.Component {

    constructor(props) {
      super(props);
      this.componentDidMount = this.componentDidMount.bind(this);
      this.componentWillUnmount = this.componentWillUnmount.bind(this);
    }

    componentDidMount() {
      console.log("user in authiri")
      this.listener = this.props.firebase.auth.onAuthStateChanged(
        authUser => {
          if (!condition(authUser)) {
            this.props.navigation.navigate("welcome");
          }
        },
      );
    }

    componentWillUnmount() {
      this.listener();
    }

    render() {
      return (
        <AuthUserContext.Consumer>
          {authUser =>
            condition(authUser) ? <Component {...this.props} /> : null
          }
        </AuthUserContext.Consumer>
      );
    }
  }

  return compose(
    withFirebase,
  )(WithAuthorization);
};

export default withAuthorization;
