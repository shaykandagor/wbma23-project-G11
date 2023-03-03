import {
  Keyboard,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import PropTypes from 'prop-types';
import colors from '../config/colors';
import UpdateUserForm from '../components/UpdateUserForm';
import {Image} from '@rneui/themed';

// Login function is called when the login button is pressed
const UpdateUser = ({navigation, route}) => {
  // const [isUpdate, setisUpdate] = useState(route.params);

  return (
    <ScrollView>
      <View style={styles.card}>
        <Image
          style={styles.logo}
          source={require('../assets/renewlogo.jpg')}
        />
      </View>

      <TouchableOpacity
        onPress={() => Keyboard.dismiss()}
        style={{flex: 1}}
        activeOpacity={1}
      >
        <KeyboardAvoidingView style={styles.container}>
          <UpdateUserForm navigation={navigation} />
        </KeyboardAvoidingView>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: colors.lightgreen,
    flex: 1,
  },
  card: {
    backgroundColor: colors.lightgreen,
    alignItems: 'center',
    flex: 1,
  },
  logo: {
    width: 250,
    height: 200,
  },
  text: {
    paddingTop: 30,
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
    paddingLeft: 50,
  },
});

UpdateUser.propTypes = {
  navigation: PropTypes.object,
  route: PropTypes.object,
};

export default UpdateUser;
