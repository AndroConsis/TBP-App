'use strict';

import React, { Component } from 'react';

import {
  StyleSheet,
  View,
  Text,
  BackAndroid,
  ListView,
  TouchableHighLight,
  ToolbarAndroid,
  AsyncStorage,
} from 'react-native';

const STORAGE_KEY = "@TBP:user";
import Config from './config'
import GiftedSpinner from 'react-native-gifted-spinner';
import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/Ionicons';

const addContactIcon =  (<Icon name="ios-contact-outline" size={35} color="#FFFFFF" />)

class Home extends Component {
  constructor(props){
    super(props)
    this.state = {
      isLoading: true,
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2
      })
    }
  }

  async _fetchUserId(){
  try{
    var user = await AsyncStorage.getItem(STORAGE_KEY);
    if(user !== null) {
      user = JSON.parse(user);

      if(user.userId) {
          return user.userId
      } else {
        return false;
        // Credentials Expired
      }
    } else {
      return false;
      // Credentials Expired
    }}
    catch(error){
      return false;
    }
  }

  componentDidMount() {
      this._getData()
    }

    _getData() {
      this._fetchUserId().done((userId) => {
        this._fetchContacts(userId);
        })
      }

    async getUserId(){

    }

    _fetchContacts(userId) {
       fetch("http://tajbusinessopportunity.com/tbp/show-clients?user_id="+userId)
        .then((response) => response.json())
        .then((responseData) => {
          
          if(responseData.Android[0].result == "Success"){
            
          this.setState({
            dataSource: this.state.dataSource.cloneWithRows(responseData.Android),
            isLoading: false,
            })
          }
        }).done();
    }

  render() {
      if(this.state.isLoading) {
        return this._renderLoading()
      } else {
        return(
          <View style={styles.container}>
           <ToolbarAndroid
            style={styles.toolbar}
            logo={require('../images/TajLogo.jpg')}
            title="Contacts"/>
            <ListView
              dataSource= {this.state.dataSource}
              renderRow={this._renderContact}
              style={styles.listView}
              renderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.separator} />}
            />
            <ActionButton buttonColor="rgba(231,76,60,1)">
              <ActionButton.Item buttonColor='#9b59b6' title="Add Contact" onPress={() => this.props.toAddContact()}>
                {addContactIcon}
              </ActionButton.Item>
              <ActionButton.Item buttonColor='#3498db' title="About Taj" onPress={() => {}}>
                <Icon name="md-notifications-off" style={styles.actionButtonIcon} />
              </ActionButton.Item>
               <ActionButton.Item buttonColor='#3498db' title="Logout" onPress={() => {this._logout()}}>
                <Icon name="ios-log-out-outline" size={30} color="#FFFFFF"/>
              </ActionButton.Item>
            </ActionButton>
          </View>
          )
      }
  }

  _logout(){
    this._removeStorage().done(()=> {
      this.props.toLogin();
    })
  }

  async _removeStorage() {
    try {
      await AsyncStorage.setItem('STORAGE_KEY', JSON.stringify({}));
    } catch (error) {

    }
  }

  _renderLoading(){
    return (
      <View style={[styles.container, {justifyContent: 'center', alignItems: 'center'}]}>
        <GiftedSpinner style={{alignSelf: 'center'}}/>
      </View>
    )
  }

  _renderContact(contact: contact) {
    return (
      <View style={{flex: 1, padding: 12,
                   flexDirection: 'column',
                    alignItems: 'flex-start',}}>
          <Text style={styles.text}>{contact.name}</Text>
          <Text style={styles.text}>{contact.contact}</Text>
          <Text style={styles.text}>{contact.email}</Text>
          <Text style={styles.text}>{contact.area}</Text>
      </View>
      
    )
  }
}

const styles = StyleSheet.create({
  container: {
        flex: 1, 
        flexDirection: 'row',
  },
  listView: {
       backgroundColor: '#F2F1F0',
       padding: 8,
   },
  toolbar: {
      backgroundColor: '#000',
      height: 56,
  },
  text: {
    marginLeft: 12,
    fontSize: 16,
  },
  separator: {
    height: 1,
    backgroundColor: '#8E8E8E',
},
});

export default Home;