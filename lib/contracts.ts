import abi from '@/abi/ChainAid.json'

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`;
const CONTRACT_ABI = abi.abi;

export { CONTRACT_ADDRESS, CONTRACT_ABI }