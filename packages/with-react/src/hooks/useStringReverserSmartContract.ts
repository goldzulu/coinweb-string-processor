import { useState, useEffect } from 'react';
import * as api from 'string-reverser.cm';
import type { FetchedClaim } from 'string-reverser.cm';

export const useStringReverserSmartContract = () => {
  const [fetchedCoinwebClaim, setFetchedCoinwebClaim] = useState<FetchedClaim | null>(null);
  const [contractId, setContractId] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    api.getContractId().then((id) => setContractId(id));
  }, []);

  const readClaim = async (input: string) => {
    try {
      setIsLoading(true);
      setFetchedCoinwebClaim(null);
      await api.readClaim(input).then((claim) => setFetchedCoinwebClaim(claim));
    } catch (error) {
      console.error(error);
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
