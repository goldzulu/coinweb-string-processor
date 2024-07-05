import { CaretRightOutlined } from '@ant-design/icons';
import { Button, Col, Row, Tag, message } from 'antd';

function EmbedSuccessMessage({ embedId }: { embedId: string }) {
  return (
    <Row gutter={[0, 12]} style={{ display: 'flex', flexDirection: 'column' }}>
      <Col>Transaction embedded successfully:</Col>
      <Col>
        <Tag
          style={{ cursor: 'pointer' }}
          onClick={async () => {
            await navigator.clipboard.writeText(embedId);
            await message.success('Copied ID to clipboard');
          }}
        >
          {embedId}
        </Tag>
      </Col>
      <Col>
        <Button
          type="primary"
          icon={<CaretRightOutlined />}
          onClick={() => {
            window.open(`https://explorer-devnet.coinweb.io/?hash=${embedId}`, '_blank', 'noopener noreferrer');
          }}
        >
          Open in Explorer
        </Button>
      </Col>
    </Row>
  );
}

export default EmbedSuccessMessage;
