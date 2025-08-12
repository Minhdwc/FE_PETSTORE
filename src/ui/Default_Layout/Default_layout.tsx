import { Layout } from "antd";
import { Container } from "@mui/material";
import HeaderComponent from "@/layout/Header/HeaderComponent";
import FooterComponents from "@/layout/Footer/FooterComponents";
import SideBar from "@/layout/SideBar/sideBar";
type LayoutProps = {
  children: React.ReactNode;
};
const DefaultLayout = ({ children }: LayoutProps) => {
  return (
    <>
      <Layout.Header>
        <HeaderComponent />
      </Layout.Header>
      <Layout.Content>
        <Container>{children}</Container>
      </Layout.Content>
      <Layout.Footer style={{ padding: 0 }}>
        <FooterComponents />
      </Layout.Footer>
    </>
  );
};

const MainLayout = ({ children }: LayoutProps) => {
  return (
    <>
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
