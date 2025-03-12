import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import User from './User';
import Department from './Department';
import CustomHeader from './CustomHeader';
import Holidays from './Holidays';


const DataList = () => {
  const [selectedTab, setSelectedTab] = useState('Users');

  return (
    <View style={styles.container}>
      <CustomHeader title={'Admin'} />
      {/* Top Menu */}
      <View style={styles.menuContainer}>
        <Text style={[styles.menuItem, selectedTab === 'Users' && styles.activeMenu]} onPress={() => setSelectedTab('Users')}>
          Users
        </Text>
        <Text style={[styles.menuItem, selectedTab === 'Departments' && styles.activeMenu]} onPress={() => setSelectedTab('Departments')}>
          Departments
        </Text>
        <Text style={[styles.menuItem, selectedTab === 'Holidays' && styles.activeMenu]} onPress={() => setSelectedTab('Holidays')}>
          Holidays
        </Text>
      </View>
      { selectedTab === 'Users' ? <User /> : selectedTab=== "Departments" ? <Department /> : <Holidays />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
  },
  menuContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 10,
    padding: 10,
    paddingBottom: 0,
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
