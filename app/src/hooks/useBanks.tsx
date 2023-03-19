import { AnchorProvider, BN, Program } from "@project-serum/anchor";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import {
  useAnchorWallet,
  useConnection,
  useWallet,
} from "@solana/wallet-adapter-react";
import { useCallback, useEffect, useMemo, useState } from "react";

import { EndpointTypes } from "../models/types";
import { Solanapdas } from "../../../target/types/solanapdas";
import SolanapdasIdl from "../../../target/idl/solanapdas.json";
import { findProgramAddressSync } from "@project-serum/anchor/dist/cjs/utils/pubkey";
import { notify } from "../utils/notifications";

export interface Bank {
  name: String;
  balance: BN;
  owner: PublicKey;
}

export default function useBanks() {
  const { connection } = useConnection();
  const wallet = useAnchorWallet();
  const program = useMemo(
    () =>
      new Program<Solanapdas>(
        SolanapdasIdl as any,
        SolanapdasIdl.metadata.address,
        new AnchorProvider(connection, wallet, {})
      ),
    [connection, wallet]
  );
  const [banks, setBanks] = useState<Bank[]>([]);

  console.log(wallet, program);

  const fetchBanks = useCallback(async () => {
    if (!program || !wallet?.publicKey || !connection) return;

    setBanks((await program.account.bank.all()).map((b) => b.account));
  }, [wallet?.publicKey, connection, program]);

  useEffect(() => {
    if (wallet?.publicKey && connection && program) {
      fetchBanks();
    }
  }, [wallet?.publicKey, connection, program, fetchBanks]);

  async function createBank(name: string) {
    if (!wallet?.publicKey || !program) return;
    console.log({
      user: wallet.publicKey.toString(),
      bank: findProgramAddressSync(
        [Buffer.from("bankaccount"), wallet.publicKey.toBuffer()],
        new PublicKey(SolanapdasIdl.metadata.address)
      )[0].toString(),
      systemProgram: SystemProgram.programId.toString(),
    });

    try {
      await program.methods
        .create(name)
        .accounts({
          user: wallet.publicKey,
          bank: findProgramAddressSync(
            [Buffer.from("bankaccount"), wallet.publicKey.toBuffer()],
            program.programId
          )[0],
          systemProgram: SystemProgram.programId,
        })
        .rpc();
    } catch (err) {
      console.log(err);
      notify({ type: "error", message: String(err) });
    }
  }

  async function deposit(amount: BN) {
    if (!wallet?.publicKey) return;

    await program.methods
      .deposit(amount)
      .accounts({
        user: wallet.publicKey,
        bank: findProgramAddressSync(
          [Buffer.from("bankaccount"), wallet.publicKey.toBuffer()],
          program.programId
        )[0],
      })
      .rpc();
  }

  async function withdraw(amount: BN) {
    if (!wallet?.publicKey) return;

    await program.methods
      .withdraw(amount)
      .accounts({
        user: wallet.publicKey,
        bank: findProgramAddressSync(
          [Buffer.from("bankaccount"), wallet.publicKey.toBuffer()],
          program.programId
        )[0],
      })
      .rpc();
  }

  return {
    banks,
    createBank,
    deposit,
    withdraw,
  };
}
