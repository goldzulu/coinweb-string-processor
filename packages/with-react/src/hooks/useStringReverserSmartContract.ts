import { useState, useEffect, useCallback } from 'react';
import * as api from 'string-processor.cm';
import type { FetchedClaim } from 'string-processor.cm';
import { EMPTY_CLAIM } from '../constants';
import type { L2TransactionData } from '@coinweb/wallet-lib';

export const useStringReverserSmartContract = () => {
  const [methodHandler, setMethodHandler] = useState<string>();
  const [fetchedCoinwebClaims, setFetchedCoinwebClaims] = useState<FetchedClaim[]>([EMPTY_CLAIM]);
  const [contractId, setContractId] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setContractId(api.getContractId());
  }, []);

  const readClaims = async (input?: string) => {
    try {
      setIsLoading(true);
      await api.readClaim(input).then(setFetchedCoinwebClaims);
    } catch (error) {
      setFetchedCoinwebClaims([EMPTY_CLAIM]);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const generateCallOp = useCallback(
    (input: string) => {
      return api.generateCallOp(input, methodHandler);
    },
    [methodHandler]
  );

  const prepareTransaction = async (input: string) => {
    if (!input || typeof input !== 'string') {
      throw new Error('Input string has to be provided');
    }

    try {
      const callOp = generateCallOp(input);
      return api.prepareTransaction(callOp);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  };

  const embedTransaction = async (input: string) => {
    if (!input || typeof input !== 'string') {
      throw new Error('Input string has to be provided');
    }

    if (isLoading) {
      throw new Error('Loading state is active, please wait for the previous transaction to finish.');
    }

    try {
      setIsLoading(true);
      const transactionData = await prepareTransaction(input);
      return api.embedTransaction(transactionData as L2TransactionData);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      throw error;
    } finally {
      // Throttle subsequent execution
      setTimeout(() => setIsLoading(false), 5000);
    }
  };

  return {
    readClaims,
    generateCallOp,
    prepareTransaction,
    embedTransaction,
    methodHandler,
    setMethodHandler,
    claims: fetchedCoinwebClaims,
    contractId,
    isLoading,
  };
};
