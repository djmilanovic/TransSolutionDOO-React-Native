import React, { useState } from 'react';
import { Button, SafeAreaView, StyleSheet, Text, TextInput, View, Image, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard,Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import config from '../config/config'; // Import the config file

export default function AddClient({ route }) {
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [country, setCountry] = useState('');
    const [city, setCity] = useState('');
    const navigation = useNavigation();
    const { scannedData } = route.params; // qr_code_id will be the scanned data

    const handleSubmit = async () => {
        if (!name || !surname || !phoneNumber || !country || !city) {
            alert('Popunite sva polja.');
            return;
        }

        try {
            const response = await fetch(`${config.BASE_URL}/clients/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name,
                    surname,
                    phone_number: phoneNumber,
                    country,
                    city,
                    qr_code_id: scannedData, // Pass the scanned QR code ID
                }),
            });

            const data = await response.json();
            //console.log(data.client);
            if (data.success) {
                Alert.alert('Uspeh!', 'Klijent je uspešno dodat!');
                navigation.replace('ClientInfo', { client: data });
            } else {
                Alert.alert('Greška!', 'Došlo je do greške');
            }
        } catch (error) {
            console.error('Error adding client:', error);
            alert('Server error');
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

                        <Text style={styles.title}>Dodaj novog klijenta</Text>

                        <TextInput
                            style={styles.input}
                            placeholder="Ime:"
                            value={name}
                            onChangeText={setName}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Prezime:"
                            value={surname}
                            onChangeText={setSurname}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Telefon:"
                            keyboardType="phone-pad"
                            value={phoneNumber}
                            onChangeText={setPhoneNumber}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Drzava:"
                            value={country}
                            onChangeText={setCountry}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Grad:"
                            value={city}
                            onChangeText={setCity}
                        />

                        <Button title="Dodaj klijenta" onPress={handleSubmit} />
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center', // Vertically center the content
        alignItems: 'center', // Horizontally center the content
        padding: 20,
    },
    keyboardAvoidingView: {
        flex: 1,
        width: '100%',
    },
    formContainer: {
        width: '100%', // Reduce width of the form to ensure it's not too wide
        alignItems: 'center', // Ensure form items (inputs) are centered
        padding: 30,
        justifyContent: 'center', // Vertically center content inside the form
    },
    logo: {
        width: 200,
        height: 100,
        resizeMode: 'contain',
        marginBottom: 20, // Add space below the logo
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center', // Center the title text
    },
    input: {
        width: '100%', // Ensure input takes the full width of the form container
        padding: 10,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        backgroundColor: '#fff',
    },
    button: {
        width: '100%',
        marginTop: 10,
    },
});
