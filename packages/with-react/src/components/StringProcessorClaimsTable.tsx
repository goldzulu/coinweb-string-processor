import { useEffect } from 'react';
import { useStringReverserSmartContract } from '../hooks/useStringReverserSmartContract';
import { Col, Descriptions, Row, Table, message } from 'antd';

const columns = [
  {
    title: 'First Key',
    dataIndex: 'firstKey',
    key: 'firstKey',
    width: '240px',
  },
  {
    title: 'Second Key',
    dataIndex: 'secondKey',
    key: 'secondKey',
  },
  {
    title: 'Body',
    dataIndex: 'body',
    key: 'body',
  },
];

function StringProcessorClaimsTable() {
  const { claims, isLoading, readClaims } = useStringReverserSmartContract();

  useEffect(() => {
    readClaims()
      .then(() => {
        message.success({ content: 'Claims loaded.', duration: 4 });
      })
      .catch((error) => {
        message.error({ content: (error as Error).message, duration: 4 });
      });
  }, []);

  return (
    <Row>
      <Col>
        <Descriptions title="Smart Contract Claims Overview" />
        <Table
          loading={isLoading}
          dataSource={claims}
          columns={columns}
          rowKey={(record) => record.secondKey}
          pagination={false}
        />
      </Col>
    </Row>
  );
}

export default StringProcessorClaimsTable;
