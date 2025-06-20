import { createContext, useEffect, useReducer } from 'react';
import axios from 'src/utils/taxios';
import { decrypt } from 'src/utils/security';
import PropTypes from 'prop-types';

const initialAuthState = {
  isAuthenticated: false,
  isInitialized: false,
  user: null
};

const setSession = (accessToken) => {
  if (accessToken) {
    sessionStorage.setItem('accessToken', accessToken);
    axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
  } else {
    sessionStorage.removeItem('accessToken');
    delete axios.defaults.headers.common.Authorization;
  }
};

const handlers = {
  INITIALIZE: (state, action) => {
    const { isAuthenticated, user } = action.payload;

    return {
      ...state,
      isAuthenticated,
      isInitialized: true,
      user
    };
  },
  LOGIN: (state, action) => {
    const { user } = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user
    };
  },
  LOGOUT: (state) => ({
    ...state,
    isAuthenticated: false,
    user: null
  }),
  REGISTER: (state, action) => {
    const { user } = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user
    };
  }
};

const reducer = (state, action) =>
  handlers[action.type] ? handlers[action.type](state, action) : state;

const AuthContext = createContext({
  ...initialAuthState,
  method: 'JWT',
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  register: () => Promise.resolve()
});

export const AuthProvider = (props) => {
  const { children } = props;
  const [state, dispatch] = useReducer(reducer, initialAuthState);

  useEffect(() => {
    const initialize = async () => {
      try {
        const accessToken = sessionStorage.getItem('accessToken');

        if (accessToken) {
          setSession(accessToken);
          let user = decrypt(accessToken);
          if (user) {
            user = JSON.parse(user);
            dispatch({
              type: 'INITIALIZE',
              payload: {
                isAuthenticated: true,
                user
              }
            });
          } else {
            dispatch({
              type: 'INITIALIZE',
              payload: {
                isAuthenticated: false,
                user: null
              }
            });
          }
        } else {
          dispatch({
            type: 'INITIALIZE',
            payload: {
              isAuthenticated: false,
              user: null
            }
          });
        }
      } catch (err) {
        console.error(err);
        dispatch({
          type: 'INITIALIZE',
          payload: {
            isAuthenticated: false,
            user: null
          }
        });
      }
    };

    initialize();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post('/merchant/auto/login', {
        username: email,
        password
      });
      console.log(response);

      if (
        response.status === 200 &&
        response.data.type === 0 &&
        response.data.data
      ) {
        const { accessToken } = response.data.data;

        if (accessToken) {
          sessionStorage.setItem('accessToken', accessToken);
          setSession(accessToken);

          let user = decrypt(accessToken);
          if (user) {
            user = JSON.parse(user);
          }

          dispatch({
            type: 'LOGIN',
            payload: {
              user
            }
          });
        }
      }

      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    setSession(null);
    dispatch({ type: 'LOGOUT' });
  };

  const register = async (email, name, password) => {
    try {
      const response = await axios.post('/account/register', {
        email,
        name,
        password
      });

      const { accessToken, user } = response.data;

      // Fixed: consistent key name
      sessionStorage.setItem('accessToken', accessToken);
      setSession(accessToken);

      dispatch({
        type: 'REGISTER',
        payload: {
          user
        }
      });

      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        method: 'JWT',
        login,
        logout,
        register
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export default AuthContext;
