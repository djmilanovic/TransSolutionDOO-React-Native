import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Modal, ScrollView, Platform, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import config from '../config/config';
import { format, parseISO } from 'date-fns';
import { srLatn } from 'date-fns/locale';

const OrderFilter = () => {
    const [selectedClient, setSelectedClient] = useState(null);
    const [selectedDriver, setSelectedDriver] = useState(null);
    const [clients, setClients] = useState([]);
    const [drivers, setDrivers] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [driverDropdownVisible, setDriverDropdownVisible] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [userId, setUserId] = useState(null);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [showStartDatePicker, setShowStartDatePicker] = useState(false);
    const [showEndDatePicker, setShowEndDatePicker] = useState(false);

    const formatDate = (dateString) => {
        try {
            const date = parseISO(dateString);
            return format(date, 'd. MMMM yyyy.', { locale: srLatn });
        } catch (error) {
            console.error("Date parsing error:", error);
            return "Invalid Date";
        }
    };

    useEffect(() => {
        const initializeUser = async () => {
            try {
                const role = await AsyncStorage.getItem('userRole');
                const id = await AsyncStorage.getItem('userId');
                if (role === 'admin') {
                    setIsAdmin(true);
                    fetchDrivers();
                } else {
                    setUserId(id);
                }
            } catch (error) {
                console.error("Error retrieving user role or ID from AsyncStorage:", error);
            }
        };

        initializeUser();
        fetchClients();
    }, []);

    const fetchClients = async () => {
        try {
            const response = await fetch(`${config.BASE_URL}/allClients`);
            const data = await response.json();
            setClients(data.clients);
        } catch (error) {
            console.error('Error fetching clients:', error);
        }
    };

    const fetchDrivers = async () => {
        try {
            const response = await fetch(`${config.BASE_URL}/drivers`);
            const data = await response.json();
            setDrivers(data.data);
        } catch (error) {
            console.error('Error fetching drivers:', error);
        }
    };

    const handleSearch = async () => {
        setLoading(true);
        try {
            const url = new URL(`${config.BASE_URL}/getOrders`);
            if (isAdmin) {
                if (selectedClient) url.searchParams.append("clientId", selectedClient.id);
                if (selectedDriver) url.searchParams.append("driverId", selectedDriver.id);
            } else {
                if (selectedClient) url.searchParams.append("clientId", selectedClient.id);
                url.searchParams.append("driverId", userId);
            }
            if (startDate) url.searchParams.append("startDate", startDate.toISOString());
            if (endDate) url.searchParams.append("endDate", endDate.toISOString());
            const response = await fetch(url.toString());
            const data = await response.json();
            const sortedOrders = data.orders.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
            setOrders(sortedOrders);
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const resetFilters = () => {
        setSelectedClient(null);
        setSelectedDriver(null);
        setStartDate(null);
        setEndDate(null);
    };

    const selectClient = (client) => {
        setSelectedClient(client);
        setDropdownVisible(false);
    };

    const selectDriver = (driver) => {
        setSelectedDriver(driver);
        setDriverDropdownVisible(false);
    };

    const onStartDateChange = (event, selectedDate) => {
        setShowStartDatePicker(false);
        if (selectedDate) setStartDate(selectedDate);
    };

    const onEndDateChange = (event, selectedDate) => {
        setShowEndDatePicker(false);
        if (selectedDate) setEndDate(selectedDate);
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Image source={require('../assets/transsolutionlogo.png')} style={styles.logo} />
            <Text style={styles.title}>Pregled porudžbina</Text>

            {/* Client Dropdown */}
            <TouchableOpacity style={styles.dropdown} onPress={() => setDropdownVisible(true)}>
                <Text style={styles.dropdownText}>
                    {selectedClient ? `${selectedClient.name} ${selectedClient.surname}` : 'Izaberi klijenta'}
                </Text>
            </TouchableOpacity>
            <Modal visible={dropdownVisible} transparent={true} animationType="slide" onRequestClose={() => setDropdownVisible(false)}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <ScrollView>
                            <TouchableOpacity onPress={() => selectClient(null)}>
                                <Text style={styles.clientItem}>Svi klijenti</Text>
                            </TouchableOpacity>
                            {clients.map((client) => (
                                <TouchableOpacity key={client.id} style={styles.clientItem} onPress={() => selectClient(client)}>
                                    <Text>{`${client.name} ${client.surname}`}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                        <TouchableOpacity onPress={() => setDropdownVisible(false)} style={styles.closeModalButton}>
                            <Text style={styles.closeModalButtonText}>Zatvori</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Drivers Dropdown - Only visible for Admin */}
            {isAdmin && (
                <TouchableOpacity style={styles.dropdown} onPress={() => setDriverDropdownVisible(true)}>
                    <Text style={styles.dropdownText}>
                        {selectedDriver ? `${selectedDriver.name} ${selectedDriver.surname}` : 'Izaberi vozaca'}
                    </Text>
                </TouchableOpacity>
            )}
            <Modal visible={driverDropdownVisible} transparent={true} animationType="slide" onRequestClose={() => setDriverDropdownVisible(false)}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <ScrollView>
                            <TouchableOpacity onPress={() => selectDriver(null)}>
                                <Text style={styles.clientItem}>Svi vozaci</Text>
                            </TouchableOpacity>
                            {drivers.map((driver) => (
                                <TouchableOpacity key={driver.id} style={styles.clientItem} onPress={() => selectDriver(driver)}>
                                    <Text>{`${driver.name} ${driver.surname}`}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                        <TouchableOpacity onPress={() => setDriverDropdownVisible(false)} style={styles.closeModalButton}>
                            <Text style={styles.closeModalButtonText}>Zatvori</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Date Pickers */}
            <TouchableOpacity onPress={() => setShowStartDatePicker(true)} style={styles.datePicker}>
                <Text>{startDate ? `Od: ${format(startDate, 'd. MMMM yyyy.', { locale: srLatn })}` : 'Od: Izaberi datum'}</Text>
            </TouchableOpacity>
            {showStartDatePicker && (
                <DateTimePicker value={startDate || new Date()} mode="date" display={Platform.OS === 'ios' ? 'inline' : 'default'} onChange={onStartDateChange} />
            )}

            <TouchableOpacity onPress={() => setShowEndDatePicker(true)} style={styles.datePicker}>
                <Text>{endDate ? `Do: ${format(endDate, 'd. MMMM yyyy.', { locale: srLatn })}` : 'Do: Izaberi datum'}</Text>
            </TouchableOpacity>
            {showEndDatePicker && (
                <DateTimePicker value={endDate || new Date()} mode="date" display={Platform.OS === 'ios' ? 'inline' : 'default'} onChange={onEndDateChange} />
            )}

            {/* Resetuj Datume Button */}
            <TouchableOpacity style={styles.resetButton} onPress={resetFilters}>
                <Text style={styles.resetButtonText}>Resetuj pretragu</Text>
            </TouchableOpacity>

            {/* Pretraga Button */}
            <TouchableOpacity style={styles.button} onPress={handleSearch} disabled={loading}>
                <Text style={styles.buttonText}>Pretraga</Text>
            </TouchableOpacity>

            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                orders.map((item, index) => (
                    <View key={index} style={styles.orderItem}>
                        <Text>Porudžbina: {item.description}</Text>
                        <Text>Vozac: {item.username}</Text>
                        <Text>Cena: {item.price} €</Text>
                        <Text>Datum: {formatDate(item.created_at)}</Text>
                        <Text>Iskorišćena kasica: {item.discount_used ? "Da" : "Ne"}</Text>
                        <Text>Novac iz kasice: {item.discount_price} €</Text>
                    </View>
                ))
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
    },
    logo: {
        width: 200,
        height: 100,
        resizeMode: 'contain',
        alignSelf: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
        textAlign: 'center',
        fontWeight:'bold',
    },
    dropdown: {
        borderWidth: 1,
        borderColor: 'gray',
        padding: 10,
        borderRadius: 5,
        marginBottom: 15,
    },
    dropdownText: {
        fontSize: 16,
    },
    datePicker: {
        borderWidth: 1,
        borderColor: 'gray',
        padding: 10,
        borderRadius: 5,
        marginBottom: 15,
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
    resetButton: {
        backgroundColor: 'gray',
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
    resetButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
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
    },
    orderItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        marginTop: 10,
    },
    closeModalButton: {
        padding: 10,
        backgroundColor: '#ff6902',
        borderRadius: 5,
        marginTop: 10,
        alignSelf: 'center',
    },
    closeModalButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default OrderFilter;
