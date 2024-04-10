import { useCallback, useState } from 'react';
import pDebounce from 'p-debounce';
import { Collapse, Button, Form, Input, Row, Col, Descriptions } from 'antd';
import type { FetchedClaim } from 'string-processor.cm';
import type { CustomUiCommand, L2TransactionData } from '@coinweb/wallet-lib';
import CoinwebClaim from './CoinwebClaim';
import HighlightCodeBlock from './HighlightCodeBlock';
import { useStringReverserSmartContract } from '../hooks/useStringReverserSmartContract';
import { EMPTY_CLAIM } from '../constants';

function InputLabel() {
  return <>Enter a string that you want to be processed</>;
}

function StringProcessorWriteForm() {
  const [claimPreview, setClaimPreview] = useState<FetchedClaim & { handler: string }>({
    ...EMPTY_CLAIM,
    handler: 'DEFAULT',
  });
  const [transactionDataPreview, setTransactionDataPreview] = useState<L2TransactionData | null>(null);
  const [callOpPreview, setCallOpPreview] = useState<CustomUiCommand | null>(null);
  const [embedId, setEmbedId] = useState<string>();
  const [stringToBeProcessed, setStringToBeProcessed] = useState<string>('');

  const { generateCallOp, prepareTransaction, embedTransaction, isLoading } = useStringReverserSmartContract();

  const prepareTransactionPreview = useCallback(
    pDebounce(async (input: string) => {
      await prepareTransaction(input)?.then((transactionData) => {
        setTransactionDataPreview(transactionData as L2TransactionData);
      });
    }, 300),
    []
  );

  const prepareCallOpPreview = useCallback(
    pDebounce(async (input: string) => {
      await generateCallOp(input)?.then((callOp) => {
        if (callOp) setCallOpPreview(callOp);
      });
    }, 150),
    []
  );

  const prepareClaimPreview = useCallback(
    pDebounce(async (input: string) => {
      await generateCallOp(input)?.then((callOp) => {
        if (callOp) {
          const { data } = (callOp.calls.at(0) as { contract_input: { data: any[] } })?.contract_input || {};
          setClaimPreview({
            handler: data.at(0),
            firstKey: data.at(1),
            secondKey: data.at(2),
            body: data.at(3),
          });
        }
      });
    }, 150),
    []
  );

  const generateCallOpClaimPreview = async (input: string) => {
    if (input) {
      prepareTransactionPreview(input);
      prepareCallOpPreview(input);
      prepareClaimPreview(input);
    } else {
      setClaimPreview({ ...EMPTY_CLAIM, handler: 'DEFAULT' });
    }
  };

  return (
    <Row gutter={[0, 32]} style={{ width: '100%' }} justify="center">
      <Col xs={24} style={{ maxWidth: '500px' }}>
        <Descriptions title="Contract argument input" />
        <Form
          layout="vertical"
          onFinish={(form) => {
            embedTransaction(form?.stringToBeProcessed).then((embedId) => {
              console.log('Transaction embedded with id:', embedId);
              setEmbedId(embedId);
            });
          }}
        >
          <Form.Item
            name="stringToBeProcessed"
            label={<InputLabel />}
            rules={[{ required: true, message: 'Please input a string to process!' }]}
          >
            <Input
              value={stringToBeProcessed}
              onChange={async (e) => {
                setStringToBeProcessed(e.target.value);
                await generateCallOpClaimPreview(e.target.value);
              }}
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={isLoading}>
              Call Contract
            </Button>
          </Form.Item>
        </Form>

        <CoinwebClaim label={'CallOp arguments preview'} claim={claimPreview} />
      </Col>

      <Col xs={24}>
        <Descriptions title="RAW data preview" />
        <Collapse
          collapsible={stringToBeProcessed ? 'icon' : 'disabled'}
          items={[
            {
              key: 'json_callop_preview',
              label: 'RAW Json CallOp data preview',
              children: <HighlightCodeBlock content={JSON.stringify(callOpPreview, null, 2)} language="json" />,
            },
            {
              key: 'json_transaction_data_preview',
              label: 'RAW Json Transaction data preview',
              children: (
                <HighlightCodeBlock content={JSON.stringify(transactionDataPreview, null, 2)} language="json" />
              ),
            },
          ]}
        />
      </Col>

      {embedId && (
        <Col xs={24}>
          <Descriptions title="View transaction in explorer" />
          <p>
            Please follow this transaction link and wait for it to appear in the explorer. This means the transaction is
            written to L1 AND L2.
          </p>
          <a href={`https://explorer-devnet.coinweb.io/?hash=${embedId}`} target="_blank" rel="noopener noreferrer">
            {`https://explorer-devnet.coinweb.io/?hash=${embedId}`}
          </a>
        </Col>
      )}
    </Row>
  );
}

export default StringProcessorWriteForm;
