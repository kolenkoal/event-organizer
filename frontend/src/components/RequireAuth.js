import { Navigate } from 'react-router-dom';
import { LOGIN_ROUTE } from '../utils/consts';

const RequireAuth = ({ isAuth, children }) => {
    const localItem = localStorage.getItem('isAuth')
    console.log(localItem)
    // console.log('isAuth', isAuth)
    return localItem ? children : <Navigate to={LOGIN_ROUTE} />;
};

export default RequireAuth