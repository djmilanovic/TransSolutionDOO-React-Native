import React, { useState, useRef } from 'react';
import { Camera, CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import { Button, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import config from '../config/config';

export default function QRScanner() {
    const [permission, requestPermission] = useCameraPermissions();
    const navigation = useNavigation();
    const hasNavigated = useRef(false); // Ref to prevent multiple navigations

    if (!permission) {
        return <View />;
    }

    if (!permission.granted) {
        return (
            <View style={styles.container}>
                <Text style={styles.message}>We need your permission to show the camera</Text>
                <Button onPress={requestPermission} title="Grant Permission" />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <CameraView
                style={StyleSheet.absoluteFillObject}
                facing="back"
                onBarcodeScanned={async ({ data }) => {
                    // Prevent navigation if already in progress
                    if (hasNavigated.current) return;

                    hasNavigated.current = true; // Set flag to prevent multiple navigations

                    try {
                        const response = await fetch(`${config.BASE_URL}/clients/${data}`);
                        const clientData = await response.json();

                        setTimeout(() => {
                            if (clientData.exists) {
                                navigation.replace('ClientInfo', { client: clientData });
                            } else {
                                navigation.replace('AddClient', { scannedData: data });
                            }
                        }, 300); // Small delay for smoother transition
                    } catch (error) {
                        console.error("Error fetching client data:", error);
                        hasNavigated.current = false; // Reset navigation guard on error
                    }
                }}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    message: {
        textAlign: 'center',
        paddingBottom: 10,
    },
});
