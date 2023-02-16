import React, {useState} from 'react';
import PropTypes from 'prop-types';

// This is needed to change the value of isLoggedIn
// To share that to different components like Navigator, Login and Profile

const MainContext = React.createContext({});

const MainProvider = (props) => {
  //  Provides access to the values inside the content application wide in array format
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  return (
    <MainContext.Provider value={{isLoggedIn, setIsLoggedIn}}>
      {props.children}
    </MainContext.Provider>
  );
};

MainProvider.propTypes = {
  children: PropTypes.node,
};

export {MainContext, MainProvider};
