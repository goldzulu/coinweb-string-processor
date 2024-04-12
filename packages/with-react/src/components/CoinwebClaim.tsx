import { Descriptions, Tag } from 'antd';
import { ReactElement } from 'react';
import type { FetchedClaim } from 'string-processor.cm';

export type ClaimWithHandler = FetchedClaim & { handler?: string };

const CoinwebClaim = ({
  claim,
  label,
  fallback = null,
}: {
  claim: ClaimWithHandler | null;
  label?: string;
  isLoading?: boolean;
  fallback?: ReactElement | null;
}) => {
  return (
    <div style={{ width: '100%' }}>
      {claim ? (
        <Descriptions bordered column={2} title={label || 'Fetched Claim'} layout="horizontal">
          {claim.handler ? (
            <Descriptions.Item span={2} label="Method Handler">
              {claim.handler}
            </Descriptions.Item>
          ) : null}
          <Descriptions.Item span={2} label="First Key">
            {claim.firstKey || <Tag color="default">empty</Tag>}
          </Descriptions.Item>
          <Descriptions.Item span={2} label="Second Key">
            {claim.secondKey || <Tag color="default">empty</Tag>}
          </Descriptions.Item>
          <Descriptions.Item span={2} label="Body">
            {claim.body || <Tag color="default">empty</Tag>}
          </Descriptions.Item>
        </Descriptions>
      ) : (
        fallback
      )}
    </div>
  );
};

export default CoinwebClaim;
