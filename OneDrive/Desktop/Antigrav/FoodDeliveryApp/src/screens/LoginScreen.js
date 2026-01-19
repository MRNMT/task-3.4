import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { Input, Text, Icon, CheckBox } from 'react-native-elements';
import { LinearGradient } from 'expo-linear-gradient';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearError } from '../redux/authSlice';

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);

    const dispatch = useDispatch();
    const { isLoading, error, isAuthenticated } = useSelector((state) => state.auth);

    useEffect(() => {
        if (error) {
            Alert.alert('Login Failed', error);
            dispatch(clearError());
        }
    }, [error, dispatch]);

    const handleLogin = () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }
        dispatch(loginUser({ email, password }));
    };

    return (
        <View style={styles.container}>
            <Text h2 style={styles.title}>Crave & Click</Text>
            <Text style={styles.subtitle}>Log In</Text>

            <View style={styles.inputContainer}>
                <Input
                    placeholder="Enter your Email"
                    placeholderTextColor="#888"
                    leftIcon={<Icon name="mail" type="feather" color="#888" size={20} />}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    inputStyle={styles.input}
                    inputContainerStyle={styles.inputField}
                />
                <Input
                    placeholder="Password"
                    placeholderTextColor="#888"
                    leftIcon={<Icon name="lock" type="feather" color="#888" size={20} />}
                    onChangeText={setPassword}
                    secureTextEntry
                    inputStyle={styles.input}
                    inputContainerStyle={styles.inputField}
                />
            </View>

            <View style={styles.optionsContainer}>
                <CheckBox
                    title="Remember Me"
                    checked={rememberMe}
                    onPress={() => setRememberMe(!rememberMe)}
                    containerStyle={styles.checkboxContainer}
                    textStyle={styles.checkboxText}
                    checkedColor="#FFA726"
                />
                <TouchableOpacity onPress={() => Alert.alert('Forgot Password', 'Reset functionality not implemented yet')}>
                    <Text style={styles.forgotText}>Forgot Password?</Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={handleLogin} disabled={isLoading}>
                <LinearGradient
                    colors={['#FF6F00', '#FFA726']}
                    style={styles.button}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                >
                    <Text style={styles.buttonText}>{isLoading ? 'Logging In...' : 'Log In'}</Text>
                </LinearGradient>
            </TouchableOpacity>

            <View style={styles.socialContainer}>
                <TouchableOpacity style={styles.socialIcon}>
                    <Icon name="google" type="font-awesome" color="#DB4437" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.socialIcon}>
                    <Icon name="facebook" type="font-awesome" color="#4267B2" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.socialIcon}>
                    <Icon name="apple" type="font-awesome" color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.socialIcon}>
                    <Icon name="twitter" type="font-awesome" color="#1DA1F2" />
                </TouchableOpacity>
            </View>

            <View style={styles.footer}>
                <Text style={styles.footerText}>Do you have an account? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                    <Text style={styles.linkText}>Register</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#121212',
    },
    title: {
        textAlign: 'center',
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
    subtitle: {
        textAlign: 'center',
        color: '#CCCCCC',
        fontSize: 18,
        marginBottom: 30,
        marginTop: 10,
    },
    inputContainer: {
        marginBottom: 10,
    },
    input: {
        color: '#FFFFFF',
    },
    inputField: {
        borderBottomColor: '#555',
    },
    optionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    checkboxContainer: {
        backgroundColor: 'transparent',
        borderWidth: 0,
        padding: 0,
        marginLeft: 0,
    },
    checkboxText: {
        color: '#CCCCCC',
        fontWeight: 'normal',
    },
    forgotText: {
        color: '#CCCCCC',
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

export default LoginScreen;
