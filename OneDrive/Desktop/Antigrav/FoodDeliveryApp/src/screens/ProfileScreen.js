import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Input, Button, Text, Icon } from 'react-native-elements';
import { useDispatch, useSelector } from 'react-redux';
import { AuthService } from '../services/AuthService';
import { checkAuthStatus } from '../redux/authSlice';
import { theme } from '../theme';

const ProfileScreen = ({ navigation }) => {
    const { user } = useSelector(state => state.auth);
    const dispatch = useDispatch();

    const [formData, setFormData] = useState({
        name: '',
        surname: '',
        contact: '',
        address: '',
        email: '',
        cardNumber: '',
    });

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                surname: user.surname || '',
                contact: user.contact || '',
                address: user.address || '',
                email: user.email || '',
                cardNumber: user.cardNumber || '',
            });
        }
    }, [user]);

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleUpdate_Profile = async () => {
        try {
            await AuthService.updateProfile(formData);
            dispatch(checkAuthStatus()); // Refresh redux state
            Alert.alert('Success', 'Profile Updated Successfully');
        } catch (error) {
            Alert.alert('Error', error.message);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text h4 style={styles.header}>My Profile</Text>

            <Input
                label="First Name"
                placeholder="First Name"
                placeholderTextColor={theme.colors.textPlaceholder}
                value={formData.name}
                onChangeText={(val) => handleChange('name', val)}
                leftIcon={<Icon name="user" type="feather" color={theme.colors.textSecondary} size={20} />}
                inputStyle={styles.input}
                inputContainerStyle={styles.inputField}
                labelStyle={styles.label}
            />
            <Input
                label="Last Name"
                placeholder="Last Name"
                placeholderTextColor={theme.colors.textPlaceholder}
                value={formData.surname}
                onChangeText={(val) => handleChange('surname', val)}
                leftIcon={<Icon name="user" type="feather" color={theme.colors.textSecondary} size={20} />}
                inputStyle={styles.input}
                inputContainerStyle={styles.inputField}
                labelStyle={styles.label}
            />
            <Input
                label="Email"
                value={formData.email}
                editable={false}
                leftIcon={<Icon name="mail" type="feather" color={theme.colors.textSecondary} size={20} />}
                inputStyle={[styles.input, { opacity: 0.7 }]}
                inputContainerStyle={styles.inputField}
                labelStyle={styles.label}
            />
            <Input
                label="Contact Number"
                placeholder="Contact Number"
                placeholderTextColor={theme.colors.textPlaceholder}
                value={formData.contact}
                keyboardType="phone-pad"
                onChangeText={(val) => handleChange('contact', val)}
                leftIcon={<Icon name="phone" type="feather" color={theme.colors.textSecondary} size={20} />}
                inputStyle={styles.input}
                inputContainerStyle={styles.inputField}
                labelStyle={styles.label}
            />
            <Input
                label="Address"
                placeholder="Address"
                placeholderTextColor={theme.colors.textPlaceholder}
                value={formData.address}
                onChangeText={(val) => handleChange('address', val)}
                leftIcon={<Icon name="home" type="feather" color={theme.colors.textSecondary} size={20} />}
                inputStyle={styles.input}
                inputContainerStyle={styles.inputField}
                labelStyle={styles.label}
            />
            <Input
                label="Card Number"
                placeholder="Card Number"
                placeholderTextColor={theme.colors.textPlaceholder}
                value={formData.cardNumber}
                keyboardType="numeric"
                onChangeText={(val) => handleChange('cardNumber', val)}
                leftIcon={<Icon name="credit-card" type="feather" color={theme.colors.textSecondary} size={20} />}
                inputStyle={styles.input}
                inputContainerStyle={styles.inputField}
                labelStyle={styles.label}
            />

            <Button
                title="Update Profile"
                onPress={handleUpdate_Profile}
                containerStyle={styles.btn}
                buttonStyle={{ backgroundColor: theme.colors.primary }}
            />

            <View style={styles.adminSection}>
                <Text h5 style={styles.adminTitle}>Admin Access</Text>
                <Button
                    title="Go to Admin Dashboard"
                    type="outline"
                    onPress={() => navigation.navigate('Admin')}
                    containerStyle={styles.btn}
                    buttonStyle={{ borderColor: theme.colors.primary }}
                    titleStyle={{ color: theme.colors.primary }}
                />
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: theme.colors.background,
        flexGrow: 1,
    },
    header: {
        textAlign: 'center',
        marginBottom: 20,
        color: theme.colors.textPrimary,
    },
    btn: {
        marginVertical: 10,
    },
    adminSection: {
        marginTop: 40,
        borderTopWidth: 1,
        borderTopColor: theme.colors.border,
        paddingTop: 20,
        alignItems: 'center',
    },
    adminTitle: {
        color: theme.colors.textPrimary,
        marginBottom: 10,
    },
    input: {
        color: theme.colors.textPrimary,
    },
    inputField: {
        borderBottomColor: theme.colors.inputBorder,
    },
    label: {
        color: theme.colors.textSecondary,
    }
});

export default ProfileScreen;
