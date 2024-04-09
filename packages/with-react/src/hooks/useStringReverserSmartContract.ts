import { useState, useEffect } from 'react';
import * as api from 'string-reverser.cm';
import type { FetchedClaim } from 'string-reverser.cm';
import { message } from 'antd';
import { EMPTY_CLAIM } from '../constants';

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
      setIsLoading(true);
      return api.generateCallOp(input);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    readClaim,
    generateCallOp,
    claim: fetchedCoinwebClaim,
    contractId,
    isLoading,
  };
};
