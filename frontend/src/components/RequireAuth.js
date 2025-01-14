import { Navigate } from 'react-router-dom';
import { LOGIN_ROUTE } from '../utils/consts';

const RequireAuth = ({ isAuth, children }) => {
    console.log('isAuth', isAuth)
    return isAuth ? children : <Navigate to={LOGIN_ROUTE} replace />;
};

export default RequireAuth