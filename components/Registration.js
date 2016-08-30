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
  Picker,
  Modal
} from 'react-native';

const STORAGE_KEY = "@TBP:user";
import k from './keyboarddismiss';
import Config from './config';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Actions } from 'react-native-router-flux';
const imageUploadIcon = (<Icon name="add-a-photo" size={30} color="#4F4F4F"/>)
import Spinner from './Modal';
const Item = Picker.Item;
var ImagePicker = require('react-native-image-picker');
import SignatureCapture from 'react-native-signature-capture';
import CheckBox from './checkbox';

import RNFetchBlob from 'react-native-fetch-blob';


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
      userImageUrl: '',
      cpassword: '',
      uploading: 'Uploading..',
      cp : false,
      showcp: false,
      showMob: false,
      showEmail: false,
      showName: false,
      showAdharCard: false,
      showPancard: false,
      showImage: false,
      showOccption : false,
      validEmail: false,
      validMob: false,
      validName: false,
      validAdharCard: false,
      validPancard: false,
      validImage: false,
      validOccupation : false,
      validPancardImage: false,
      showPancardImage: false,
      noPancardImageYet: true,
      userPancardUrl: '',
      idType: 'adharcard',
      idNumber: '',
      showIdType: '',
      validIdNo: '',
      showIdNo: '',
      idFrontImageURL: '',
      showFrontImage: '',
      noFrontImageYet: true,
      noBackImageYet: true,
      validFrontImage: '',
      idBackImageURL: '',
      showBackImage: '',
      validBackImage: '',
      signatureURL : '',
      noSignatureYet: true,
      validSignature: false,
      showSignature : false,
      showSignatureScreen: false,
      isChecked: false,
      representative_number: '',
      show_representative_number: false,
      valid_representative_number: false,
    };
  }

  focusNextField(nextField) {
    this.refs[nextField].focus();
  }

validateMobile(mob) {
    var re = /^([0-9]{10}$)/;
    return re.test(mob);
}

validateEmail(email) {
      var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
     return re.test(email);
};

validatePancard(pc){
    var re =  /(^([a-zA-Z]{5})([0-9]{4})([a-zA-Z]{1})$)/;
    return re.test(pc);
}

validateAdharCard(ac){
    var re = /^([0-9]{12}$)/;
    return re.test(ac);
}

validateName(name) {
      return /^[A-Za-z\s]{1,}[\.]{0,1}[A-Za-z\s]{0,}$/.test(name);
};

_isInt(contact) {
  return x % 1 === 0;
}

