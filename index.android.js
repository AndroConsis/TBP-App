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
        if(action.key == "Home"){
                  popit(currentState)
                  return NavigationStateUtils.push(
                    currentState, {key: 
                    action.key});  
              } else{
                 return NavigationStateUtils.push(
                    currentState, {key: 
                    action.key});
            }
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

    this.state = {
      // This defines the initial navigation state.
      navState: NavReducer(undefined, {})
    }
  }

  componentDidMount() {
    BackAndroid.addEventListener('hardwareBackPress', () => this._handleBackAction());
  }

  componentWillUnmount() {
    BackAndroid.removeEventListener('hardwareBackPress', ()=>this._handleBackAction());
  }
 
  _handleAction (action) {
      const newState = NavReducer(this.state.navState, action);
      if ( newState === this.state.navState ) {
        return false;
      }
      this.setState ({
        navState: newState
      })
      return true;
    }

  _handleBackAction() {
      return this._handleAction({ type: 'pop'});
    } 

  _renderRoute (key) {
    if (key === 'Home') {
      return <Home 
      	onBack = {this._handleBackAction.bind(this)}
        toLogin = {this._handleAction.bind(this, {type: 'push', key: "Login"})}
        toAddContact = {this._handleAction.bind(this, {type: 'push', key: "AddContact"})}
      />
    }

    if (key === 'Login') {
      return <Login 
      		toRegister = {this._handleAction.bind(this, {type: 'push', key: 'Registration'})}
      		toHome = {this._handleAction.bind(this, {type: 'push', key: 'Home'})} />
    }

    if (key === 'Registration') {
      return <Registration 
      			toHome = {this._handleAction.bind(this,
      				{type: 'push', key: 'Home'})}
            onBack= {this._handleBackAction.bind(this)}/>
    }

    if (key === 'AddContact') {
        return <AddContact
            toHome= {this._handleAction.bind(this, {type: 'push', key: 'Home1'})}
            onBack= {this._handleBackAction.bind(this)}
            toLogin= {this._handleAction.bind(this, {type: 'push', key: "Home"})} />
    }

    if (key === 'Home1') {

        return <Home 
          onBack = {this._handleBackAction.bind(this)}
          toLogin = {this._handleAction.bind(this, {type: 'push', key: "Home"})}
          toAddContact = {this._handleAction.bind(this, {type: 'push', key: "AddContact"})}
        />
    }
  }

  _renderScene(props) {
    console.log(props+"\n"+ JSON.stringify(props))
    const ComponentToRender = this._renderRoute(props.scene.route.key)
      return (
        <View style={styles.scrollView} keyboardShouldPersistTaps={true} contentContainerStyle={styles.scrollContentContainer} automaticallyAdjustContentInsets={false}>
          {ComponentToRender}
        </View>
        );
  }

  render() {
    return (
        <NavigationCardStack
          navigationState = {this.state.navState}
          onNavigate={this._handleAction.bind(this)}
          renderScene = {this._renderScene.bind(this)} />
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
