import { useLocation, useNavigate } from 'react-router-dom';
import kebabCase from 'lodash/kebabCase';
import routes from '../routes';

const useNavLinks = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navLinkItems = new Array(0).concat(
    Object.keys(routes).map((routeKey, idx, arr) => {
      const routesCount = arr.length;

      if (idx === 0) {
        return {
          key: 'Start',
          label: 'Start',
          onClick: () => navigate('/'),
        };
      }

      if (idx === routesCount - 1) {
        return {
          key: 'End',
          label: 'End',
          onClick: () => navigate('/'.concat(kebabCase(routeKey))),
        };
      }

      return {
        key: routeKey,
        label: `Step${idx}`,
        onClick: () => navigate('/'.concat(kebabCase(routeKey))),
      };
    })
  );

  const activeKey = navLinkItems.find((i) => {
    const pathname = location.pathname.replace('/', '');

    if (!pathname) return i.key === 'Start';
    return kebabCase(i.key) === pathname;
  })?.key;

  return { items: navLinkItems, activeKey };
};

export default useNavLinks;
