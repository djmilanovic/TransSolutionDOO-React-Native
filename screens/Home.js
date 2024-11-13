import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Home({ navigation }) {
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const checkAdminStatus = async () => {
            const role = await AsyncStorage.getItem('userRole');
            setIsAdmin(role === 'admin');
        };

        checkAdminStatus();
    }, []);

    const handleLogout = async () => {
        await AsyncStorage.clear();
        navigation.replace('Login');
    };

    return (
        <View style={styles.container}>
            <Image source={require('../assets/transsolutionlogo.png')} style={styles.logo} />

            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('QRScanner')}>
                <Text style={styles.buttonText}>Skeniraj karticu</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.button, styles.buttonSpacing]} onPress={() => navigation.navigate('OrderFilter')}>
                <Text style={styles.buttonText}>Pregled porudžbina</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.button, styles.buttonSpacing]} onPress={() => navigation.navigate('ViewClients')}>
                <Text style={styles.buttonText}>Pregled klijenata</Text>
            </TouchableOpacity>

            {isAdmin && (
                <TouchableOpacity style={[styles.button, styles.buttonSpacing]} onPress={() => navigation.navigate('AddDriver')}>
                    <Text style={styles.buttonText}>Dodaj novog vozača</Text>
                </TouchableOpacity>
            )}
            {isAdmin && (
                <TouchableOpacity style={[styles.button, styles.buttonSpacing]} onPress={() => navigation.navigate('ViewDriver')}>
                    <Text style={styles.buttonText}>Pregled vozača</Text>
                </TouchableOpacity>
            )}


            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Text style={styles.logoutButtonText}>Izloguj se</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    logo: {
        width: 200,
        height: 100,
        resizeMode: 'contain',
        marginBottom: 40,
    },
    button: {
        backgroundColor: '#ff6902',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 5,
        width: 250, // Set a fixed width for all buttons
        height: 50, // Set a fixed height for all buttons
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    buttonSpacing: {
        marginTop: 10,
    },
    logoutButton: {
        position: 'absolute',
        top: 20,
        right: 20,
        backgroundColor: '#ff6902',
        padding: 8,
        borderRadius: 5,
    },
    logoutButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },
});
