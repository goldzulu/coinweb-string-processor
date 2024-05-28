import { useCallback, useEffect, useState } from 'react';
import pDebounce from 'p-debounce';
import { Collapse, Button, Form, Input, Row, Col, Descriptions, Select, message } from 'antd';
import type { FetchedClaim } from 'string-processor.cm';
import { TOGGLE_CASER, REVERSER, DEFAULT_HANDLER_NAME, STRING_PROCESSOR_TABLE } from 'string-processor.cm';
import type { CustomUiCommand, L2TransactionData, WalletError } from '@coinweb/wallet-lib';
import CoinwebClaim from './CoinwebClaim';
import HighlightCodeBlock from './HighlightCodeBlock';
import { useStringReverserSmartContract } from '../hooks/useStringReverserSmartContract';
import { EMPTY_CLAIM } from '../constants';
import { CaretRightOutlined } from '@ant-design/icons';
import EmbedSuccessMessage from './EmbedSuccessMessage';

function InputLabel() {
  return <>Enter a string that you want to be processed</>;
}

function SelectLabel() {
  return <>Select a method handler</>;
}

function StringProcessorWriteForm({ withMethodHandlerSelector }: { withMethodHandlerSelector?: boolean }) {
  const [claimPreview, setClaimPreview] = useState<FetchedClaim & { handler: string }>({
    ...EMPTY_CLAIM,
    handler: DEFAULT_HANDLER_NAME,
  });
  const [transactionDataPreview, setTransactionDataPreview] = useState<L2TransactionData | null>(null);
  const [callOpPreview, setCallOpPreview] = useState<CustomUiCommand | null>(null);
  const [embedId, setEmbedId] = useState<string>();
  const [stringToBeProcessed, setStringToBeProcessed] = useState<string>('');

  const { generateCallOp, prepareTransaction, embedTransaction, isLoading, methodHandler, setMethodHandler } =
    useStringReverserSmartContract();

  const generateTransactionPreview = useCallback(
    pDebounce(async (input: string) => {
      await prepareTransaction(input)?.then((transactionData) => {
        setTransactionDataPreview(transactionData as L2TransactionData);
      });
    }, 300),
    [methodHandler]
  );

  const generateCallOpPreview = useCallback(
    pDebounce(async (input: string) => {
      await generateCallOp(input)?.then((callOp) => {
        if (callOp) setCallOpPreview(callOp);
      });
    }, 150),
    [methodHandler]
  );

  const generateClaimPreview = useCallback(
    pDebounce(async (input: string) => {
      await generateCallOp(input)?.then((callOp) => {
        if (callOp) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    [methodHandler]
  );

  const generateCallOpClaimPreview = async (input: string) => {
    if (input) {
      generateTransactionPreview(input);
      generateCallOpPreview(input);
      generateClaimPreview(input);
    } else {
      setClaimPreview({
        ...EMPTY_CLAIM,
        handler: methodHandler || DEFAULT_HANDLER_NAME,
        firstKey: STRING_PROCESSOR_TABLE,
      });
    }
  };

  useEffect(() => {
    generateCallOpClaimPreview(stringToBeProcessed);
  }, [stringToBeProcessed, methodHandler]);

  const onSubmit = async (form: { stringToBeProcessed: string }) => {
    const closeLoadingMessage = message.loading({ content: 'Embedding transaction' });
    await Promise.resolve()
      .then(() => {
        return embedTransaction(form?.stringToBeProcessed);
      })
      .then((embedId) => {
        closeLoadingMessage();
        message.success({ content: <EmbedSuccessMessage embedId={embedId} />, duration: 6 });
        setEmbedId(embedId);
        return embedId;
      })
      .catch((error: WalletError) => {
        closeLoadingMessage();
        Object.entries(error).forEach(([descriptor, error]) => {
          const errorMessage = descriptor.concat(': ', error.error || error);
          message.error({ content: <div style={{ maxWidth: '500px' }}>{errorMessage}</div>, duration: 10 });
        });
      });
  };

  return (
    <Row gutter={[0, 32]} style={{ width: '100%' }} justify="center">
      <Col xs={24} style={{ maxWidth: '500px' }}>
        <Descriptions title="Contract argument input" />
        <Form layout="vertical" onFinish={onSubmit}>
          {withMethodHandlerSelector && (
            <Form.Item name="selectMethodHandler" label={<SelectLabel />} initialValue={DEFAULT_HANDLER_NAME}>
              <Select onSelect={setMethodHandler}>
                <Select.Option value={DEFAULT_HANDLER_NAME}>{DEFAULT_HANDLER_NAME}</Select.Option>
                <Select.Option value={TOGGLE_CASER}>{TOGGLE_CASER}</Select.Option>
                <Select.Option value={REVERSER}>{REVERSER}</Select.Option>
              </Select>
            </Form.Item>
          )}
          <Form.Item
            name="stringToBeProcessed"
            label={<InputLabel />}
            rules={[{ required: true, message: 'Please input a string to process!' }]}
          >
            <Input
              value={stringToBeProcessed}
              onChange={async (e) => {
                setStringToBeProcessed(e.target.value);
              }}
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" disabled={isLoading} loading={isLoading}>
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

      <Col xs={24}>
        <Descriptions title="View transaction in explorer" />
        <p>
          Please follow this transaction link and wait for it to appear in the explorer. This means the transaction is
          written to L1 AND L2.
        </p>

        <Button
          type="primary"
          icon={<CaretRightOutlined />}
          disabled={!embedId}
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

export default StringProcessorWriteForm;
