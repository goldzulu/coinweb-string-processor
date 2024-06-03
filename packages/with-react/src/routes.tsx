import Start from './pages/Start.mdx';
import CreateContract from './pages/CreateContract.mdx';
import Onchain from './pages/Onchain.mdx';
import DeployContract from './pages/DeployContract.mdx';
import CallStringProcessorFromCli from './pages/CallStringProcessorFromCli.mdx';
import ReadClaimSimpleWalletLib from './pages/ReadClaimSimpleWalletLib.mdx';
import ReadClaimSimpleGraphQl from './pages/ReadClaimSimpleGraphQl.mdx';
import CallContractInteractive from './pages/CallContractInteractive.mdx';
import CallContractCoinwebWallet from './pages/CallContractCoinwebWallet.mdx';
import CallSingleMethodHandler from './pages/CallSingleMethodHandler.mdx';
import End from './pages/End.mdx';

// Order equals the steps in the tutorial
// Keys become the url paths in the tutorial
// Values render the content for each step
export default {
  Start: <Start />,
  CreateContract: <CreateContract />,
  Onchain: <Onchain />,
  DeployContract: <DeployContract />,
  CallStringProcessorFromCli: <CallStringProcessorFromCli />,
  ReadClaimSimpleWalletLib: <ReadClaimSimpleWalletLib />,
  ReadClaimSimpleGraphQl: <ReadClaimSimpleGraphQl />,
  CallContractInteractive: <CallContractInteractive />,
  CallContractCoinwebWallet: <CallContractCoinwebWallet />,
  CallSingleMethodHandler: <CallSingleMethodHandler />,
  End: <End />,
};
