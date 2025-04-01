import React, { useState, useEffect } from "react";
import { View, Text, TextInput, StyleSheet, FlatList, TouchableOpacity, Alert } from "react-native";
import { useSession} from "../../ctx";
import { useRouter } from 'expo-router';
import Task from "../../componets/task";

const Main = () => {
    const { session, signOut, getTasks, addTask, deleteTask } = useSession();
    const router = useRouter();
    const [task, setTask] = useState('');
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        const loadTasks = async () => {
            if (session?.email) {
                console.log("loading task for email", session.email);
                try {
                    const userTasks = await getTasks(session.email);
                    setTasks(userTasks);
                    console.log("Task Loaded", userTasks);

                } catch (e) {
                    Alert.alert("something went wrong when load the tasks", e.message)
                }

            }
        };
        loadTasks();
    }, [session]);

    const handleAddTask = async () => {
        console.log("handleAddTaks called");
        console.log("Task value: ", task, " Session email: ", session?.email)
        if (task && session?.email) {
            try {
                console.log("adding task on the DB");
                await addTask(session.email, task);
                setTask('');
                const updatedTasks = await getTasks(session.email);
                setTasks(updatedTasks);
            } catch (e) {
                Alert.alert("Ups, Something went wrong to add the Task", e.message)
            }

        } else {
            Alert.alert("Please Fill the data!");
        }
    };

    const handleDeleteTask = async (taskId) => {
        try {
            await deleteTask(taskId);
            const updatedTasks = await getTasks(session.email);
            setTasks(updatedTasks);
        } catch (e) {
            Alert.alert("Error when deleting the task");
        }

    };

    if (!session) {
        return (
            <View style={styles.container}>
                <Text>No se encontró una sesión, por favor inicia sesion o registrate</Text>
                <Button title="Sign In" onPress={() => router.push('/iniciar-sesion')}/>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Bienvenid@, {session.email}!</Text>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Add a task"
                    value={task}
                    onChangeText={setTask}
                />
                <TouchableOpacity style={styles.addButton} onPress={handleAddTask}>
                    <Text style={styles.addButtonText}>Añadir</Text>
                </TouchableOpacity>
            </View>
            <FlatList
                data={tasks}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <Task item={item} handleDeleteTask={handleDeleteTask} />
                )}
            />
            <TouchableOpacity style={styles.signOutButton} onPress={signOut}>
                <Text style={styles.signOutButtonText}>Cerrar Sesión</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: '#000', // Fondo negro
    },
    heading: {
      fontSize: 28,
      fontWeight: 'bold',
      marginBottom: 25,
      color: '#00BFFF', // Azul cielo vibrante
      textAlign: 'center',
      textShadowColor: '#1E90FF',
      textShadowOffset: { width: 2, height: 2 },
      textShadowRadius: 4,
    },
    inputContainer: {
      flexDirection: 'row',
      marginBottom: 20,
    },
    input: {
      flex: 1,
      height: 45,
      borderColor: '#1E90FF', // Azul eléctrico
      borderWidth: 1.5,
      marginRight: 10,
      paddingHorizontal: 12,
      borderRadius: 8,
      backgroundColor: '#111', // Fondo del input
      color: '#fff',
      fontSize: 16,
      shadowColor: '#00BFFF',
      shadowOffset: { width: 1, height: 1 },
      shadowOpacity: 0.4,
      shadowRadius: 3,
    },
    addButton: {
      backgroundColor: '#8A2BE2', // Morado eléctrico
      paddingVertical: 12,
      paddingHorizontal: 18,
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#8A2BE2',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.5,
      shadowRadius: 6,
    },
    addButtonText: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 16,
    },
    signOutButton: {
      backgroundColor: '#DC143C', // Rojo carmesí
      paddingVertical: 14,
      borderRadius: 8,
      marginTop: 30,
      alignItems: 'center',
      shadowColor: '#DC143C',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.6,
      shadowRadius: 6,
    },
    signOutButtonText: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 17,
    },
  });
  

export default Main