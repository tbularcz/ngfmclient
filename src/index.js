import Platform from "react-native-web/dist/exports/Platform";
import "./font.css";
import React, { Component}  from 'react';
import ReactDOM from 'react-dom';

import App from './App';
import Firebase, { FirebaseContext } from './components/firebase';

const ReactNative = require("react-native");
const Modal = require("./ModalComponent/Modal");

ReactNative.Modal = Modal;
Platform.OS = "ios";

require("./main");
