import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';
import { AppColors } from '../../utils/color';
import NewsHeader from '../../components/NewsHeader';
import { hp } from '../../utils/constant';
import AppFonts from '../../utils/appFonts';

const InvestmentArticlesDetails: React.FC = ({ route }: any) => {
  const item = route?.params?.item;

  return (
    
    <ScrollView 
      bounces={false}
      contentContainerStyle={styles.container} 
      showsVerticalScrollIndicator={false}
    >
      <NewsHeader title='Investment Articles/News' />
      
      <Image source={{uri: item?.image}} style={styles.image} />
      <Text style={styles.title}>{item?.headline}</Text>
      <View style={styles.authorContainer}>
        <Image source={{uri: item.image}} style={styles.authorImage} />
        <Text style={styles.authorText}>{item?.authTitle}</Text>
      </View>
      <Text style={styles.description}>{item?.summary}</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: AppColors.body,
    padding: 15,
    paddingVertical: hp(6),
    flexGrow: 1,  
    paddingBottom: hp(12)
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginVertical: 10,
    color:AppColors.black,
    fontFamily:AppFonts.InterBold
  },
  authorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  authorImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
  },
  authorText: {
    fontSize: 14,
    color: AppColors.black,
    fontFamily:AppFonts.InterRegular
  },
  description: {
    fontSize: 14,
    marginTop: 10,
    color:AppColors.black,
    fontFamily:AppFonts.InterRegular,
    lineHeight:20
  },
});

export default InvestmentArticlesDetails;
