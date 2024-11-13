import React, { useEffect, useState } from 'react';
import config from '../config/config';
import {
    View,
    Text,
    TouchableOpacity,
    Modal,
    StyleSheet,
    ActivityIndicator,
    ScrollView,
    TextInput,
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform
} from 'react-native';

const ViewDriver = () => {
    const [drivers, setDrivers] = useState([]);
    const [selectedDriver, setSelectedDriver] = useState(null);
    const [driverDetails, setDriverDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [detailsLoading, setDetailsLoading] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    useEffect(() => {
        fetchDrivers();
    }, []);

    const fetchDrivers = async () => {
        try {
            const response = await fetch(`${config.BASE_URL}/drivers`);
            const data = await response.json();
            setDrivers(Array.isArray(data.data) ? data.data : []);
        } catch (error) {
            console.error('Error fetching drivers:', error);
            setDrivers([]);
        } finally {
            setLoading(false);
        }
    };

    const selectDriver = (driver) => {
        setSelectedDriver(driver);
        setDropdownVisible(false);
    };

    const handlePasswordChange = async () => {
        if (newPassword !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match');
            return;
        }

        try {
            const response = await fetch(`${config.BASE_URL}/driverPasswordChange`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: selectedDriver.id,
                    newPassword,
                }),
            });

            const result = await response.json();
            if (result.success) {
                Alert.alert('Uspeh!', 'Šifra je promenjena uspešno!');
                setNewPassword('');
                setConfirmPassword('');
            } else {
                Alert.alert('Greška!', 'Došlo je do greške');
            }
        } catch (error) {
            console.error('Error updating password:', error);
            Alert.alert('Error', 'An error occurred while updating password');
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
                <Image source={require('../assets/transsolutionlogo.png')} style={styles.logo} />
                <Text style={styles.title}>Pregled vozača</Text>

                {loading ? (
                    <ActivityIndicator size="large" color="#0000ff" />
                ) : (
                    <TouchableOpacity style={styles.dropdown} onPress={() => setDropdownVisible(true)}>
                        <Text style={styles.dropdownText}>
                            {selectedDriver ? `${selectedDriver.name} ${selectedDriver.surname}` : 'Izaberi vozača'}
                        </Text>
                    </TouchableOpacity>
                )}

                {dropdownVisible && (
                    <Modal
                        visible={dropdownVisible}
                        transparent={true}
                        animationType="slide"
                        onRequestClose={() => setDropdownVisible(false)}
                    >
                        <View style={styles.modalOverlay}>
                            <View style={styles.modalContent}>
                                <ScrollView>
                                    <TouchableOpacity onPress={() => selectDriver(null)}>
                                        <Text style={styles.clientItem}>Svi vozači</Text>
                                    </TouchableOpacity>
                                    {drivers.map((driver) => (
                                        <TouchableOpacity
                                            key={driver.id}
                                            style={styles.clientItem}
                                            onPress={() => selectDriver(driver)}
                                        >
                                            <Text>{`${driver.name} ${driver.surname}`}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                                {/* Close Button */}
                                <TouchableOpacity style={styles.closeButton} onPress={() => setDropdownVisible(false)}>
                                    <Text style={styles.closeButtonText}>Zatvori</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>
                )}

                {selectedDriver && (
                    <View style={styles.driverDetails}>
                        <Text style={styles.detailText}>Ime: {selectedDriver.name}</Text>
                        <Text style={styles.detailText}>Prezime: {selectedDriver.surname}</Text>
                        <Text style={styles.detailText}>Broj telefona: {selectedDriver.phone_number}</Text>

                        <TextInput
                            style={styles.input}
                            placeholder="Nova lozinka"
                            secureTextEntry
                            value={newPassword}
                            onChangeText={setNewPassword}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Potvrdi lozinku"
                            secureTextEntry
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                        />

                        <TouchableOpacity
                            onPress={handlePasswordChange}
                            disabled={!newPassword || !confirmPassword || newPassword !== confirmPassword}
                            style={[
                                styles.button,
                                { opacity: !newPassword || !confirmPassword || newPassword !== confirmPassword ? 0.5 : 1 },
                            ]}
                        >
                            <Text style={styles.buttonText}>Promeni lozinku</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9f9f9',
    },
    scrollViewContent: {
        alignItems: 'center',
        padding: 20,
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
    dropdown: {
        width: '100%',
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 5,
        padding: 10,
        marginBottom: 20,
        justifyContent: 'center',
    },
    dropdownText: {
        fontSize: 16,
        textAlign: 'center',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '80%',
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        maxHeight: '50%',
    },
    clientItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        textAlign: 'center',
    },
    driverDetails: {
        marginTop: 20,
        padding: 15,
        backgroundColor: '#ffffff',
        borderRadius: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
        elevation: 3,
        width: '100%',
    },
    detailText: {
        fontSize: 16,
        marginBottom: 10,
        textAlign: 'center',
    },
    input: {
        width: '100%',
        padding: 10,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 5,
        marginBottom: 10,
        textAlign: 'center',
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
    closeButton: {
        padding: 10,
        backgroundColor: '#ff6902',
        borderRadius: 5,
        marginTop: 10,
        alignSelf: 'center',
    },
    closeButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default ViewDriver;
