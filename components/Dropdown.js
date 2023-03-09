import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';
import colors from '../config/colors';

const categoryWMKData = [
  {label: 'Women', categoryWMK: 'women'},
  {label: 'Men', categoryWMK: 'men'},
  {label: 'Kids', categoryWMK: 'kids'},
];
const categorytypeData = [
  {label: 'Clothes', value: 'Clothes'},
  {label: 'Shoes', value: 'Shoes'},
  {label: 'Aceessories', value: 'Aceessories'},
];

const DropdownComponent = () => {
  // const [value, setValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);
  const [dropDownWMK, setWMKcategory] = useState(null);
  const [categorytype, setCategoryType] = useState(null);

  return (
    <View style={styles.container}>
      <Dropdown
        style={[styles.dropdown, isFocus && {borderColor: colors.secondary}]}
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
        style={[styles.dropdown, isFocus && {borderColor: colors.secondary}]}
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
  );
};

export default DropdownComponent;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.lightgreen,
    padding: 16,
  },
  dropdown: {
    height: 50,
    borderColor: colors.secondary,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 10,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: 'absolute',
    backgroundColor: 'white',
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});
