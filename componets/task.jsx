import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

const Task = ({ item, handleDeleteTask }) => {
    return (
        <View style={styles.taskItem}>
            <Text style={styles.taskText}>{item.task}</Text>
            <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteTask(item.id)}>
                <Text style={styles.deleteButtonText}>Borrar</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    taskItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        marginBottom: 10,
        backgroundColor: '#fff',
        borderRadius: 5,
        elevation: 2,
    },
    taskText: {
        flex: 1,
        marginRight: 10,
        color: '#333',
    },
    deleteButton: {
        backgroundColor: '#f44336',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 5,
    },
    deleteButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default Task;