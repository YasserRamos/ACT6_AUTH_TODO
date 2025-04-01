import React, { createContext, useState, useContext, useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import { useRouter } from "expo-router";
import * as SQLite from "expo-sqlite";
import * as FileSystem from "expo-file-system";
import { Alert } from "react-native";

const SessionContext = createContext({
    session: null,
    isLoading: true,
    signIn: async () => {},
    signOut: async () => {},
    signUp: async () => {},
    getTasks: async () => [],
    addTask: async () => {},
    deleteTask: async () => {},
});

const openDatabase = async () => {
    if (!(await FileSystem.getInfoAsync(FileSystem.documentDirectory + "SQLite"))
        .exists) {
        console.log("creating directory");
        await FileSystem.makeDirectoryAsync(
            FileSystem.documentDirectory + "SQLite"
        );
    }
    console.log("opening database");
    return SQLite.openDatabaseAsync("users.db");
};

export function SessionProvider({ children }) {
    const [session, setSession] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [db, setDb] = useState(null);
    const router = useRouter();
    useEffect(() => {
        const initialize = async () => {
            try {
                console.log("initializing");
                const database = await openDatabase();
                console.log("Database: ", database);
                setDb(database);


            } catch (error) {
                console.error("Initialization error:", error);
                Alert.alert("something went wrong on DB initialize", error.message);
            } finally {
                setIsLoading(false);
            }
        };

        initialize();

        return () => {
            if (db) {
                const closeDB = async () => {
                    await db.closeAsync()
                }
                closeDB();
            }
        };
    }, []);

    useEffect(() => {
        const start = async () => {
            if (db) {
                await createTables();
                await loadSession();
            }
        }
        start();
    }, [db])

    const createTables = async () => {
        try {
            console.log("Creating users table", db);
            await db.execAsync(`
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY NOT NULL,
                email TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL
            );
     
            CREATE TABLE IF NOT EXISTS tasks (
                id INTEGER PRIMARY KEY NOT NULL,
                userEmail TEXT NOT NULL,
                task TEXT NOT NULL,
                FOREIGN KEY (userEmail) REFERENCES users(email)
            );
        `);
            console.log("Tasks table created");
        } catch (error) {
            console.error("Error creating users and tasks tables", error);
            Alert.alert("Error creating table", error.message);
        }
    };

    const loadSession = async () => {
        try {
            const storedUser = await SecureStore.getItemAsync("user");
            if (storedUser) {
                const parsedUser = JSON.parse(storedUser);
                setSession(parsedUser);
            }
        } catch (error) {
            console.error("Error loading session:", error);
            Alert.alert("Error loading session", error.message);
        }
    };

    const signIn = async (email, password) => {
        try {
            const result = await db.getFirstAsync(
                "SELECT * FROM users WHERE email = ? AND password = ?;",
                [email, password]
            );

            if (result) {
                const userData = { id: result.id, email: result.email };
                await SecureStore.setItemAsync("user", JSON.stringify(userData));
                setSession(userData);
                router.replace("/");
            } else {
                throw new Error("Invalid credentials");
            }
        } catch (error) {
            console.error("Sign-in error:", error);
            throw error;
        }
    };

    const signUp = async (email, password) => {
        try {
            await db.runAsync("INSERT INTO users (email, password) VALUES (?, ?);", [
                email,
                password,
            ]);
            await signIn(email, password);
        } catch (error) {
            console.error("Sign-up error:", error);
            throw error;
        }
    };

    const signOut = async () => {
        try {
            await SecureStore.deleteItemAsync("user");
            setSession(null);
            router.replace("/iniciar-sesion");
        } catch (error) {
            console.error("Sign-out error:", error);
            throw error;
        }
    };

    const getTasks = async (userEmail) => {
        try {
            console.log("getting Task from ", userEmail);
            const tasks = await db.getAllAsync(
                "SELECT * FROM tasks WHERE userEmail = ?;",
                [userEmail]
            );
            console.log("Taks data", tasks);
            return tasks;
        } catch (error) {
            console.error("Error getting tasks:", error);
            Alert.alert("Error getting tasks", error.message);
            return [];
        }
    };

    const addTask = async (userEmail, task) => {
        try {
            console.log("adding to DB");
            await db.runAsync("INSERT INTO tasks (userEmail, task) VALUES (?, ?);", [
                userEmail,
                task,
            ]);
            console.log("Task added successfully");
        } catch (error) {
            Alert.alert("ups, something went wrong, please try again", error.message);
            console.error("Error adding task:", error);
        }
    };

    const deleteTask = async (taskId) => {
        try {
            await db.runAsync("DELETE FROM tasks WHERE id = ?;", [taskId]);
            console.log("Task deleted successfully");
        } catch (error) {
            console.error("Error deleting task:", error);
            Alert.alert("ups, something went wrong on delete task", error.message);
        }
    };

    const value = {
        session,
        isLoading,
        signIn,
        signOut,
        signUp,
        getTasks, // Add getTasks to value
        addTask, // Add addTask to value
        deleteTask, // Add deleteTask to value
    };

    return (
        <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
    );
}

export function useSession() {
    return useContext(SessionContext);
}