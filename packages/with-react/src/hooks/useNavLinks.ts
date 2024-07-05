import { useLocation, useNavigate } from 'react-router-dom';
import kebabCase from 'lodash/kebabCase';
import routes from '../routes';

type NavLinkItem = { key: string; label: string; onClick: () => void };

const useNavLinks = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navLinkItems = new Array(0).concat(
    Object.keys(routes).map((routeKey, idx, arr) => {
      const routesCount = arr.length;

      if (idx === 0) {
        return {
          key: 'Start',
          label: 'START',
          onClick: () => navigate('/'),
        };
      }

      if (idx === routesCount - 1) {
        return {
          key: 'End',
          label: 'END',
          onClick: () => navigate('/'.concat(kebabCase(routeKey))),
        };
      }

      return {
        key: routeKey,
        label: `Step ${idx}`,
        onClick: () => navigate('/'.concat(kebabCase(routeKey))),
      };
    })
  ) as NavLinkItem[];

  const activeRouteIndex = navLinkItems.findIndex((i, idx) => {
    const pathname = location.pathname.replace('/', '');

    if (!pathname) return i.key === 'Start';
    if (idx === navLinkItems.length - 1) return i.key === 'End';
    return kebabCase(i.key) === pathname;
  });

  const activeItem = navLinkItems[activeRouteIndex];
  const nextItem = navLinkItems[activeRouteIndex + 1] || null;
  const previousItem = navLinkItems[activeRouteIndex - 1] || null;

  return { items: navLinkItems, activeItem, previousItem, nextItem };
};

export default useNavLinks;
