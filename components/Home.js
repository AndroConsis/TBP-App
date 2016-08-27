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
  Image,
  NetInfo
} from 'react-native';

const STORAGE_KEY = "@TBP:user";
import Config from './config'
import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/Ionicons';
import { Actions } from 'react-native-router-flux';
import Spinner from './Modal';
import NoInternet from './NoInternet';
const addContactIcon =  (<Icon name="ios-person-add-outline" size={35} color="#FFFFFF" />);
const menuIcon = (<Icon name="md-apps" size={35} color="#FFFFFF"/>);
const person = (<Icon name="ios-person" size={25} color="#0680cd"/>);
const mail = (<Icon name="ios-mail" size={25} color="#0680cd"/>);
const mobile = (<Icon name="ios-call" size={25} color="#0680cd"/>);
const Area = (<Icon name="ios-navigate" size={25} color="#0680cd"/>);

class Home extends Component {
  constructor(props){
    super(props)
    this.state = {
      isLoading: true,
      isEmpty: false,
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2
      }),
      internetAvailable: true,
    }
  }
  
  componentDidMount() {
    this._getData();
  }

  testInternetConnectivity(){
    var response;
    NetInfo.isConnected.fetch().then(isConnected => {
                 response = isConnected; 
                  });
    return response;
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
        alert("Session Expired! Please Login Again")
        Actions.login({type: 'reset'});
        Actions.refresh();
      }
    } else {
      return false;
      alert("Session Expired! Please Login Again")
        Actions.login({type: 'reset'});
        Actions.refresh();
    }}
    catch(error){
      return false;
      alert("Session Expired! Please Login Again ")
        Actions.login({type: 'reset'});
        Actions.refresh();
    }
  }


  // Handling Internet Errors
  handleErrors(response) {
    if (!response.ok) {
        throw Error(response.statusText);
    }
    return response;
  }

  _getData() {
   
      this._fetchUserId().done((userId) => {
        this._fetchContacts(userId);
        })
    }
    
  _fetchContacts(userId) {
    fetch("http://tajbusinessopportunity.com/tbp/show-clients?user_id="+userId)
        .then(this.handleErrors)
        .then((response) => response.json())
        .then((responseData) => {
          if(responseData.Android.length !== 0){
          if(responseData.Android[0].result == "Success"){
              this.setState({
                dataSource: this.state.dataSource.cloneWithRows(responseData.Android),
                isLoading: false,
                })
              } else {
                this.setState({
                  isEmpty: true,
                  isLoading: false,
                })
              }
          
          } else {
               this.setState({
                  isEmpty: true,
                  isLoading: false,
                })
          }
        })
        .done();
    }

  render() {
      if(this.state.isLoading) {
        return this._renderLoading()
      } else {
          if(this.state.isEmpty) { 
            return (
              <View style={styles.container}>
                <View style={[styles.fixed]}>
                <Image
                      source={require('../images/app_bg.png')}
                      style={{flex: 1 ,width: null,height: null,resizeMode: 'stretch', opacity: 0.2}}/>
                </View>
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}>
                  <Icon name="ios-filing-outline" size={100} color="#5B5B5B"/>
                  <Text>Your Contact List is Empty. Add Now</Text>
                </View>
                <ActionButton buttonColor="rgba(0, 129, 190, 1)" icon={menuIcon} backdrop={true}  bgColor="rgba(241,241,241,.7)">
                  <ActionButton.Item buttonColor='#9b59b6' title="Add Contact" onPress={() => Actions.addContact()}>
                    {addContactIcon}
                  </ActionButton.Item>
                   <ActionButton.Item buttonColor='#3498db' title="Logout" onPress={() => {this._logout()}}>
                    <Icon name="ios-log-out-outline" size={30} color="#FFFFFF"/>
                  </ActionButton.Item>
                </ActionButton>
               </View>
            ) 
          }
          else { 
        return(
        <View style={styles.container}>
          <View style={[styles.fixed]}>
          <Image
                source={require('../images/app_bg.png')}
                style={{flex: 1 ,width: null,height: null,resizeMode: 'stretch', opacity: 0.2}}/>
          </View>
            <ListView
              dataSource= {this.state.dataSource}
              renderRow={this._renderContact}
              style={[styles.listView, {opacity: 0.9}]}
              renderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.separator} />}
            />
            <ActionButton buttonColor="rgba(0, 129, 190, 1)" icon={menuIcon} backdrop={true}  bgColor="rgba(241,241,241,.7)">
              <ActionButton.Item buttonColor='#9b59b6' title="Add Contact" onPress={() => Actions.addContact()}>
                {addContactIcon}
              </ActionButton.Item>
               <ActionButton.Item buttonColor='#3498db' title="Logout" onPress={() => {this._logout()}}>
                <Icon name="ios-log-out-outline" size={30} color="#FFFFFF"/>
              </ActionButton.Item>
            </ActionButton>
          
          </View>
          )
        }
      }
  }

  _logout(){
    this._removeStorage().done(()=> {
      Actions.login({type: 'reset'});
    })
  }

  async _removeStorage() {
    try {
      await AsyncStorage.setItem('STORAGE_KEY', JSON.stringify({}));
    } catch (error) {
      // console.log("Error - "+ error.message)
    }
  }

  _renderLoading(){
    return (
      <View style={[styles.container, {justifyContent: 'center', alignItems: 'center'}]}>
          <View style={[styles.fixed]}>
          <Image
                source={require('../images/app_bg.png')}
                style={{flex: 1 ,width: null,height: null,resizeMode: 'stretch',opacity: 0.2}}/>
          </View>
           <Spinner visible={this.state.isLoading} />
      </View>
    )
  }

  _renderContact(contact: contact) {
    return (
      <View style={{flex: 1, padding: 12,
                    backgroundColor: "transparent"}}>
          
          <View style={{flexDirection: 'row', flex: 1}}>
          <Icon name="ios-person" size={30} color="#0680cd"/>
          <Text style={{fontWeight: 'bold', fontSize: 18, color: "#212121", paddingLeft: 5, borderWidth: 1}}>{contact.name}</Text>
          </View>
          <View style={{flexDirection: 'row',}}>
          <Icon name="ios-call" size={22} color="#0680cd"/>
          <Text style={{fontSize: 15, color: "#212121", paddingLeft: 5,  borderWidth: 1}}>{contact.contact}</Text></View>
          <View style={{flexDirection: 'row',}}>
          <Icon name="ios-mail" size={22} color="#0680cd"/>
          <Text style={{fontSize: 15, color: "#212121", paddingLeft: 5,  borderWidth: 1}}>{contact.email}</Text></View>
          <View style={{flexDirection: 'row',}}>
          <Icon name="ios-navigate" size={22} color="#0680cd"/>
          <Text style={{fontSize: 15, color: "#212121", paddingLeft: 5,  borderWidth: 1}}>{contact.area}</Text></View>
      </View>
      
    )
  }
}

const styles = StyleSheet.create({
  container: {
        flex: 1, 
        flexDirection: 'row',
        marginTop: 54,
        backgroundColor: "#FFFFFF",
  },
  listView: {
       backgroundColor: 'transparent',
       
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
    marginTop: 1,
    height: 1,
    backgroundColor: '#e5e5e5',
},
fixed: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  }
});

export default Home;