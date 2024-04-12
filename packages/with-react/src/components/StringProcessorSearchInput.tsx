import { Button, Form, Input, Tag, Row, Col, Descriptions, message } from 'antd';
import { useStringReverserSmartContract } from '../hooks/useStringReverserSmartContract';
import CoinwebClaim, { type ClaimWithHandler } from './CoinwebClaim';

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
  const { readClaims, claims, isLoading } = useStringReverserSmartContract();

  const onSubmit = (form: { claimSearchInput: string }) => {
    readClaims(form?.claimSearchInput)
      .then(() => {
        message.success({ content: 'Claim loaded.', duration: 5 });
      })
      .catch((error) => {
        message.error({ content: (error as Error).message, duration: 5 });
      });
  };

  return (
    <Row gutter={[0, 32]} style={{ width: '100%' }} justify="center">
      <Col xs={24} style={{ maxWidth: '500px' }}>
        <Descriptions title="Read a claim by second key" />
        <Form layout="vertical" onFinish={onSubmit}>
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

        <CoinwebClaim claim={claims.at(0) as ClaimWithHandler} isLoading={isLoading} />
      </Col>
    </Row>
  );
}

export default StringProcessorSearchInput;
