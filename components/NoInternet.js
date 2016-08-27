'use strict';

import React, { Component } from 'react';

import {
  StyleSheet,
  View,
  Text,
} from 'react-native';

class NoInternet extends Component {
  render() {
    return (
      <View style={styles.container}>
      	<Text>Internet Not Available</Text>
      	<Text>Please connect to the Internet.</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
	container: {
		flex: 1, 
        flexDirection: 'row',
        marginTop: 54,
        backgroundColor: "#FFFFFF",
        justifyContent: 'center',
        alignItems: 'center'
	}
});


export default NoInternet;