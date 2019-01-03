import React from 'react';

import AuthUserContext from './context';
import { withFirebase } from '../firebase';

const withAuthentication = Component => {

  class WithAuthentication extends React.Component {
    constructor(props) {
      super(props);
      //this.componentDidMount = this.componentDidMount.bind(this);
      //this.componentWillUnmount = this.componentWillUnmount.bind(this);
      this.state = {
        authUser: null,
      };
    }

    componentDidMount() {
      //console.log("user inconst", this.props.firebase.auth)
      this.listener = this.props.firebase.auth.onAuthStateChanged(
        authUser => {
          authUser
           ? this.setState({ authUser })
          : this.setState({ authUser: null });
       },
      );
    }

    componentWillUnmount() {
      this.listener();
    }

    render() {
      return (
        <AuthUserContext.Provider value={this.state.authUser}>
          <Component {...this.props} />
        </AuthUserContext.Provider>
      );
    }
  }

  return withFirebase(WithAuthentication);
};

export default withAuthentication;
