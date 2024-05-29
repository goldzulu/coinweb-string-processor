import { Route, createRoutesFromElements, RouterProvider, createHashRouter } from 'react-router-dom';
import kebabCase from 'lodash/kebabCase';
import MainLayout from './containers/MainLayout';
import routes from './routes';

const router = createHashRouter(
  createRoutesFromElements(
    <Route>
      <Route path={'/'} element={<MainLayout />}>
        <Route index element={Object.entries(routes).at(0)?.at(1)} />
        {Object.entries(routes).map(([routeKey, component]) => {
          return <Route key={kebabCase(routeKey)} path={kebabCase(routeKey)} element={component} />;
        })}
      </Route>
    </Route>
  )
);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
