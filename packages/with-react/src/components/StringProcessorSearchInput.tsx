import { Button, Form, Input, Tag, Row, Col, Descriptions } from 'antd';
import { useStringReverserSmartContract } from '../hooks/useStringReverserSmartContract';
import CoinwebClaim from './CoinwebClaim';

function InputLabel() {
  return (
    <>
      Enter the
      <Tag color="orange" style={{ marginLeft: '8px' }}>
        Second Key
      </Tag>
      of the claim to read (case-sensitive)
    </>
  );
}

function StringProcessorSearchInput() {
  const { readClaim, claim, isLoading } = useStringReverserSmartContract();

  return (
    <Row gutter={[0, 32]} style={{ width: '100%' }} justify="center">
      <Col xs={24} style={{ maxWidth: '500px' }}>
        <Descriptions title="Read a claim by first key" />
        <Form
          layout="vertical"
          onFinish={(form) => {
            readClaim(form?.claimSearchInput);
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
        <CoinwebClaim claim={claim} isLoading={isLoading} />
      </Col>
    </Row>
  );
}

export default StringProcessorSearchInput;
