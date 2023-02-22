import React, {useState} from 'react';
import PropTypes from 'prop-types';

// This is needed to change the value of isLoggedIn
// To share that to different components like Navigator, Login and Profile

const MainContext = React.createContext({});

const MainProvider = (props) => {
  //  Provides access to the values inside the content application wide in array format
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState({});
  const [update, setUpdate] = useState(true);
  return (
    <MainContext.Provider
      value={{isLoggedIn, setIsLoggedIn, user, setUser, update, setUpdate}}
    >
      {props.children}
    </MainContext.Provider>
  );
};

MainProvider.propTypes = {
  children: PropTypes.node,
};

export {MainContext, MainProvider};
