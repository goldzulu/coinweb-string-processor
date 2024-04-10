import Start from './pages/Start.mdx';
import CreateContract from './pages/CreateContract.mdx';
import Onchain from './pages/Onchain.mdx';
import DeployContract from './pages/DeployContract.mdx';
import CallStringProcessorFromCli from './pages/CallStringProcessorFromCli.mdx';
import ReadClaimSimple from './pages/ReadClaimSimpleWalletLib.mdx';
import ReadClaimSimpleGraphQl from './pages/ReadClaimSimpleGraphQl.mdx';
import CallContractInteractive from './pages/CallContractInteractive.mdx';
import CallContractCoinwebWallet from './pages/CallContractCoinwebWallet.mdx';
import End from './pages/End.mdx';

// Order equals the steps in the tutorial
export default {
  Start: <Start />,
  CreateContract: <CreateContract />,
  Onchain: <Onchain />,
  DeployContract: <DeployContract />,
  CallStringProcessorFromCli: <CallStringProcessorFromCli />,
  ReadClaimSimple: <ReadClaimSimple />,
  ReadClaimSimpleGraphQl: <ReadClaimSimpleGraphQl />,
  CallContractInteractive: <CallContractInteractive />,
  CallContractCoinwebWallet: <CallContractCoinwebWallet />,
  End: <End />,
};
