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
import GiftedSpinner from 'react-native-gifted-spinner';
import { Actions } from 'react-native-router-flux';


const STORAGE_KEY = "@TBP:user";

import Icon from 'react-native-vector-icons/Ionicons';

const myIcon = (<Icon name="ios-arrow-up-outline" size={25} color="#900" />)
const successIcon = (<Icon name="ios-checkmark-outline" size={25} color="#900" />)

class Login extends Component {
  
  constructor(props) {
    super(props);
  
    this.state = {
    	email : "",
    	password: "",
    	signing: "Sign In",
      logged: true,
      loading: false,
    };
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
          
          
          <ScrollView style={{flex:1}} keyboardShouldPersistTaps={true}>
            <View style={{height: 200, justifyContent: 'center', alignItems: 'center',}}>
    				 <Image source={require('../images/TajLogo.jpg')} style={styles.base}></Image>
            </View>   
            
            <View style={{margin: 16, padding: 8}} keyboardShouldPersistTaps={true}>

    		    	<View keyboardShouldPersistTaps={true}>
                  <Text>Email</Text>
    		    			<TextInput
    		    				 ref="1"
    		    				 keyboardType={'email-address'}
    		    				 value={this.state.email}
    		    				 style={styles.formInput}
    		    				 blurOnSubmit={false}
                     returnKeyType="next"
                      onSubmitEditing={() => {if (!this.validateEmail(this.state.email)) {
                                      alert("Please enter a Valid Email Id")
                                    } else {
                                  this.focusNextField('2');
                              }}}
    		    				 onChange={(event) => this.setState({email: event.nativeEvent.text})}
    		    				 >
    		    			</TextInput>
    		    	</View>
              <View keyboardShouldPersistTaps={true}>
    		    			<Text>Password</Text>
    		    			<TextInput
    		    				 ref="2"
    		    				 secureTextEntry={true} 
    		    				 blurOnSubmit={false}
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
  	    					onPress={ ()=> Actions.register()} 
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
                      {this.state.loading ? 
                         (<GiftedSpinner/>) :
                         ( <Text style={styles.buttonText}>{this.state.signing}</Text>)}
                      </View>
                </TouchableHighlight> 
              </View> 
              </View>
             </View>  
            </ScrollView>
  			</View>


    );
  }

  validateEmail = (email) => {
      var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
  };


  async _removeStorage() {
    try {
      await AsyncStorage.setItem('STORAGE_KEY', JSON.stringify({}));
    } catch (error) {

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
    if(this.state.email || this.state.password !== '' && this.validateEmail(this.state.email)){
      this.setState({
        signing: "checking..",
        loading: true
      })
    	fetch(Config.api+"/user-login?email="+this.state.email+"&password="+this.state.password)
        .then((response) => response.json())
    	   .then((responseJson) => {
        if(responseJson.Android[0].result == "Success"){
            this.setState({
                signing: "Logging in .." + successIcon
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

  componentDidMount() {
      this._removeStorage();
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
      backgroundColor: "transparent",
      borderColor: "#456fb0",
      borderWidth: 1,
      borderRadius: 8,
      marginTop: 10,
      justifyContent: "center"
  },
  buttonText: {
      fontSize: 15,
      color: "#212121",
      alignSelf: "center"
  },
  buttonContainer: {
      flexDirection: 'row'
  },
  base: {
    width: 100,
    height: 100,
  },
});


export default Login;