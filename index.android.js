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
  View,
  Image,
  StatusBar
} from 'react-native';

import Login from './components/Login'; 
import Registration from './components/Registration';
import Home from './components/Home';
import AddContact from './components/AddContact';
import Spinner from './components/Modal';


const STORAGE_KEY = "@TBP:user";


import {Actions, Scene, Router} from 'react-native-router-flux';

const sceneNewUser = Actions.create(
    <Scene key="root">
        <Scene key="login" component={Login} title="Login" hideNavBar={true} initial={true} />
        <Scene key="home" component={Home} hideNavBar={false} title="Contacts"/>
        <Scene key="register" component={Registration} hideNavBar={false} title="Register"/>
        <Scene key="addContact" component={AddContact} hideNavBar={false} title="Add Contact"/>
    </Scene>
);

const scenePreviousUser = Actions.create(
    <Scene key="root">
        <Scene key="home" component={Home} hideNavBar={false} title="Contacts" initial={true}/>
        <Scene key="register" component={Registration} hideNavBar={false} title="Register"/>
        <Scene key="login" component={Login} title="Login" hideNavBar={true} />
        <Scene key="addContact" component={AddContact} hideNavBar={false} title="Add Contact"/>
    </Scene>
);

class TBP extends Component {
  
  constructor(props, context) {
    super(props, context);
    this.state = {
      isLoading : true,
      foundUserId : false,
      spinnerLoading: false,
    };
  }

  componentDidMount(){
    StatusBar.setBackgroundColor('#2A527C', true);
    setTimeout( () => {
      
    }, 5000);
    setTimeout( () => {
      this._checkUser();
      this.setState({
        spinnerLoading : true 
      })
    }, 4000)
  }

  _checkUser() {
    AsyncStorage.getItem(STORAGE_KEY).then((response) => {
      
    if(response !== null) {
      if(JSON.parse(response).logged == true) {
          this.setState({
            isLoading: false,
            foundUserId: true,
          })
      } else {
        this.setState({
          isLoading : false,
          foundUserId: false,
        })
      }
    } else {
        this.setState({
          isLoading : false,
          foundUserId: false,
        })
      }
    }

  )
   .catch((error) => {
      this.setState({
        isLoading : false,
        foundUserId: false,
      });
   })
   .done();
  }

  render() {
     if(this.state.isLoading){
      return this._renderLoadingView()
    } else { 
      if(this.state.foundUserId) {
        return  this._renderHomePage()
      } else {
        return this._renderLoginPage()
      } 
    }
   }

_renderHomePage() {
    return(
        <Router scenes={scenePreviousUser}/>
      )
}

_renderLoginPage() {
    return (
        <Router scenes={sceneNewUser}/> 
      )
}



_renderLoadingView() {
  return (

      <View style={{flex:1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
          <View style={[styles.fixed, {flex:1}]}>
            <Image
                  source={require('./images/bg.png')}
                  style={{flex: 1 ,width: null,height: null,resizeMode: 'stretch',}}/>
                  <Spinner visible={this.state.spinnerLoading} />
          </View>
      </View>
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
   },
   fixed: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 1,
  }
});

AppRegistry.registerComponent('TBP', () => TBP);