import React from 'react'

const Signup = () => {
  return (
    <div className='flex flex-row items-center gap-10 justify-center h-screen py-10 bg-blue-950'>
        <div className='flex flex-col items-start justify-center w-1/2 h-full p-20 gap-5'>
            <h1 className='text-4xl'>Welcome to</h1>
            <h1 className='text-4xl font-bold'>LawConnect</h1>
            <p >Facilitates connections between the communityand affordable attorneys</p>
            <button className='px-7 py-1 rounded-4xl text-blue-950 bg-white' type='submit'>Login</button>
        </div>
        <div className='flex flex-col items-center justify-center w-full h-full bg-white rounded-l-full'>
            <div className='flex flex-row p-1 bg-blue-950 rounded-full self-end mr-10 mb-20'>
                <button className='px-5 py-1 rounded-4xl text-blue-950 bg-white' type='submit'>Client</button>
                <button className='px-5 py-1 rounded-4xl text-white bg-none' type='submit'>Attorney</button>
            </div>
            <h1 className='text-4xl font-bold text-blue-950'>Signup</h1>
            <div className='flex flex-row justify-center m-5 w-3/5 gap-7'>
                <form className='flex flex-col items-center justify-center text-blue-950 gap-5'>
                    <input className='text-gray-400 px-7 py-1 rounded-4xl outline-1 outline-gray-300' type="text" placeholder='First Name' />
                    <input className='text-gray-400 px-7 py-1 rounded-4xl outline-1 outline-gray-300' type="email" placeholder='Email' />
                    <input className='text-gray-400 px-7 py-1 rounded-4xl outline-1 outline-gray-300' type="password" placeholder='Password' />

                </form> 
                <form className='flex flex-col items-center justify-center text-blue-950 gap-5'>
                    <input className='text-gray-400 px-7 py-1 rounded-4xl outline-1 outline-gray-300' type="text" placeholder='Last Name' />
                    <input className='text-gray-400 px-7 py-1 rounded-4xl outline-1 outline-gray-300' type="tel" placeholder='Phone Number' />
                    <input className='text-gray-400 px-7 py-1 rounded-4xl outline-1 outline-gray-300' type="password" placeholder='Confirm Password' />
                </form>
            </div>
                <button className='px-7 py-1 rounded-4xl text-white bg-blue-950' type='submit'>Signup</button>
        </div>
    </div>
  )
}

export default Signup
