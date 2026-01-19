import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { Input, Text, Icon } from 'react-native-elements';
import { LinearGradient } from 'expo-linear-gradient';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, clearError } from '../redux/authSlice';

const RegisterScreen = ({ navigation }) => {
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [contact, setContact] = useState('');
    const [address, setAddress] = useState('');


    const dispatch = useDispatch();
    const { isLoading, error } = useSelector((state) => state.auth);

    useEffect(() => {
        if (error) {
            Alert.alert('Registration Failed', error);
            dispatch(clearError());
        }
    }, [error, dispatch]);

    const handleRegister = () => {
        if (!name || !surname || !email || !password || !contact || !address) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        const userData = {
            name,
            surname,
            email,
            password,
            contact,
            address,

        };

        dispatch(registerUser(userData));
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text h4 style={styles.title}>Create an account</Text>

            <View style={styles.inputContainer}>
                <Input
                    placeholder="First Name"
                    placeholderTextColor="#888"
                    inputStyle={styles.input}
                    inputContainerStyle={styles.inputField}
                    onChangeText={setName}
                    leftIcon={<Icon name="user" type="feather" color="#888" size={20} />}
                />
                <Input
                    placeholder="Last Name"
                    placeholderTextColor="#888"
                    inputStyle={styles.input}
                    inputContainerStyle={styles.inputField}
                    onChangeText={setSurname}
                    leftIcon={<Icon name="user" type="feather" color="#888" size={20} />}
                />
                <Input
                    placeholder="Email Address"
                    placeholderTextColor="#888"
                    autoCapitalize="none"
                    keyboardType="email-address"
                    inputStyle={styles.input}
                    inputContainerStyle={styles.inputField}
                    onChangeText={setEmail}
                    leftIcon={<Icon name="mail" type="feather" color="#888" size={20} />}
                />
                <Input
                    placeholder="Password"
                    placeholderTextColor="#888"
                    secureTextEntry
                    inputStyle={styles.input}
                    inputContainerStyle={styles.inputField}
                    onChangeText={setPassword}
                    leftIcon={<Icon name="lock" type="feather" color="#888" size={20} />}
                />
                <Input
                    placeholder="Contact Number"
                    placeholderTextColor="#888"
                    keyboardType="phone-pad"
                    inputStyle={styles.input}
                    inputContainerStyle={styles.inputField}
                    onChangeText={setContact}
                    leftIcon={<Icon name="phone" type="feather" color="#888" size={20} />}
                />
                <Input
                    placeholder="Address"
                    placeholderTextColor="#888"
                    inputStyle={styles.input}
                    inputContainerStyle={styles.inputField}
                    onChangeText={setAddress}
                    leftIcon={<Icon name="home" type="feather" color="#888" size={20} />}
                />

            </View>

            <TouchableOpacity onPress={handleRegister} disabled={isLoading}>
                <LinearGradient
                    colors={['#FF6F00', '#FFA726']}
                    style={styles.button}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                >
                    <Text style={styles.buttonText}>{isLoading ? 'Registering...' : 'Register'}</Text>
                </LinearGradient>
            </TouchableOpacity>

            <View style={styles.socialContainer}>
                {/* Social Login Icons - Placeholder for Images/Icons */}
                <TouchableOpacity style={styles.socialIcon}>
                    <Icon name="google" type="font-awesome" color="#DB4437" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.socialIcon}>
                    <Icon name="facebook" type="font-awesome" color="#4267B2" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.socialIcon}>
                    <Icon name="apple" type="font-awesome" color="#fff" />
                </TouchableOpacity>
                {/* Unidentified provider placeholder */}
                <TouchableOpacity style={styles.socialIcon}>
                    <Icon name="twitter" type="font-awesome" color="#1DA1F2" />
                </TouchableOpacity>
            </View>

            <View style={styles.footer}>
                <Text style={styles.footerText}>Do you have an account? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                    <Text style={styles.linkText}>Log in</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#121212',
        flexGrow: 1,
        justifyContent: 'center',
    },
    title: {
        textAlign: 'center',
        marginBottom: 30,
        color: '#FFFFFF',
    },
    inputContainer: {
        marginBottom: 20,
    },
    input: {
        color: '#FFFFFF',
    },
    inputField: {
        borderBottomColor: '#555',
    },
    button: {
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    socialContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginVertical: 30,
    },
    socialIcon: {
        marginHorizontal: 15,
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#1E1E1E',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#333',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    footerText: {
        color: '#CCCCCC',
        fontSize: 16,
    },
    linkText: {
        color: '#FFA726',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default RegisterScreen;
