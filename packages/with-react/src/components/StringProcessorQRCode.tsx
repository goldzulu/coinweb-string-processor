import { useCallback, useEffect, useState } from 'react';
import { Collapse, Form, Input, Row, Col, Descriptions } from 'antd';
import pDebounce from 'p-debounce';
import type { FetchedClaim } from 'string-processor.cm';
import type { CustomUiCommand } from '@coinweb/wallet-lib';
import HighlightCodeBlock from './HighlightCodeBlock';
import CoinwebClaim from './CoinwebClaim';
import { useStringReverserSmartContract } from '../hooks/useStringReverserSmartContract';
import { EMPTY_CLAIM } from '../constants';
import ClaimQRCode from './ClaimQRCode';

function StringProcessorQRCode() {
  const [loadingQrCode, setLoadingQrCode] = useState<boolean>(true);
  const [claimPreview, setClaimPreview] = useState<FetchedClaim & { handler: string }>({
    ...EMPTY_CLAIM,
    handler: 'DEFAULT',
  });
  const [callOpPreview, setCallOpPreview] = useState<CustomUiCommand | null>(null);
  const [stringToBeProcessed, setStringToBeProcessed] = useState<string>('');

  const { generateCallOp, isLoading } = useStringReverserSmartContract();

  const prepareCallOpPreview = useCallback(
    pDebounce(async (input: string) => {
      if (!input) {
        setCallOpPreview(null);
      } else {
        await generateCallOp(input)?.then((callOp) => {
          if (callOp) setCallOpPreview(callOp);
        });
      }
    }, 150),
    []
  );

  const prepareClaimPreview = async (input: string) => {
    if (!input) {
      setClaimPreview({ ...EMPTY_CLAIM, handler: 'DEFAULT' });
    } else {
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
    }
  };

  const generateCallOpClaimPreview = useCallback(
    pDebounce(async (input: string) => {
      if (input) {
        prepareCallOpPreview(input);
        prepareClaimPreview(input);
      } else {
        setClaimPreview({ ...EMPTY_CLAIM, handler: 'DEFAULT' });
        setCallOpPreview(null);
      }
    }, 250),
    []
  );

  useEffect(() => {
    // generate QR code
    Promise.resolve()
      .then(() => {
        setLoadingQrCode(true);
      })
      .then(() => {
        return generateCallOpClaimPreview(stringToBeProcessed);
      })
      .finally(() => {
        if (stringToBeProcessed) setLoadingQrCode(false);
      });
  }, [stringToBeProcessed]);

  return (
    <Row gutter={[0, 8]} style={{ width: '100%' }} justify="center">
      <Col xs={24} style={{ maxWidth: '500px' }}>
        <Descriptions title="Contract argument input" />
        <Form layout="vertical">
          <Form.Item
            name="stringToBeProcessed"
            label="Enter a string that you want to be processed"
            rules={[{ required: true, message: 'Please input a string to process!' }]}
          >
            <Input
              value={stringToBeProcessed}
              onChange={async (e) => {
                const inputValue = e.target.value;
                if (inputValue) {
                  setStringToBeProcessed(e.target.value);
                  await generateCallOpClaimPreview(e.target.value);
                } else {
                  setStringToBeProcessed('');
                }
              }}
            />
          </Form.Item>

          <Form.Item>
            <ClaimQRCode value={callOpPreview} loading={loadingQrCode} />
          </Form.Item>
          <Form.Item>
            <CoinwebClaim label="CallOp arguments preview" claim={claimPreview} isLoading={isLoading} />
          </Form.Item>
        </Form>
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
          ]}
        />
      </Col>
    </Row>
  );
}

export default StringProcessorQRCode;
