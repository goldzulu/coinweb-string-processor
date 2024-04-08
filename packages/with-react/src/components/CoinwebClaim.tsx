import { Descriptions, Spin } from 'antd';
import { ReactElement } from 'react';
import type { FetchedClaim } from 'string-reverser.cm';

const CoinwebClaim = ({
  claim,
  label,
  isLoading,
  fallback = null,
}: {
  claim: (FetchedClaim & { handler?: string }) | null;
  label?: string;
  isLoading?: boolean;
  fallback?: ReactElement | null;
}) => {
  return (
    <div style={{ width: '100%' }}>
      {isLoading ? (
        <Spin />
      ) : claim ? (
        <Descriptions bordered title={label || 'Fetched Claim'} layout="horizontal">
          {claim.handler ? (
            <Descriptions.Item span={3} label="Method Handler">
              {claim.handler}
            </Descriptions.Item>
          ) : null}
          <Descriptions.Item span={3} label="First Key">
            {claim.firstKey}
          </Descriptions.Item>
          <Descriptions.Item span={3} label="Second Key">
            {claim.secondKey}
          </Descriptions.Item>
          <Descriptions.Item span={3} label="Body">
            {claim.body}
          </Descriptions.Item>
        </Descriptions>
      ) : (
        fallback
      )}
    </div>
  );
};

export default CoinwebClaim;
