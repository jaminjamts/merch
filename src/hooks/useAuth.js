import { useContext } from 'react';
// eslint-disable-next-line
import AuthContext from '../contexts/JWTAuthContext';

const useAuth = () => useContext(AuthContext);

export default useAuth;
