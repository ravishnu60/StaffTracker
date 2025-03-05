import React, { useState } from 'react';
import { View, FlatList, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import { Button, DataTable, Text, IconButton, Modal, Portal, TextInput, Provider } from 'react-native-paper';
import User from './User';
import Department from './Department';

const users = [
  { id: 1, name: 'Alice Johnson', email: 'qRn9Z@example.com', role: 'Admin' },
  { id: 2, name: 'Bob Smith', email: 'YjM9g@example.com', role: 'Manager' },
  { id: 3, name: 'Charlie Brown', email: 'HqWt3@example.com', role: 'Employee' },
];

const departments = [
  { id: 1, name: 'Engineering' },
  { id: 2, name: 'Marketing' },
  { id: 3, name: 'Human Resources' },
];

const DataList = () => {
  const [selectedTab, setSelectedTab] = useState('Users');

  return (
    <View style={styles.container}>
      {/* Top Menu */}
      <View style={styles.menuContainer}>
        <Text style={[styles.menuItem, selectedTab === 'Users' && styles.activeMenu]} onPress={() => setSelectedTab('Users')}>
          Users
        </Text>
        <Text style={[styles.menuItem, selectedTab === 'Departments' && styles.activeMenu]} onPress={() => setSelectedTab('Departments')}>
          Departments
        </Text>
      </View>
      { selectedTab === 'Users' ? <User /> : <Department />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f4f4f4',
  },
  menuContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 10,
  },
  menuItem: {
    flex: 1,
    textAlign: 'center',
    paddingVertical: 10,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
  },
  activeMenu: {
    color: '#000',
    borderBottomWidth: 3,
    borderBottomColor: '#6200ee',
  },
  addButtonContainer: {
    alignItems: 'flex-end',
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: '#6200ee',
    borderRadius: 5,
  },
  addButtonLabel: {
    color: '#fff',
    padding: 10,
    fontSize: 14,
    fontWeight: 'bold',
  },


  tableHeader: {
    fontWeight: 'bold',
    color: '#333',
  },
  tableCell: {
    color: '#333',
    fontSize: 12,
    paddingRight: 15,
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 5,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  modal: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
});

export default DataList;
