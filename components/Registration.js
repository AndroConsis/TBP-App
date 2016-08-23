'use strict';

import React, { Component } from 'react';

import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableHighlight,
  ScrollView,
  Platform,
  BackAndroid,
  TouchableOpacity,
  Image,
  AsyncStorage,
} from 'react-native';

const STORAGE_KEY = "@TBP:user";
import k from './keyboarddismiss';
import Config from './config';
import GiftedSpinner from 'react-native-gifted-spinner';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Actions } from 'react-native-router-flux';
const imageUploadIcon = (<Icon name="add-a-photo" size={30} color="#4F4F4F"/>)
const tick = (<Icon name="check" size={15} color="#2b2b2b"/>)
const wrong = (<Icon name="eroor" size={15} color="#2b2b2b"/>)
import Spinner from './Modal';

var ImagePicker = require('react-native-image-picker');

var options = {
  title: 'Select Image',
  storageOptions: {
    skipBackup: true,
  }
};




class Registration extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
    	name: '',
    	address: '',
    	mobile_no: '',
    	alt_mobile_no: '',
    	email: '',
    	password: '',
    	pancard_no: '',
    	adharcard_no: '',
    	occupation: '',
    	passport_no: '',
    	firebaseid: '',
    	referancename: '',
    	height: 60,
    	loading: false,
    	noAvatarYet: true,
    	avatarLoading: '',
    	base64avatar: '',
    	imageData: '',
    	fileURL: '',
      cpassword: '',
    	uploading: 'Uploading..',
      cp : false,
      showcp: false,
      };
  }

  validateEmail = (email) => {
      var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
  };


  focusNextField(nextField) {
    this.refs[nextField].focus();
  }

