import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import axios from 'axios';

function haversine(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the Earth in kilometers

    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = R * c; // Distance in kilometers
    return distance * 1000; // Distance in meters
}

export default function App() {
    const [isWithinOneMeter, setIsWithinOneMeter] = useState(false);

    const withinOneMeter = (centerLat, centerLon, pointLat, pointLon) => {
        const distance = haversine(centerLat, centerLon, pointLat, pointLon);

        return distance <= 2;
    }
    const getCurrentLocation = () => {
        Geolocation.getCurrentPosition(
            position => {
                const { latitude, longitude } = position.coords;
                console.log('Current Location:', latitude, longitude);

                const withinTwoMeter = withinOneMeter(
                    40.1965035,
                    44.4796589,
                    latitude,
                    longitude
                );
                console.log(withinTwoMeter);
                setIsWithinOneMeter(withinTwoMeter);
                // Call reverse geocoding function with latitude and longitude
                // reverseGeocode(latitude, longitude);
            },
            error => {
                console.error('Error getting location:', error);
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
    };

    // setInterval(() => {
    //     getCurrentLocation();
    // }, 3000);
  return (
    <View style={styles.container}>
        <Button
            onPress={() => {
                axios.get('http://109.75.44.3:9000/gateopen/ProductEngineering.php');
                // fetch('http://109.75.44.3:9000/gateopen/ProductEngineering.php')
                //     .then(response => response.json())
                //     .then(json => {
                //         console.log(json);
                //     })
                //     .catch(error => {
                //         console.error(error);
                //     });
            }}
            title="Open Door"
            color="#841584"
            accessibilityLabel="Learn more about this purple button"
            // disabled={!isWithinOneMeter}
        />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
