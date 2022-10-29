import {View, Text, FlatList, StyleSheet} from 'react-native';
import React, {useState, useEffect} from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';

export default function List(props) {
  const [data, setData] = useState([]);

  useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', () => {
      // The screen is focused
      // Call any action
      getData();
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [props.navigation]);

  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem('markers');
      if (value !== null) {
        setData(JSON.parse(value));
        console.log(JSON.parse(value));
      }
    } catch (e) {
      console.log('Error reading localStorage data' + e);
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        keyExtractor={(item, index) => index}
        renderItem={({item}) => (
          <View style={styles.item}>
            <View style={{flexDirection: 'row'}}>
              <Text style={{fontWeight: '700', marginRight: 5}}>Mood:</Text>
              <Text>{item.emotion}</Text>
            </View>
            <View style={{flexDirection: 'row'}}>
              <Text style={{fontWeight: '700', marginRight: 5}}>
                Description:
              </Text>
              <Text>{item.description}</Text>
            </View>
            <View style={{flexDirection: 'row'}}>
              <Text style={{fontWeight: '700', marginRight: 5}}>Location:</Text>
              <Text>
                {item.lat} - {item.lon}
              </Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
  },
  item: {
    padding: 10,
    fontSize: 18,

    borderColor: 'black',
    borderWidth: 1,
    margin: 5,
    borderRadius: 5,
  },
});
