import React, { Component } from 'react';
import { Alert, Linking, Dimensions, LayoutAnimation, Text, View, StatusBar, StyleSheet, TouchableOpacity } from 'react-native';
import { BarCodeScanner, Permissions } from 'expo';
import AwesomeAlert from 'react-native-awesome-alerts';
import * as API from '../API'

export default class App extends Component {
  state = {
    hasCameraPermission: null,
    lastScannedUrl: null,
    showAlert: false,
    alertMessage: '',
  };

  componentDidMount() {
    this._requestCameraPermission();
  }

  _requestCameraPermission = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({
      hasCameraPermission: status === 'granted',
    });
  };

  // Handle QR code reader output
  _handleBarCodeRead = result => {
    console.log("Reading BarCode!!!")
    if (result.data !== this.state.lastScannedUrl) {
      LayoutAnimation.spring();
      console.log("Changing Barcode Url")
      this.setState({ lastScannedUrl: result.data });

      API.getItem(result.data)
      .then(async (response) => {
        //TODO wait for Nawaf to change API request
        const itemName = response.itemName
        const price = response.price
        const itemDescription = response.description

        const firstLine = `name: ${itemName}`
        const secondLine = `price: ${price}`
        const thirdLine = `description: ${itemDescription}`

        const fullDescription = firstLine + "\n" + secondLine + "\n\n" + thirdLine
        this.showAlert(fullDescription)
      }).catch((error) => {})
    }
  }

  render() {
    return (
      <View style={styles.container}>

        {this.state.hasCameraPermission === null
          ? <Text>Requesting for camera permission</Text>
          : this.state.hasCameraPermission === false
              ? <Text style={{ color: '#fff' }}>
                  Camera permission is not granted
                </Text>
              : <BarCodeScanner
                  onBarCodeRead={this._handleBarCodeRead}
                  style={{
                    height: Dimensions.get('window').height,
                    width: Dimensions.get('window').width,
                  }}
                />}

        <AwesomeAlert
        	show={this.state.showAlert}
        	title={"ITEM DESCRIPTION"}
        	message={this.state.alertMessage}
        	closeOnTouchOutside={true}
        	closeOnHardwareBackPress={true}
        	showConfirmButton={true}
        	confirmText="OK"
        	confirmButtonColor="#1fb19c"
        	onConfirmPressed={() => this.hideAlert()}
        	messageStyle={{ textAlign: 'left' }}
        />

        <StatusBar hidden />
      </View>
    );
  }
  _handlePressUrl = () => {
    Alert.alert(
      'Open this URL?',
      this.state.lastScannedUrl,
      [
        {
          text: 'Yes',
          onPress: () => Linking.openURL(this.state.lastScannedUrl),
        },
        { text: 'No', onPress: () => {} },
      ],
      { cancellable: false }
    );
  };

  _handlePressCancel = () => {
    this.setState({ lastScannedUrl: null });
  };

  showAlert = (message) => {
    console.log("Showing alert...")
    this.setState({
      showAlert: true,
      alertMessage: message
    })

    console.log("SHOWALERT lastScannedUrl: " + this.state.lastScannedUrl)

    console.log("Alert Shown!!")
  }

  hideAlert = () => {
    console.log("Hiding alert...")
    this.setState({
      showAlert: false,
      lastScannedUrl: null
    })

    console.log("HIDEALERT lastScannedUrl: " + this.state.lastScannedUrl)

    console.log("Alert hidden!!")
  }

  _maybeRenderUrl = () => {
    console.log("Maybe Render Url...")
    if (!this.state.lastScannedUrl) {
      return;
    }


    console.log("IT IS URL!! RENDER IT!!")
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 15,
    flexDirection: 'row',
  },
  url: {
    flex: 1,
  },
  urlText: {
    color: '#fff',
    fontSize: 20,
  },
  cancelButton: {
    marginLeft: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 18,
  },
});
