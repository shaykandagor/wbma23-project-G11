import {StyleSheet} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import {FlatList} from 'react-native';
import {View} from 'react-native';
import {Avatar, Input} from '@rneui/themed';
import {ListItem} from 'react-native-elements';
import moment from 'moment';
import colors from '../config/colors';
import {useComment, useTag} from '../hooks/ApiHooks';
import PropTypes from 'prop-types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {uploadsUrl} from '../utils/variables';
import {MainContext} from '../contexts/MainContext';

const Comments = ({route}) => {
  const fileId = route.params.fileId;
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const {getCommentsByFileId, postComment} = useComment();
  const {getFilesByTag} = useTag();
  const {user} = useContext(MainContext);
  const [avatar, setAvatar] = useState('');

  const fetchComments = async () => {
    const commentsResponse = await getCommentsByFileId(fileId);
    setComments(commentsResponse);
  };
  useEffect(() => {
    fetchComments();
  }, []);

  const handleAddComment = async () => {
    const userToken = await AsyncStorage.getItem('userToken');
    await postComment(userToken, {
      comment: newComment,
      file_id: fileId,
    });
    await fetchComments();
  };

  const loadAvatar = async () => {
    try {
      const avatarArray = await getFilesByTag('avatar_' + user.user_id);
      // Getting the latest profile if you have uploaded many files
      setAvatar(avatarArray.pop().filename);
    } catch (error) {
      console.error('user avatar fetch failed', error.message);
    }
  };

  useEffect(() => {
    loadAvatar();
  }, []);

  const renderItem = ({item}) => (
    <ListItem key={item.id}>
      <Avatar rounded source={{uri: uploadsUrl + avatar}} />
      <ListItem.Content>
        <ListItem.Title>{item.comment}</ListItem.Title>
        <ListItem.Subtitle>
          {moment(item.time_added).format('Do MMMM YYYY')}
        </ListItem.Subtitle>
      </ListItem.Content>
    </ListItem>
  );

  return (
    <View style={styles.list}>
      <FlatList
        data={comments}
        renderItem={renderItem}
        keyExtractor={(item) => item.comment_id}
      />
      <View>
        <Input
          value={newComment}
          onChangeText={setNewComment}
          placeholder="Comment here .."
          rightIcon={{
            name: 'send',
            onPress: handleAddComment,
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  list: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: colors.white,
  },
});

Comments.propTypes = {
  route: PropTypes.object,
};

export default Comments;
