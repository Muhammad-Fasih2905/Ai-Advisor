import React, {useState} from 'react';
import {FlatList, Pressable, StyleSheet, Text} from 'react-native';
import AppFonts from '../utils/appFonts';
import {AppColors} from '../utils/color';
import {hp} from '../utils/constant';
import {size} from '../utils/responsiveFonts';
import {TabsProps} from '../types/types';

const Tabs: React.FC<TabsProps> = ({data}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const renderTab = (item: any, index: number) => (
    <Pressable
      onPress={() => setSelectedIndex(index)}
      style={[
        styles.tabContainer,
        {
          backgroundColor:
            selectedIndex == index ? AppColors.primary : '#efefef',
        },
      ]}>
      <Text
        style={[
          styles.tabTitle,
          {
            color: selectedIndex == index ? AppColors.white : AppColors.black,
          },
        ]}>
        {item}
      </Text>
    </Pressable>
  );

  return (
    <FlatList
      horizontal
      showsHorizontalScrollIndicator={false}
      data={data}
      renderItem={({item, index}) => renderTab(item, index)}
      contentContainerStyle={styles.contentContainerStyle}
    />
  );
};

export default Tabs;

const styles = StyleSheet.create({
  tabContainer: {
    marginRight: hp(1),
    backgroundColor: AppColors.primary,
    height: hp(6),
    width: hp(12),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: hp(5),
  },
  tabTitle: {
    color: AppColors.white,
    fontSize: size.default,
    fontFamily: AppFonts.RebondGrotesqueMedium,
  },
  contentContainerStyle: {marginVertical: hp(1)},
});
