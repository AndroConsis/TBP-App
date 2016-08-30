'use strict';

import React, { Component } from 'react';


import {
  StyleSheet,
  AsyncStorage,
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableHighlight,
  Image
} from 'react-native';

import Config from './config';
const STORAGE_KEY = '@TBP:user';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Actions } from 'react-native-router-flux';
import Spinner from './Modal';
import k from './keyboarddismiss';
const tick = (<Icon name="check" size={15} color="#2b2b2b"/>)
const wrong = (<Icon name="error" size={15} color="#DF6126"/>)


class AddContact extends Component {

  constructor(props) {
    super(props);
  
    this.state = {
      name: '',
      contact: '',
      email: '',
      area: '',
      isLoading: false,
      validContact: false,
      validEmail: false,
      validName: false,
      validAddress: false,
      showEmail: false,
      showMobile: false,
      showName: false,
      userId: '',
    };
  }

  _saveContact() {
    if (this.state.validName && this.state.validEmail && this.state.validContact && this.state.area) {
              
              this.setState({
                isLoading: true,
              });
              this._fetchUserId().done(() => {
              this._saveContacttoServer(this.state.name, 
                  this.state.contact, this.state.email, 
                  this.state.area).done((response) => {
                    
                    if (response) {
                      if (response.Android[0].result == "Success") {
                        // Success
                         alert(JSON.stringify(response.Android[0].msg))
                         Actions.home({type: 'reset'});
                         Actions.refresh();
                      } else {
                          this.setState({
                            isLoading: false,
                          })
                          alert("Some error occured. Please try again");
                      }
                    } else {
                          this.setState({
                            isLoading: false,
                          })
                          alert("Some error occured. Please try again");
                    }
                    this.setState({
                      isLoading: false,
                    })
      
                  })
             })
          }
      else {
        alert("Please Enter Proper Credentials")
      }
  }


  focusNextField(nextField) {
    this.refs[nextField].focus();
  }