_pickImage() {

  	ImagePicker.showImagePicker(options, (response) => {
  		
  		if (response.didCancel){

  		}

  		else if (response.error) {
  			alert('Some Error Occured. '+ JSON.stringify(error))
  		}

  		else {

  			this.setState({
  				imageData : response.data,
  			});

  			if (Platform.OS === 'ios') {
  				const imageUrl = response.uri.replace('file://','');
  				this.setState({
  				fileURL : imageUrl,
				noAvatarYet: false
  				})
  			} else {
  				const imageUrl = response.uri;
  				this.setState({
  				fileURL : imageUrl,
  				noAvatarYet: false
  				})
  			}
  		}

  	})
  }
  _submit() {
    k();
  	if(this.state.name && this.state.email && this.state.password && this.state.mobile_no 
        && this.state.address && this.state.adharcard_no && this.state.pancard_no
        && this.state.fileURL && this.state.occupation && this.validateEmail(this.state.email)) {

      this.setState({
          loading : true,
        })
    
        var photo = {
            uri: this.state.fileURL,
            type: 'image/jpg',
            name: this.state.name+".jpg"
          }
      var body = new FormData();
      body.append('image', photo);
      body.append('name', this.state.name);
      body.append('address', this.state.address);
      body.append('mobile_no', this.state.mobile_no);
      body.append('alt_mobile_no', this.state.alt_mobile_no);
      body.append('email', this.state.email);
      body.append('password', this.state.password);
      body.append('pancard_no', this.state.pancard_no);
      body.append('adharcard_no', this.state.adharcard_no);
      body.append('occupation', this.state.occupation);
      body.append('passport_no', this.state.passport_no);
      body.append('referancename', this.state.referancename)
      body.append('firebaseid', "");
      var xhr = new XMLHttpRequest();
      xhr.open('POST', Config.api+ "/user-register");
      xhr.onload = () => {
        if(xhr.status !== 200) {
          alert("Failed : Some Error Occured Please check your credentials again")
          this.setState({
            loading: false
          })
          return;
        };
        if(JSON.parse(xhr.responseText).Android[0].result == "Success") {
          this.setState({
            uploading: 'Logging In'
          })
          this._storeUser(JSON.parse(xhr.responseText).Android[0].user_id)
              .done(()=> {
                Actions.home();
              })
        } else {
             alert("Failed: \n" + JSON.parse(xhr.responseText).Android[0].msg)
             this.setState({
              loading: false
            })
        }
	};

	if (xhr.upload) {
		xhr.upload.onprogess = (event) => {
			if(event.lengthComputable) {
				this.setState({
					uploading: event.loaded / event.total
				})
			}
		};
	}
	xhr.send(body);
 } else {
    alert("Please fill proper credentials")
 }
}

 	async _storeUser(userId) {
 		try{ 
 			await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({
 				userId: userId,
 				logged: true,
 			}));
 		} catch (error) {
 			alert("AsyncStorage Error" + error.message)
 		}
 	}

  confirmPassword() {
    if (this.state.password == this.state.cpassword) 
      return true 
      else
       return false
  }


  render() {
    return (
    	 
        <View style={styles.container}>
      	  <View style={[styles.fixed, {flex:1}]}>
            <Image
                  source={require('../images/app_bg.png')}
                  style={{flex: 1 ,width: null,height: null,resizeMode: 'stretch',}}/>
                  <Spinner visible={this.state.loading} />
          </View>
        <ScrollView keyboardShouldPersistTaps={true} >
      		
      		<View style={{flex:1, height: 150, margin: 16,}} >
      			<TouchableOpacity style={styles.onPressImage} onPress = {() => this._pickImage()} >
      			{
      				this.state.noAvatarYet ? (
      					<View style={{alignSelf: 'center'}}>{imageUploadIcon}</View>
      					) : (
      					<View style={{alignSelf: 'center'}}>
      						<Image  style={{ height: 120, 
      										width: 120, 
      										borderRadius: 19
      									}} 
      								source={{uri : this.state.fileURL, isStatic: true}}/>
      					</View>
      					)
      				}
      			</TouchableOpacity>
      		</View>

          <Text>Name</Text>
          
        	<TextInput
        		ref="1"
        		onChange={(event) => this.setState({
        			name: event.nativeEvent.text
        		})}
        		autoCapitalize="words"
        		returnKeyType="next"
        		
        		style={styles.textInput}
       			onSubmitEditing={() => this.focusNextField('2')}
        		value={this.state.name}/>
        		
        	<Text>Email</Text>
        	
        	<TextInput	
        		onChange={(event) => this.setState({
        			email: event.nativeEvent.text
        		})}
        		keyboardType='email-address'
        		value={this.state.email}
        		returnKeyType="next"
        		
        		style={styles.textInput}
        		ref="2"
	      	    onSubmitEditing={() => {if (!this.validateEmail(this.state.email)) {
                                      alert("Please enter a Valid Email Id")
                                    } else {
                                  this.focusNextField('3');
                              }}}
        		/>
        		
        	
        	<Text>Password</Text>
        	
        	<TextInput
        		onChange={(event) => this.setState({
        			password: event.nativeEvent.text
        		})}
        		secureTextEntry={true}
        		value={this.state.password}
        		returnKeyType="next"
        		
        		style={styles.textInput}
        		ref="3"
	      	    onSubmitEditing={() => this.focusNextField('4')}/>
	      	    

          <Text>Confirm Password  
          {
            this.state.showcp 
            ? ( this.state.cp 
              ? 
              (<Icon name="check" size={15} color="#2b2b2b"/>) 
              : 
              (<Icon name="error" size={15} color="#2b2b2b"/>)
            
            ) : (<Text></Text>)}</Text>
          
          <TextInput
            onChange={(event) => {this.setState({
              cpassword: event.nativeEvent.text,
              showcp: true
            }); 
            if(this.state.password == event.nativeEvent.text){
              this.setState({
                cp : true,
              })
            } else {
              this.setState({
                cp: false,
              })
            }
          }}
            secureTextEntry={true}
            value={this.state.cpassword}
            returnKeyType="next"
            
            style={styles.textInput}
            ref="4"
              onSubmitEditing={() => this.confirmPassword() ? this.focusNextField('5') : alert("Password didn't match")}/>

        	<Text>Mobile No</Text>
        	
        	<TextInput
        		placeholder=""
        		onChange={(event) => this.setState({
        			mobile_no: event.nativeEvent.text
        		})}
        		keyboardType="numeric"
        		value={this.state.mobile_no}
        		returnKeyType="next"
        		
        		style={styles.textInput}
        		ref="5"
	      	    onSubmitEditing={() => this.focusNextField('6')}/>
	      	    

        	<Text>Alternative Mobile No</Text>
        	
        	<TextInput        		
        		onChange={(event) => this.setState({
        			alt_mobile_no: event.nativeEvent.text
        		})}
        		keyboardType="numeric"
        		value={this.state.alt_mobile_no}
        		returnKeyType="next"
        		
        		style={styles.textInput}
        		ref="6"
	      	    onSubmitEditing={() => this.focusNextField('7')}/>
	      	    
        	
        	<Text>Address</Text>
        	
        	<TextInput        		
        		onChange={(event) => this.setState({
        			address: event.nativeEvent.text
        		})}
        		value={this.state.address}
        		multiline={true}
        		returnKeyType="next"
        		
        		style={styles.textInput}
        		ref="7"
	      	  />
	      	    


        	<Text>Adhar Card No</Text>
        	
        	<TextInput
        		placeholder=""
        		onChange={(event) => this.setState({
        			adharcard_no: event.nativeEvent.text
        		})}
        		value={this.state.adharcard_no}
        		returnKeyType="next"
        		
        		style={styles.textInput}
        		ref="8"
	      	    onSubmitEditing={() => this.focusNextField('9')}/>
	      	    

        	<Text>Pancard No</Text>
        	
        	<TextInput        		
        		onChange={(event) => this.setState({
        			pancard_no: event.nativeEvent.text
        		})}
        		value={this.state.pancard_no}
        		returnKeyType="next"
        		
        		style={styles.textInput}
        		ref="9"
	      	    onSubmitEditing={() => this.focusNextField('10')}/>
	      	    
        	
        	<Text>Occupation</Text>
        	
        	<TextInput        		
        		onChange={(event) => this.setState({
        			occupation: event.nativeEvent.text
        		})}
        		value={this.state.occupation}
        		returnKeyType="next"
        		
        		style={styles.textInput}
        		ref="10"
	      	    onSubmitEditing={() => this.focusNextField('11')}/>
	      	    

        	<Text>Passport No</Text>
        	
        	<TextInput        		
        		onChange={(event) => this.setState({
        			passport_no: event.nativeEvent.text
        		})}
        		value={this.state.passport_no}
        		returnKeyType="next"
        		
        		style={styles.textInput}
        		ref="11"
	      	    onSubmitEditing={() => this.focusNextField('12')}/>
	      	    
        	<Text>Reference No</Text>
        	
        	<TextInput        		
        		onChange={(event) => this.setState({
        			referancename: event.nativeEvent.text
        		})}
        		value={this.state.referancename}
        		returnKeyType="done"
        		
        		style={styles.textInput}
        		ref="12"
	      	    onSubmitEditing={() => this._submit()}/>
	      	    
        	
        	<TouchableHighlight
        		onPress= { ()=> { this._submit()}}
        		style={styles.button}>
        		<View>
        		{
        			this.state.loading ? (<View><GiftedSpinner/></View>) :
        								(<Text style={styles.buttonText}>Submit</Text>)
        		}
        		</View>
        		</TouchableHighlight>
        </ScrollView>
            </View>
      
    );
  }
}

const styles = StyleSheet.create({
	 container: {
	    padding: 16,
      marginTop: 36,
	    flex: 1, 
	    backgroundColor: '#ffffff',
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

  onPressImage : {
   	 	flex: 1, height: 150, 
   	 	borderRadius: 50, 
   	 	alignItems: 'center', 
   	 	justifyContent: 'center'
   	 },
   	 textInput: {
   	 	
   	 },
  fixed: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.2,
  }
});


export default Registration;
