import { Route, createRoutesFromElements, createBrowserRouter, RouterProvider } from 'react-router-dom';
import kebabCase from 'lodash/kebabCase';
import MainLayout from './containers/MainLayout';
import routes from './routes';

const routerOptions = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  basename: ((window as any).__BASE_URL__ || '/') as string,
};

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path={'/'} element={<MainLayout />}>
        <Route index element={Object.entries(routes).at(0)?.at(1)} />
        {Object.entries(routes).map(([routeKey, component]) => {
          return <Route key={kebabCase(routeKey)} path={kebabCase(routeKey)} element={component} />;
        })}
      </Route>
    </Route>
  ),
  routerOptions
);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
