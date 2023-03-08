import {StyleSheet} from 'react-native';
import React, {useEffect, useState} from 'react';
import {FlatList} from 'react-native';
import {View} from 'react-native';
import {Avatar, Input} from '@rneui/themed';
import {ListItem} from 'react-native-elements';
import moment from 'moment';
import colors from '../config/colors';
import {useComment} from '../hooks/ApiHooks';
import PropTypes from 'prop-types';
import AsyncStorage from '@react-native-async-storage/async-storage';

const renderItem = ({item}) => (
  <ListItem key={item.id}>
    <Avatar
      rounded
      source={{uri: 'https://randomuser.me/api/portraits/men/36.jpg'}}
    />
    <ListItem.Content>
      <ListItem.Title>{item.comment}</ListItem.Title>
      <ListItem.Subtitle>
        {moment(item.time_added).format('Do MMMM YYYY')}
      </ListItem.Subtitle>
    </ListItem.Content>
  </ListItem>
);

const Comments = ({fileId = 6286}) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const {getCommentsByFileId, postComment} = useComment();

  const fetchComments = async () => {
    const commentsResponse = await getCommentsByFileId(fileId);
    // console.log(commentsResponse);
    setComments(commentsResponse);
  };
  useEffect(() => {
    fetchComments();
  }, []);

  const handleAddComment = async () => {
    const userToken = await AsyncStorage.getItem('userToken');
    const response = await postComment(userToken, {
      comment: newComment,
      file_id: fileId,
    });
    await fetchComments();
  };

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
  fileId: PropTypes.number,
};

export default Comments;
