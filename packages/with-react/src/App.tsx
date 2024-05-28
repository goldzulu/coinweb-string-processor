import { Route, createRoutesFromElements, createBrowserRouter, RouterProvider } from 'react-router-dom';
import kebabCase from 'lodash/kebabCase';
import MainLayout from './containers/MainLayout';
import routes from './routes';

const baseUrl = import.meta.env.BASE_URL;

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path={baseUrl} element={<MainLayout />}>
        <Route index element={Object.entries(routes).at(0)?.at(1)} />
        {Object.entries(routes).map(([routeKey, component]) => {
          return <Route key={kebabCase(routeKey)} path={baseUrl.concat(kebabCase(routeKey))} element={component} />;
        })}
      </Route>
    </Route>
  )
);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
