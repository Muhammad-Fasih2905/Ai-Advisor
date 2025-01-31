import {useNavigation} from '@react-navigation/native';
import {debounce} from 'lodash';
import React, {useCallback, useEffect, useState} from 'react';
import {Controller, useForm, useWatch} from 'react-hook-form';
import {FlatList, Pressable, StyleSheet, Text, View} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import AppButton from '../../components/AppButton';
import AppDropdown from '../../components/AppDropDown';
import AppHeader from '../../components/AppHeader';
import AppInput from '../../components/AppInput';
import {getAllCategories} from '../../store/finance/financeActions';
import {useAppDispatch, useAppSelector} from '../../store/hooks';
import {
  createInvesment,
  getAllInvestments,
  getSearchAssets,
} from '../../store/invesment/invesmentActions';
import {setSearchAssets} from '../../store/invesment/invesmentSlices';
import AppStyles from '../../styles/AppStyles';
import AppFonts from '../../utils/appFonts';
import {AppColors} from '../../utils/color';
import {hp} from '../../utils/constant';
import {convert_data} from '../../utils/functions';
import {size} from '../../utils/responsiveFonts';

const AddInvestment = () => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const categories = useAppSelector(state => state.financeSlice.categories);
  const isLoading = useAppSelector(state => state.commonSlice.isLoading);
  const searchAssets = useAppSelector(
    state => state.invesmentSlice.searchAssets,
  );
  const [showMoreFields, setShowMoreFields] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [givenValues, setGivenValues] = useState({
    quantity: false,
    price: false,
    amount: false,
  });
  let data;

  useEffect(() => {
    dispatch(getAllCategories());
  }, []);

  data = convert_data(categories?.filter((item: any) => item?.title != 'All'));

  const {
    control,
    handleSubmit,
    formState: {errors},
    watch,
    setValue,
    setError,
  } = useForm({
    defaultValues: {
      amount: '',
      category: '',
      asset: '',
      symbol: '',
      quantity: '',
      price: '',
    },
  });

  const assets = watch('asset');
  const symbol = watch('symbol');

  const fetchAssets = useCallback(
    debounce(async assetsValue => {
      try {
        const res = await dispatch(getSearchAssets(assetsValue)).unwrap();
        console.log(res);
      } catch (error) {
        console.error('Error fetching assets:', error);
      }
    }, 300),
    [dispatch],
  );

  useEffect(() => {
    if (assets !== '' && symbol === '') {
      fetchAssets(assets);
    } else {
      dispatch(setSearchAssets([]));
    }

    return () => {
      fetchAssets.cancel();
    };
  }, [assets, symbol, fetchAssets, dispatch]);

  const quantity = useWatch({control, name: 'quantity'});
  const amount = useWatch({control, name: 'amount'});
  const price = useWatch({control, name: 'price'});

  const handleSymbol = (item: any) => {
    setValue('asset', item?.longname);
    setValue('symbol', item?.symbol);
    dispatch(setSearchAssets([]));
    if (
      selectedCategory == 'Funds' ||
      selectedCategory == 'Money Market Funds'
    ) {
      setValue('amount', item?.price);
    }
  };
  useEffect(() => {
    if (
      (selectedCategory === 'Funds' ||
        selectedCategory === 'Money Market Funds') &&
      price &&
      amount
    ) {
      const calculatedQuantity = `${Number(price) / Number(amount)}`;
      if (quantity !== calculatedQuantity) {
        setValue('quantity', calculatedQuantity, {
          shouldValidate: true,
          shouldDirty: true,
        });
      }
    }
  }, [amount, price, quantity, selectedCategory, setValue]);

  useEffect(() => {
    if (
      quantity &&
      amount &&
      !givenValues.price &&
      selectedCategory != 'Funds' &&
      selectedCategory != 'Money Market Funds'
    ) {
      setValue('price', `${Number(quantity) * Number(amount)}`);
      setError('price', {
        type: 'manual',
        message: '',
      });
    } else if (price && amount && !givenValues.quantity) {
      setValue('quantity', `${Number(price) / Number(amount)}`);
      setError('quantity', {
        type: 'manual',
        message: '',
      });
    } else if (price && quantity && !givenValues.amount) {
      setValue('amount', `${Number(price) / Number(quantity)}`);
      setError('amount', {
        type: 'manual',
        message: '',
      });
    }

    if (
      selectedCategory &&
      selectedCategory != 'Funds' &&
      selectedCategory != 'Money Market Funds'
    ) {
      if (!quantity && !amount && !givenValues.price) {
        setValue('price', '');
        setGivenValues({
          quantity: false,
          price: false,
          amount: false,
        });
      } else if (!price && !amount && !givenValues.quantity) {
        setValue('quantity', '');
        setGivenValues({
          quantity: false,
          price: false,
          amount: false,
        });
      } else if (!price && !quantity && !givenValues.amount) {
        setValue('amount', '');
        setGivenValues({
          quantity: false,
          price: false,
          amount: false,
        });
      }
    }

    if (
      selectedCategory &&
      selectedCategory != 'Funds' &&
      selectedCategory != 'Money Market Funds'
    ) {
      if (quantity && !amount && !givenValues.price) {
        setValue('price', '');
      } else if (!price && amount && !givenValues.quantity) {
        setValue('quantity', '');
      } else if (price && !quantity && !givenValues.amount) {
        setValue('amount', '');
      } else if (price && !amount && !givenValues.quantity) {
        setValue('quantity', '');
      } else if (!price && quantity && !givenValues.amount) {
        setValue('amount', '');
      } else if (!quantity && amount && !givenValues.price) {
        setValue('price', '');
      }
    }
  }, [quantity, amount, price, setValue, selectedCategory]);

  const onSubmit = async (data: {
    amount: string;
    category: string;
    asset: string;
    symbol: string;
    quantity: string;
    price: string;
  }) => {
    const api_data = {
      amount: data?.price,
      category: data.category,
      symbol: data.symbol,
      asset: data.asset,
      quantity: data.quantity,
      price: data.amount,
    };
    console.log(api_data);

    const res = await dispatch(createInvesment(api_data)).unwrap();
    if (res.success == true) {
      if (res?.data) {
        dispatch(getAllInvestments());
        navigation.goBack();
      }
    }
  };

  const handleChangeCategory = (text: {label: string; value: string}) => {
    setValue('amount', '');
    setValue('asset', '');
    setValue('category', '');
    setValue('price', '');
    setValue('quantity', '');
    setValue('symbol', '');
    setSelectedCategory(text.label);
    setValue('category', text.value);
    if (text.label === 'Funds' || text.label === 'Money Market Funds') {
      setShowMoreFields(false);
    } else {
      setShowMoreFields(true);
    }
  };

  return (
    <KeyboardAwareScrollView
      bounces={false}
      style={styles.container}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}>
      <View style={styles.Header}>
        <AppHeader title="Add new investment" />

        <Controller
          name="category"
          control={control}
          rules={{
            required: {value: true, message: 'Investment category is required'},
          }}
          render={({field: {onChange, value}}) => (
            <AppDropdown
              label="Investment Category"
              placeholder={'Select Category'}
              data={data}
              value={value}
              style={{marginVertical: 0}}
              onChangeText={(text: any) => {
                handleChangeCategory(text);
              }}
              inputStyle={styles.dropDownStyle}
              labelStyle={{...AppStyles.inputLabelStyle, marginTop: hp(1)}}
              error={errors.category?.message}
            />
          )}
        />
        <Controller
          name="asset"
          control={control}
          rules={{
            required: {value: true, message: 'Name is required'},
          }}
          render={({field: {onChange, value}}) => (
            <AppInput
              placeholder="Name your asset"
              label="Name"
              labelStyle={AppStyles.inputLabelStyle}
              value={value}
              onChangeText={(e: string) => {
                setValue('symbol', '');
                onChange(e);
              }}
              error={errors.asset?.message}
            />
          )}
        />
        {searchAssets?.length > 0 && (
          <FlatList
            nestedScrollEnabled={true}
            scrollEnabled={true}
            data={searchAssets}
            renderItem={({item}: any) => {
              return (
                <>
                  {item?.longname ? (
                    <Pressable
                      onPress={() => handleSymbol(item)}
                      style={styles.itemStyle}>
                      <Text
                        numberOfLines={2}
                        style={[
                          AppStyles.title,
                          {fontFamily: AppFonts.InterMedium},
                        ]}>
                        {item?.longname}
                      </Text>
                    </Pressable>
                  ) : null}
                </>
              );
            }}
            showsVerticalScrollIndicator={false}
            style={{minHeight: hp(7), maxHeight: hp(30), width: '100%'}}
          />
        )}

        {showMoreFields && (
          <Controller
            name="quantity"
            control={control}
            rules={{
              required: {value: true, message: 'Quantity is required'},
            }}
            render={({field: {onChange, value}}) => (
              <AppInput
                placeholder="5"
                label="Quantity"
                editable={
                  !(
                    !givenValues.quantity &&
                    givenValues.price &&
                    givenValues.amount
                  )
                }
                value={value}
                onChangeText={(text: string) => {
                  onChange(text);
                  if (!givenValues.price || !givenValues.amount) {
                    setGivenValues({
                      ...givenValues,
                      quantity: true,
                    });
                  }
                }}
                keyboardType="decimal-pad"
                labelStyle={AppStyles.inputLabelStyle}
                error={errors.quantity?.message}
              />
            )}
          />
        )}

        {showMoreFields && (
          <Controller
            name="amount"
            control={control}
            rules={{
              required: {
                value: true,
                message: 'Buy Price is required',
              },
            }}
            render={({field: {onChange, value}}) => (
              <AppInput
                placeholder="500"
                label={'Buy Price'}
                editable={
                  !(
                    givenValues.quantity &&
                    givenValues.price &&
                    !givenValues.amount
                  )
                }
                value={value}
                onChangeText={(text: string) => {
                  onChange(text);
                  if (!givenValues.price || !givenValues.amount) {
                    setGivenValues({
                      ...givenValues,
                      amount: true,
                    });
                  }
                }}
                keyboardType="decimal-pad"
                labelStyle={AppStyles.inputLabelStyle}
                error={errors.amount?.message}
              />
            )}
          />
        )}

        {showMoreFields && (
          <Controller
            name="price"
            control={control}
            rules={{
              required: {value: true, message: 'Total Amount is required'},
            }}
            render={({field: {onChange, value}}) => (
              <AppInput
                placeholder="$5000"
                label="Total Amount"
                value={value}
                editable={
                  !(
                    givenValues.quantity &&
                    !givenValues.price &&
                    givenValues.amount
                  )
                }
                onChangeText={(text: string) => {
                  onChange(text);
                  if (!givenValues.price || !givenValues.quantity) {
                    setGivenValues({
                      ...givenValues,
                      price: true,
                    });
                  }
                }}
                keyboardType="decimal-pad"
                labelStyle={AppStyles.inputLabelStyle}
                error={errors.price?.message}
              />
            )}
          />
        )}

        {!showMoreFields && (
          <Controller
            name="price"
            control={control}
            rules={{
              required: {value: true, message: 'Amount is required'},
            }}
            render={({field: {onChange, value}}) => (
              <AppInput
                placeholder="$5000"
                label="Amount"
                value={value}
                onChangeText={(text: string) => {
                  onChange(text);
                }}
                keyboardType="decimal-pad"
                labelStyle={AppStyles.inputLabelStyle}
                error={errors.price?.message}
              />
            )}
          />
        )}

        <View style={styles.AddButton}>
          <AppButton
            disabled={isLoading}
            loading={isLoading}
            title="Add your investment"
            onPress={handleSubmit(onSubmit)}
          />
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
};

export default AddInvestment;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.body,
    paddingHorizontal: 16,
  },
  Header: {
    marginTop: hp(3),
  },
  dropDownStyle: {
    height: hp(7),
    // width: wp(95),
    padding: 0,
    fontSize: size.xs,
    backgroundColor: AppColors.white,
  },
  AddButton: {
    justifyContent: 'center',
    marginBottom: hp(15),
    marginTop: hp(20),
    width: '95%',
    alignItems: 'center',
    alignSelf: 'center',
  },
  itemStyle: {
    paddingHorizontal: hp(2),
    paddingVertical: hp(2),
    backgroundColor: AppColors.white,
    marginBottom: hp(1),
    borderRadius: 10,
  },
});

// const createPostData = [
//   {value: 'Crypto', label: 'Crypto'},
//   {value: 'Real Estate', label: 'Real Estate'},
//   {value: 'Industry', label: 'Industry'},
//   {value: 'Energy', label: 'Energy'},
//   {value: 'Technology', label: 'Technology'},
// ];
