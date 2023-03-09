import {Button, Card} from '@rneui/themed';
import PropTypes from 'prop-types';
import {Controller, useForm} from 'react-hook-form';
import {
  Alert,
  Keyboard,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {useContext, useState} from 'react';
import {useMedia} from '../hooks/ApiHooks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {MainContext} from '../contexts/MainContext';
import {uploadsUrl} from '../utils/variables';
import colors from '../config/colors';
import {ActivityIndicator} from 'react-native';
import {View} from 'react-native';
import {TextInput} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';

const Modify = ({navigation, route}) => {
  const {file} = route.params;
  const [loading, setLoading] = useState(false);
  const {putMedia} = useMedia();
  const {update, setUpdate} = useContext(MainContext);

  const categoryWMKData = [
    {label: 'Women', categoryWMK: 'women'},
    {label: 'Men', categoryWMK: 'men'},
    {label: 'Kids', categoryWMK: 'kids'},
  ];
  const categorytypeData = [
    {label: 'Clothes', value: 'Clothes'},
    {label: 'Shoes', value: 'Shoes'},
    {label: 'Accessories', value: 'Accessories'},
  ];

  const [isFocus, setIsFocus] = useState(false);
  const [dropDownWMK, setWMKcategory] = useState(null);
  const [categorytype, setCategoryType] = useState(null);

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    defaultValues: {title: file.title, description: file.description},
    mode: 'onChange',
  });

  const modifyFile = async (data) => {
    // create form data and post it
    setLoading(true);
    console.log('data', data);
    try {
      const token = await AsyncStorage.getItem('userToken');
      const result = await putMedia(file.file_id, data, token);

      Alert.alert('Success', result.message, [
        {
          text: 'OK',
          onPress: () => {
            setUpdate(!update);
            navigation.navigate('MyFiles');
          },
        },
      ]);
    } catch (error) {
      console.error('file modify failed', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={[styles.wholeview]}>
      <TouchableOpacity
        onPress={() => Keyboard.dismiss()}
        style={{flex: 1}}
        activeOpacity={1}
      >
        <View style={[styles.wholeview]}>
          <View style={[styles.card, styles.shadowProp, styles.elevation]}>
            <View style={styles.imageContainer}>
              <Card.Image source={{uri: uploadsUrl + file.filename}} />
            </View>
            <Controller
              control={control}
              rules={{
                required: {value: true, message: 'Title is required.'},
                minLength: {
                  value: 3,
                  message: 'Title min length is 3 characters.',
                },
              }}
              render={({field: {onChange, onBlur, value}}) => (
                <TextInput
                  style={styles.inputStyle}
                  multiline
                  numberOfLines={1}
                  placeholder="Title"
                  placeholderTextColor={colors.black}
                  labelStyle={{backgroundColor: colors.lightgray}}
                  value={value}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  autoCapitalize="none"
                  errorMessage={errors.title && errors.title.message}
                  outlined
                  borderColor={colors.secondary}
                />
              )}
              name="title"
            />
            <Controller
              control={control}
              rules={{
                required: {value: true, message: 'Description is required.'},
                minLength: {
                  value: 5,
                  message: 'Description min length is 5 characters.',
                },
              }}
              render={({field: {onChange, onBlur, value}}) => (
                <TextInput
                  style={styles.inputStyle}
                  multiline
                  numberOfLines={4}
                  label="Write a description here.."
                  placeholder="Write a description here.."
                  textAlignVertical="top"
                  placeholderTextColor={colors.black}
                  labelStyle={{backgroundColor: colors.lightgray}}
                  value={value}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  autoCapitalize="none"
                  outlined
                  borderColor={colors.secondary}
                />
              )}
              name="description"
            />
            {/* <Controller
              control={control}
              rules={{
                required: {value: true, message: 'Price is required.'},
              }}
              render={({field: {onChange, onBlur, value}}) => (
                <TextInput
                  style={styles.inputStyle}
                  label="Price"
                  placeholder="Price"
                  placeholderTextColor={colors.black}
                  labelStyle={{backgroundColor: colors.lightgray}}
                  value={value}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  autoCapitalize="none"
                  outlined
                  borderColor={colors.secondary}
                />
              )}
              name="price"
              /> */}

            <View style={styles.DropdownContainer}>
              <Dropdown
                style={[
                  styles.dropdown,
                  isFocus && {borderColor: colors.secondary},
                ]}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                iconStyle={styles.iconStyle}
                data={categoryWMKData}
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder={'Select category'}
                value={dropDownWMK}
                onFocus={() => setIsFocus(true)}
                onBlur={() => setIsFocus(false)}
                onChange={(item) => {
                  setWMKcategory(item.value);
                  setIsFocus(false);
                }}
              />
              <Dropdown
                style={[
                  styles.dropdown,
                  isFocus && {borderColor: colors.secondary},
                ]}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                iconStyle={styles.iconStyle}
                data={categorytypeData}
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder={!isFocus ? 'Select category' : '...'}
                value={categorytype}
                onFocus={() => setIsFocus(true)}
                onBlur={() => setIsFocus(false)}
                onChange={(item) => {
                  setCategoryType(item.value);
                  setIsFocus(false);
                }}
              />
            </View>
            <Button
              title="MODIFY"
              loading={loading}
              buttonStyle={{
                backgroundColor: colors.secondary,
                borderWidth: 0,
                borderColor: 'transparent',
                borderRadius: 30,
              }}
              containerStyle={{
                width: 350,
                marginHorizontal: 50,
                marginVertical: 10,
                alignSelf: 'center',
              }}
              titleStyle={{fontWeight: 'bold'}}
              onPress={handleSubmit(modifyFile)}
            />
            {loading && <ActivityIndicator size="large" />}
          </View>
        </View>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  wholeview: {
    backgroundColor: 'white',
    alignContent: 'center',
  },
  inputStyle: {
    marginBottom: 20,
    marginHorizontal: 20,
    paddingHorizontal: 10,
    paddingVertical: 13,
    borderWidth: 1,
    borderColor: colors.secondary,
    alignItems: 'stretch',
    borderRadius: 8,
  },
  card: {
    backgroundColor: colors.lightgreen,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 10,
    width: '90%',
    marginVertical: 10,
    marginHorizontal: 14,
    marginRight: 14,
  },
  shadowProp: {
    shadowColor: '#171717',
    shadowOffset: {width: -2, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  elevation: {
    elevation: 10,
    shadowColor: '#52006A',
  },
  buttonStyle: {
    backgroundColor: colors.secondary,
    borderRadius: 8,
    margin: 14,
    alignSelf: 'center',
  },
  pickImage: {
    height: 200,
    backgroundColor: colors.lightgreen,
    borderWidth: 1,
    borderColor: colors.secondary,
    borderRadius: 5,
    margin: 14,
  },
  imageContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagestyle: {
    resizeMode: 'center',
    height: 400,
    width: 225,
    marginBottom: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.secondary,
  },
  dropdownContainer: {
    backgroundColor: colors.lightgreen,
    padding: 16,
    marginHorizontal: 20,
  },
  dropdown: {
    height: 50,
    borderColor: colors.secondary,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 10,
    marginHorizontal: 20,
  },
  icon: {
    marginRight: 5,
  },
  placeholderStyle: {
    fontSize: 14,
  },
  selectedTextStyle: {
    fontSize: 14,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
});

Modify.propTypes = {
  navigation: PropTypes.object,
  route: PropTypes.object,
};
export default Modify;
