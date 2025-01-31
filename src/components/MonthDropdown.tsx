import React, { useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const MonthDropdown = () => {
    const [selectedMonth, setSelectedMonth] = useState('This Month');

    const months = [
        'This Month', 'January', 'February', 'March', 'April', 
        'May', 'June', 'July', 'August', 
        'September', 'October', 'November', 'December'
    ];

    return (
        <View style={styles.container}>
            <Picker
                selectedValue={selectedMonth}
                style={styles.picker}
                onValueChange={(itemValue) => setSelectedMonth(itemValue)}
            >
                {months.map((month, index) => (
                    <Picker.Item key={index} label={month} value={month} />
                ))}
            </Picker>
        </View>
    );
};

export default MonthDropdown;

const styles = StyleSheet.create({
    container: {
        
        justifyContent: 'center',
        alignItems: 'center',
    },
    picker: {
        height: 10, 
        width: 150
    },
});
