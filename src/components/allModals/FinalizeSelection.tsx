import React from 'react'
import { useModalAction } from '../ui/modal/modal.context';

const FinalizeSelection = () => {
  const { openModal, closeModal } = useModalAction();

  return (

    <div className="flex h-full min-h-screen w-screen flex-col justify-center bg-light md:h-auto md:min-h-0 md:max-w-[520px] md:rounded-xl">
      <div className="items-center p-7">
        <div className='text-center mb-5'>
          <h3 className='text-lg font-semibold mb-1'>Finalize Selection</h3>
          <p className='text-md text-[#6B7280]'>You did it! You’re one step closer to the home of your dreams!
            Provide as the following info to save & view your design</p>
        </div>

        <div className='my-2'>
          <label className='text-sm' htmlFor="">Name</label>
          <input
            id='name'
            type="text"
            autoComplete="off"
            className='mt-1 py-2.5 border-gray-300 item-center w-full overflow-hidden truncate rounded-md text-sm text-heading placeholder-gray-500 transition duration-300 ease-in-out focus:border-accent focus:outline-0 focus:ring-0'
            value="jhone"
          />
        </div>

        <div className='my-2'>
          <label className='text-sm' htmlFor="">Email</label>
          <input
            id='email'
            type="text"
            autoComplete="off"
            className='mt-1 py-2.5 border-gray-300 item-center w-full overflow-hidden truncate rounded-md text-sm text-heading placeholder-gray-500 transition duration-300 ease-in-out focus:border-accent focus:outline-0 focus:ring-0'
            value="jhone@gmail.com"
          />
        </div>
        <button onClick={() => { openModal('PROJECT_SAVED') }} className='w-full bg-accent py-3 mt-7 text-md font-bold shadow-700 transition-colors hover:bg-accent-hover focus:bg-accent-hover focus:outline-0 text-light rounded-md'>Send Email</button>
      </div>
    </div>
  )
}

export default FinalizeSelection