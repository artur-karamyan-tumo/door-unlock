import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
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
    const [isOpened, setIsOpened] = useState(false);

    const withinOneMeter = (centerLat, centerLon, pointLat, pointLon) => {
        const distance = haversine(centerLat, centerLon, pointLat, pointLon);

        return distance <= 2;
    }
    const getCurrentLocation = () => {
        Geolocation.getCurrentPosition(
            position => {
                const { latitude, longitude } = position.coords;
                // console.log('Current Location:', latitude, longitude);

                const withinTwoMeter = withinOneMeter(
                    40.1965035,
                    44.4796589,
                    latitude,
                    longitude
                );
                // console.log(withinTwoMeter);
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

    let svg;
    if (isOpened) {
        svg = <svg style={styles.svg} xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36" fill="none">
            <path d="M9.11245 33.2625C8.16245 33.2625 7.35645 32.9315 6.69445 32.2695C6.03145 31.6065 5.69995 30.8 5.69995 29.85V15.075C5.69995 14.125 6.03145 13.319 6.69445 12.657C7.35645 11.994 8.16245 11.6625 9.11245 11.6625H22.2374V8.92499C22.2374 7.72499 21.825 6.71899 21 5.90699C20.175 5.09399 19.175 4.68749 18 4.68749C17.025 4.68749 16.181 4.96249 15.468 5.51249C14.756 6.06249 14.2625 6.76249 13.9875 7.61249C13.8125 8.01249 13.575 8.33099 13.275 8.56799C12.975 8.80599 12.65 8.92499 12.3 8.92499C11.725 8.92499 11.2685 8.73099 10.9305 8.34299C10.5935 7.95599 10.5 7.49999 10.65 6.97499C11.05 5.32499 11.925 3.96249 13.275 2.88749C14.625 1.81249 16.2 1.27499 18 1.27499C20.125 1.27499 21.9314 2.01249 23.4195 3.48749C24.9065 4.96249 25.65 6.77499 25.65 8.92499V11.6625H26.8874C27.8375 11.6625 28.644 11.994 29.307 12.657C29.969 13.319 30.3 14.125 30.3 15.075V29.85C30.3 30.8 29.969 31.6065 29.307 32.2695C28.644 32.9315 27.8375 33.2625 26.8874 33.2625H9.11245ZM18 25.4625C18.825 25.4625 19.5315 25.1685 20.1195 24.5805C20.7065 23.9935 21 23.2875 21 22.4625C21 21.6375 20.7065 20.931 20.1195 20.343C19.5315 19.756 18.825 19.4625 18 19.4625C17.175 19.4625 16.469 19.756 15.882 20.343C15.294 20.931 15 21.6375 15 22.4625C15 23.2875 15.294 23.9935 15.882 24.5805C16.469 25.1685 17.175 25.4625 18 25.4625Z" fill="#3FC0A7"/>
        </svg>;
    } else {
        svg = <svg style={styles.svg} xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36" fill="none">
            <path d="M9.11245 33.2625C8.16245 33.2625 7.35645 32.9315 6.69445 32.2695C6.03145 31.6065 5.69995 30.8 5.69995 29.85V15.075C5.69995 14.15 6.03145 13.35 6.69445 12.675C7.35645 12 8.16245 11.6625 9.11245 11.6625H10.35V8.92499C10.35 6.79999 11.0935 4.99349 12.5805 3.50549C14.0685 2.01849 15.875 1.27499 18 1.27499C20.125 1.27499 21.9314 2.01849 23.4195 3.50549C24.9065 4.99349 25.65 6.79999 25.65 8.92499V11.6625H26.8874C27.8375 11.6625 28.644 12 29.307 12.675C29.969 13.35 30.3 14.15 30.3 15.075V29.85C30.3 30.8 29.969 31.6065 29.307 32.2695C28.644 32.9315 27.8375 33.2625 26.8874 33.2625H9.11245ZM18 25.4625C18.825 25.4625 19.5315 25.1685 20.1195 24.5805C20.7065 23.9935 21 23.2875 21 22.4625C21 21.6375 20.7065 20.931 20.1195 20.343C19.5315 19.756 18.825 19.4625 18 19.4625C17.175 19.4625 16.469 19.756 15.882 20.343C15.294 20.931 15 21.6375 15 22.4625C15 23.2875 15.294 23.9935 15.882 24.5805C16.469 25.1685 17.175 25.4625 18 25.4625ZM13.7625 11.6625H22.2374V8.92499C22.2374 7.74999 21.825 6.74999 21 5.92499C20.175 5.09999 19.175 4.68749 18 4.68749C16.825 4.68749 15.825 5.09999 15 5.92499C14.175 6.74999 13.7625 7.74999 13.7625 8.92499V11.6625Z" fill="#F15D4D"/>
        </svg>;
    }

    setInterval(() => {
        getCurrentLocation();
    }, 3000);
  return (
    <View style={styles.container}>
        <Text style={styles.title}>Engineering</Text>
        <Text style={styles.subTitle}>Door lock</Text>
        <View style={isOpened ? styles.unlockedButtonBlock : styles.lockedButtonBlock}>
            <View style={isOpened ? styles.unlockedButton : (isWithinOneMeter ? styles.lockedButtonWithinOneMeter : styles.lockedButton)}>
                <TouchableOpacity
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
                        setIsOpened(true);
                        setTimeout(() => {
                            setIsOpened(false);
                        }, 2000);
                    }}
                    disabled={!isWithinOneMeter}
                >
                    { svg }
                    <Text style={isOpened ? styles.unlocked : styles.locked }>{ isOpened ? 'unlocked' : 'locked' }</Text>
                </TouchableOpacity>
            </View>
        </View>
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
    title: {
        color: '#000',
        fontSize: '24px',
        fontStyle: 'normal',
        fontWeight: 'bold',
        lineHeight: '30px',
        letterSpacing: '0.1px'
    },
    subTitle: {
        fontSize: '16px',
    },
    lockedButtonBlock: {
        marginTop: '27px',
        borderRadius: '50%',
        textAlign: 'center',
        border: '26px solid rgba(241, 93, 77, 0.20)',
    },
    lockedButton: {
        padding: '30px',
        borderRadius: '50%',
        width: '140px',
        height: '140px'
    },
    lockedButtonWithinOneMeter: {
        padding: '30px',
        borderRadius: '50%',
        boxShadow: '0px 0px 28px 0px rgba(241, 93, 77, 0.96)',
        width: '140px',
        height: '140px'
    },
    unlockedButtonBlock: {
        marginTop: '27px',
        borderRadius: '50%',
        textAlign: 'center',
        border: '26px solid rgba(63, 192, 167, 0.2)',

    },
    unlockedButton: {
        padding: '30px',
        borderRadius: '50%',
        boxShadow: '0px 0px 28px 0px rgba(63, 192, 167, 0.25)',
        width: '140px',
        height: '140px'
    },
    svg: {
        marginLeft: 'auto',
        marginRight: 'auto',
        marginBottom: '14px',
    },
    locked: {
        color: '#F15D4D',
        fontSize: '14px',
        textTransform: 'uppercase',
        textAlign: 'center'
    },
    unlocked: {
        color: '#3FC0A7',
        fontSize: '14px',
        textTransform: 'uppercase',
        textAlign: 'center'
    }
});
