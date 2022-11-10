import React from "react";
import { abi, contractAddresses } from "../constants";
import { useMoralis, useWeb3Contract } from "react-moralis";
import { useEffect, useState, useMemo } from "react";
import { ethers, provider } from "ethers";
import { useNotification, Loading } from "web3uikit";

const LotteryEntrace = () => {
    const { isWeb3Enabled, chainId: hexChainId } = useMoralis();
    const chainId = parseInt(hexChainId);
    const raffleAddress = chainId in contractAddresses ? contractAddresses[chainId][0] : null;
    const [entraceFee, setEntranceFee] = useState(null);
    const [numberOfPlayers, setNumberOfPlayers] = useState(0);
    const [recentWinner, setRecentWinner] = useState(null);
    const dispatch = useNotification();
    let raffle;

    const {
        runContractFunction: enterRaffle,
        isLoading,
        isFetching,
    } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "enterRaffle",
        params: {},
        msgValue: entraceFee,
    });

    const { runContractFunction: getEntranceFee } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getEntranceFee",
        params: {},
    });

    const { runContractFunction: getNumberOfPlayers } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getNumberOfPlayers",
        params: {},
    });

    const { runContractFunction: getRecentWinner } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getRecentWinner",
        params: {},
    });

    const dispatchSuccess = () => {
        dispatch({
            type: "success",
            message: "Thanks for joining the raffle",
            title: "Welcome",
            position: "topR",
        });
    };

    const handleSuccess = async (tx) => {
        if (tx) {
            await tx.wait(1);
            dispatchSuccess();
        }
    };

    useEffect(() => {
        (async () => {
            if (isWeb3Enabled && raffleAddress) {
                setEntranceFee((await getEntranceFee()).toString());
                setRecentWinner(await getRecentWinner());
                setNumberOfPlayers((await getNumberOfPlayers()).toString());
                console.log(numberOfPlayers);
            }
        })();
    }, [isWeb3Enabled, dispatchSuccess]);

    if (!raffleAddress) {
        return <h1>There is no raffle address detected on chainId {chainId}</h1>;
    }

    return (
        <>
            <div className="p-5">
                The lottery entrance fee is{" "}
                {entraceFee && ethers.utils.formatUnits(entraceFee, "ether")} ETH
                <div>
                    <button
                        className="flex justify-center w-32 p-4 bg-blue-500 hover:bg-blue-700 rounded-3xl text-white font-bold"
                        onClick={async () =>
                            await enterRaffle({
                                onSuccess: handleSuccess,
                                onError: (e) => console.log(e),
                            })
                        }
                    >
                        {isLoading || isFetching ? (
                            <div className="w-5">
                                <Loading />
                            </div>
                        ) : (
                            "Enter raffle"
                        )}
                    </button>
                </div>
                <div>Number of players : {numberOfPlayers}</div>
                <div>Recent winner: {recentWinner || "null"}</div>
            </div>
        </>
    );
};

export default LotteryEntrace;
