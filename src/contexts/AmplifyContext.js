// import { createContext, useEffect, useReducer } from 'react';
// import PropTypes from 'prop-types';
// import Amplify, { Auth } from 'aws-amplify';
// import { amplifyConfig } from '../config';

// Amplify.configure(amplifyConfig);

// const initialAuthState = {
//   isAuthenticated: false,
//   isInitialized: false,
//   user: null
// };

// const handlers = {
//   INITIALIZE: (state, action) => {
//     const { isAuthenticated, user } = action.payload;

//     return {
//       ...state,
//       isAuthenticated,
//       isInitialized: true,
//       user
//     };
//   },
//   LOGIN: (state, action) => {
//     const { user } = action.payload;

//     return {
//       ...state,
//       isAuthenticated: true,
//       user
//     };
//   },
//   LOGOUT: (state) => ({
//     ...state,
//     isAuthenticated: false,
//     user: null
//   }),
//   REGISTER: (state) => ({ ...state }),
//   VERIFY_CODE: (state) => ({ ...state }),
//   RESEND_CODE: (state) => ({ ...state }),
//   PASSWORD_RECOVERY: (state) => ({ ...state }),
//   PASSWORD_RESET: (state) => ({ ...state })
// };

// const reducer = (state, action) =>
//   handlers[action.type] ? handlers[action.type](state, action) : state;

// const AuthContext = createContext({
//   ...initialAuthState,
//   method: 'Amplify',
//   login: () => Promise.resolve(),
//   logout: () => Promise.resolve(),
//   register: () => Promise.resolve(),
//   verifyCode: () => Promise.resolve(),
//   resendCode: () => Promise.resolve(),
//   passwordRecovery: () => Promise.resolve(),
//   passwordReset: () => Promise.resolve()
// });

// export const AuthProvider = (props) => {
//   const { children } = props;
//   const [state, dispatch] = useReducer(reducer, initialAuthState);

//   useEffect(() => {
//     const initialize = async () => {
//       try {
//         const user = await Auth.currentAuthenticatedUser();

//         dispatch({
//           type: 'INITIALIZE',
//           payload: {
//             isAuthenticated: true,
//             user: {
//               id: user.sub,
//               jobtitle: 'Lead Developer',
//               avatar: user.picture,
//               email: user.email,
//               name: user.name,
//               role: user.role,
//               location: user.location,
//               username: user.username,
//               posts: user.posts,
//               coverImg: user.coverImg,
//               followers: user.followers,
//               description: user.description
//             }
//           }
//         });
//       } catch (error) {
//         dispatch({
//           type: 'INITIALIZE',
//           payload: {
//             isAuthenticated: false,
//             user: null
//           }
//         });
//       }
//     };

//     initialize();
//   }, []);

//   const login = async (email, password) => {
//     const user = await Auth.signIn(email, password);

//     if (user.challengeName) {
//       console.error(`Can't login, "${user.challengeName}" failed.`);
//       return;
//     }

//     dispatch({
//       type: 'LOGIN',
//       payload: {
//         user: {
//           id: user.sub,
//           jobtitle: 'Lead Developer',
//           avatar: user.picture,
//           email: user.email,
//           name: user.name,
//           role: user.role,
//           location: user.location,
//           username: user.username,
//           posts: user.posts,
//           coverImg: user.coverImg,
//           followers: user.followers,
//           description: user.description
//         }
//       }
//     });
//   };

//   const logout = async () => {
//     await Auth.signOut();
//     dispatch({
//       type: 'LOGOUT'
//     });
//   };

//   const register = async (email, password) => {
//     await Auth.signUp({
//       username: email,
//       password,
//       attributes: { email }
//     });
//     dispatch({
//       type: 'REGISTER'
//     });
//   };

//   const verifyCode = async (username, code) => {
//     await Auth.confirmSignUp(username, code);
//     dispatch({
//       type: 'VERIFY_CODE'
//     });
//   };

//   const resendCode = async (username) => {
//     await Auth.resendSignUp(username);
//     dispatch({
//       type: 'RESEND_CODE'
//     });
//   };

//   const passwordRecovery = async (username) => {
//     await Auth.forgotPassword(username);
//     dispatch({
//       type: 'PASSWORD_RECOVERY'
//     });
//   };

//   const passwordReset = async (username, code, newPassword) => {
//     await Auth.forgotPasswordSubmit(username, code, newPassword);
//     dispatch({
//       type: 'PASSWORD_RESET'
//     });
//   };

//   return (
//     <AuthContext.Provider
//       value={{
//         ...state,
//         method: 'Amplify',
//         login,
//         logout,
//         register,
//         verifyCode,
//         resendCode,
//         passwordRecovery,
//         passwordReset
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

// AuthProvider.propTypes = {
//   children: PropTypes.node.isRequired
// };

// export default AuthContext;
