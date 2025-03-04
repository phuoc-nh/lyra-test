'use client'
import { Bell, HelpCircle, Menu, Search } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { useSidebar } from '~/components/ui/sidebar'
import { signOut } from 'next-auth/react' // Correct import

export default function TopNavBar() {
	const { toggleSidebar } = useSidebar()
	return (
		<header className="border-b">
			<div className="flex items-center px-4 h-14">
				<Button variant="ghost" size="icon" className="mr-2" onClick={toggleSidebar}>
					<Menu className="h-5 w-5"/>
				</Button>
				<Link href="/" className="flex items-center mr-8">
					<div className="w-32">
						<Image
							src={"/images.png"}
							alt="Airtable Logo"
							width={107}
							height={32}
							className="h-8 w-auto"
						/>
					</div>
				</Link>
				<div className="flex-1 max-w-xl relative">
					<Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
					<Input placeholder="Search..." className="pl-8 w-full bg-muted/30" />
				</div>
				<div className="flex items-center gap-2 ml-4">
					<Button variant="ghost" size="icon">
						<HelpCircle className="h-5 w-5" />
					</Button>
					<Button variant="ghost" size="icon">
						<Bell className="h-5 w-5" />
					</Button>
					<Button variant="ghost" size="icon" className="rounded-full bg-purple-600 text-white hover:bg-purple-700">
						U
					</Button>
					<Button onClick={() => signOut()} variant="ghost" >
						Log out
					</Button>
				</div>
			</div>
		</header>
	)
}
