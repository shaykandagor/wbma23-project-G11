import React from 'react';
import {StyleSheet, Image, View} from 'react-native';
import PropTypes from 'prop-types';
import {uploadsUrl} from '../utils/variables';
import {Card, Text, Icon, Button} from 'react-native-elements';

const Single = ({route}) => {
  console.log(route.params);
  const {title, description, filename, time_added: timeAdded} = route.params;

  return (
    <Card>
      <Image style={styles.itemImage} source={{uri: uploadsUrl + filename}} />
      <View style={styles.categoryContainer}>
        <Text style={styles.categoryText}>Women</Text>
        <Text style={styles.categoryText}>Size 38</Text>
        <Text style={styles.categoryText}>Trousers</Text>
      </View>
      <Text style={styles.itemName}>{title}</Text>
      <Icon
        name="heart"
        type="font-awesome"
        color="#f50"
        style={styles.heartIcon}
      />
      <Text style={styles.itemPrice}>$100</Text>
      <Text style={styles.itemLocation}>Location</Text>
      <Text style={styles.itemDescription}>{description}</Text>
      <View style={styles.sellerInfoContainer}>
        <Text style={styles.sellerName}>Seller Name</Text>
        <Icon
          name="shopping-bag"
          type="font-awesome"
          color="#517fa4"
          style={styles.shoppingBagIcon}
        />
        <Text style={styles.sellerItemsCount}>20</Text>
      </View>
      <Text style={styles.postedDate}>{timeAdded}</Text>
      <Button
        icon={<Icon name="envelope" type="font-awesome" color="#ffffff" />}
        title="Send message"
      />
    </Card>
  );
};

const styles = StyleSheet.create({
  itemImage: {
    width: '100%',
    height: 200,
  },
  categoryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  categoryText: {
    color: '#517fa4',
    fontWeight: 'bold',
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  heartIcon: {
    position: 'absolute',
    right: 0,
    top: 10,
  },
  itemPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#f50',
    marginTop: 10,
  },
  itemLocation: {
    color: '#517fa4',
    marginTop: 10,
  },
  itemDescription: {
    marginTop: 10,
  },
  sellerInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  sellerName: {
    fontWeight: 'bold',
  },
  shoppingBagIcon: {
    marginLeft: 5,
    marginRight: 5,
  },
  sellerItemsCount: {
    color: '#517fa4',
  },
  postedDate: {
    color: '#517fa4',
    marginTop: 10,
  },
});

Single.propTypes = {
  route: PropTypes.object,
};

export default Single;
