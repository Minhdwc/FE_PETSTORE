import { routes } from "@/routes/index";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {
  DefaultLayout,
  DefaultLayoutAdmin,
  MainLayout,
} from "./ui/Default_Layout/Default_layout";

function App() {
  return (
    <Router>
      <Routes>
        {routes.map((route: any, index: number) => {
          const Element = route.element;

          return (
            <Route
              key={index}
              path={route.path}
              element={
                route.isAdmin ? (
                  <DefaultLayoutAdmin>
                    <Element />
                  </DefaultLayoutAdmin>
                ) : route.isShowHeader ? (
                  <DefaultLayout>
                    <Element />
                  </DefaultLayout>
                ) : (
                  <MainLayout>
                    <Element />
                  </MainLayout>
                )
              }
            />
          );
        })}
      </Routes>
    </Router>
  );
}

export default App;
