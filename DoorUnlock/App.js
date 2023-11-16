import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your Open sesame app!</Text>
        <Button
            onPress={() => {
                fetch('http://109.75.44.3:9000/gateopen/ProductEngineering.php')
                    .then(response => response.json())
                    .then(json => {
                        console.log(json);
                    })
                    .catch(error => {
                        console.error(error);
                    });
            }}
            title="Open Door"
            color="#841584"
            accessibilityLabel="Learn more about this purple button"
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
