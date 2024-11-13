import React from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginPage from './screens/LoginPage';
import QRScanner from './screens/QRScanner';
import Home from './screens/Home';
import ClientInfo from './screens/ClientInfo';
import AddClient from './screens/AddClient';
import OrderFilter from "./screens/OrderFilter";
import ViewClients from './screens/ViewClients';
import AddDriver from './screens/AddDriver';
import ViewDriver from './screens/ViewDriver';

const Stack = createStackNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator
            initialRouteName="Login"
            screenOptions={{
                headerBackTitle: 'Nazad', // Set default back button text
            }}
            >
                <Stack.Screen
                    name="Login"
                    component={LoginPage}
                    options={{ title: ' ' }} // Custom title for Login screen
                />
                <Stack.Screen
                    name="Home"
                    component={Home}
                    options={{ title: 'Trans Solution DOO' }} // Custom title for Home screen
                />
                <Stack.Screen
                    name="QRScanner"
                    component={QRScanner}
                    options={{ title: 'Skeniraj QR karticu' }} // Custom title for QRScanner screen
                />
                <Stack.Screen
                    name="ClientInfo"
                    component={ClientInfo}
                    options={{ title: 'Informacije o klijentu' }} // Custom title for ClientInfo screen
                />
                <Stack.Screen
                    name="AddClient"
                    component={AddClient}
                    options={{ title: 'Dodaj novog klijenta' }} // Custom title for AddClient screen
                />
                <Stack.Screen
                    name="OrderFilter"
                    component={OrderFilter}
                    options={{ title: 'Pregled poružbina' }}
                />
                 <Stack.Screen
                    name="ViewClients"
                    component={ViewClients}
                    options={{ title: 'Pregled klijenata' }}
                />
                <Stack.Screen
                    name="AddDriver"
                    component={AddDriver}
                    options={{ title: 'Registruj vozača' }}
                />
                <Stack.Screen
                    name="ViewDriver"
                    component={ViewDriver}
                    options={{ title: 'Pregled vozača' }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({
    logo: {
        width: 200,
        height: 100,
        resizeMode: 'contain',
        marginBottom: 40,
    },
});
