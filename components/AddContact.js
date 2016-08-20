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

import TextField from 'react-native-md-textinput';
import Config from './config';
import GiftedSpinner from 'react-native-gifted-spinner';
const STORAGE_KEY = '@TBP:user';

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
    this._fetchUserId();
    onBack = this.props.onBack;
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
      	<Text>Add Contact</Text>

        <View style={{flex: 1, padding: 16}}>
        <ScrollView keyboardShouldPersistTaps={true}>

          <TextField 
            label={'Name'} 
            highlightColor={'#00BCD4'} 
            onChange={(event) => this.setState({name: event.nativeEvent.text})}
            value={this.state.name}
            returnKeyType="next"
            />
          <TextField 
            label={'Contact'} 
            highlightColor={'#00BCD4'} 
            keyboardType="numeric"
            onChange={(event) => this.setState({contact: event.nativeEvent.text})}
            value={this.state.contact}
            returnKeyType="next"
            />
          <TextField 
            label={'Email'} 
            highlightColor={'#00BCD4'}
            keyboardType="email-address" 
            onChange={(event) => this.setState({email: event.nativeEvent.text})}
            value={this.state.email}
            returnKeyType="next"
            />
          <TextField 
            label={'Area'} 
            highlightColor={'#00BCD4'} 
            onChange={(event) => this.setState({area: event.nativeEvent.text})}
            value={this.state.area}
            returnKeyType="next"
            />

          <View style={{height: 10}} />

          <TouchableHighlight
            onPress={() => this._saveContact()}
            style = {styles.buttonWrapper}>
              
              <View>

              {this.state.isLoading ? 
                (<GiftedSpinner/>) : 
                (<Text>Save Contact</Text>)
              }

              </View>

          </TouchableHighlight>

        </ScrollView>
        </View>

      </View>
    );
  }

_saveContact() {
    this.setState({
      isLoading: true,
    })

    this._saveContacttoServer(this.state.name, 
        this.state.contact, this.state.email, 
        this.state.area).done((response) => {
          if (response) {
            if (JSON.parse(response.Android[0].result == "Success")) {
              // Success
               alert(JSON.stringify(response.Android[0].msg))
              this.props.toHome();
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

  }

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

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
  buttonWrapper: {
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#e5e5e5'
    },
});


export default AddContact;