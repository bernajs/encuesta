/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
    AppRegistry,
    AsyncStorage,
    StyleSheet,
    Text,
    TextInput,
    View,
    Alert,
    Button
} from 'react-native';

import db from './firebase'


export default class encuesta extends Component {
    constructor(props) {
        super(props)
        this.state = {
            nombre: '', correo: '', users: [], connected: false
        }

        this.handleCorreo = this.handleCorreo.bind(this)
        this.handleNombre = this.handleNombre.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)

        console.ignoredYellowBox = ['Setting a timer']
    }

    handleCorreo(e) {
        this.setState({ correo: e.nativeEvent.text })
        // AsyncStorage.setItem('correo', e.nativeEvent.text)
    }

    handleNombre(e) {
        this.setState({ nombre: e.nativeEvent.text })
        // AsyncStorage.setItem('nombre', e.nativeEvent.text)
    }

    handleSubmit() {
        if (this.state.connected) {
            db
                .database()
                .ref('users')
                .push({ username: this.state.nombre, email: this.state.correo, profile_picture: 'google.com' });
            // AsyncStorage.getItem('usuarios').then(data => { console.log('asyncdata usuarios', data) })
        } else {
            Alert.alert(
                'Desconectado',
                'Por el momento no te encuentras con una conexión, guardaremos el registro y cuando se conecte a internet se enviaran',
                [
                    { text: 'Ask me later', onPress: () => console.log('Ask me later pressed') },
                    { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                    { text: 'OK', onPress: () => console.log('OK Pressed') },
                ],
                { cancelable: false }
            )
            var usuarios = []
            var usuario = { username: this.state.nombre, email: this.state.correo, profile_picture: 'google.com' }
            AsyncStorage.getItem('usuarios').then(data => {
                if (data) { usuarios = JSON.parse(data) }
                console.log('asyncdata usuarios', data)
                usuarios.push(usuario)
                AsyncStorage.setItem('usuarios', JSON.stringify(usuarios))
                AsyncStorage.getItem('usuarios').then(data => { console.log('data', data) })
            })
        }
    }

    componentDidMount() {
        let result = db.database().ref('users').on('value', (snapShot) => {
            let users = []
            snapShot.forEach((child) => { users.push({ nombre: child.val().nombre, correo: child.val().correo }) })
            AsyncStorage.setItem('usuarios', JSON.stringify([]))
            
            // this.setState({ users })
            // console.log(users)
        })

        let getStatus = db.database().ref('.info/connected')
        getStatus.on('value', (snapshot) => {
            if (snapshot.val()) {
                Alert.alert(
                    'Conectado',
                    'Te has conectado',
                    [
                        { text: 'Ask me later', onPress: () => console.log('Ask me later pressed') },
                        { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                        { text: 'OK', onPress: () => console.log('OK Pressed') },
                    ],
                    { cancelable: false }
                )
                let usuarios = []
                this.setState({ connected: true })
                AsyncStorage.getItem('usuarios').then(data => {
                    let usuarios;
                    if (data) { usuarios = JSON.parse(data); }
                    console.log(usuarios)
                    usuarios.map(usuario => {
                        db
                            .database()
                            .ref('users')
                            .push({ username: usuario.username, email: usuario.email, profile_picture: 'google.com' });
                            console.log('registro', 1)
                    })
                    AsyncStorage.setItem('usuarios', JSON.stringify(null))
                })
            } else {
                Alert.alert(
                    'Desconectado',
                    'Te has desconectado',
                    [
                        { text: 'Ask me later', onPress: () => console.log('Ask me later pressed') },
                        { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                        { text: 'OK', onPress: () => console.log('OK Pressed') },
                    ],
                    { cancelable: false }
                )
                this.setState({ connected: false })
            }
        })
    }

    render() {
        return (
            <View style={styles.container}>
                <View>
                    <Text style={styles.title}>{this.state.connected ? 'Conectado' : 'Desconectado'}</Text>
                </View>
                <View style={styles.inputFather}>
                    <Text>Ingresa tu nombre: </Text>
                    <TextInput style={styles.input} value={this.state.nombre} onChange={this.handleNombre} placeholder=""></TextInput>
                    <TextInput style={styles.input} value={this.state.correo} onChange={this.handleCorreo} placeholder=""></TextInput>
                    <Text>{this.state.nombre}</Text>
                    <Text>{this.state.correo}</Text>
                </View>
                <View>
                    <Button title="Enviar" onPress={this.handleSubmit}></Button>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
        // flexDirection: 'row',
        padding: 20
    },
    inputFather: {
        // backgroundColor: 'black',
        flex: 1
    },
    input: {
        width: 300,
        // flex: 1
    },
    title: {
        fontSize: 40
    }
});

AppRegistry.registerComponent('encuesta', () => encuesta);
