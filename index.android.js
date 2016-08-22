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
import GiftedSpinner from 'react-native-gifted-spinner';


const STORAGE_KEY = "@TBP:user";

import {Scene, Router} from 'react-native-router-flux';

class TBP extends Component {
  
  constructor(props, context) {
    super(props, context);
    this.state = {
      isLoading : true,
      foundUserId : false,
    };
  }

  componentDidMount(){
   AsyncStorage.getItem(STORAGE_KEY).then((response) => {
       
    if(response !== null) {
        
      if(JSON.parse(response).logged !== true) {
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
        <Router>
          <Scene key="root">
            <Scene key="login" component={Login} title="Login" hideNavBar={true} initial={true} />
            <Scene key="register" component={Registration} hideNavBar={false} title="Register"/>
            <Scene key="home" component={Home} hideNavBar={false} title="Contacts"/>
            <Scene key="addContact" component={AddContact} hideNavBar={false} title="Add Contact"/>
          </Scene>
        </Router>
      )
}

_renderLoginPage() {
    return (
        <Router>
          <Scene key="root">
            <Scene key="home" component={Home} hideNavBar={false} title="Contacts" initial={true}/>
            <Scene key="login" component={Login} title="Login" hideNavBar={true} />
            <Scene key="register" component={Registration} hideNavBar={false} title="Register"/>
            <Scene key="addContact" component={AddContact} hideNavBar={false} title="Add Contact"/>
          </Scene>
        </Router>
      )
}



_renderLoadingView() {
  return (
      <View style={{flex:1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
        <GiftedSpinner/>
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
   }
});

AppRegistry.registerComponent('TBP', () => TBP);