import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList } from 'react-native';
import { AppColors } from '../../utils/color';
import AppFonts from '../../utils/appFonts';
import AppHeader from '../../components/AppHeader';
import { hp } from '../../utils/constant';
import GlobalIcon from '../../components/GlobalIcon';
import { useAppSelector } from '../../store/hooks';
import { FAQ } from '../../types/types';

const Faq = () => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const staticContent = useAppSelector(state => state.userSlices.staticContent);

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const renderItem = ({ item, index }: { item: FAQ; index: number }) => (
    <View style={styles.itemContainer}>
      <TouchableOpacity onPress={() => toggleExpand(index)} style={styles.questionContainer}>
        <Text style={styles.question}>{item?.question}</Text>
        <GlobalIcon name={expandedIndex === index ? 'chevron-up' : 'chevron-down'} size={14} color={AppColors.black}/>
      </TouchableOpacity>
      {expandedIndex === index && (
        <Text style={styles.answer}>{item?.answer}</Text>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.faqHeaderView}>
        <AppHeader title='FAQs' />
      </View>
      <View style={styles.faqView}>
        <Text style={styles.faqTitle}>{staticContent[0]?.FAQ?.title}</Text>
        <Text style={styles.faqDescription}>{staticContent[0]?.FAQ?.description}</Text>
      </View>
      <FlatList
        data={staticContent[0]?.FAQ?.questions}
        renderItem={renderItem}
        keyExtractor={(item: any) => item?._id}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default Faq;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.body,
  },
  faqHeaderView: {
    marginTop: hp(1),
  },
  itemContainer: {
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#D9D9D9',
    borderRadius: 10,
    width: '94%',
    alignSelf: 'center',
    marginTop: hp(2),
  },
  questionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 14,
  },
  question: {
    fontSize: 16,
    fontFamily: AppFonts.InterRegular,
    color: AppColors.black
  },
  answer: {
    fontSize: 16,
    fontFamily: AppFonts.InterRegular,
    color: AppColors.silverText,
    paddingVertical: 5,
    paddingLeft: 14,
    lineHeight:27
  },
  faqView: {
    paddingHorizontal: 16,
    marginTop: hp(-2)
  },
  faqTitle: {
    color: AppColors.black,
    fontSize: 16,
    fontFamily: AppFonts.InterBold,
  },
  faqDescription: {
    color: AppColors.black,
    fontSize: 16,
    fontFamily: AppFonts.InterRegular,
    lineHeight: 20,
    marginTop: hp(1),
  },
});
