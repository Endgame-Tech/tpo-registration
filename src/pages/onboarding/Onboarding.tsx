import { Link } from 'react-router'

export default function OnboardingPage() {


  return (
    <div className='text-3xl flex flex-col px-4 gap-8 max-w-[450px] w-full dark:text-text-dark'>
        <h1>
        Welcome to TNNP Onboarding
        </h1>
        <p className='text-base'>
      We will need to get some information from you to get started.
        </p>
        <Link to="/onboarding/personal-info" className='bg-accent-green text-white px-4 py-2 rounded-lg w-fit text-xl'>Start the onboarding Process.</Link>
    </div>
  )
}
