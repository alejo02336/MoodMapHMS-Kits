import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import React, {useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {HmsLocalNotification} from '@hmscore/react-native-hms-push';

export default function Register({navigation, route}) {
  const [emotion, setEmotion] = useState('');
  const [description, setDescription] = useState('');

  const storeData = async value => {
    try {
      await AsyncStorage.setItem('markers', value).then(() => {
        console.log('Mood Saved');

        const notification = {
          [HmsLocalNotification.Attr.title]: 'Good work!',
          [HmsLocalNotification.Attr.message]: 'You added a new record', // (required)
          [HmsLocalNotification.Attr.ticker]: 'Optional Ticker',
          [HmsLocalNotification.Attr.largeIcon]: 'ic_launcher',
          [HmsLocalNotification.Attr.smallIcon]: 'ic_notification',
          [HmsLocalNotification.Attr.bigText]:
            'Now you can see on the map the location of your emotions',
          [HmsLocalNotification.Attr.subText]: 'This is a subText',
          [HmsLocalNotification.Attr.color]: 'white',
          [HmsLocalNotification.Attr.vibrate]: false,
          [HmsLocalNotification.Attr.vibrateDuration]: 1000,
          [HmsLocalNotification.Attr.tag]: 'hms_tag',
          [HmsLocalNotification.Attr.ongoing]: false,
          [HmsLocalNotification.Attr.importance]:
            HmsLocalNotification.Importance.max,
          [HmsLocalNotification.Attr.dontNotifyInForeground]: false,
          [HmsLocalNotification.Attr.autoCancel]: false,
        };
        // LocalNotification
        HmsLocalNotification.localNotification(notification)
          .then(result => {
            this.log('LocalNotification Default', result);
          })
          .catch(err => {
            console.log(
              '[LocalNotification Default] Error/Exception: ' +
                JSON.stringify(err),
            );
          });

        navigation.pop();
      });
    } catch (e) {
      console.log('Error while storing data.' + e);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>How do you feel?</Text>
      <TextInput
        style={styles.emotion}
        autoFocus={true}
        placeholder="Write here the emotion name"
        placeholderTextColor="gray"
        onChangeText={emotion => setEmotion(emotion)}
      />
      <TextInput
        style={styles.description}
        multiline={true}
        placeholder="Describe your emotion or situation"
        placeholderTextColor="gray"
        onChangeText={description => setDescription(description)}
      />

      <TouchableOpacity
        disabled={description.length > 0 && emotion.length > 0 ? false : true}
        style={{
          alignSelf: 'center',
          flexDirection: 'row',
          justifyContent: 'center',
          backgroundColor:
            description.length > 0 && emotion.length > 0 ? '#1661A6' : 'gray',
          padding: 20,
          marginTop: 20,
          borderRadius: 2,
          shadowOpacity: 80,
          elevation: 15,
        }}
        onPress={() => {
          storeData(
            JSON.stringify([
              ...route.params.markers,
              {
                emotion: emotion,
                description: description,
                lat: route.params.lat,
                lon: route.params.lon,
              },
            ]),
          );
        }}>
        <Text
          style={{
            fontSize: 15,
            color: 'white',
            fontWeight: 'bold',
          }}>
          Save mood
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emotion: {
    borderColor: 'black',
    borderWidth: 1,
    padding: 10,
    margin: 10,
    width: '80%',
    color: 'black',
  },
  description: {
    borderColor: 'black',
    borderWidth: 1,
    color: 'black',
    padding: 10,
    margin: 10,
    width: '80%',
    height: 150,
    textAlignVertical: 'top',
  },
});
