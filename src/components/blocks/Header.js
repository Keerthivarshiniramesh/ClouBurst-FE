'use client'

import { useContext, useState } from 'react'
import {
  Dialog,
  DialogPanel,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Popover,
  PopoverButton,
  PopoverGroup,
  PopoverPanel,
} from '@headlessui/react'
import { FiCloud, FiLogOut, FiLogIn } from "react-icons/fi";
import {
  ArrowPathIcon,
  Bars3Icon,
  ChartPieIcon,
  CursorArrowRaysIcon,
  FingerPrintIcon,
  SquaresPlusIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import { ChevronDownIcon, PhoneIcon, PlayCircleIcon } from '@heroicons/react/20/solid'
// import Logo from '../../assets/Logo.png'
import { DContext } from '../../context/Datacontext'

const products = [
  { name: 'Analytics', description: 'Get a better understanding of your traffic', href: '#', icon: ChartPieIcon },
  { name: 'Engagement', description: 'Speak directly to your customers', href: '#', icon: CursorArrowRaysIcon },
  { name: 'Security', description: 'Your customers’ data will be safe and secure', href: '#', icon: FingerPrintIcon },
  { name: 'Integrations', description: 'Connect with third-party tools', href: '#', icon: SquaresPlusIcon },
  { name: 'Automations', description: 'Build strategic funnels that will convert', href: '#', icon: ArrowPathIcon },
]
const callsToAction = [
  { name: 'Watch demo', href: '#', icon: PlayCircleIcon },
  { name: 'Contact sales', href: '#', icon: PhoneIcon },
]

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { isAuth, handleLogout } = useContext(DContext)

  return (
    <header className="bg-white shadow-sm border-b border-gray-100">
      <nav aria-label="Global" className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8">
        <div className="flex lg:flex-1">
          <a href="/" className="-m-1.5 p-1.5 flex items-center gap-2">
            <span className="sr-only">Cloudburst</span>
            <div className='inline-flex items-center justify-center w-10 h-10 bg-blue-600 rounded-lg'>
              <FiCloud className='w-6 h-6 text-white' />
            </div>
            <h1 className='font-bold text-blue-600 text-xl'>Cloudburst</h1>
          </a>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700 hover:bg-gray-100"
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon aria-hidden="true" className="size-6" />
          </button>
        </div>
        <div className="hidden lg:flex lg:gap-x-8">
          <a href="/" className="font-medium text-gray-900 hover:text-blue-600 transition">
            Home
          </a>
          <a href="/dashboard" className="font-medium text-gray-900 hover:text-blue-600 transition">
            Dashboard
          </a>
        </div>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          {
            isAuth ? (
              <button
                className='flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition'
                onClick={handleLogout}
              >
                <FiLogOut className='w-4 h-4' />
                Logout
              </button>
            ) : (
              <button
                className='flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition'
                onClick={() => window.location.href = "/login"}
              >
                <FiLogIn className='w-4 h-4' />
                Login
              </button>
            )
          }
        </div>
      </nav>
      <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
        <div className="fixed inset-0 z-10" />
        <DialogPanel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <a href="/" className="-m-1.5 p-1.5 flex items-center gap-2">
              <span className="sr-only">Cloudburst</span>
              <div className='inline-flex items-center justify-center w-8 h-8 bg-blue-600 rounded-lg'>
                <FiCloud className='w-5 h-5 text-white' />
              </div>
              <h1 className='font-bold text-blue-600'>Cloudburst</h1>
            </a>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="-m-2.5 rounded-md p-2.5 text-gray-700 hover:bg-gray-100"
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon aria-hidden="true" className="size-6" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-200">
              <div className="space-y-2 py-6">
                <a
                  href="/"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold text-gray-900 hover:bg-blue-50"
                >
                  Home
                </a>
                <a
                  href="/dashboard"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold text-gray-900 hover:bg-blue-50"
                >
                  Dashboard
                </a>
              </div>
              <div className="py-6">
                {
                  isAuth ? (
                    <button
                      className='w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition'
                      onClick={handleLogout}
                    >
                      <FiLogOut className='w-4 h-4' />
                      Logout
                    </button>
                  ) : (
                    <button
                      className='w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition'
                      onClick={() => window.location.href = "/login"}
                    >
                      <FiLogIn className='w-4 h-4' />
                      Login
                    </button>
                  )
                }
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  )
}
