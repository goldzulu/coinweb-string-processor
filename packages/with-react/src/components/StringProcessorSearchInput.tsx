import { Button, Form, Input, Tag, Row, Col } from 'antd';
import { useStringReverserSmartContract } from '../hooks/useStringReverserSmartContract';
import CoinwebClaim from './CoinwebClaim';

function InputLabel() {
  return (
    <>
      Enter the
      <Tag color="orange" style={{ marginLeft: '8px' }}>
        First Key
      </Tag>
      of the claim to read
    </>
  );
}

function StringProcessorSearchInput() {
  const { readClaim, claim, isLoading } = useStringReverserSmartContract();

  return (
    <div style={{ display: 'flex', justifyContent: 'center', margin: '24px 0' }}>
      <Row gutter={[0, 16]} style={{ maxWidth: '500px' }}>
        <Col xs={24}>
          <Form
            layout="vertical"
            onFinish={(form) => {
              readClaim(form?.claimSearchInput?.toUpperCase());
            }}
          >
            <Form.Item
              name="claimSearchInput"
              label={<InputLabel />}
              rules={[{ required: true, message: 'Please input your search key!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={isLoading}>
                Read Claim
              </Button>
            </Form.Item>
          </Form>
        </Col>

        <Col xs={24}>
          <CoinwebClaim claim={claim} isLoading={isLoading} />
        </Col>
      </Row>
    </div>
  );
}

export default StringProcessorSearchInput;
