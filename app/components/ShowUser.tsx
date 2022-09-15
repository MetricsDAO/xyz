import { useEffect, useState} from "react";
import { useContractRead } from 'wagmi';
import { CheckmarkFilled32, CloseFilled32 } from '@carbon/icons-react';
import { usePrevious } from '~/utils/helpers';

import ShowMetric from "./ShowMetric";


export default function ShowUser ({address, topChef}: {address: string, topChef: Record<string, string> }) {
    const [currentAllocationGroup, setCurrentAllocationGroup] = useState<Array<string>>([]);
    const [indexOfAllocation, setIndexAllocation] = useState<number>(-1)
    const prevAddress = usePrevious(address);

    const { data: contractData } = useContractRead({
        addressOrName: topChef.address,
        contractInterface: topChef.abi,
        functionName: 'getAllocationGroups',
        enabled: prevAddress !== address,
        onError: (err) => {
            console.error(err);
        },
    });
    
    useEffect(() => {
        function isAddressEligible(data:string[][]) {
                let match:string[] | [] = [];
                let index = -1;
                data.forEach((accounts:string[], i:number) => {
                if (accounts[0] === address) {
                    match = accounts;
                    index = i;
                }
            });
            return {
                match,
                index
            }
        }

        if (Array.isArray(contractData) && address !== prevAddress) {
            const obj = isAddressEligible(contractData)
            setCurrentAllocationGroup(obj.match || []);
            setIndexAllocation(obj.index)
        }
    }, [address, contractData, prevAddress])

    return (
        <>
            <div className="tw-mx-auto bg-white tw-p-6 tw-rounded-lg tw-w-1/3 tw-mb-7">
                <div className="tw-mx-auto tw-flex tw-items-center tw-justify-center tw-mb-4">
                    {currentAllocationGroup.length ? (
                    <>
                    <CheckmarkFilled32 className="tw-fill-[#66B75F] tw-inline" /> 
                    <h3 className="tw-text-2xl tw-inline tw-pl-2 tw-font-semibold">Eligible for Vesting</h3> 
                    </> 
                    ) : 
                    <> 
                    <CloseFilled32 className="tw-fill-[#F7746D] tw-inline" />
                    <h3 className="tw-text-2xl tw-inline tw-pl-2">Not Eligible for vesting</h3>
                    </>
                    } 
                </div>
                <p className="tw-text-center">{currentAllocationGroup.length ? (
                <span>The current address will be Eligible for vesting $METRIC</span>
                ) : (
                    <span>The current address is not eligible for vesting $METRIC</span>
                )}
                </p>
            </div>
            {currentAllocationGroup.length && indexOfAllocation >= 0 && (
                <ShowMetric 
                    topChef={topChef} 
                    address={address} 
                    prevAddress={prevAddress} 
                    indexOfAllocation={indexOfAllocation} 
                />
            )}
        </>
    )
}