import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TextInput, View, Image, Alert, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import config from '../config/config'; // Import the config file

export default function AddDriver() {
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigation = useNavigation();

    const handleSubmit = async () => {
        // Validate the form fields
        if (!name || !surname || !phoneNumber || !password || !confirmPassword) {
            Alert.alert('Greška', 'Molim Vas popunite sva polja.');
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert('Greška', 'Šifre se ne poklapaju.');
            return;
        }

        try {
            const response = await fetch(`${config.BASE_URL}/register`, { // Adjust the URL if needed for the driver API endpoint
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name,
                    surname,
                    phone_number: phoneNumber,
                    role: 'driver', // Set role to "driver" automatically
                    password,
                }),
            });

            const data = await response.json();

            if (data.success) {
                Alert.alert('Uspeh!', 'Vozač je uspešno dodat!');
                navigation.goBack(); // Go back to the previous screen or navigate as needed
            } else {
                Alert.alert('Greška', data.message || 'Došlo je do greške u registraciji novog vozača.');
            }
        } catch (error) {
            console.error('Error:', error);
            Alert.alert('Greška', 'Došlo je do greške sa serverom.');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardAvoidingView}
            >
                {/* Dismiss keyboard when tapping outside */}
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.formContainer}>
                        {/* Logo at the top */}
                        <Image source={require('../assets/transsolutionlogo.png')} style={styles.logo} />

                        <Text style={styles.title}>Registruj vozača</Text>

                        <TextInput
                            style={styles.input}
                            placeholder="Ime"
                            value={name}
                            onChangeText={setName}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Prezime"
                            value={surname}
                            onChangeText={setSurname}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Broj telefona"
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
                        <TextInput
                            style={styles.input}
                            placeholder="Potvrdi šifru"
                            secureTextEntry
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                        />

                        <TouchableOpacity onPress={handleSubmit} style={styles.button}>
                            <Text style={styles.buttonText}>Registruj vozača</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    keyboardAvoidingView: {
        flex: 1,
        width: '100%',
    },
    formContainer: {
        width: '100%',
        alignItems: 'center',
        padding: 30,
    },
    logo: {
        width: 200,
        height: 100,
        resizeMode: 'contain',
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        width: '100%',
        padding: 10,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        backgroundColor: '#fff',
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
