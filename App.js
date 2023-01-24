import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Platform,
  StatusBar,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";
import { theme } from "./color";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Octicons } from "@expo/vector-icons";

const STORAGE_KEY = "@toDo";

export default function App() {
  const [working, setWorkig] = useState(true);
  const [text, setText] = useState("");
  const [todo, setTodo] = useState({});
  useEffect(() => {
    loadToDo();
  }, []);

  const work = () => setWorkig(true);
  const travel = () => setWorkig(false);
  const textHandle = (payload) => setText(payload);

  const saveTodo = async (toSave) => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  };
  const loadToDo = async () => {
    const load = await AsyncStorage.getItem(STORAGE_KEY);
    setTodo(JSON.parse(load));
  };
  const todoHandle = async () => {
    if (text === "") {
      return;
    } else {
      //later
      const newTodo = {
        ...todo,
        [Date.now()]: { text, working },
      };
      setTodo(newTodo);
      await saveTodo(newTodo);
      setText("");
    }
  };

  const deleteToDo = async (id) => {
    const newTodo = { ...todo };
    delete newTodo[id];
    setTodo(newTodo);
    await saveTodo(newTodo);
  };
  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor={"transparent"} />
      {/* Headers */}
      <View style={styles.header}>
        <TouchableOpacity onPress={work}>
          <Text
            style={{
              ...styles.btnText,
              color: working ? "#fff" : theme.garyLight,
            }}
          >
            Work
          </Text>
        </TouchableOpacity>
        {/* ........................................... */}
        <TouchableOpacity onPress={travel}>
          <Text
            style={{
              ...styles.btnText,
              color: !working ? "#fff" : theme.garyLight,
            }}
          >
            Task
          </Text>
        </TouchableOpacity>
      </View>
      {/* Input */}
      <View marginTop={24}>
        <TextInput
          onSubmitEditing={todoHandle}
          onChangeText={textHandle}
          value={text}
          returnKeyType="done"
          placeholder={working ? "Task To Do" : "Where You want To Go?"}
          style={styles.input}
        />
      </View>
      {/* List of Task or Work */}
      <ScrollView showsVerticalScrollIndicator={false}>
        {todo &&
          Object.keys(todo).map((item) => {
            return todo[item].working === working ? (
              <View
                style={styles.todo}
                borderColor={todo[item].working ? theme.blue : theme.green}
                key={item}
              >
                <Text style={styles.todoText}>{todo[item].text}</Text>
                <TouchableOpacity onPress={() => deleteToDo(item)}>
                  <Octicons
                    style={styles.todoIcon}
                    name="x-circle-fill"
                    size={20}
                    color={theme.garyLight}
                  />
                </TouchableOpacity>
              </View>
            ) : null;
          })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.bg,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 72,
  },
  btnText: {
    fontSize: 32,
    fontWeight: "600",
  },
  input: {
    backgroundColor: theme.white,
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 10000000,
    fontSize: 20,
    marginBottom: 24,
  },
  todo: {
    backgroundColor: theme.grayDark,
    marginBottom: 10,
    paddingVertical: 24,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderColor: theme.green,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  todoText: {
    color: theme.white,
    fontSize: 18,
  },
});
