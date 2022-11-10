import { useEffect } from "react";
import { useMoralis } from "react-moralis";

const ManualHeader = () => {
    const { enableWeb3, isWeb3EnableLoading, deactivateWeb3, account, isWeb3Enabled } =
        useMoralis();

    useEffect(() => {
        if (isWeb3Enabled) return;
        window && window.localStorage.getItem("connected") && enableWeb3();
    }, [isWeb3Enabled]);

    return (
        <>
            {account ? (
                <Connected deactivateWeb3={deactivateWeb3} account={account} />
            ) : (
                <Connect enableWeb3={enableWeb3} isWeb3EnableLoading={isWeb3EnableLoading} />
            )}
        </>
    );
};

const Connect = ({ enableWeb3, isWeb3EnableLoading }) => {
    return (
        <button
            disabled={isWeb3EnableLoading}
            onClick={async () => {
                await enableWeb3();
                window && window.localStorage.setItem("connected", "injected");
            }}
        >
            Please connect
        </button>
    );
};
const Connected = ({ deactivateWeb3, account }) => {
    return (
        <>
            <div>
                Connected to {account.slice(0, 6)}...{account.slice(account.length - 4)}
            </div>
            <button
                onClick={async () => {
                    window.localStorage.removeItem("connected");
                    await deactivateWeb3();
                }}
            >
                Disconnected
            </button>
            ;
        </>
    );
};

export default ManualHeader;
