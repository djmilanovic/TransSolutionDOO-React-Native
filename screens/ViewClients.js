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
    Image
} from 'react-native';

const ViewClients = () => {
    const [clients, setClients] = useState([]);
    const [selectedClient, setSelectedClient] = useState(null);
    const [clientDetails, setClientDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [detailsLoading, setDetailsLoading] = useState(false);

    useEffect(() => {
        fetchClients();
    }, []);

    const fetchClients = async () => {
        try {
            const response = await fetch(`${config.BASE_URL}/allClients`);
            const data = await response.json();
            setClients(Array.isArray(data.clients) ? data.clients : []);
        } catch (error) {
            console.error('Error fetching clients:', error);
            setClients([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchClientDetails = async (clientId) => {
        setDetailsLoading(true);
        try {
            const response = await fetch(`${config.BASE_URL}/allClientDataById/${clientId}`);
            const data = await response.json();
            if (data.exists) {
                setClientDetails(data.data);
            } else {
                setClientDetails(null);
            }
        } catch (error) {
            console.error('Error fetching client details:', error);
            setClientDetails(null);
        } finally {
            setDetailsLoading(false);
        }
    };

    const selectClient = (client) => {
        setSelectedClient(client);
        setDropdownVisible(false);
        if (client) {
            fetchClientDetails(client.id);
        } else {
            setClientDetails(null);
        }
    };

    return (
        <View style={styles.container}>
            {/* Centered logo */}
            <Image source={require('../assets/transsolutionlogo.png')} style={styles.logo} />

            {/* Centered title */}
            <Text style={styles.title}>Pregled klijenata</Text>

            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <TouchableOpacity style={styles.dropdown} onPress={() => setDropdownVisible(true)}>
                    <Text style={styles.dropdownText}>
                        {selectedClient ? `${selectedClient.name} ${selectedClient.surname}` : 'Izaberi klijenta'}
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
                                <TouchableOpacity onPress={() => selectClient(null)}>
                                    <Text style={styles.clientItem}>Svi klijenti</Text>
                                </TouchableOpacity>
                                {clients.map((client) => (
                                    <TouchableOpacity
                                        key={client.id}
                                        style={styles.clientItem}
                                        onPress={() => selectClient(client)}
                                    >
                                        <Text>{`${client.name} ${client.surname}`}</Text>
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

            {selectedClient && (
                <ScrollView style={styles.clientDetails}>
                    {detailsLoading ? (
                        <ActivityIndicator size="large" color="#0000ff" />
                    ) : clientDetails ? (
                        <>
                            <Text style={styles.detailText}>Ime: {clientDetails.name}</Text>
                            <Text style={styles.detailText}>Prezime: {clientDetails.surname}</Text>
                            <Text style={styles.detailText}>Broj telefona: {clientDetails.phone_number}</Text>
                            <Text style={styles.detailText}>Država: {clientDetails.country}</Text>
                            <Text style={styles.detailText}>Grad: {clientDetails.city}</Text>
                            <Text style={styles.detailText}>Trenutna kasica: {clientDetails.loyalty_bonus_money}</Text>
                        </>
                    ) : (
                        <Text style={styles.detailText}>Nema podataka o klijentu.</Text>
                    )}
                </ScrollView>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f9f9f9',
        alignItems: 'center', // Center align content
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
        width: '100%', // Full width dropdown
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
        textAlign: 'center', // Center align client names
    },
    clientDetails: {
        marginTop: 20,
        padding: 15,
        backgroundColor: '#ffffff',
        borderRadius: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
        elevation: 3,
        width: '100%', // Full width for client details
    },
    detailText: {
        fontSize: 16,
        marginBottom: 10,
        textAlign: 'center',
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

export default ViewClients;
