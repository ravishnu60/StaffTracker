import React, { useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Button, DataTable, Text } from 'react-native-paper';

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

  // Get data based on selection
  const data = selectedTab === 'Users' ? users : departments;

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
          <DataTable.Title>{selectedTab === 'Users' ? 'Email' : 'Head'}</DataTable.Title>
        </DataTable.Header>

        <FlatList
          data={data}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <DataTable.Row>
              <DataTable.Cell>{item.id}</DataTable.Cell>
              <DataTable.Cell>{item.name}</DataTable.Cell>
              <DataTable.Cell>{selectedTab === 'Users' ? item.email : item.head}</DataTable.Cell>
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
