import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert, FlatList, Image, TouchableOpacity, TextInput, Keyboard, TouchableWithoutFeedback } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {jwtDecode} from 'jwt-decode';
import config from '../config/config';
import { format, parseISO } from 'date-fns';
import { srLatn } from 'date-fns/locale';

const ClientInfo = ({ route, navigation }) => {
    const { client } = route.params;
    const [orderDescription, setOrderDescription] = useState('');
    const [price, setPrice] = useState('');
    const [userId, setUserId] = useState(null);
    const [userRole, setUserRole] = useState('');
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);

    // Fetch user role and ID from token and set it up on component mount
    useEffect(() => {
        const initializeUser = async () => {
            try {
                const token = await AsyncStorage.getItem('token');
                if (token) {
                    const decodedToken = jwtDecode(token);
                    setUserId(decodedToken.id);
                    setUserRole(decodedToken.role);
                }
            } catch (error) {
                console.error('Error decoding token:', error);
                Alert.alert('Error', 'Could not retrieve user ID');
            }
        };

        initializeUser();
    }, []);

    // Call fetchOrders only when userRole and userId are set
    useEffect(() => {
        if (userRole && userId) {
            fetchOrders();
        }
    }, [userRole, userId]);

    const formatDate = (dateString) => {
        try {
            const date = parseISO(dateString);
            return format(date, 'd. MMMM yyyy.', { locale: srLatn });
        } catch (error) {
            console.error("Date parsing error:", error);
            return "Invalid Date";
        }
    };

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const url = new URL(`${config.BASE_URL}/getOrders`);

            // Append parameters based on user role
            if (userRole === 'admin') {
                url.searchParams.append("clientId", client.data.id);
            } else if (userRole === 'driver') {
                url.searchParams.append("clientId", client.data.id);
                url.searchParams.append("driverId", userId);
            }

            // Debug log to confirm the final URL with parameters
            console.log("Final URL with search params:", url.toString());

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

    const handleCreateOrder = async () => {
        if (!orderDescription || !price) {
            Alert.alert('Input Error', 'Molim Vas upišite opis porudžbine ili cenu.');
            return;
        }

        let finalPrice = parseFloat(price);
        let useBonusMoney = false;

        if (client?.data?.loyalty_bonus_money > 0) {
            Alert.alert(
                'Iskoristiti kasicu?',
                'Da li želite da iskoristite vašu kasicu?',
                [
                    {
                        text: 'Ne',
                        onPress: () => {
                            useBonusMoney = false;
                            createOrder(finalPrice, useBonusMoney);
                        },
                        style: 'cancel',
                    },
                    {
                        text: 'Da',
                        onPress: () => {
                            finalPrice = Math.max(0, finalPrice - client.data.loyalty_bonus_money);
                            useBonusMoney = true;
                            createOrder(finalPrice, useBonusMoney);
                        },
                    },
                ]
            );
        } else {
            createOrder(finalPrice, useBonusMoney);
        }
    };

    const createOrder = async (finalPrice, useBonusMoney) => {
        try {
            const response = await fetch(`${config.BASE_URL}/orders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    client_id: client.data.id,
                    user_id: userId,
                    order_description: orderDescription,
                    price: finalPrice,
                    useBonusMoney: useBonusMoney,
                    loyalty_bonus_money: client.data.loyalty_bonus_money,
                }),
            });

            const result = await response.json();

            if (result.success) {
                Alert.alert('Uspeh!', 'Porudžbina je napravljena!');
                navigation.navigate('Home');
            } else {
                Alert.alert('Greška', 'Došlo je do greške prilikom registracije.');
            }
        } catch (error) {
            console.error('Error:', error);
            Alert.alert('Greška', 'Greška prilikom kreiranja porudžbine.');
        }
    };

    return (
        <FlatList
            ListHeaderComponent={
                <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                    <View style={styles.container}>
                        <Image source={require('../assets/transsolutionlogo.png')} style={styles.logo} />
                        <View style={styles.divider} />
                        <Text style={styles.title}>Informacije o klijentu</Text>
                        <Text style={styles.clientInfo}>
                            Ime i prezime: {client?.data?.name || 'Nije dostupno'} {client?.data?.surname || 'Nije dostupno'}
                        </Text>
                        <Text style={styles.clientInfo}>
                            Trenutna kasica: {client?.data?.loyalty_bonus_money || 'Nije dostupno'}
                        </Text>
                        <View style={styles.divider} />
                        <Text style={styles.title1}>Nova porudžbina</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Detalji paketa"
                            value={orderDescription}
                            onChangeText={setOrderDescription}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Cena"
                            keyboardType="numeric"
                            value={price}
                            onChangeText={setPrice}
                        />
                        <TouchableOpacity style={styles.button} onPress={handleCreateOrder}>
                            <Text style={styles.buttonText}>Napravi porudzbinu</Text>
                        </TouchableOpacity>
                        <View style={styles.divider} />
                        <Text style={styles.title1}>Porudžbine</Text>
                        {loading && <ActivityIndicator size="large" color="#0000ff" />}
                    </View>
                </TouchableWithoutFeedback>
            }
            data={orders}
            keyExtractor={(item, index) => (item.id ? item.id.toString() : index.toString())}
            renderItem={({ item }) => (
                <View style={styles.orderItem}>
                    <Text>Porudžbina: {item.description}</Text>
                    <Text>Vozac: {item.username}</Text>
                    <Text>Cena: {item.price} €</Text>
                    <Text>Datum: {formatDate(item.created_at)}</Text>
                    <Text>Iskorišćena kasica: {item.discount_used ? 'Da' : 'Ne'}</Text>
                    <Text>Novac iz kasice: {item.discount_price} €</Text>
                </View>
            )}
            contentContainerStyle={styles.scrollContainer}
        />
    );
};

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
    },
    container: {
        justifyContent: 'flex-start',
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
        marginBottom: 10,
        textAlign: 'center',
    },
    title1: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        marginTop: 30,
        textAlign: 'center',
    },
    divider: {
        width: '100%',
        height: 1,
        backgroundColor: '#ccc',
        marginVertical: 15,
    },
    input: {
        width: '80%',
        padding: 10,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        backgroundColor: '#fff',
    },
    orderItem: {
        marginTop: 10,
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
    },
    clientInfo: {
        fontSize: 16,
        marginBottom: 1,
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
        marginBottom: 20,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default ClientInfo;
