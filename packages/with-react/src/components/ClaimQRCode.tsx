import { ArrowDownOutlined } from '@ant-design/icons';
import { Descriptions, Flex, QRCode } from 'antd';
import coinwebLogo from '../assets/coinweb_logo_color.svg';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ClaimQRCode({ value, loading }: { value: any; loading: boolean }) {
  return (
    <Flex vertical>
      <Descriptions
        title={
          <>
            <ArrowDownOutlined /> {loading ? 'Waiting for input value' : 'Scan QR Code with Coinweb Wallet'}{' '}
            <ArrowDownOutlined />
          </>
        }
      />

      <QRCode
        size={250}
        status={(loading && 'loading') || 'active'}
        value={JSON.stringify({ CustomV1: value })}
        icon={coinwebLogo}
      />
    </Flex>
  );
}

export default ClaimQRCode;
