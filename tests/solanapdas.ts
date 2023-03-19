import * as anchor from "@project-serum/anchor";

import { Program } from "@project-serum/anchor";
import { Solanapdas } from "../target/types/solanapdas";
import { findProgramAddressSync } from "@project-serum/anchor/dist/cjs/utils/pubkey";

describe("solanapdas", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.Solanapdas as Program<Solanapdas>;

  it("Is initialized!", async () => {
    // Add your test here.
    const tx = await program.methods
      .create("ok")
      .accounts({
        user: program.provider.publicKey,
        bank: findProgramAddressSync(
          [Buffer.from("bankaccount"), program.provider.publicKey.toBuffer()],
          program.programId
        )[0],
      })
      .rpc();
    console.log("Your transaction signature", tx);
  });
});
