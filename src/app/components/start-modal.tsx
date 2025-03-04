"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "~/components/ui/dialog"
import { Badge } from "~/components/ui/badge"
import Image from "next/image"
import axios from 'axios';
import { useRouter } from "next/navigation";
interface CreateBaseResponse {
	baseId: string;
}
export default function StartModal({ children, onBaseCreated }: { children: React.ReactNode, onBaseCreated: () => void }) {
	const router = useRouter();
	const handleInsertBase = async () => {
		try {
			const response = await axios.post<CreateBaseResponse>('/api/bases', { name: 'Untitled Base' });
			if (response.status !== 200) {
				console.error('Failed to insert base');
			}

			const baseId = response.data.baseId;
			onBaseCreated();
			router.push(`/${baseId}`);
		} catch (error) {
			console.error('Failed to insert base', error);
		}
	}

	return (
		<Dialog>
			<DialogTrigger>
				{children}
			</DialogTrigger>
			<DialogContent className="sm:max-w-[800px]">
				<DialogHeader>
					<div className="flex items-center justify-between">
						<DialogTitle className="text-2xl font-semibold">How do you want to start?</DialogTitle>
					</div>
				</DialogHeader>
				<div className="grid gap-4 md:grid-cols-2 pt-4">
					<button className="group relative overflow-hidden rounded-lg border bg-background p-6 text-left transition-colors hover:bg-accent/50" onClick={handleInsertBase}>
						<div className="mb-8">
							<Image
								src="/start-with-ai-v3.png"
								alt="Analytics dashboard illustration"
								width={400}
								height={200}
								className="w-full"
							/>
						</div>
						<div className="space-y-2">
							<div className="flex items-center gap-2">
								<h3 className="text-xl font-semibold">Build an app with AI</h3>
								<Badge variant="secondary" className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50">
									New
								</Badge>
							</div>
							<p className="text-muted-foreground">
								Cobuilder quickly turns your process into a custom app with data and interfaces.
							</p>
						</div>
					</button>
					<button className="group relative overflow-hidden rounded-lg border bg-background p-6 text-left transition-colors hover:bg-accent/50" onClick={handleInsertBase}>
						<div className="mb-8">
							<Image
								src="/start-with-data.png"
								alt="Table interface illustration"
								width={400}
								height={200}
								className="w-full"
							/>
						</div>
						<div className="space-y-2">
							<h3 className="text-xl font-semibold">Start from scratch</h3>
							<p className="text-muted-foreground">Build your ideal workflow starting with a blank table.</p>
						</div>
					</button>
				</div>
			</DialogContent>
		</Dialog>
	)
}

