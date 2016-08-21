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
} from 'react-native';

import Config from './config';
import GiftedSpinner from 'react-native-gifted-spinner';
const STORAGE_KEY = '@TBP:user';
import { Actions } from 'react-native-router-flux';


var onBack;

class AddContact extends Component {

  constructor(props) {
    super(props);
  
    this.state = {
      name: '',
      contact: '',
      email: '',
      area: '',
      isLoading: false,
      userId: '',
    };
  }

  componentDidMount(){
    
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
        // Credentials Expired
      }
    } else {
      // Credentials Expired
    }}
    catch(error){
      alert("Error in fetch User id  "+ error.message)
    }
  }

  render() {
    return (
      <View style={styles.container}>

        <View style={{flex: 1, padding: 16}}>
        <ScrollView keyboardShouldPersistTaps={true}>

          <Text>Name</Text>
            <TextInput
              onChange={(event)=> this.setState({name: event.nativeEvent.text})}
              value={this.state.name}
              autoCapitalize="words"
              returnKeyType="next"
              />

          <Text>Contact</Text>
            <TextInput 
                keyboardType="numeric"
                onChange={(event) => this.setState({contact: event.nativeEvent.text})}
                value={this.state.contact}
                returnKeyType="next"
                />
        
          <Text>Email</Text>
          <TextInput 
            keyboardType="email-address" 
            onChange={(event) => this.setState({email: event.nativeEvent.text})}
            value={this.state.email}
            returnKeyType="next"
            />

          <Text>Area</Text>
          <TextInput 
            onChange={(event) => this.setState({area: event.nativeEvent.text})}
            value={this.state.area}
            returnKeyType="done"
            />
          <View style={{height: 10}} />

          <TouchableHighlight
            onPress={() => this._saveContact()}
            style = {styles.button}>
              
              <View>

              {this.state.isLoading ? 
                (<GiftedSpinner/>) : 
                (<Text style={styles.buttonText}>Save Contact</Text>)
              }

              </View>

          </TouchableHighlight>

        </ScrollView>
        </View>

      </View>
    );
  }

_saveContact() {

    if (this.state.name && this.state.email && this.state.contact && this.state.area) {
              this.setState({
                isLoading: true,
              })
              this._fetchUserId().done(() => {
              this._saveContacttoServer(this.state.name, 
                  this.state.contact, this.state.email, 
                  this.state.area).done((response) => {
                    if (response) {
                      if (JSON.parse(response.Android[0].result == "Success")) {
                        // Success
                         alert(JSON.stringify(response.Android[0].msg))
                         Actions.home({type: 'reset'});
                         Actions.refresh();
                      } else {
                        // Error
                      }
                    } else {
                      // Some Error
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

validateEmail = (email) => {
      var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
};

async _saveContacttoServer(name, contact, email, area) {
  try {
    let response = await fetch(Config.api + '/save-clients?user_id='
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
});


export default AddContact;