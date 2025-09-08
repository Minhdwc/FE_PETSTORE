import { Layout } from "antd";
import { Container } from "@mui/material";
import { Toaster } from "react-hot-toast";
import HeaderComponent from "@/layout/Header/HeaderComponent";
import FooterComponents from "@/layout/Footer/FooterComponents";
import SideBar from "@/layout/SideBar/sideBar";
type LayoutProps = {
  children: React.ReactNode;
};

const DefaultLayout = ({ children }: LayoutProps) => {
  return (
    <Layout
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      <Layout.Header>
        <HeaderComponent />
      </Layout.Header>
      <Layout.Content style={{ flex: 1 }}>
        <Toaster />
        <Container>{children}</Container>
      </Layout.Content>
      <Layout.Footer style={{ padding: 0, background: "#001529" }}>
        <FooterComponents />
      </Layout.Footer>
    </Layout>
  );
};

const MainLayout = ({ children }: LayoutProps) => {
  return (
    <>
      <Toaster />
      <Layout.Content>{children}</Layout.Content>
    </>
  );
};

const DefaultLayoutAdmin = ({ children }: LayoutProps) => {
  return (
    <>
      <div>
        <SideBar />
        {children}
      </div>
    </>
  );
};
export { DefaultLayout, DefaultLayoutAdmin, MainLayout };
