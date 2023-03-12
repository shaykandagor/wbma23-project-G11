import React, {useCallback, useContext, useState} from 'react';
import PropTypes from 'prop-types';
import {Card, Button} from '@rneui/themed';
import {Controller, useForm} from 'react-hook-form';
import {
  ActivityIndicator,
  Keyboard,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  View,
  Alert,
  TextInput,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import {useMedia, useTag} from '../hooks/ApiHooks';
import {Dropdown} from 'react-native-element-dropdown';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {MainContext} from '../contexts/MainContext';
import colors from '../config/colors';
import {appId} from '../utils/variables';
import {useFocusEffect} from '@react-navigation/core';

const customerCategories = [
  {label: 'Women', value: 'Women'},
  {label: 'Men', value: 'Men'},
  {label: 'Kids', value: 'Kids'},
];
const itemCategories = [
  {label: 'Clothes', value: 'Clothes'},
  {label: 'Shoes', value: 'Shoes'},
  {label: 'Accessories', value: 'Accessories'},
];

const Upload = ({navigation}) => {
  const [mediafile, setMediafile] = useState({});
  const [loading, setLoading] = useState(false);
  const {postMedia} = useMedia();
  const {postTag} = useTag();
  const {update, setUpdate} = useContext(MainContext);
  const {
    control,
    handleSubmit,
    formState: {errors},
    trigger,
    reset,
  } = useForm({
    defaultValues: {
      title: '',
      description: '',
      price: '',
      size: '',
    },
    mode: 'onChange',
  });

  // This function enables the user to upload a file with its info
  const uploadFile = async (data) => {
    setLoading(true);
    const formData = new FormData();
    formData.append('title', data.title);
    const description = JSON.stringify({
      description: data.description,
      customerCategory: currentCustomerCategory,
      itemCategory: currentItemCategory,
      price: data.price,
      size: data.size,
    });
    formData.append('description', description);
    const filename = mediafile.uri.split('/').pop();
    let fileExt = filename.split('.').pop();
    if (fileExt === 'jpg') fileExt = 'jpeg';
    const mimeType = mediafile.type + '/' + fileExt;
    formData.append('file', {
      uri: mediafile.uri,
      name: filename,
      type: mimeType,
    });

    try {
      const token = await AsyncStorage.getItem('userToken');
      const result = await postMedia(formData, token);

      const appTag = {
        file_id: result.file_id,
        tag: appId,
      };
      const tagResult = await postTag(appTag, token);
      console.log('tag result', tagResult);

      Alert.alert('Upload Ok', 'File id: ' + result.file_id, [
        {
          text: 'OK',
          onPress: () => {
            console.log('OK Pressed');
            // update 'update' state in context
            setUpdate(!update);
            // Navigation to home
            navigation.navigate('Home');
          },
        },
      ]);
    } catch (error) {
      console.log('file upload failed', error);
    } finally {
      setLoading(false);
    }
  };

  // This function is async because when the system launches the image picker it
  // waits for the user to choose an image from the device and then the file is ready
  const pickFile = async () => {
    try {
      // No permissions request is necessary for launching the image library
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [9, 16],
        quality: 0.5,
      });

      console.log(result);

      if (!result.canceled) {
        setMediafile(result.assets[0]);
        // validate form
        trigger();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const resetForm = () => {
    setMediafile({});
    reset();
  };

  useFocusEffect(
    useCallback(() => {
      return () => {
        resetForm();
      };
    }, [])
  );

  const [isFocus, setIsFocus] = useState(false);
  const [currentCustomerCategory, setCurrentCustomerCategory] = useState({});
  const [currentItemCategory, setcurrentItemCategory] = useState({});

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
              <Card.Image
                style={styles.imagestyle}
                placeholderStyle={{}}
                onPress={pickFile}
                source={{
                  uri:
                    mediafile.uri ||
                    'https://t4.ftcdn.net/jpg/04/81/13/43/240_F_481134373_0W4kg2yKeBRHNEklk4F9UXtGHdub3tYk.jpg',
                }}
              />
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
            <Controller
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
            />
            <Controller
              control={control}
              rules={{
                required: {value: true, message: 'Size is required.'},
              }}
              render={({field: {onChange, onBlur, value}}) => (
                <TextInput
                  style={styles.inputStyle}
                  label="Size"
                  placeholder="Size"
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
              name="size"
            />

            <View style={styles.dropdownContainer}>
              <Dropdown
                style={[
                  styles.dropdown,
                  isFocus && {borderColor: colors.secondary},
                ]}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                iconStyle={styles.iconStyle}
                data={customerCategories}
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder={'Select category'}
                value={currentCustomerCategory}
                onFocus={() => setIsFocus(true)}
                onBlur={() => setIsFocus(false)}
                onChange={(item) => {
                  setCurrentCustomerCategory(item.value);
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
                data={itemCategories}
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder={!isFocus ? 'Select category' : '...'}
                value={currentItemCategory}
                onFocus={() => setIsFocus(true)}
                onBlur={() => setIsFocus(false)}
                onChange={(item) => {
                  setcurrentItemCategory(item.value);
                  setIsFocus(false);
                  console.log('item', item);
                }}
              />
            </View>
            <Button
              disabled={!mediafile.uri}
              title="POST"
              onPress={handleSubmit(uploadFile)}
              buttonStyle={{backgroundColor: colors.secondary, borderRadius: 8}}
              containerStyle={{
                width: 200,
                marginHorizontal: 50,
                marginVertical: 10,
                alignSelf: 'center',
              }}
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
    height: 150,
    width: 150,
    marginBottom: 20,
    borderRadius: 100,
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

Upload.propTypes = {
  navigation: PropTypes.object,
};

export default Upload;
