import React, {useContext, useState} from 'react';
import PropTypes from 'prop-types';
import {Button, Card, Input} from '@rneui/themed';
import {Controller, useForm} from 'react-hook-form';
import {
  ActivityIndicator,
  Keyboard,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import {useMedia} from '../hooks/ApiHooks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Alert} from 'react-native';
import {MainContext} from '../contexts/MainContext';

const Upload = ({navigation}) => {
  const [mediafile, setMediafile] = useState({});
  // Loading is true the Activity Indicator is visible
  // Loading is false the Activity Indicator is hidden
  const [loading, setLoading] = useState(false);
  const {postMedia} = useMedia();
  const {update, setUpdate} = useContext(MainContext);
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    defaultValues: {
      // category: '',
      // size: '',
      title: '',
      description: '',
    },
  });

  // This function enales the user to upload a file with its info
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
      const result = await postMedia(
        formData,
        await AsyncStorage.getItem('userToken')
      );
      setLoading(false);
      console.log('upload result', result);
      Alert.alert('Upload Ok', 'file id: ' + result.file_id, [
        {
          text: 'OK',
          onPress: () => {
            console.log('OK Pressed');
            // TODO: Navigate to home
            setUpdate(!update);
            // update the update state in the main context
          },
        },
      ]);
    } catch (error) {
      console.log('file upload failed', error);
    } finally {
      setLoading(false);
    }

    console.log('upload a file', data);
  };

  // This function is async because when the system launches the image picker it
  // waits for the user to choose an image from the device and then the file is ready
  const pickFile = async () => {
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
    }
  };

  return (
    <ScrollView>
      <TouchableOpacity
        onPress={() => Keyboard.dismiss()}
        style={{flex: 1}}
        activeOpacity={1}
      >
        <Card>
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
          <Controller
            control={control}
            rules={{
              required: {value: true, message: 'Title is required.'},
            }}
            render={({field: {onChange, onBlur, value}}) => (
              <Input
                placeholder="Write a title here.."
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                autoCapitalize="none"
                errorMessage={errors.title && errors.title.message}
              />
            )}
            name="title"
          />
          <Controller
            control={control}
            render={({field: {onChange, onBlur, value}}) => (
              <Input
                placeholder="Write a description here.."
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                autoCapitalize="none"
              />
            )}
            name="description"
          />
          <Button title="Pick an image" onPress={pickFile} />
          <Button
            disabled={!mediafile.uri}
            title="Upload"
            onPress={handleSubmit(uploadFile)}
          />
          {loading && <ActivityIndicator size="large" />}
        </Card>
      </TouchableOpacity>
    </ScrollView>
  );
};

Upload.propTypes = {
  navigation: PropTypes.object,
};

export default Upload;
