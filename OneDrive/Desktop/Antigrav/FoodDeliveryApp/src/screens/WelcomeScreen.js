import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Button, Text } from 'react-native-elements';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../contexts/ThemeContext'; // CHANGED: Import useTheme hook

const WelcomeScreen = ({ navigation }) => {
    const { theme } = useTheme(); // Now this will work

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <View style={styles.content}>
                <Text h1 style={[styles.title, { color: theme.colors.textPrimary }]}>Crave & Click</Text>
                <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>Delicious food delivered to your doorstep.</Text>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                        <LinearGradient
                            colors={[theme.colors.gradientStart, theme.colors.gradientEnd]}
                            style={styles.gradientButton}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                        >
                            <Text style={[styles.buttonText, { color: theme.colors.textPrimary }]}>Login</Text>
                        </LinearGradient>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        onPress={() => navigation.navigate('Register')} 
                        style={[styles.outlineButtonContainer, { borderColor: theme.colors.primary }]}
                    >
                        <Text style={[styles.outlineButtonText, { color: theme.colors.primary }]}>Create Account</Text>
                    </TouchableOpacity>

                    <Button
                        title="Continue as Guest"
                        type="clear"
                        titleStyle={[styles.guestButtonTitle, { color: theme.colors.textSecondary }]}
                        onPress={() => navigation.navigate('Home')}
                    />
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    content: {
        alignItems: 'center',
    },
    title: {
        marginBottom: 10,
        textAlign: 'center',
    },
    subtitle: {
        marginBottom: 60,
        fontSize: 18,
        textAlign: 'center',
    },
    buttonContainer: {
        width: '100%',
        paddingHorizontal: 20,
    },
    gradientButton: {
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 20,
    },
    buttonText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    outlineButtonContainer: {
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 20,
        borderWidth: 1,
        backgroundColor: 'transparent',
    },
    outlineButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    guestButtonTitle: {
        // color will be applied inline
    },
});

export default WelcomeScreen;