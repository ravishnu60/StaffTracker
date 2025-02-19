import React, { useState } from 'react';
import { View, FlatList, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import { Button, DataTable, Text, IconButton, Modal, Portal, TextInput, Provider } from 'react-native-paper';
import { AddUserModal } from './User';

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
  const [modalVisible, setModalVisible] = useState(false);
  const [expandedRow, setExpandedRow] = useState(null);
  const [newEntry, setNewEntry] = useState('');

  const data = selectedTab === 'Users' ? users : departments;
  const columns = selectedTab === 'Users' ? ["Name", 'Email', 'Role', 'Actions'] : ["Name", 'Actions'];

  const UserTable = () => {
    return (
      <FlatList
        data={data}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <>
            <DataTable.Row>
              <DataTable.Cell style={{ flex: 2 }}><Text style={styles.tableCell} numberOfLines={1}>{item.name}</Text></DataTable.Cell>
              <DataTable.Cell style={{ flex: 3 }}><Text style={styles.tableCell} numberOfLines={1}>{item.email}</Text></DataTable.Cell>
              <DataTable.Cell style={{ flex: 2 }}><Text style={styles.tableCell} numberOfLines={1}>{item.role}</Text></DataTable.Cell>
              <DataTable.Cell style={{ flex: 1 }}>
                <IconButton icon={expandedRow === item.id ? "chevron-up" : "chevron-down"} iconColor='#000' size={20} onPress={() => toggleExpand(item.id)} />
              </DataTable.Cell>
            </DataTable.Row>

            {expandedRow === item.id && (
              <View style={[styles.actionContainer, { backgroundColor: '#e9e9e9' }]}>
                <IconButton icon="eye" iconColor='#000' size={20} onPress={() => Alert.alert('View', JSON.stringify(item, null, 2))} />
                <IconButton icon="pencil" iconColor='#000' size={20} onPress={() => Alert.alert('Edit', `Editing ${item.name}`)} />
                <IconButton icon="delete" iconColor='#000' size={20} onPress={() => Alert.alert('Delete', `Deleting ${item.name}`)} />
              </View>
            )}
          </>
        )}
      />
    )
  }

  const DepartmentTable = () => {
    return (
      <FlatList
        data={data}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <>
            <DataTable.Row>
              <DataTable.Cell style={{ flex: 2 }}><Text style={styles.tableCell} numberOfLines={1}>{item.name}</Text></DataTable.Cell>
              <DataTable.Cell style={{ flex: 1 }}>
                <View style={styles.actionContainer}>
                  <IconButton icon="eye" iconColor='#000' size={20} onPress={() => Alert.alert('View', JSON.stringify(item, null, 2))} />
                  <IconButton icon="pencil" iconColor='#000' size={20} onPress={() => Alert.alert('Edit', `Editing ${item.name}`)} />
                  <IconButton icon="delete" iconColor='#000' size={20} onPress={() => Alert.alert('Delete', `Deleting ${item.name}`)} />
                </View>
              </DataTable.Cell>
            </DataTable.Row>
          </>
        )}
      />
    )
  }

  const toggleExpand = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  // Modal Handlers
  const openModal = () => setModalVisible(true);
  const closeModal = () => setModalVisible(false);

  // Handle Add
  const handleAdd = () => {
    if (!newEntry) {
      Alert.alert('Error', `${selectedTab} name is required`);
      return;
    }
    Alert.alert('Success', `${selectedTab} "${newEntry}" added successfully!`);
    closeModal();
  };

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

        {/* Add Button */}
        <View style={styles.addButtonContainer}>
          <TouchableOpacity onPress={openModal} style={styles.addButton}>
            <Text style={styles.addButtonLabel}>Add {selectedTab}</Text>
          </TouchableOpacity>
        </View>

        {/* Table */}
        <DataTable>
          <DataTable.Header>
            {columns.map((column) => (
              <DataTable.Title key={column} style={{ flex: column === 'Actions' ? 1 : column === 'Email' ? 3 : 2, paddingLeft: 5 }}>
                <Text style={styles.tableHeader}>{column}</Text>
              </DataTable.Title>
            ))}
          </DataTable.Header>
          {selectedTab === 'Users' ? <UserTable /> : <DepartmentTable />}
        </DataTable>

        {/* Modal for Adding */}
        <AddUserModal visible={modalVisible} onDismiss={() => setModalVisible(false)} />

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
