import React, { useState } from 'react';
import {
    View,
    TextInput,
    Button,
    StyleSheet,
    Alert,
    Image,
    ActivityIndicator,
    Keyboard,
    TouchableOpacity,
    Text,
    TouchableWithoutFeedback,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../config/config';

export default function Login({ navigation }) {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!phoneNumber || !password) {
            Alert.alert('Input Error', 'Please enter both phone number and password');
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`${config.BASE_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ phoneNumber, password }),
            });

            const result = await response.json();

            if (result.success) {
                await AsyncStorage.setItem('token', result.token);
                await AsyncStorage.setItem('userRole', result.user.role);
                await AsyncStorage.setItem('userId', result.user.id.toString());

                //console.log(`Logged in user: ${result.user.name} ${result.user.surname}, Role: ${result.user.role}, ID: ${result.user.id}`);

                navigation.replace('Home');
            } else {
                Alert.alert('Neuspešno logovanje', 'Netačan broj telefona ili šifra');
            }
        } catch (error) {
            console.error('Error:', error);
            Alert.alert('Neuspešno logovanje', 'Došlo je do nekakve greške.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <View style={styles.container}>
                <Image source={require('../assets/transsolutionlogo.png')} style={styles.logo} />
                <TextInput
                    style={styles.input}
                    placeholder="Broj telefona:"
                    keyboardType="phone-pad"
                    value={phoneNumber}
                    onChangeText={setPhoneNumber}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Šifra"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                />
                {loading ? (
                    <ActivityIndicator size="large" color="#0000ff" />
                ) : (
                    <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
                <Text style={styles.buttonText}>Uloguj se</Text>
            </TouchableOpacity>
                )}
            </View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    logo: {
        width: 200,
        height: 100,
        resizeMode: 'contain',
        marginBottom: 40,
    },
    input: {
        width: '80%',
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#ff6902',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 5,
        width: 250,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        marginBottom: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
