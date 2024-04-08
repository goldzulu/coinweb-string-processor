import { useState } from 'react';
import { Collapse, Button, Form, Input } from 'antd';
import type { FetchedClaim } from 'string-reverser.cm';
import type { CustomUiCommand } from '@coinweb/wallet-lib';
import CoinwebClaim from './CoinwebClaim';
import HighlightCodeBlock from './HighlightCodeBlock';
import { useStringReverserSmartContract } from '../hooks/useStringReverserSmartContract';

function InputLabel() {
  return <>Enter a string that you want to be processed by your reactive smart contract</>;
}

const EMPTY_CLAIM = {
  handler: 'DEFAULT',
  firstKey: '',
  secondKey: '',
  body: '',
};

function StringProcessorWriteForm() {
  const [claimPreview, setClaimPreview] = useState<FetchedClaim & { handler: string }>(EMPTY_CLAIM);
  const [callOpPreview, setCallOpPreview] = useState<CustomUiCommand | null>(null);
  const { generateCallOp, isLoading } = useStringReverserSmartContract();
  const [stringToBeProcessed, setStringToBeProcessed] = useState<string>('');

  const generateCallOpClaimPreview = async (input: string) => {
    if (input) {
      await generateCallOp(input)?.then((callOp) => {
        if (callOp) {
          setCallOpPreview(callOp);
          const { data } = (callOp.calls.at(0) as { contract_input: { data: any[] } })?.contract_input || {};
          setClaimPreview({
            handler: data.at(0),
            firstKey: data.at(1),
            secondKey: data.at(2),
            body: data.at(3),
          });
        }
      });
    } else {
      setClaimPreview(EMPTY_CLAIM);
    }
  };

  return (
    <div style={{ width: '100%' }}>
      <Form
        layout="vertical"
        onFinish={(form) => {
          generateCallOp(form?.claimSearchInput?.toUpperCase());
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
          <Button type="primary" htmlType="submit">
            Call Contract
          </Button>
        </Form.Item>
      </Form>

      <CoinwebClaim label={'CallOp arguments preview'} claim={claimPreview} isLoading={isLoading} />

      {callOpPreview && (
        <Collapse collapsible={callOpPreview ? 'icon' : 'disabled'} style={{ margin: '24px 0' }}>
          <Collapse.Panel key="json_callop_preview" header="RAW Json CallOp preview data">
            <HighlightCodeBlock
              content={JSON.stringify(callOpPreview, null, 2)}
              language="json"
              style={{ margin: 0 }}
            />
          </Collapse.Panel>
        </Collapse>
      )}
    </div>
  );
}

export default StringProcessorWriteForm;
