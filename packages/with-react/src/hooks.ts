import { useRef, useState } from 'react';
import * as api from 'string-reverser.cm';
import type { FetchedClaim } from 'string-reverser.cm';

export const useGreeting = () => {
  const greeting = useRef<FetchedClaim>();
  const contractId = useRef<string>('');
  const [isLoadingGreeting, setIsLoadingGreeting] = useState(false);

  const fetch = async () => {
    try {
      setIsLoadingGreeting(true);
      await Promise.all([api.getContractId(), api.getGreeting()]).then(([contractIdentity, greetingClaim]) => {
        console.log(contractIdentity, greetingClaim);
        contractId.current = contractIdentity;
        greeting.current = greetingClaim;
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoadingGreeting(false);
    }
  };

  return {
    fetch,
    greeting: greeting.current,
    contractId: contractId.current,
    isLoading: isLoadingGreeting,
  };
};
