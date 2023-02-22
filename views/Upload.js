import React, {useCallback, useContext, useRef, useState} from 'react';
import PropTypes from 'prop-types';
import {Button, Card, Input} from '@rneui/themed';
import {Controller, useForm} from 'react-hook-form';
import {Alert, Keyboard, ScrollView, TouchableOpacity} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import {useMedia, useTag} from '../hooks/ApiHooks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {MainContext} from '../contexts/MainContext';
import {useFocusEffect} from '@react-navigation/native';
import {appId} from '../utils/variables';
import {Video} from 'expo-av';

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

  const resetForm = () => {
    setMediafile({});
    reset();
  };

  useFocusEffect(
    useCallback(() => {
      return () => {
        console.log('leaving');
        resetForm();
      };
    }, [])
  );

  console.log('tupe', mediafile.type);

  return (
    <ScrollView>
      <TouchableOpacity onPress={() => Keyboard.dismiss()} activeOpacity={1}>
        <Card>
          {mediafile.type === 'video' ? (
            <Video
              ref={video}
              source={{uri: mediafile.uri}}
              style={{width: '100%', height: 200}}
              resizeMode="cover"
              useNativeControls
              onError={(error) => {
                console.log(error);
              }}
            />
          ) : (
            <Card.Image
              source={{
                uri: mediafile.uri || 'https://picsum.photos/id/237/200/300',
              }}
              onPress={pickFile}
            />
          )}
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
              minLength: {
                value: 3,
                message: 'Title min length is 3 characters.',
              },
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
            rules={{
              minLength: {
                value: 5,
                message: 'Description min length is 5 characters.',
              },
            }}
            render={({field: {onChange, onBlur, value}}) => (
              <Input
                placeholder="Write a description here.."
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                errorMessage={errors.description && errors.description.message}
              />
            )}
            name="description"
          />
          <Button title="Pick an image" onPress={pickFile} />
          <Button
            loading={loading}
            disabled={!mediafile.uri}
            title="Upload"
            onPress={handleSubmit(uploadFile)}
          />
          <Button title={'Reset'} onPress={resetForm} type="outline" />
        </Card>
      </TouchableOpacity>
    </ScrollView>
  );
};

Upload.propTypes = {
  navigation: PropTypes.object,
};

export default Upload;
