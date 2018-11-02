import React, { Component } from 'react';
import { Alert, Linking, Dimensions, LayoutAnimation, Text, View, StatusBar, StyleSheet, TouchableOpacity } from 'react-native';
import { BarCodeScanner, Permissions } from 'expo';
import AwesomeAlert from 'react-native-awesome-alerts';

export default class App extends Component {
  state = {
    hasCameraPermission: null,
    lastScannedUrl: null,
    showAlert: false,
    alertTitle: '',
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
    if (result.data !== this.state.lastScannedUrl) {
      LayoutAnimation.spring();
      this.setState({ lastScannedUrl: result.data });
    }
  }
  renderAlert() {
    const { showAlert, alertTitle, alertMessage } = this.state
    return (
      <AwesomeAlert
        show={showAlert}
        title={alertTitle}
        message={alertMessage}
        closeOnTouchOutside={true}
        closeOnHardwareBackPress={true}
        showConfirmButton={true}
        confirmText="OK"
        confirmButtonColor="#1fb19c"
        onConfirmPressed={() => this.hideAlert()}
        messageStyle={{ textAlign: 'center' }}
      />
    )
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

        {this._maybeRenderUrl()}
        {this.renderAlert()}

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

  showAlert = (alertTitle, alertMessage) => {
    this.setState({
      alertMessage,
      alertTitle,
      showAlert: true
    })
  }

  hideAlert = () => {
    this.setState({
      showAlert: false
    })
  }

  _maybeRenderUrl = () => {
    if (!this.state.lastScannedUrl) {
      return;
    }
    const itemName = "{{Item Name}}"
    const itemDescription = "{{Item Description}}"

    const firstLine = `name: ${itemName}`
    const secondLine = `description: ${itemDescription}`

    const fullDescription = firstLine + "\n\n" + secondLine

    this.showAlert("ITEM DESCRIPTION", fullDescription);
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
