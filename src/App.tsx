import { useEffect, useState } from 'react'
import Charity from '../artifacts/contracts/Charity.sol/Charity.json'
import { ethers } from 'ethers'
import './App.css'

const charityAddress = '0x9ccc284B42960C1feF0f96924d51Abccfc3Cd93c'

function App() {
  const [fullName, setFullName] = useState('')
  const [donor, setDonor] = useState<
    { fullName: string; amount: string }[] | null
  >(null)

  const handleDonate = async () => {
    if (typeof window.ethereum !== 'undefined') {
      await window.ethereum.request({
        method: 'eth_requestAccounts',
      })
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const contract = new ethers.Contract(charityAddress, Charity.abi, signer)

      const ethAmount = '0.0003'

      const trx = await contract.donate(fullName, {
        value: ethers.utils.parseEther(ethAmount),
      })
      await trx.wait()
      fetchDonors()
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

      let i = 0
      const donations = []
      for (;;) {
        try {
          const data = await contract.donors(signer.getAddress(), i)
          donations.push({
            fullName: data[0],
            amount: ethers.utils.formatEther(data[1]),
          })
          i++
        } catch (_) {
          break
        }
      }

      setDonor(donations)
    }
  }

  useEffect(() => {
    if (!donor) {
      fetchDonors()
    }
  }, [donor])

  return (
    <>
      <div className="formContainer">
        <input
          type="text"
          onChange={(event) => setFullName(event.target.value)}
        />
        <button onClick={handleDonate}>Donate</button>
      </div>

      <div className="senderDonations">
        {donor && donor?.length > 0 ? (
          donor.map((i, index) => (
            <span key={index}>
              {i.fullName} / {i.amount} ETH
            </span>
          ))
        ) : (
          <span className="youHaveNotDonatedText">You haven't donated!</span>
        )}
      </div>
    </>
  )
}

export default App