_isGreaterThan(a, b){
  if(a.toString().length >= b)
    return true;
  else 
    return false;
}
validateLicense(no){
    let re = /^[a-zA-Z0-9-]*$/
    if(re.test(no)){
      if(11 < no.length < 14) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
}

_pickImage(imageFor) {
  	ImagePicker.showImagePicker(options, (response) => {
  		
  		if (response.didCancel){

  		}

  		else if (response.error) {
  			alert('Some Error Occured. '+ JSON.stringify(error))
  		}

  		else {

  			if (Platform.OS === 'ios') {
  				const imageUrl = response.uri.replace('file://','');
          switch(imageFor) {
            case 'userPancard' :
                  this.setState({
                    userPancardUrl : imageUrl,
                    validPancardImage : true,
                    noPancardImageYet : false,
                    showPancardImage : true,
                  })
                  break;
            case 'userPhoto' : 
                  this.setState({
                    userImageUrl : imageUrl,
                    validImage : true,
                    noAvatarYet : false,
                  })
                  break;
            case 'idFrontImage' :
                  this.setState({
                    idFrontImageURL : imageUrl,
                    validFrontImage : true,
                    showFrontImage : true,
                    noFrontImageYet: false,
                  })
                  break;
            case 'idBackImage' : 
                  this.setState({
                    idFrontImageURL : imageUrl,
                    validBackImage : true,
                    showBackImage : true,
                    noBackImageYet : false,
                })
          }
  			} else {
  				const imageUrl = response.uri;
          switch(imageFor) {
            case 'userPancard' :
                  this.setState({
                    userPancardUrl : imageUrl,
                    validPancardImage : true,
                    noPancardImageYet : false
                  })
                  break;
            case 'userPhoto' : 
                  this.setState({
                    userImageUrl : imageUrl,
                    validImage : true,
                    noAvatarYet : false,
                  })
                  break;
            case 'idFrontImage' :
                  this.setState({
                    idFrontImageURL : imageUrl,
                    validFrontImage : true,
                    noFrontImageYet: false,
                  })
                  break;
            case 'idBackImage' : 
                  this.setState({
                    idBackImageURL : imageUrl,
                    validBackImage : true,
                    noBackImageYet : false,
                })
          }
  			}
  		}

  	})
  }
  _submit() {
    k();
  	if(this.state.validName && this.state.validEmail && this.state.validMob && this.state.validOccupation && this.state.validPancard
        && this.state.validIdNo && (this.state.address.length > 0) && this.confirmPassword() && this.state.validImage
        && this.state.validSignature && this.state.validBackImage && this.state.validFrontImage && this.state.validPancardImage 
        && this.state.isChecked && this.state.valid_representative_number) {
      this.setState({
          loading : true,
        })

      RNFetchBlob.fetch('POST', 'http://tajbusinessopportunity.com/tbp/user-register', {
        'Content-Type' : 'multipart/form-data'
      }, [
      {name : 'image', filename: this.state.name+"_image.jpg", type: 'image/jpg', data: RNFetchBlob.wrap(this.state.imageUrl)},
      {name : 'pancard_image', filename: this.state.name+"_pancard.jpg", type: 'image/jpg', data: RNFetchBlob.wrap(this.state.userPancardUrl)},
      {name : 'id_front_photo', filename: this.state.name+"_id_front_photo.jpg", type: 'image/jpg', data: RNFetchBlob.wrap(this.state.idFrontImageURL)},
      {name : 'id_back_photo', filename: this.state.name+"_id_back_photo.jpg", type: 'image/jpg', data: RNFetchBlob.wrap(this.state.idBackImageURL)},
      {name : 'signature', filename: this.state.name+"_signature.jpg", type: 'image/png', data: RNFetchBlob.wrap(this.state.signatureURL)},
      {name : 'name', data: this.state.name},
      {name : 'address', data: this.state.address },
      {name : 'mobile_no', data : this.state.mobile_no },
      {name : 'alt_mobile_no', data : this.state.address},
      {name : 'email', data : this.state.email},
      {name : 'password', data : this.state.password},
      {name : 'pancard_no', data : this.state.pancard_no},
      {name : 'occupation', data : this.state.occupation},
      {name : 'referancename', data : this.state.referancename},
      {name : 'firebaseid', data : ""},
      {name : 'id_type', data : this.state.idType},
      {name : 'id_number', data : this.state.idNumber},
      {name : 'representative_number', data : this.state.representative_number},
      ]).then((resp) => {
        this.setState({loading: false});
        if(JSON.parse(resp).Android[0].result == "Success") {
            alert("Registration Successful please Login with your credentials");
             Actions.login({type: 'reset'});
             Actions.refresh();
        } else if( JSON.parse(resp).Android[0].result == "Failed") {
            alert("Failed : " + JSON.parse(resp).Android[0].msg)
        } else {
          alert("Some Error Occured Please Try Again.")
        }
      }).catch((err) => {
        this.setState({loading: false});
        alert("Unable to connect to server right now, Please try after some time.");
      })
	
 } else {
    alert("Please fill proper credentials");
    this.setState({
      showSignature : true,
      showPancardImage : true,
      showPancard : true,
      showFrontImage : true,
      showBackImage : true,
      showIdNo : true,
      showIdType : true,
      showName : true,
      showEmail : true,
      showMob : true,
      showcp : true,
      showOccption : true,
      show_representative_number: true,
    });
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

  validateId(no) {
    switch (this.state.idType) {
      case 'Adhar Card' : 
            return this.validateAdharCard(no);
      case 'License' : 
            return this.validateLicense(no);
      case 'Voter Id' : 
            return /^[aA-zZ0-9]*$/.test(no);
      case 'Passport' : 
            return this.validatePancard(no);
        }
  }


  onValueChange(key: string, value: string) {
      this.setState({idType : key, idNumber : '', noFrontImageYet: true, noBackImageYet: true, idFrontImageURL: '', idBackImageURL: '' });
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
          {this._renderSignature()}
        <ScrollView keyboardShouldPersistTaps={true} >
      		<Text style={{marginTop: 20, alignSelf : 'center'}}>Attach your Photo</Text>
      		<View style={{flex:1, height: 150}} >
      			<TouchableOpacity style={styles.onPressImage} onPress = {() => this._pickImage("userPhoto")} >
      			{
      				this.state.noAvatarYet ? (
      					<View style={{alignSelf: 'center'}}>{imageUploadIcon}</View>
      					) : (
      					<View style={{alignSelf: 'center'}}>
      						<Image  style={{ height: 120, 
      										width: 120, 
      										borderRadius: 19
      									}} 
      								source={{uri : this.state.userImageUrl, isStatic: false}}/>
      					</View>
      					)
      				}
      			</TouchableOpacity>
      		</View>

          <Text>Name{
            this.state.showName 
            ? ( this.state.validName 
              ? 
              (<Icon name="check" size={15} color="#2b2b2b"/>) 
              : 
              (<Icon name="error" size={15} color="#DF6126"/>)
            
            ) : (<Text></Text>)}</Text>
          
        	<TextInput
        		ref="1"
        		onChange={(event) => {this.setState({name: event.nativeEvent.text});
                                  this.validateName(event.nativeEvent.text) ? this.setState({validName: true}) : this.setState({validName: false});
                                  }}
        		autoCapitalize="words"
        		returnKeyType="next"
        		style={styles.textInput}
       			onSubmitEditing={() => {if(this.state.validName) {this.focusNextField('2');} else {this.setState({showName: true});}}}
        		value={this.state.name}/>
        		
        	<Text>Email{
            this.state.showEmail 
            ? ( this.state.validEmail 
              ? 
              (<Icon name="check" size={15} color="#2b2b2b"/>) 
              : 
              (<Icon name="error" size={15} color="#DF6126"/>)
            
            ) : (<Text></Text>)}</Text>
        	<TextInput	
        		onChange={(event) => {
                                this.setState({email : event.nativeEvent.text, showEmail: true})
                                if(this.validateEmail(event.nativeEvent.text)){
                                    this.setState({validEmail: true})
                                    } else {
                                      this.setState({validEmail: false})
                                    }}
                                  }
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

        	<Text>Mobile No{
            this.state.showMob
            ? ( this.state.validMob 
              ? 
              (<Icon name="check" size={15} color="#2b2b2b"/>) 
              : 
              (<Icon name="error" size={15} color="#DF6126"/>)
            
            ) : (<Text></Text>)}</Text>
        	
        	<TextInput
        		placeholder=""
        		onChange={(event) => {this.setState({
                                                mobile_no: event.nativeEvent.text,
                                                showMob : true});
                                              if(this.validateMobile(event.nativeEvent.text)){
                                                  this.setState({validMob: true})
                                              } else{
                                                  this.setState({validMob: false})
                                              }
                                            }}
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

        	<Text>Pancard No{
            this.state.showPancard
            ? ( this.state.validPancard 
              ? 
              (<Icon name="check" size={15} color="#2b2b2b"/>) 
              : 
              (<Icon name="error" size={15} color="#DF6126"/>)
            
            ) : (<Text></Text>)}</Text>
        	
        	<TextInput        		
        		onChange={(event) => {this.setState({
                          pancard_no: event.nativeEvent.text,
                          showPancard : true,
                        });
                        if(this.validatePancard(event.nativeEvent.text)){ this.setState({validPancard : true})} else {this.setState({validPancard : false})}}}
        		value={this.state.pancard_no}
        		returnKeyType="next"
        		style={styles.textInput}
        		ref="9"
	      	    onSubmitEditing={() => this.focusNextField('10')}/>

          <Text style={{alignSelf: 'center'}}>Attach Pancard Image{
            this.state.showPanCardImage 
            ? ( this.state.validPancardImage 
              ? 
              (<Icon name="check" size={15} color="#2b2b2b"/>) 
              : 
              (<Icon name="error" size={15} color="#DF6126"/>)
            
            ) : (<Text></Text>)}</Text>
            <View style={{flex:1, height: 150}} >
            <TouchableOpacity style={styles.onPressImage} onPress = {() => this._pickImage("userPancard")} >
            {
              this.state.noPancardImageYet ? (
                <ImageUploadIcon/>
                ) : (
                <View style={{alignSelf: 'center'}}>
                  <Image  style={{ height: 120, 
                          width: 120, 
                          borderRadius: 19
                        }} 
                      source={{uri : this.state.userPancardUrl, isStatic: false}}/>
                </View>
                )
              }
            </TouchableOpacity>
          </View>

          <Text>Upload ID</Text>
          <Picker 
            style={styles.picker}
            selectedValue={this.state.idType}
            onValueChange={this.onValueChange.bind(this)}
            mode= "dialog"
            >
            <Item label="Adhar Card" value="Adhar Card"/>
            <Item label="License" value="License"/>
            <Item label="Passport" value="Passport"/>
            <Item label="Voter Id" value="Voter Id" />
          </Picker>
        	
          <Text>{this.state.idType} No.</Text>
          <TextInput            
            onChange={(event) => {this.setState({
                         idNumber : event.nativeEvent.text,
                         showIdNo : true
                        });
                        if(event.nativeEvent.text.toString().length > 6){
                         this.setState({validIdNo : true})} else { this.setState({validIdNo : true})};
                      }}
            value={this.state.idNumber}
            returnKeyType="next"
            style={styles.textInput}
            ref="10"
            onSubmitEditing={() => k()}/>
          <View style={{flexDirection : 'row',}}>
              <View style={{flex: 1}}>
                <Text style={{alignSelf: 'center'}}>Front Image of ID</Text>
                    <TouchableOpacity style={styles.onPressImage} onPress = {() => this._pickImage("idFrontImage")} >
                      {
                        this.state.noFrontImageYet ? (
                          <ImageUploadIcon/>
                          ) : (
                          <View style={{alignSelf: 'center'}}>
                            <Image  style={{ height: 120, 
                                    width: 120, 
                                    borderRadius: 19,
                                    margin: 20,
                                  }} 
                                source={{uri : this.state.idFrontImageURL, isStatic: false}}/>
                          </View>
                          )
                        }
                      </TouchableOpacity>
              </View>             
              <View style={{flex: 1}}>
                <Text style={{alignSelf: 'center'}}>Back Image of ID</Text>
                  <TouchableOpacity style={styles.onPressImage} onPress = {() => this._pickImage("idBackImage")} >
                    {
                      this.state.noBackImageYet ? (
                        <ImageUploadIcon/>
                        ) : (
                        <View style={{alignSelf: 'center'}}>
                          <Image  style={{ height: 120, 
                                  width: 120, 
                                  borderRadius: 19
                                }} 
                              source={{uri : this.state.idBackImageURL, isStatic: false}}/>
                        </View>
                        )
                      }
                    </TouchableOpacity>
              </View>
          </View>

        	<Text>Occupation{
            this.state.showOccption 
            ? ( this.state.validOccupation 
              ? 
              (<Icon name="check" size={15} color="#2b2b2b"/>) 
              : 
              (<Icon name="error" size={15} color="#DF6126"/>)
            
            ) : (<Text></Text>)}</Text>
        	
        	<TextInput        		
        		onChange={(event) => {this.setState({
                          occupation: event.nativeEvent.text,
                          showOccption: true
                        });
              if(event.nativeEvent.text == ''){
                  this.setState({validOccupation : false})
              } else {
                   if(this.validateName(event.nativeEvent.text)){this.setState({validOccupation: true})} else {this.setState({validOccupation: false})};
            }}}
        		value={this.state.occupation}
        		returnKeyType="next"
        		
        		style={styles.textInput}
        		ref="10"
	      	    onSubmitEditing={() => k()}/>
	      	
          <Text>Representative Mobile No{
            this.state.show_representative_number 
            ? ( this.state.valid_representative_number 
              ? 
              (<Icon name="check" size={15} color="#2b2b2b"/>) 
              : 
              (<Icon name="error" size={15} color="#DF6126"/>)
            
            ) : (<Text></Text>)}</Text>
          
          <TextInput            
            onChange={(event) => {this.setState({
                          representative_number: event.nativeEvent.text,
                          show_representative_number  : true,
                        });
              if(event.nativeEvent.text == ''){
                  this.setState({valid_representative_number : false})
              } else {
                   if(this.validateMobile(event.nativeEvent.text)){this.setState({valid_representative_number: true})} else {this.setState({valid_representative_number: false})};
            }}}
            value={this.state.representative_number}
            returnKeyType="next"
            keyboardType='numeric'
            style={styles.textInput}
            ref="10"
              onSubmitEditing={() => k()}/>
        	<Text>Reference No</Text>
        	
        	<TextInput        		
        		onChange={(event) => this.setState({
        			referancename: event.nativeEvent.text
        		})}
        		value={this.state.referancename}
        		returnKeyType="done"
        		
        		style={styles.textInput}
        		ref="12"
	      	    onSubmitEditing={() => k()}/>
	      	

          <Text style={{alignSelf: 'center'}}>Add Your Signature{
            this.state.showSignature 
            ? ( this.state.validSignature 
              ? 
              (<Icon name="check" size={15} color="#2b2b2b"/>) 
              : 
              (<Icon name="error" size={15} color="#DF6126"/>)
            
            ) : (<Text></Text>)}</Text>
            <View style={{flex:1, height: 150}} >
            <TouchableOpacity style={styles.onPressImage} onPress = {() => this.pickSignature()} >
            {
              this.state.noSignatureYet ? (
                <View><Icon name="create" size={30} color="#4F4F4F"/></View>
                ) : (
                <View style={{alignSelf: 'center'}}>
                  <Image  style={{ height: 120, 
                          width: 120, 
                          borderRadius: 19
                        }} 
                      source={{uri : this.state.signatureURL, isStatic: false}}/>
                </View>
                )
              }
              
            </TouchableOpacity>
          </View>
        	
        <CheckBox
          size={24}
          checked={this.state.isChecked}
          onValueChange={(newValue) => {this.setState({isChecked : !this.state.isChecked})}}
        /><Text> Agree Terms and Conditions </Text>

        	<TouchableHighlight
        		onPress= { ()=> { this._submit()}}
        		style={styles.button}>
        		<View>
              <Text style={styles.buttonText}>Submit</Text>
        		</View>
        		</TouchableHighlight>
        </ScrollView>
            </View>
      
    );
  }

  handlePressCheckedBox(){
    this.setState({
      isChecked : true,
    })
  }

  _renderSignature(){
    return (
      <Modal visible={this.state.showSignatureScreen} onRequestClose={()=> this.setState({showSignatureScreen: !this.state.showSignatureScreen})} >
      <View style={{ flex: 1, top: 0, bottom : 0, left: 0, right: 0 }}>
                  <Text style={{alignItems:"center",justifyContent:"center"}}>Your Signature </Text>
                  <SignatureCapture
                    style={[{flex:1},styles.signature]}
                    ref="sign"
                    onSaveEvent={this._onSaveEvent.bind(this)}
                    onDragEvent={this._onDragEvent}
                    saveImageFileInExtStorage={true}
                    showNativeButtons={true}
                    viewMode={"portrait"}/>
              </View></Modal>
        );
  }

  pickSignature(){
    this.setState({showSignatureScreen : !this.state.showSignatureScreen});
  }
  _onSaveEvent(result){
    this.setState({
      signatureURL: "file://"+result.pathName,
      noSignatureYet : false,
      showSignatureScreen : false,
      validSignature : true,
      showSignature : true,
    })
  }

  _onDragEvent() {
  }
}

class ImageUploadIcon extends Component {
  render(){
    return (
      <View style={{alignSelf: 'center'}}>{imageUploadIcon}</View>
      )
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
   	 	flex: 1, height: 120, 
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
  },
  picker: {
    
  },
   signature: {
        flex: 1,
        borderColor: '#000033',
        borderWidth: 1,
        top:0,
        bottom: 0,

    },
    buttonStyle: {
        flex: 1, justifyContent: "center", alignItems: "center", height: 50,
        backgroundColor: "#eeeeee",
        margin: 10

    }
});


export default Registration;
