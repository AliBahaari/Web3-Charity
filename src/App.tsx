import { useEffect, useState } from 'react'
import Charity from '../artifacts/contracts/Transfer.sol/Charity.json'
import { ethers } from 'ethers'

const charityAddress = '0xc281A14F004092880F91a1C682FaD3d73f8E2969'

function App() {
  const [fullName, setFullName] = useState('')
  const [donor, setDonor] = useState<{
    fullName: string
    amount: string
  } | null>(null)

  const handleDonate = async () => {
    if (typeof window.ethereum !== 'undefined') {
      await window.ethereum.request({
        method: 'eth_requestAccounts',
      })
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const contract = new ethers.Contract(charityAddress, Charity.abi, signer)

      const ethAmount = '0.0005'

      const trx = await contract.donate(fullName, {
        value: ethers.utils.parseEther(ethAmount),
      })
      await trx.wait()
    }
  }

  const fetchDonors = async () => {
    if (typeof window.ethereum !== 'undefined') {
      await window.ethereum.request({
        method: 'eth_requestAccounts',
      })
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const contract = new ethers.Contract(
        charityAddress,
        Charity.abi,
        provider
      )

      try {
        const data = await contract.donors(signer.getAddress())

        setDonor({
          fullName: data[0],
          amount: ethers.utils.formatEther(data[1]),
        })
      } catch (error) {
        console.log(error)
      }
    }
  }

  useEffect(() => {
    if (!donor) {
      fetchDonors()
    }
  }, [donor])

  return (
    <>
      <input
        type="text"
        onChange={(event) => setFullName(event.target.value)}
      />
      <button onClick={handleDonate}>Donate</button>
      <hr />
      {donor ? `${donor.fullName} / ${donor.amount} ETH` : 'Not found'}
    </>
  )
}

export default App