  render() {
    return (
      <View style={styles.container}>
          <View style={[styles.fixed, {flex:1}]}>
            <Image
                  source={require('../images/app_bg.png')}
                  style={{flex: 1 ,width: null,height: null,resizeMode: 'stretch',opacity: 0.2}}/>
                  <Spinner visible={this.state.isLoading} />
          </View>
        <View style={{flex: 1, padding: 16}}>
        <ScrollView keyboardShouldPersistTaps={true}>

          <Text>Name {this.state.showName 
            ? ( this.state.validName 
              ? 
              (<Icon name="check" size={15} color="#2b2b2b"/>) 
              : 
              (<Icon name="error" size={15} color="#DF6126"/>)
            
            ) : (<Text></Text>)}</Text>
            <TextInput
              ref="1"
              onChange={(event)=> {this.setState({
                                      name: event.nativeEvent.text,
                                      showName: true });
               if(event.nativeEvent.text == ''){
                  this.setState({validName : false})
              } else {
                                    if(this.validateName(event.nativeEvent.text)){
                                      this.setState({
                                        validName: true,
                                      })
                                    } else {
                                      this.setState({
                                        validName: false,
                                      })
                                    }
                                    }}}
              value={this.state.name}
              autoCapitalize="words"
              style={styles.input}
              returnKeyType="next"
              onSubmitEditing={() => this.focusNextField('2')}
              />

          <Text>Mobile No{
            this.state.showMobile 
            ? ( this.state.validContact 
              ? 
              (<Icon name="check" size={15} color="#2b2b2b"/>) 
              : 
              (<Icon name="error" size={15} color="#DF6126"/>)
            
            ) : (<Text></Text>)}</Text>
            <TextInput
                ref="2" 
                keyboardType="numeric"
                onChange={(event) => {this.setState({contact: event.nativeEvent.text, showMobile: true});
                                       if(this.validateMobile(event.nativeEvent.text)){
                                            this.setState({validContact: true})
                                          } else {
                                            this.setState({validContact: false})
                                          }}}
                value={this.state.contact}
                returnKeyType="next"
                onSubmitEditing={() => this.focusNextField('3')}
                />
        
          <Text>Email{
            this.state.showEmail 
            ? ( this.state.validEmail 
              ? 
              (<Icon name="check" size={15} color="#2b2b2b"/>) 
              : 
              (<Icon name="error" size={15} color="#DF6126"/>)
            
            ) : (<Text></Text>)}</Text>
          <TextInput 
            ref="3"
            keyboardType="email-address" 
            onChange={(event) => {this.setState({email: event.nativeEvent.text, showEmail: true})
                                    if(this.validateEmail(event.nativeEvent.text)){
                                      this.setState({validEmail: true})
                                    } else {
                                      this.setState({validEmail: false})
                                    }
                                    }}
            value={this.state.email}
            returnKeyType="next"
            onSubmitEditing={() => { if(this.validateEmail(this.state.email)) {
              this.focusNextField('4')
            } else {
              alert("Please enter proper email.")
              }}
            }
            />

          <Text>Area</Text>
          <TextInput
            ref="4" 
            onChange={(event) => this.setState({area: event.nativeEvent.text})}
            value={this.state.area}
            returnKeyType="done"
            onSubmitEditing={() => this._saveContact()}
            />

          <View style={{height: 10}} />

          <TouchableHighlight
            onPress={() => this._saveContact()}
            style = {styles.button}>
              <View>
                <Text style={styles.buttonText}>Save Contact</Text>
              </View>
          </TouchableHighlight>
        </ScrollView>
        </View>
      </View>
    );
  }

validateMobile(mob) {
   if(this._isInt(mob))
        {
          if(this._isGreaterThan(mob, 10)){
              return true;
          } else {
              return false;
          }
      } else {
          return false;
  }
}

validateEmail(email) {
      var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
     return re.test(email);
};

validateName(name) {
      return /^[A-Za-z\s]{1,}[\.]{0,1}[A-Za-z\s]{0,}$/.test(name);
};

_isInt(x) {
  return x % 1 === 0;
}

_isGreaterThan(a, b){
  if(a.toString().length >= b)
    return true;
  else 
    return false;
}

async _fetchUserId(){
    try{
    var user = await AsyncStorage.getItem(STORAGE_KEY);
    if(user !== null) {
      user = JSON.parse(user);
      if(user.userId) {
          this.setState({
            userId: user.userId,
          })
      } else {
        alert("Session Expired! ")
        Actions.login({type: 'reset'});
        Actions.refresh();
      }
    } else {
      // Credentials Expired
      alert("Session Expired! ")
        Actions.login({type: 'reset'});
        Actions.refresh();
    }
  }
  catch(error){
      alert("Some Error Occured. Please Login again."+ error.message);
      Actions.login({type: 'reset'});
      Actions.refresh();
    }
  }

async _saveContacttoServer(name, contact, email, area) {
  try {
    let response = await fetch('http://tajbusinessopportunity.com/tbp/save-clients?user_id='
                            +this.state.userId
                            +'&name='+name+'&contact='+contact
                            +'&email='+email+'&area='+area)
    return response.json();
  } catch (error) {
    alert("Couldn't connect to Server. Please try again.")
    return false;
  }
}
}

class WithLabel extends Component {
  render() {
    return ( 
        <View style={styles.labelContainer}>
          <View style={styles.label}>
            <Text>{this.props.label}</Text>
          </View>
          {this.props.chidren}
        </View>
      );
  }
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
    marginTop: 56
	},
  buttonWrapper: {
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#e5e5e5'
    },
  labelContainer: {
    flexDirection: 'row',
    marginVertical: 2,
    flex: 1,
  },
  label: {
    width: 115,
    alignItems: 'flex-end',
    marginRight: 10,
    paddingTop: 2,
  },
   button: {
      height: 48,
      flex: 1,
      backgroundColor: "#0680cd",
      marginTop: 10,
      justifyContent: "center"
  },
  buttonText: {
      fontSize: 15,
      color: "#FAFAFA",
      fontWeight: "bold",
      alignSelf: "center"
  },
  fixed: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 1,
  },
  input: {
    borderWidth: 1,
    borderColor: '#212121',
    borderRadius: 2,
    
  }
});


export default AddContact;