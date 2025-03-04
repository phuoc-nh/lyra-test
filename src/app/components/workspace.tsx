'use client'
import Link from "next/link"
import { MoreHorizontal, Star } from "lucide-react"
import { Button } from "~/components/ui/button"
import StartModal from "./start-modal"
import { Badge } from "~/components/ui/badge"
import BaseCard from "./base-card"
import { type Base } from "@prisma/client"
import { useState, useEffect } from "react"
import axios from 'axios'

export default function Workspace() {
	const [bases, setBases] = useState<Base[]>([]);

	const fetchBases = async () => {
		try {
			const response = await axios.get('/api/bases');
			setBases(response.data as Base[]);
		} catch (error) {
			console.error('Failed to fetch bases', error);
		}
	};

	useEffect(() => {
		void fetchBases();
	}, []);

	return (
		<div className="block rounded-lg border bg-background p-7  transition-colors">
			<div className="flex flex-col gap-4 mb-5">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-4">
						<h1 className="text-xl font-semibold">Workspace</h1>
						<div className="flex items-center gap-2">
							<Badge variant="outline">
								FREE PLAN
							</Badge>
							<Badge variant="outline" className="text-blue-400">
								UPGRADE
							</Badge>
						</div>
						<button className="text-muted-foreground hover:text-foreground">
							<Star className="h-5 w-5" />
						</button>
					</div>

					<div className="flex items-center gap-2">
						<StartModal onBaseCreated={fetchBases}>
							<Button variant="outline" size="sm">Create</Button>
						</StartModal>
						<Button variant="outline" size="sm">Share</Button>
						<Button variant="ghost" size="icon">
							<MoreHorizontal className="h-4 w-4" />
						</Button>
					</div>
				</div>
			</div>
			{bases.length ? (
				<div className="grid grid-cols-3 gap-3">
					{bases.map(base => (
						<BaseCard key={base.id} base={base} />
					))}
				</div>
			) : (
				<div className="flex items-center justify-center">
					<p className="text-muted-foreground">No bases yet. Create one to get started.</p>
				</div>
			)}
		</div>
	)
}