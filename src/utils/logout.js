import history from 'utils/history';
import { clearSessionData, clearCookie } from 'utils/session';

const forceLogout = () => {
  clearSessionData();
  clearCookie();
  history.push('/');
};

export { forceLogout };
