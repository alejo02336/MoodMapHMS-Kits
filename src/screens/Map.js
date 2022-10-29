import React, {useState, useEffect} from 'react';

import {
  ActivityIndicator,
  View,
  Text,
  Dimensions,
  PixelRatio,
  Image,
  TouchableOpacity,
  TouchableHighlight,
} from 'react-native';

import HMSLocation from '@hmscore/react-native-hms-location';
import HMSMap, {
  MapTypes,
  HMSMarker,
  HMSInfoWindow,
} from '@hmscore/react-native-hms-map';
import {LogBox} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Map(props) {
  const [lat, setLan] = useState(0);
  const [lon, setLon] = useState(0);
  const [position, setPosition] = useState();
  const [markers, setMarkers] = useState([]);
  const [mapMarkers, setMapMarkers] = useState([]);

  useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', () => {
      // The screen is focused
      // Call any action
      getMarkers();
    });

    // Initialize Location Kit
    HMSLocation.LocationKit.Native.init()
      .then(_ => console.log('Done loading'))
      .catch(ex => console.log('Error while initializing.' + ex));
    //HMSLocation.FusedLocation.Native.requestPermission();

    LogBox.ignoreLogs([
      'Non-serializable values were found in the navigation state',
    ]);

    getLocation();

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [props.navigation]);

  const getLocation = () => {
    const locationRequest = {
      priority:
        HMSLocation.FusedLocation.Native.PriorityConstants
          .PRIORITY_HIGH_ACCURACY,
      interval: 3,
      numUpdates: 10,
      fastestInterval: 1000.0,
      expirationTime: 200000.0,
      expirationTimeDuration: 200000.0,
      smallestDisplacement: 0.0,
      maxWaitTime: 2000000.0,
      needAddress: true,
      language: 'en',
      countryCode: 'en',
    };

    const locationSettingsRequest = {
      locationRequests: [locationRequest],
      alwaysShow: false,
      needBle: false,
    };

    HMSLocation.FusedLocation.Native.checkLocationSettings(
      locationSettingsRequest,
    )
      .then(res => {
        HMSLocation.FusedLocation.Native.getLastLocation()
          .then(pos => (position ? null : setPosition(pos)))
          .catch(err => console.log('Failed to get last location', err));
      })

      .catch(ex => console.log('Error while getting location settings. ' + ex));
  };

  const getMarkers = async () => {
    try {
      const value = await AsyncStorage.getItem('markers');
      if (value !== null) {
        let markers = JSON.parse(value);
        setMarkers(markers);

        let markersComponent = markers.map(function (item, index) {
          return (
            <HMSMarker
              key={index}
              icon={{
                uri: Image.resolveAssetSource(require('../assets/heart.png'))
                  .uri,
                width: 75,
                height: 75,
              }}
              coordinate={{
                latitude: item.lat,
                longitude: item.lon,
              }}>
              <HMSInfoWindow>
                <TouchableHighlight>
                  <View
                    style={{
                      backgroundColor: 'orange',
                      padding: 10,
                      alignItems: 'center',
                    }}>
                    <Text style={{fontWeight: 'bold'}}>{item.emotion}</Text>
                    <Text>{item.description}</Text>
                  </View>
                </TouchableHighlight>
              </HMSInfoWindow>
            </HMSMarker>
          );
        });

        setMapMarkers(markersComponent);
      }
    } catch (e) {
      console.log('Error reading localStorage data' + e);
    }
  };

  let mapView;
  return (
    <View style={{flex: 1}}>
      {position ? (
        <HMSMap
          mapType={MapTypes.NORMAL}
          myLocationEnabled={true}
          zoomControlsEnabled={true}
          myLocationButtonEnabled={true}
          ref={e => (mapView = e)}
          onCameraIdle={e =>
            mapView
              .getCoordinateFromPoint({
                x: (Dimensions.get('screen').width * PixelRatio.get()) / 2,
                y: (Dimensions.get('screen').height * PixelRatio.get()) / 2,
              })
              .then(a => {
                setLan(a.latitude);
                setLon(a.longitude);
                console.log(a.latitude, a.longitude);
              })
              .catch(a => console.log(a))
          }
          camera={{
            target: {
              latitude: position.latitude,
              longitude: position.longitude,
            },
            zoom: 15,
          }}
          style={{
            flex: 1,
          }}>
          {mapMarkers}
        </HMSMap>
      ) : (
        <ActivityIndicator
          style={{flex: 1, backgroundColor: 'gray', opacity: 0.5}}
          size={85}
          color="#0000ff"
        />
      )}

      {position ? (
        <Image
          style={{
            width: 50,
            height: 50,

            position: 'absolute',
            top: '53.5%',
            left: '41.5%',

            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 999,
          }}
          source={require('../assets/brain.png')}
        />
      ) : null}

      {position ? (
        <TouchableOpacity
          style={{
            position: 'absolute',
            alignSelf: 'center',
            flexDirection: 'row',
            justifyContent: 'center',
            backgroundColor: '#1661A6',
            padding: 20,
            paddingBottom: 22,
            borderRadius: 100,
            shadowOpacity: 80,
            elevation: 15,
            top: '76%',
          }}
          onPress={() => {
            props.navigation.navigate('Register', {lat, lon, markers});
          }}>
          <Text
            style={{
              fontSize: 15,
              color: 'white',
              fontWeight: 'bold',
            }}>
            Add mood
          </Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}
