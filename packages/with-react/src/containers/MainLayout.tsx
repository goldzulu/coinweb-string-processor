import { Layout, Menu, Col, Row, theme, Button, Divider } from 'antd';
import { ArrowRightOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { Outlet } from 'react-router-dom';
import { useStringReverserSmartContract } from '../hooks/useStringReverserSmartContract';
import useNavLinks from '../hooks/useNavLinks';
import reactLogo from '../assets/react.svg';
import coinwebLogo from '../assets/coinweb-logo.svg';
import useScrollToTop from '../hooks/useScrollToTop';

const { Header, Content, Footer } = Layout;

const MainLayout = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  useScrollToTop();

  const { items: navLinks, activeItem, previousItem, nextItem } = useNavLinks();

  const { contractId: stringReverserContractId } = useStringReverserSmartContract();

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 11,
          width: '100%',
          display: 'flex',
          gap: '1rem',
        }}
      >
        <a href="https://coinweb.io" target="_blank" rel="noopener nofollow noreferrer">
          <img src={coinwebLogo} className="logo" alt="Coinweb logo" />
        </a>
        <a href="https://react.dev" target="_blank" rel="noopener nofollow noreferrer">
          <img src={reactLogo} className="logo" alt="React logo" />
        </a>
        <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white' }}>Tutorials</span>
        <span style={{ fontSize: '1rem', fontWeight: 'bold', color: 'white' }}>string processor</span>
      </Header>
      <Content style={{ padding: '24px 48px 0' }}>
        <Row gutter={16} justify="center">
          <Col xs={24} md={24} lg={24} xl={18} xxl={14}>
            <Menu
              mode="horizontal"
              items={navLinks}
              selectedKeys={[activeItem.key]}
              style={{ flex: 1, background: colorBgContainer, borderRadius: borderRadiusLG }}
            />
          </Col>
          <Col xs={24} md={24} lg={24} xl={18} xxl={14}>
            <div
              style={{
                marginTop: '24px',
                padding: '48px 48px 24px',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                background: colorBgContainer,
                borderRadius: borderRadiusLG,
                boxShadow: '0 0 20px rgba(0, 0, 0, 0.1)',
              }}
            >
              <Outlet />

              <Divider />

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  {previousItem && (
                    <Button type="text" onClick={previousItem.onClick} icon={<ArrowLeftOutlined />}>
                      {previousItem.label}
                    </Button>
                  )}
                </div>
                <div>
                  {nextItem && (
                    <Button type="primary" onClick={nextItem.onClick}>
                      {nextItem.label} <ArrowRightOutlined />
                    </Button>
                  )}
                </div>
              </div>
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
        <div>String Processor Contract ID: {stringReverserContractId}</div>
        <div>© {new Date().getFullYear()} Coinweb — True Interoperability. Real world usage.</div>
      </Footer>
    </Layout>
  );
};

export default MainLayout;
