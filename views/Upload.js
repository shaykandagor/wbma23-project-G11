import React, {useContext, useRef, useState} from 'react';
import PropTypes from 'prop-types';
import {Button, Card} from '@rneui/themed';
import Input from 'react-native-input-style';
import {Controller, useForm} from 'react-hook-form';
import {
  ActivityIndicator,
  Keyboard,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  View,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import {useMedia, useTag} from '../hooks/ApiHooks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {MainContext} from '../contexts/MainContext';
import colors from '../config/colors';
import {SelectList} from 'react-native-dropdown-select-list';
import {appId} from '../utils/variables';

const Upload = ({navigation}) => {
  const [mediafile, setMediafile] = useState({});
  const video = useRef(null);
  // Loading is true the Activity Indicator is visible
  // Loading is false the Activity Indicator is hidden
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
      // category: '',
      // size: '',
      title: '',
      description: '',
      mode: 'onChange',
    },
  });

  // This function enables the user to upload a file with its info
  const uploadFile = async (data) => {
    //  Creates form data and posts it
    setLoading(true);
    const formData = new FormData();
    // formData.append('category', JSON.stringify(moreFileData));
    // formData.append('size', JSON.stringify(moreFileData));
    formData.append('title', data.title);
    formData.append('description', data.description);
    const filename = mediafile.uri.split('/').pop();
    let fileExt = filename.split('.').pop();
    if (fileExt === 'jpg') fileExt = 'jpeg';
    const mimeType = mediafile.type + '/' + fileExt;
    formData.append('file', {
      uri: mediafile.uri,
      name: filename,
      type: mimeType,
    });
    console.log('form data', formData);

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
        aspect: [4, 3],
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

  const [/* selected,*/ setSelected] = React.useState('');

  const category1 = [
    {key: '1', value: 'Women'},
    {key: '2', value: 'Men'},
    {key: '3', value: 'Kids'},
  ];
  const category2 = [
    {key: '1', value: 'Clothes'},
    {key: '2', value: 'Shoes'},
    {key: '3', value: 'Aceessories'},
  ];
  const category3 = [
    {key: '1', value: 'Baby'},
    {key: '2', value: '1-2years'},
    {key: '3', value: '2-3years'},
    {key: '4', value: '3-4years'},
    {key: '5', value: '4-5years'},
    {key: '6', value: '6-7years'},
    {key: '7', value: '7-9years'},
    {key: '8', value: '9-11years'},
    {key: '9', value: '11-13years'},
    {key: '10', value: '13-15years'},
    {key: '11', value: '15-17years'},
  ];
  return (
    <ScrollView style={[styles.wholeview]}>
      <TouchableOpacity
        onPress={() => Keyboard.dismiss()}
        style={{flex: 1}}
        activeOpacity={1}
      >
        <View style={[styles.card, styles.shadowProp]}>
          <Card.Image
            source={{
              uri: mediafile.uri || 'https://picsum.photos/id/237/200/300',
            }}
          />
          {/* <Controller
            control={control}
            rules={{
              required: {value: true, message: 'Category is required.'},
            }}
            render={({field: {onChange, onBlur, value}}) => (
              <Input
                placeholder="Select Category"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                autoCapitalize="none"
                errorMessage={errors.category && errors.category.message}
              />
            )}
            name="category"
          />
          <Controller
            control={control}
            rules={{
              required: {value: true, message: 'Size is required.'},
            }}
            render={({field: {onChange, onBlur, value}}) => (
              <Input
                placeholder="Choose Size"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                autoCapitalize="none"
                errorMessage={errors.size && errors.size.message}
              />
            )}
            name="size"
          /> */}
          <SelectList
            setSelected={(val) => setSelected(val)}
            data={category1}
            save="value"
            placeholder="Select Category"
            search={false}
            boxStyles={{
              marginHorizontal: 14,
              marginVertical: 8,
              borderRadius: 5,
              backgroundColor: colors.secondary,
            }}
          />
          <SelectList
            setSelected={(val) => setSelected(val)}
            data={category2}
            save="value"
            placeholder="Select Category"
            search={false}
            boxStyles={{
              marginHorizontal: 14,
              marginVertical: 8,
              borderRadius: 5,
              backgroundColor: colors.secondary,
            }}
          />
          <SelectList
            setSelected={(val) => setSelected(val)}
            data={category3}
            save="value"
            placeholder="Select Size"
            search={false}
            boxStyles={{
              marginHorizontal: 14,
              marginVertical: 8,
              borderRadius: 5,
              backgroundColor: colors.secondary,
            }}
          />
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
              <Input
                label="Title"
                labelStyle={{backgroundColor: colors.lightgray}}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
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
              minLength: {
                value: 5,
                message: 'Description min length is 5 characters.',
              },
            }}
            render={({field: {onChange, onBlur, value}}) => (
              <Input
                label="Write a description here.."
                labelStyle={{backgroundColor: colors.lightgray}}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                autoCapitalize="none"
                outlined
                borderColor={colors.secondary}
              />
            )}
            name="description"
          />

          <Button
            title="Pick an image"
            onPress={pickFile}
            buttonStyle={{
              backgroundColor: colors.secondary,
              borderRadius: 5,
              margin: 14,
            }}
            containerViewStyle={{
              borderRadius: 20,
              elevation: 15,
            }}
          />
          <Button
            buttonStyle={{
              backgroundColor: colors.secondary,
              borderRadius: 5,
              margin: 14,
            }}
            containerViewStyle={{
              borderRadius: 20,
              elevation: 15,
            }}
            disabled={!mediafile.uri}
            title="Upload"
            onPress={handleSubmit(uploadFile)}
          />
          {loading && <ActivityIndicator size="large" />}
        </View>
      </TouchableOpacity>
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  wholeview: {
    backgroundColor: 'white',
  },
  card: {
    backgroundColor: colors.lightgray,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 10,
    width: '90%',
    marginVertical: 10,
    marginHorizontal: 14,
    marginRight: 14,
  },
});

Upload.propTypes = {
  navigation: PropTypes.object,
};

export default Upload;
