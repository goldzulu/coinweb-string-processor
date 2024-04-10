import { useState, useEffect } from 'react';
import { message } from 'antd';
import * as api from 'string-processor.cm';
import type { FetchedClaim } from 'string-processor.cm';
import { EMPTY_CLAIM } from '../constants';
import type { CustomUiCommand, L2TransactionData } from '@coinweb/wallet-lib';

export const useStringReverserSmartContract = () => {
  const [fetchedCoinwebClaim, setFetchedCoinwebClaim] = useState<FetchedClaim>(EMPTY_CLAIM);
  const [contractId, setContractId] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    api.getContractId().then((id) => setContractId(id));
  }, []);

  const readClaim = async (input: string) => {
    try {
      setIsLoading(true);
      await api.readClaim(input).then((claim) => {
        setFetchedCoinwebClaim(claim);
        message.success({ content: 'Found claim' });
      });
    } catch (error) {
      message.error({ content: (error as Error).message });
      setFetchedCoinwebClaim(EMPTY_CLAIM);
    } finally {
      setIsLoading(false);
    }
  };

  const generateCallOp = (input: string) => {
    try {
      return api.generateCallOp(input);
    } catch (error) {
      console.error(error);
    }
  };

  const prepareTransaction = async (input: string) => {
    if (!input || typeof input !== 'string') {
      throw new Error('Input string has to be provided');
    }

    try {
      const callOp = await generateCallOp(input);
      return api.prepareTransaction(callOp as CustomUiCommand);
    } catch (error) {
      console.error(error);
    }
  };

  const embedTransaction = async (input: string) => {
    if (!input || typeof input !== 'string') {
      throw new Error('Input string has to be provided');
    }

    try {
      setIsLoading(true);
      const transactionData = await prepareTransaction(input);
      return api.embedTransaction(transactionData as L2TransactionData).then((embedId) => {
        message.success({ content: 'Transaction embedded successfully: '.concat(embedId) });
        return embedId;
      });
    } catch (error) {
      message.error({ content: 'Transaction not embedded' });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    readClaim,
    generateCallOp,
    prepareTransaction,
    embedTransaction,
    claim: fetchedCoinwebClaim,
    contractId,
    isLoading,
  };
};
