import { Layout, Menu, Col, Row, theme } from 'antd';
import { Outlet } from 'react-router-dom';
import { useStringReverserSmartContract } from '../hooks/useStringReverserSmartContract';
import useNavLinks from '../hooks/useNavLinks';
import reactLogo from '../assets/react.svg';
import coinwebLogo from '../assets/coinweb-logo.svg';

const { Header, Content, Footer } = Layout;

const MainLayout = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const { items: navLinks, activeKey } = useNavLinks();

  const { contractId: stringReverserContractId } = useStringReverserSmartContract();

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 1,
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
        }}
      >
        <a href="https://coinweb.io" target="_blank" rel="noopener nofollow noreferrer">
          <img src={coinwebLogo} className="logo" alt="Coinweb logo" />
        </a>
        <a href="https://react.dev" target="_blank" rel="noopener nofollow noreferrer">
          <img src={reactLogo} className="logo" alt="React logo" />
        </a>
        <Menu
          theme="dark"
          mode="horizontal"
          items={navLinks}
          selectedKeys={[activeKey]}
          style={{ flex: 1, minWidth: 0 }}
        />
      </Header>
      <Content style={{ padding: '24px 48px 0' }}>
        <Row gutter={16} justify="center">
          <Col xs={24} md={24} lg={24} xl={18} xxl={14}>
            <div
              style={{
                padding: '24px 48px',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                background: colorBgContainer,
                borderRadius: borderRadiusLG,
                boxShadow: '0 0 20px rgba(0, 0, 0, 0.1)',
              }}
            >
              <Outlet />
            </div>
          </Col>
        </Row>
      </Content>
      <Footer
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {/* eslint-disable-next-line */}
        <div>API endpoint: {(window as any).__API_URL__}</div>
        <div>String Reverser Contract ID: {stringReverserContractId}</div>
        <div>© {new Date().getFullYear()} Coinweb — True Interoperability. Real world usage.</div>
      </Footer>
    </Layout>
  );
};

export default MainLayout;
