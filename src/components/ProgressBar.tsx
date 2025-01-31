import React from 'react';
import { View, StyleSheet } from 'react-native';
import { hp } from '../utils/constant';
import { AppColors } from '../utils/color';

const ProgressBar = () => {
    return (
        <View style={styles.container}>
            <View style={[styles.segment, styles.amber]} />
            <View style={[styles.segment, styles.royalBlue]} />
            <View style={[styles.segment, styles.cottonCandyPink]} />
            <View style={[styles.segment, styles.turquoise]} />
            <View style={[styles.segment, styles.lightGray]} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        width: '100%',
        height: hp(1),
        justifyContent:'center'
        
    },
    segment: {
        flex: 1,
        borderRadius:4,
        
    },
    amber: {
        backgroundColor: '#FFBF3E',
    },
    royalBlue: {
        backgroundColor: '#6347EB',
    },
    cottonCandyPink: {
        backgroundColor: '#F76494',
    },
    turquoise: {
        backgroundColor: '#56D3B9',
    },
    lightGray: {
        backgroundColor: '#E3E3E5',
    },
});

export default ProgressBar;
