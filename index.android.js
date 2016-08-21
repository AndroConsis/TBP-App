/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component }  from 'react';
import {
  AppRegistry,
  NavigationExperimental,
  Text, 
  StyleSheet,
  ScrollView,
  Platform,
  BackAndroid,
  AsyncStorage,
  View
} from 'react-native';

import Login from './components/Login'; 
import Registration from './components/Registration';
import Home from './components/Home';
import AddContact from './components/AddContact';

const STORAGE_KEY = "@TBP:user";

import {Scene, Router} from 'react-native-router-flux';

const { 
  CardStack: NavigationCardStack, 
  StateUtils: NavigationStateUtils, 
} = NavigationExperimental;


function popit(cs){ 
  return NavigationStateUtils.pop(cs)
}


function createReducer(initialState){
   
  return (currentState = initialState, action) => {
    switch (action.type) {
        case 'push':
                 return NavigationStateUtils.push(
                    currentState, {key: 
                    action.key});
      case 'pop':
        return currentState.index > 0 ?
          NavigationStateUtils.pop(currentState) : currentState ;
      default: 
        return currentState;
    }
  }
}

const NavReducer = createReducer({
                      index: 0,
                      key: 'Login',
                      routes: [{key: 'Login'}]
                    });


class TBP extends Component {
  
  constructor(props, context) {
    super(props, context);
  }

  render() {
    return (
        <Router>
          <Scene key="root">
            <Scene key="login" component={Login} title="Login" hideNavBar={true} />
            <Scene key="register" component={Registration} hideNavBar={false} title="Register"/>
            <Scene key="home" component={Home} hideNavBar={false} title="Contacts"/>
            <Scene key="addContact" component={AddContact} hideNavBar={false} title="Add Contact"/>
          </Scene>
        </Router>
       ); 
     }
}

const styles = StyleSheet.create({ 
 
  scrollView: {
    backgroundColor: '#FFFFFF',
    flex:1
   },
   scrollContentContainer: {
    flex: 1
   }
});

AppRegistry.registerComponent('TBP', () => TBP);

// <NavigationCardStack
//           navigationState = {this.state.navState}
//           onNavigate={this._handleAction.bind(this)}
//           renderScene = {this._renderScene.bind(this)} />