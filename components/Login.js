'use strict';

import React, { Component } from 'react';

import {
  StyleSheet,
  View,
  ScrollView,
  TextInput,
  Text,
  TouchableHighlight,
  AsyncStorage,
  Image,
  BackAndroid,
} from 'react-native';

import kd from './keyboarddismiss'
import Config from './config';

import { Actions } from 'react-native-router-flux';


const STORAGE_KEY = "@TBP:user";

import Icon from 'react-native-vector-icons/MaterialIcons';
import Spinner from './Modal';

class Login extends Component {
  
  constructor(props) {
    super(props);
  
    this.state = {
    	email : "",
    	password: "",
    	signing: "Sign In",
      logged: true,
      loading: false,
      showEmail: false,
      validEmail: false,
    };
  }

  componentDidMount() {
      this._removeStorage();
    }

  focusNextField(nextField) { 
  	this.refs[nextField].focus(); 
  }

  _goToRegistration() {
  	this.props.onPushRoute()
  }

  render() {
    return (
        <View style={{flex: 1, backgroundColor: "#FFFFFF"}} keyboardShouldPersistTaps={false}>
          <View style={[styles.fixed, {flex:1}]}>
            <Image
                  source={require('../images/login_bg.png')}
                  style={{flex: 1 ,width: null,height: null,resizeMode: 'stretch',}}/>
                  <Spinner visible={this.state.loading} />
          </View>
          
          <ScrollView style={{flex:1}} keyboardShouldPersistTaps={true}>
            <View style={{height: 200, justifyContent: 'center', alignItems: 'center',}}>
    				
            </View>   
            
            <View style={{margin: 16, padding: 8, marginTop: 40}} keyboardShouldPersistTaps={true}>

    		    	<View keyboardShouldPersistTaps={true}>
                  <Text>Email{this.state.showEmail 
                          ? ( this.state.validEmail 
                            ? 
                            (<Icon name="check" size={15} color="#2b2b2b"/>) 
                            : 
                            (<Icon name="error" size={15} color="#DF6126"/>)
                          
                          ) : (<Text></Text>)}</Text>
    		    			<TextInput
    		    				 ref="1"
    		    				 keyboardType={'email-address'}
    		    				 value={this.state.email}
    		    				 style={styles.formInput}
                     returnKeyType="next"
                      onSubmitEditing={() => {if (!this.validateEmail(this.state.email)) {
                                      this.setState({showEmail: true});
                                    } else {
                                  this.focusNextField('2');
                              }}}
    		    				 onChange={(event) => {this.setState({email: event.nativeEvent.text})
                                          if(this.validateEmail(event.nativeEvent.text)){
                                            this.setState({validEmail : true})
                                          } else {
                                            this.setState({validEmail : false})
                                          }}}
    		    				 >
    		    			</TextInput>
    		    	</View>
              <View keyboardShouldPersistTaps={true}>
    		    			<Text>Password</Text>
    		    			<TextInput
    		    				 ref="2"
    		    				 secureTextEntry={true}
                     returnKeyType="done"
    		    				 placeholderTextColor="red"
                     onSubmitEditing={() => this._login()}
    		    				 onChange={(event) => this.setState({password: event.nativeEvent.text})}
    		             style={styles.buttonContainer}
    		             value={this.state.password} />
              </View> 
	    			
            <View style={{flexDirection: 'row'}}>	
            
              <View style={{flex: 1}} keyboardShouldPersistTaps={true}>
  	    				<TouchableHighlight
  	    					onPress={ ()=> {this._toRegister()}} 
  	    						style={styles.button}>
  	    					<Text style={styles.buttonText}>Register</Text>
  	    				</TouchableHighlight>
              </View>

              <View style={{width: 8}}></View>
              
                <View style={{flex: 1}}>
                  <TouchableHighlight
                    onPress={ ()=> this._login()} 
                      style={styles.button}>
                      <View>
                         <Text style={styles.buttonText}>{this.state.signing}</Text>
                      </View>
                </TouchableHighlight> 
              </View> 
              </View>
             </View>  
            </ScrollView>
  			</View>


    );
  }

  _toRegister() {
    this.setState({
      email: '',
      password: '',
    })
    Actions.register();
  }

  validateEmail = (email) => {
      var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
  };


  async _removeStorage() {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({
        userId: "",
        logged: false
      }))
    } catch (error) {
      console.log('AsyncStorage error: '+ error.message);
    }
  }

  async _storeUser(userId){
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({
        userId: userId,
        logged: true
      }));
    } catch (error) {
      console.log('AsyncStorage error: '+ error.message);
    }
  }

  _login(){
    kd();
    if(this.state.validEmail && (this.state.password.toString().length > 5)){
      this.setState({
        signing: "Authenticating..",
        loading: true
      })
    	fetch(Config.api+"/user-login?email="+this.state.email+"&password="+this.state.password)
        .then((response) => response.json())
    	   .then((responseJson) => {
        if(responseJson.Android[0].result == "Success"){
            this.setState({
                signing: "Signing in ..",
            })
            this._storeUser(responseJson.Android[0].userid).done(() => {
              Actions.home({type: 'reset'});
              Actions.refresh();
            })   
        } else {
          alert("Unsuccessfull, Please check your credentials")
          this.setState({
            loading: false,
            signing: 'Sign In'
          });
        }
    	})
  } else {
    alert("Please fill proper credentials.")
  }

  }

  
}



const styles = StyleSheet.create({
   container: {
     
    flexDirection: 'column',
    padding: 16,
    backgroundColor: "#FFFFFF"
   },
   default: { 
   	height: 26, 
   	borderWidth: 0.5, 
   	borderColor: '#0f0f0f', 
   	flex: 1, 
   	fontSize: 13, 
   	padding: 4, 
   },
   singleLine: { 
   	fontSize: 16, 
   	padding: 4, 
   	height: 50, 
   }, 
   singleLineWithHeightTextInput: { 
   	height: 30, 
   },
   formInput: {
      height: 48,
      padding: 10,
      marginRight: 5,
      marginBottom: 5,
      marginTop: 5,
      flex: 1,
      fontSize: 18,
      borderWidth: 1,
      borderColor: "#555555",
      borderRadius: 8,
      color: "#555555"
  },
    button: {
      height: 48,
      flex: 1,
      backgroundColor: "#2A527C",
      marginTop: 10,
      justifyContent: "center"
  },
  buttonText: {
      fontSize: 15,
      color: "#FAFAFA",
      fontWeight: "bold",
      alignSelf: "center"
  },
  buttonContainer: {
      flexDirection: 'row'
  },
  base: {
    width: 100,
    height: 100,
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


export default Login;