"use client";

import { MerkleTree } from "merkletreejs";
import { keccak256, arrayify } from "ethers/lib/utils";
import {
  Card,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import Image from "next/image";
import { useState, useEffect } from "react";
import CustomConnectButton from "./connectWallet3rd";
import { defineChain, getContract, toEther } from "thirdweb";
import { base } from "thirdweb/chains";
import background from "@/assets/TopBG.png";
import nftPreview from "@/assets/preview.webp";
import {
  MediaRenderer,
  useActiveAccount,
  useReadContract,
  TransactionButton,
} from "thirdweb/react";
import {
  claimTo,
  getActiveClaimCondition,
  getTotalClaimedSupply,
  nextTokenIdToMint,
  getClaimConditionById,
} from "thirdweb/extensions/erc721";
import { getContractMetadata } from "thirdweb/extensions/common";
import { client } from "@/app/client";
import CountdownTimer from "./countdown";
import Link from "next/link";

// Helper function to hash an address using keccak256 with arrayified input
function hashAddress(address: string): Buffer {
  return Buffer.from(keccak256(arrayify(address)).slice(2), "hex");
}

// Function to create a Merkle tree from an allowlist
function createMerkleTree(allowlist: string[]): MerkleTree {
  const leafNodes = allowlist.map(hashAddress);
  return new MerkleTree(leafNodes, keccak256, { sortPairs: true });
}

// Function to get the Merkle root from an allowlist
function getMerkleRoot(allowlist: string[]): string {
  const merkleTree = createMerkleTree(allowlist);
  return `0x${merkleTree.getRoot().toString("hex")}`;
}

// Function to generate a Merkle proof for a given address
function getMerkleProof(allowlist: string[], address: string): string[] {
  const merkleTree = createMerkleTree(allowlist);
  return merkleTree.getHexProof(hashAddress(address));
}

const allowlistWithQuantities = [
  { address: "0x1Bf709Ba0FC479CC6dA33e1b84Ac59B7934c4398", quantity: 330 },
  { address: "0xc59cB50Bc1aF3b6fe5DA295740054f8daD98FE9b", quantity: 70 },
  { address: "0x167c6B85D92D00642A4F388fA40CB7a317cA6441", quantity: 70 },
  { address: "0x9442A886D33636DA461229E28Be10996B40796af", quantity: 15 },
  { address: "0x168D8b4f50BB3aA67D05a6937B643004257118ED", quantity: 15 },
];

const MintERC721 = () => {
  const account = useActiveAccount();
  const chain = defineChain(base);
  const [quantity, setQuantity] = useState(1);
  const [isAllowed, setIsAllowed] = useState(false);
  const [proof, setProof] = useState<string[]>([]);
  const [maxEligibleQuantity, setMaxEligibleQuantity] = useState(1);

  const contract = getContract({
    client: client,
    chain: chain,
    address: "0x30287A98f07860abf0F469365a2210B5296fd164",
  });

  const { data: contractMetadata, isLoading: isContractMetadataLoading } =
    useReadContract(getContractMetadata, { contract: contract });

  const { data: claimedSupply, isLoading: isClaimedSupplyLoading } =
    useReadContract(getTotalClaimedSupply, { contract: contract });

  const { data: totalNFTSupply, isLoading: isTotalSupplyLoading } =
    useReadContract(nextTokenIdToMint, { contract: contract });

  const { data: claimCondition } = useReadContract(getActiveClaimCondition, {
    contract: contract,
  });

  // Define Minting Phase
  const allowlistPhaseId = BigInt(1);
  const publicPhaseId = BigInt(0);

  const { data: allowlistPhase } = useReadContract(getClaimConditionById, {
    contract: contract,
    conditionId: allowlistPhaseId,
  });

  const { data: publicPhase } = useReadContract(getClaimConditionById, {
    contract: contract,
    conditionId: publicPhaseId,
  });

  useEffect(() => {
    if (account?.address) {
      const proofForAddress = getMerkleProof(
        allowlistWithQuantities.map((entry) => entry.address),
        account.address
      );
      setProof(proofForAddress);
      setIsAllowed(proofForAddress.length > 0);

      // Find the eligible quantity for the user's address
      const eligibleEntry = allowlistWithQuantities.find(
        (entry) => entry.address.toLowerCase() === account.address.toLowerCase()
      );
      if (eligibleEntry) {
        setMaxEligibleQuantity(eligibleEntry.quantity);
        setQuantity(eligibleEntry.quantity);
      }
    }
  }, [account]);

  const getPrice = (quantity: number) => {
    const total =
      quantity * parseInt(claimCondition?.pricePerToken.toString() || "0");
    return toEther(BigInt(total));
  };

  const handleQuantityChange = (newQuantity: number) => {
    const minQuantity = 1;

    if (newQuantity < minQuantity) {
      setQuantity(minQuantity);
      return;
    }

    if (allowlistPhaseActive && !publicPhaseActive) {
      // Restrict to maxEligibleQuantity during allowlist phase
      setQuantity(Math.min(newQuantity, maxEligibleQuantity));
    } else {
      // No restriction during public phase
      setQuantity(newQuantity);
    }
  };

  const price = claimCondition?.pricePerToken
    ? parseInt(claimCondition.pricePerToken.toString())
    : "FREE MINT";

  const allowlistPhaseActive =
    allowlistPhase &&
    Date.now() >= Number(allowlistPhase.startTimestamp) * 1000;
  const publicPhaseActive =
    publicPhase && Date.now() >= Number(publicPhase.startTimestamp) * 1000;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      {/* <div className="fixed top-4 right-4 z-50 md:pb-5">
        <CustomConnectButton />
      </div> */}
      <div
        className="absolute inset-0 bg-cover bg-center contrast-200 brightness-50 saturate-200 overflow-hidden"
        style={{ backgroundImage: `url(${background.src})` }}
      >
        <Image
          src={background}
          alt="background"
          fill={true}
          style={{ objectFit: "cover" }}
        />
      </div>{" "}
      <div className="flex flex-col items-center justify-center w-full max-w-[1000px] p-4 z-50 mt-16">
        <Card className="text-white backdrop-blur-sm bg-black/60 w-full p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex w-auto h-auto items-center justify-center p-0">
              {isContractMetadataLoading ? (
                <span className="text-[12px] italic font-light text-slate-500">
                  Loading...
                </span>
              ) : (
                <Image
                  src={nftPreview}
                  alt="which-one"
                  width={350}
                  height={350}
                  className="rounded-xl max-w-full h-auto"
                />
              )}
            </div>
            <div className="flex flex-col space-y-4">
              <CardTitle className="text-2xl font-bold">
                {contractMetadata?.name}
              </CardTitle>
              <CardDescription className="text-sm">
                {contractMetadata?.description}
              </CardDescription>
              <CardContent className="flex justify-center items-center py-10">
                {/* <div className="grid grid-cols-2 gap-5">
                  <div id="blockchain">
                    <div className="text-slate-400 font-bold text-sm">
                      BLOCKCHAIN
                    </div>
                    <div>Base</div>
                  </div>
                  <div id="price" className="flex flex-col">
                    <div className="text-slate-400 font-bold text-sm">
                      PRICE
                    </div>
                    <div>
                      {price === "FREE MINT"
                        ? "0"
                        : `${toEther(BigInt(price))} ETH`}
                    </div>
                  </div>
                  <div id="supply">
                    <div className="text-slate-400 font-bold text-sm">
                      CLAIMED / TOTAL SUPPLY
                    </div>
                    <div className="font-semibold">
                      {isClaimedSupplyLoading || isTotalSupplyLoading ? (
                        <div className="text-[12px] italic font-light text-slate-500">
                          calling the block
                        </div>
                      ) : (
                        <div>
                          {claimedSupply?.toString()} /{" "}
                          {totalNFTSupply?.toString()}
                        </div>
                      )}
                    </div>
                  </div>
                </div> */}
                <div className="flex flex-col justify-center items-center">
                  <div className="text-3xl font-bold py-2">MINT ENDED</div>
                  <div className="py-2 italic">you can trade Fight NFTS on</div>
                  <div className="py-2">
                    <Link
                      href={"https://opensea.io/collection/the-fight-nft"}
                      target="_blank"
                    >
                      <span className="hover:text-blue-500 text-xl font-bold">
                        OpenSea
                      </span>
                    </Link>
                  </div>
                </div>
              </CardContent>

              {/* Eligibility Message */}
              {/* {account?.address &&
                allowlistPhaseActive &&
                !publicPhaseActive && (
                  <div className="text-center text-sm font-bold">
                    {isAllowed ? (
                      <span className="text-green-500">
                        You are eligible to claim up to {maxEligibleQuantity}{" "}
                        NFTs.
                      </span>
                    ) : (
                      <span className="text-red-500">
                        You are not eligible to claim this NFT.
                      </span>
                    )}
                  </div>
                )} */}

              {/* Claim Button */}
              {/* <div className="flex flex-col md:flex-row items-center gap-4">
                <div
                  id="quantity-button"
                  className="flex flex-row items-center justify-center"
                >
                  <button
                    className="bg-white text-black px-4 py-2 rounded-md mr-4"
                    onClick={() => handleQuantityChange(quantity - 1)}
                  >
                    -
                  </button>
                  <input
                    aria-label="quantity"
                    type="number"
                    value={quantity}
                    onChange={(e) =>
                      handleQuantityChange(parseInt(e.target.value))
                    }
                    className="w-20 text-center border border-gray-300 rounded-md bg-black text-white py-2"
                  />
                  <button
                    className="bg-white text-black px-4 py-2 rounded-md ml-4"
                    onClick={() => handleQuantityChange(quantity + 1)}
                  >
                    +
                  </button>
                </div>
                <div id="claim-nft-button" className="mt-4 md:mt-0">
                  <TransactionButton
                    transaction={() =>
                      claimTo({
                        contract: contract,
                        to: account?.address || "",
                        quantity: BigInt(quantity),
                      })
                    }
                    onTransactionConfirmed={async () => {
                      alert("NFT Claimed!");
                      setQuantity(1);
                    }}
                  >
                    {`Claim NFT (${getPrice(quantity)} ETH)`}
                  </TransactionButton>
                </div>
              </div> */}
            </div>
          </div>
        </Card>

        {/* COUNTDOWN */}
        {/* <div className="relative text-white gap-20 z-50 flex flex-col md:flex-row items-center md:justify-between py-10 space-y-4 md:space-y-0">
          <div className="flex flex-col items-center space-x-2 border border-white rounded-xl bg-black/60 px-10 py-5">
            <span className="text-xs italic">PUBLIC</span>
            <span className="text-xl font-semibold pt-3">
              {publicPhaseActive ? (
                "ENDED"
              ) : (
                <CountdownTimer
                  startTimestamp={BigInt(publicPhase?.startTimestamp || 0)}
                />
              )}
            </span>
          </div>
          <div className="flex flex-col items-center space-x-2 border border-white rounded-xl bg-black/60 px-10 py-5">
            <span className="text-xs italic">WHITELIST</span>
            <span className="text-xl font-semibold pt-3">
              {allowlistPhaseActive ? (
                <CountdownTimer
                  startTimestamp={BigInt(allowlistPhase?.startTimestamp || 0)}
                />
              ) : (
                "ENDED"
              )}
            </span>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default MintERC721;
