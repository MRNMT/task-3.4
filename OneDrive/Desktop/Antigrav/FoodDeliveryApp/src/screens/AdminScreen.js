import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert, FlatList } from 'react-native';
import { Text, Input, Button, ListItem, Icon } from 'react-native-elements';
import { FOOD_ITEMS } from '../data/mockData';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from 'react';
import { theme } from '../theme';

// NOTE: In a real app, this would modify the backend.
// Here we are just mocking the "Add" functionality locally for the session/demo.
// To fully satisfy "CRUD", we'd ideally need a mutable data source.
// Since FOOD_ITEMS is a constant in mockData.js, we can't easily "permanently" add to it without a backend service wrapping it.
// I will create a simple internal state to mimic "managed items" for this screen.

const AdminScreen = () => {
    const [items, setItems] = useState(FOOD_ITEMS);
    const [orders, setOrders] = useState([]);
    const [viewMode, setViewMode] = useState('menu');
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        if (viewMode === 'orders') {
            const loadOrders = async () => {
                const ordersStr = await AsyncStorage.getItem('ORDERS');
                if (ordersStr) setOrders(JSON.parse(ordersStr));
            };
            loadOrders();
        }
    }, [viewMode]);
    const [currentItem, setCurrentItem] = useState(null);

    // Form State
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState('');

    const handleEdit = (item) => {
        setCurrentItem(item);
        setName(item.name);
        setPrice(item.price.toString());
        setCategory(item.category);
        setDescription(item.description);
        setImage(item.image);
        setIsEditing(true);
    };

    const handleAddNew = () => {
        setCurrentItem(null);
        setName('');
        setPrice('');
        setCategory('');
        setDescription('');
        setImage('https://via.placeholder.com/150');
        setIsEditing(true);
    };

    const handleSave = () => {
        if (!name || !price || !category) {
            Alert.alert('Error', 'Please fill required fields');
            return;
        }

        const newItem = {
            id: currentItem ? currentItem.id : (Date.now()).toString(),
            name,
            price: parseFloat(price),
            category,
            description,
            image,
        };

        if (currentItem) {
            // Update
            setItems(items.map(i => i.id === currentItem.id ? newItem : i));
        } else {
            // Add
            setItems([...items, newItem]);
        }

        setIsEditing(false);
        Alert.alert('Success', 'Item Saved!');
    };

    const handleDelete = (id) => {
        Alert.alert('Confirm', 'Delete this item?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Delete', onPress: () => setItems(items.filter(i => i.id !== id)) }
        ]);
    };

    if (isEditing) {
        return (
            <ScrollView contentContainerStyle={styles.formContainer}>
                <Text h4 style={styles.headerTitle}>{currentItem ? 'Edit Item' : 'Add New Item'}</Text>
                <Input placeholder="Name" value={name} onChangeText={setName} placeholderTextColor={theme.colors.textPlaceholder} inputStyle={styles.input} />
                <Input placeholder="Price" value={price} onChangeText={setPrice} keyboardType="numeric" placeholderTextColor={theme.colors.textPlaceholder} inputStyle={styles.input} />
                <Input placeholder="Category" value={category} onChangeText={setCategory} placeholderTextColor={theme.colors.textPlaceholder} inputStyle={styles.input} />
                <Input placeholder="Description" value={description} onChangeText={setDescription} placeholderTextColor={theme.colors.textPlaceholder} inputStyle={styles.input} />
                <Input placeholder="Image URL" value={image} onChangeText={setImage} placeholderTextColor={theme.colors.textPlaceholder} inputStyle={styles.input} />

                <View style={styles.formButtons}>
                    <Button title="Save" onPress={handleSave} containerStyle={styles.btn} buttonStyle={{ backgroundColor: theme.colors.primary }} />
                    <Button title="Cancel" type="outline" onPress={() => setIsEditing(false)} containerStyle={styles.btn} buttonStyle={{ borderColor: theme.colors.primary }} titleStyle={{ color: theme.colors.primary }} />
                </View>
            </ScrollView>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text h4 style={styles.headerTitle}>Admin Dashboard</Text>
                <View style={{ flexDirection: 'row' }}>
                    <Button
                        title="Menu"
                        type={viewMode === 'menu' ? 'solid' : 'outline'}
                        onPress={() => setViewMode('menu')}
                        containerStyle={{ marginRight: 5 }}
                        buttonStyle={viewMode === 'menu' ? { backgroundColor: theme.colors.primary } : { borderColor: theme.colors.primary }}
                        titleStyle={viewMode === 'menu' ? {} : { color: theme.colors.primary }}
                    />
                    <Button
                        title="Orders"
                        type={viewMode === 'orders' ? 'solid' : 'outline'}
                        onPress={() => setViewMode('orders')}
                        buttonStyle={viewMode === 'orders' ? { backgroundColor: theme.colors.primary } : { borderColor: theme.colors.primary }}
                        titleStyle={viewMode === 'orders' ? {} : { color: theme.colors.primary }}
                    />
                </View>
            </View>

            {viewMode === 'menu' ? (
                <>
                    <Button title="Add New Item" onPress={handleAddNew} containerStyle={{ marginBottom: 10 }} buttonStyle={{ backgroundColor: theme.colors.primary }} />
                    <FlatList
                        data={items}
                        keyExtractor={item => item.id}
                        renderItem={({ item }) => (
                            <ListItem bottomDivider containerStyle={styles.listItem}>
                                <ListItem.Content>
                                    <ListItem.Title style={styles.itemTitle}>{item.name}</ListItem.Title>
                                    <ListItem.Subtitle style={styles.itemSubtitle}>R{item.price.toFixed(2)}</ListItem.Subtitle>
                                </ListItem.Content>
                                <Icon name="pencil" type="font-awesome" color={theme.colors.textPrimary} onPress={() => handleEdit(item)} />
                                <Icon name="trash" type="font-awesome" color={theme.colors.error} onPress={() => handleDelete(item.id)} containerStyle={{ marginLeft: 15 }} />
                            </ListItem>
                        )}
                    />
                </>
            ) : (
                <FlatList
                    data={orders}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => (
                        <ListItem bottomDivider containerStyle={styles.listItem}>
                            <ListItem.Content>
                                <ListItem.Title style={styles.itemTitle}>Order #{item.id.slice(-4)}</ListItem.Title>
                                <ListItem.Subtitle style={styles.itemSubtitle}>{item.user} - R{item.total.toFixed(2)}</ListItem.Subtitle>
                                <Text style={{ color: theme.colors.textSecondary }}>{new Date(item.date).toLocaleDateString()}</Text>
                                <Text style={{ color: theme.colors.textPrimary }}>Status: Pending</Text>
                            </ListItem.Content>
                        </ListItem>
                    )}
                    ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 20, color: theme.colors.textSecondary }}>No orders yet.</Text>}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: theme.colors.background,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        paddingHorizontal: 10,
    },
    headerTitle: {
        color: theme.colors.textPrimary,
    },
    formContainer: {
        padding: 20,
        backgroundColor: theme.colors.background,
        flexGrow: 1,
    },
    formButtons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 20,
    },
    btn: {
        width: '45%',
    },
    input: {
        color: theme.colors.textPrimary,
    },
    listItem: {
        backgroundColor: theme.colors.cardBackground,
        borderColor: theme.colors.border,
    },
    itemTitle: {
        color: theme.colors.textPrimary,
    },
    itemSubtitle: {
        color: theme.colors.primary,
    },
});

export default AdminScreen;
