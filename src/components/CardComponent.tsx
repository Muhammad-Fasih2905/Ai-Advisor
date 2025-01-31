import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { AppColors } from '../utils/color';
import GlobalIcon from '../components/GlobalIcon';
import MonthDropdown from '../components/MonthDropdown';
import { CardComponentProps } from '../types/types';
import { hp } from '../utils/constant';
import DollarIcon from "../assets/svgs/dollar.svg";
import AppFonts from '../utils/appFonts';

const CardComponent: React.FC<CardComponentProps> = ({ icon, title, amount, percentage }) => {
    return (
        <View style={styles.card}>

            <View style={styles.leftContainer}>
                <DollarIcon />
                <MonthDropdown />
            </View>

            <View style={styles.rightContainer}>
                <Text style={styles.cardTitle}>{title}</Text>
                <Text style={styles.cardAmount}>${amount}
                {/* {icon && (
                    <View style={styles.tringleIcon}>
                    <GlobalIcon library='Entypo' name={icon} size={26} color='#11C890' />
                    <Text style={styles.Percentage}>{percentage}</Text>
                    </View>
                )} */}
                </Text>
              
               

            </View>

        </View>
    );
};

export default CardComponent;

const styles = StyleSheet.create({
    card: {
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: AppColors.white,
        padding: 14,
        borderRadius: 8,
        elevation: 3,
        width: '50%',
    },
    leftContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
    },
    rightContainer: {
        width: '100%',
        marginHorizontal: hp(50),
        margin: 20,
    },

    cardTitle: {
        fontSize: 14,
        color: AppColors.secondary,
        fontFamily:AppFonts.InterRegular

    },
    cardAmount: {
        fontSize: 16,
        color: AppColors.black,
        fontFamily:AppFonts.InterBold
    },
    // Percentage:{
    //    fontSize:20,
       
    // },
    // tringleIcon:{
    //   flexDirection:'row',
    //   justifyContent:'flex-end',
    // //   alignItems:'center'
    
      
    // }


});
