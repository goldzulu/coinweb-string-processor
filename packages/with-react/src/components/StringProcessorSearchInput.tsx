import { Button, Form, Input, Tag } from 'antd';
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
    <div>
      <Form
        style={{ width: '400px' }}
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
          <Button type="primary" htmlType="submit">
            Read Claim
          </Button>
        </Form.Item>
      </Form>

      <CoinwebClaim claim={claim} isLoading={isLoading} />
    </div>
  );
}

export default StringProcessorSearchInput;
