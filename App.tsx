import 'intl-pluralrules';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TodoList from './src/screens/TodoList';
import { I18nextProvider } from 'react-i18next';
import i18n from './src/i18n/i18n';
import Toast from 'react-native-toast-message';


const Stack = createNativeStackNavigator();

const App = () => {
    return (
        <I18nextProvider i18n={i18n}>
            <NavigationContainer>
                <Stack.Navigator initialRouteName="TodoList">
                    <Stack.Screen name="TodoList" component={TodoList} />
                </Stack.Navigator>
                <Toast />
            </NavigationContainer>
        </I18nextProvider>
    );
};

export default App;