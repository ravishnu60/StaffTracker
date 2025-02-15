import React, { useState } from 'react';
import { View, FlatList, Alert, StyleSheet } from 'react-native';
import { Button, DataTable, Text, IconButton } from 'react-native-paper';

const users = [
  { id: 1, name: 'Alice Johnson', email: 'alice@example.com' },
  { id: 2, name: 'Bob Smith', email: 'bob@example.com' },
  { id: 3, name: 'Charlie Brown', email: 'charlie@example.com' },
];

const departments = [
  { id: 1, name: 'Engineering', head: 'Dr. John Doe' },
  { id: 2, name: 'Marketing', head: 'Sarah Lee' },
  { id: 3, name: 'Human Resources', head: 'Emma Wilson' },
];

const DataList = () => {
  const [selectedTab, setSelectedTab] = useState('Users'); // Track active tab

  const data = selectedTab === 'Users' ? users : departments;

  // Action Handlers
  const handleView = (item) => Alert.alert('View Details', JSON.stringify(item, null, 2));
  const handleEdit = (item) => Alert.alert('Edit', `Editing ${item.name}`);
  const handleDelete = (item) => Alert.alert('Delete', `Deleting ${item.name}`);

  return (
    <View style={styles.container}>
      {/* Top Menu Buttons */}
      <View style={styles.menuContainer}>
        <Button 
          mode={selectedTab === 'Users' ? 'contained' : 'outlined'}
          onPress={() => setSelectedTab('Users')}
          style={styles.menuButton}
        >
          Users
        </Button>
        <Button 
          mode={selectedTab === 'Departments' ? 'contained' : 'outlined'}
          onPress={() => setSelectedTab('Departments')}
          style={styles.menuButton}
        >
          Departments
        </Button>
      </View>

      {/* Table Title */}
      <Text style={styles.title}>{selectedTab} List</Text>

      {/* Data Table */}
      <DataTable>
        <DataTable.Header>
          <DataTable.Title>ID</DataTable.Title>
          <DataTable.Title>{selectedTab === 'Users' ? 'Name' : 'Department'}</DataTable.Title>
          {/* <DataTable.Title>{selectedTab === 'Users' ? 'Email' : 'Head'}</DataTable.Title> */}
          <DataTable.Title>Actions</DataTable.Title>
        </DataTable.Header>

        <FlatList
          data={data}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <DataTable.Row>
              {/* <DataTable.Cell>{item.id}</DataTable.Cell> */}
              {/* <DataTable.Cell>{item.name}</DataTable.Cell> */}
              <DataTable.Cell>{selectedTab === 'Users' ? item.email : item.head}</DataTable.Cell>
              <DataTable.Cell>
                <IconButton icon="eye" size={15} onPress={() => handleView(item)} />
                <IconButton icon="pencil" size={15} onPress={() => handleEdit(item)} />
                <IconButton icon="delete" size={15} onPress={() => handleDelete(item)} />
              </DataTable.Cell>
            </DataTable.Row>
          )}
        />
      </DataTable>
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
    justifyContent: 'space-evenly',
    marginBottom: 10,
  },
  menuButton: {
    flex: 1,
    marginHorizontal: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
  },
});

export default DataList;
