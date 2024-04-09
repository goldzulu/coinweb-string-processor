import { Descriptions, Tag } from 'antd';
import { ReactElement } from 'react';
import type { FetchedClaim } from 'string-reverser.cm';

const CoinwebClaim = ({
  claim,
  label,
  fallback = null,
}: {
  claim: (FetchedClaim & { handler?: string }) | null;
  label?: string;
  isLoading?: boolean;
  fallback?: ReactElement | null;
}) => {
  return (
    <div style={{ width: '100%' }}>
      {claim ? (
        <Descriptions bordered title={label || 'Fetched Claim'} layout="horizontal">
          {claim.handler ? (
            <Descriptions.Item span={3} label="Method Handler">
              {claim.handler}
            </Descriptions.Item>
          ) : null}
          <Descriptions.Item span={3} label="First Key">
            {claim.firstKey || <Tag color="default">empty</Tag>}
          </Descriptions.Item>
          <Descriptions.Item span={3} label="Second Key">
            {claim.secondKey || <Tag color="default">empty</Tag>}
          </Descriptions.Item>
          <Descriptions.Item span={3} label="Body">
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
