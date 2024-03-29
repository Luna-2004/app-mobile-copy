import React from 'react';
import { StyleSheet, Text, View, FlatList, TextInput, TouchableOpacity, Modal, ScrollView } from 'react-native';

export default class Cliente extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      clientes: [],
      filteredClientes: [],
      modalVisible: false,
      nombre: '',
      apellido: '',
      edad: '',
      tipoDocumento: '',
      numDocumento: '',
      correo: '',
      editingClienteId: null,
      isEditing: false,
    };
  }

  componentDidMount() {
    this.getClientes();
  }

  getClientes = () => {
    this.setState({ loading: true });
    fetch('https://localhost:7284/api/clientes')
      .then(res => res.json())
      .then(data => {
        this.setState({
          clientes: data,
          filteredClientes: data,
          loading: false
        });
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        this.setState({ loading: false });
      });
  };

  handleSearch = text => {
    const filteredClientes = this.state.clientes.filter(cliente => {
      return cliente.nombre.toLowerCase().includes(text.toLowerCase());
    });
    this.setState({ filteredClientes });
  };

  handleEdit = clienteId => {
    const cliente = this.state.clientes.find(cliente => cliente.clienteId === clienteId);
    this.setState({
      nombre: cliente.nombre,
      apellido: cliente.apellido,
      edad: cliente.edad,
      tipoDocumento: cliente.tipoDocumento,
      numDocumento: cliente.numDocumento,
      correo: cliente.correo,
      editingClienteId: clienteId,
      modalVisible: true,
      isEditing: true, // Establecer isEditing como true al entrar en modo de edición
    });
  };
  
  handleSave = async () => {
    const { nombre, apellido, edad, tipoDocumento, numDocumento, correo, editingClienteId, isEditing } = this.state;
    const data = { nombre, apellido, edad, tipoDocumento, numDocumento, correo };
    const url = editingClienteId ? `https://localhost:7284/api/clientes/${editingClienteId}` : 'https://localhost:7284/api/clientes';
  
    try {
      const method = editingClienteId ? 'PUT' : 'POST';
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      const responseData = await response.json();
      console.log('Response:', responseData);
      
      // Si no está en modo de edición, actualiza la lista
      if (!isEditing) {
        this.getClientes();
      }
      
      // Limpia el estado y cierra el modal
      this.setState({ modalVisible: false, nombre: '', apellido: '', edad: '', tipoDocumento: '', numDocumento: '', correo: '', editingClienteId: null, isEditing: false }); // Establecer isEditing como false al guardar
    } catch (error) {
      console.error('Error saving cliente:', error);
    }
  };
  

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={() => this.setState({ modalVisible: true })}
            style={{
              backgroundColor: '#440000',
              padding: 10,
              borderRadius: 50,
              marginBottom: 10,
            }}
          >
            <Text style={{ color: 'white' }}>Agregar</Text>
          </TouchableOpacity>

          {/* Agregar un View para crear un espacio */}
          <View style={{ width: 10 }} />

          <TextInput
            style={styles.searchInput}
            placeholder="Buscar cliente"
            onChangeText={this.handleSearch}
          />
        </View>
          <View>
            <View style={styles.row}>
              <Text style={[styles.tableHeader, { flex: 0.5, backgroundColor: '#440000' }]}>#</Text>
              <Text style={[styles.tableHeader, { flex: 1, backgroundColor: '#440000' }]}>NOMBRE</Text>
              <Text style={[styles.tableHeader, { flex: 1, backgroundColor: '#440000' }]}>APELLIDO</Text>
              <Text style={[styles.tableHeader, { flex: 0.5, backgroundColor: '#440000' }]}>EDAD</Text>
              <Text style={[styles.tableHeader, { flex: 1.5, backgroundColor: '#440000' }]}>TIPO DE DOCUMENTO</Text>
              <Text style={[styles.tableHeader, { flex: 1.5, backgroundColor: '#440000' }]}>NÚMERO DE DOCUMENTO</Text>
              <Text style={[styles.tableHeader, { flex: 2, backgroundColor: '#440000' }]}>CORREO</Text>
              <View style={[styles.tableHeader, { flex: 1, backgroundColor: '#440000' }]}></View>
            </View>
            <FlatList
              contentContainerStyle={styles.tableGroupDivider}
              data={this.state.filteredClientes}
              renderItem={({ item, index }) => (
                <TouchableOpacity onPress={() => this.handleEdit(item.clienteId)}>
                  <View style={styles.row}>
                    <Text style={[styles.item, { flex: 0.5 }]}>{index + 1}</Text>
                    <Text style={[styles.item, { flex: 1 }]}>{item.nombre}</Text>
                    <Text style={[styles.item, { flex: 1 }]}>{item.apellido}</Text>
                    <Text style={[styles.item, { flex: 0.5 }]}>{item.edad}</Text>
                    <Text style={[styles.item, { flex: 1.5 }]}>{item.tipoDocumento}</Text>
                    <Text style={[styles.item, { flex: 1.5 }]}>{item.numDocumento}</Text>
                    <Text style={[styles.item, { flex: 2 }]}>{item.correo}</Text>
                    <View style={[styles.buttonGroup, { flex: 1 }]}>
                      <TouchableOpacity onPress={() => this.handleEdit(item.clienteId)}>
                        <Text style={[styles.button, styles.editButton]}>✎</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => this.handleDelete(item.clienteId)}>
                        <Text style={[styles.button, styles.deleteButton]}>🗑</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </TouchableOpacity>
              )}
              keyExtractor={item => item.clienteId}
            />
          </View>

      <Modal
        visible={this.state.modalVisible}
        animationType="slide"
        onRequestClose={() => {
          // Limpia el estado y cierra el modal
          this.setState({ modalVisible: false, nombre: '', apellido: '', edad: '', tipoDocumento: '', numDocumento: '', correo: '', editingClienteId: null, isEditing: false });
        }}
      >
        <View style={styles.modalContainer}>
          <TextInput
            placeholder="Nombre"
            value={this.state.nombre}
            onChangeText={nombre => this.setState({ nombre })}
            style={styles.input}
          />
          <TextInput
            placeholder="Apellido"
            value={this.state.apellido}
            onChangeText={apellido => this.setState({ apellido })}
            style={styles.input}
          />
          <TextInput
            placeholder="Edad"
            value={this.state.edad}
            onChangeText={edad => this.setState({ edad })}
            style={styles.input}
          />
          <TextInput
            placeholder="Tipo de Documento"
            value={this.state.tipoDocumento}
            onChangeText={tipoDocumento => this.setState({ tipoDocumento })}
            style={styles.input}
          />
          <TextInput
            placeholder="Número de Documento"
            value={this.state.numDocumento}
            onChangeText={numDocumento => this.setState({ numDocumento })}
            style={styles.input}
          />
          <TextInput
            placeholder="Correo"
            value={this.state.correo}
            onChangeText={correo => this.setState({ correo })}
            style={styles.input}
          />
          <TouchableOpacity onPress={this.handleSave} style={styles.buttont}>
            <Text style={styles.buttonText}>Guardar</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.setState({ modalVisible: false })} style={styles.buttont}>
            <Text style={styles.buttonText}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#a9a9a9',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 10,
  },
  searchInput: {
    height: 40,
    borderColor: '#440000',
    borderWidth: 1,
    flex: 1,
    paddingLeft: 10,
    borderRadius: '10px',
    color :'black',
    backgroundColor: 'white',
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
    paddingVertical: 10,
    marginHorizontal: 10,
  },
  item: {
    flex: 1,
    textAlign: 'center',
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  button: {
    padding: 5,
    borderRadius: 5, // Ajuste: Cambiar a 5 para que sea ovalado
    textAlign: 'center',
    borderWidth: 1,
  },
  editButton: {
    backgroundColor: '#440000',
    color: 'white',
  },
  deleteButton: {
    backgroundColor: '#440000',
    color: 'white',
  },
  modalContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    padding: 20,
  },
  input: {
    height: 40,
    width: '80%',
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
  },
  buttont: {
    backgroundColor: '#440000', // Color de fondo del botón
    padding: 10, // Espaciado interno del botón
    borderRadius: 50, // Bordes redondeados del botón
    marginBottom: 10, // Espaciado inferior del botón
    width: '40%', // Ancho del botón
    alignItems: 'center', // Alinear contenido del botón al centro
  },
  buttonText: {
    color: 'white', // Color del texto del botón
    fontWeight: 'bold', // Negrita del texto del botón
  },
  tableHeader: {
    flex: 1,
    textAlign: 'center',
    color: 'white',
    paddingVertical: 5,
  },
  tableGroupDivider: {
    backgroundColor: '#dcdcdc',
  },
});
