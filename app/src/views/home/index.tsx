// Next, React

import { FC, useEffect, useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";

import { BN } from "bn.js";
import { Decimal } from "decimal.js";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import Link from "next/link";
import { RequestAirdrop } from "../../components/RequestAirdrop";
import pkg from "../../../package.json";
import useBanks from "../../hooks/useBanks";
import useUserSOLBalanceStore from "../../stores/useUserSOLBalanceStore";

export const HomeView: FC = ({}) => {
  const wallet = useWallet();
  const { connection } = useConnection();
  const { createBank, deposit, withdraw } = useBanks();
  const banks = [{ owner: wallet.publicKey, name: "okoko", balance: 0 }];
  const balance = useUserSOLBalanceStore((s) => s.balance);
  const { getUserSOLBalance } = useUserSOLBalanceStore();
  const [name, setName] = useState("");

  useEffect(() => {
    if (wallet.publicKey) {
      console.log(wallet.publicKey.toBase58());
      getUserSOLBalance(wallet.publicKey, connection);
    }
  }, [wallet.publicKey, connection, getUserSOLBalance]);

  console.log(banks);

  return (
    <div className="md:hero mx-auto p-4">
      <div className="md:hero-content flex flex-col">
        <div className="mt-6">
          <h1 className="text-center text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-indigo-500 to-fuchsia-500 mb-4">
            Banks
          </h1>
        </div>
        <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-800 to-fuchsia-800 flex flex-col gap-3">
          {banks.length > 0 ? (
            <table className="table w-full">
              <thead>
                <tr>
                  <th>Owner</th>
                  <th>Name</th>
                  <th>Balance</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {banks.map((bank) => (
                  <tr key={bank.owner.toString()}>
                    <th>{bank.owner.toString()}</th>
                    <th>{bank.name.toString()}</th>
                    <th>
                      {new Decimal(bank.balance.toString())
                        .div(LAMPORTS_PER_SOL)
                        .toNumber()}{" "}
                      SOL
                    </th>
                    <th>
                      <div
                        className="btn"
                        onClick={() => deposit(new BN(LAMPORTS_PER_SOL))}
                      >
                        +
                      </div>
                      <div
                        className="btn"
                        onClick={() => withdraw(new BN(LAMPORTS_PER_SOL))}
                      >
                        -
                      </div>
                    </th>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div>There are no banks</div>
          )}
          <div className="flex flex-col w-full gap-1 border bg-fuchsia-400 p-1 rounded-xl">
            <input
              className="input"
              placeholder="Bank's name"
              onChange={(e) => setName(e.target.value)}
            />
            <div
              className="btn btn-primary w-full"
              onClick={() => createBank(name)}
            >
              Create bank
            </div>
          </div>
        </div>
        <div className="flex flex-col mt-2">
          <RequestAirdrop />
          <h4 className="md:w-full text-2xl text-slate-300 my-2">
            {wallet && (
              <div className="flex flex-row justify-center">
                <div>{(balance || 0).toLocaleString()}</div>
                <div className="text-slate-600 ml-2">SOL</div>
              </div>
            )}
          </h4>
        </div>
      </div>
    </div>
  );
};
