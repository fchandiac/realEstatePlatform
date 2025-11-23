import NavBar from '../ui/NavBar';
import React from 'react';

export default function ServicesLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<>
			{/* NavBar - Sticky under TopBar */}
			<div className="sticky top-16 z-40 bg-background shadow-[0_4px_8px_-4px_rgba(0,0,0,0.12)]">
				<NavBar />
			</div>
			<div className="min-h-screen bg-background flex flex-col items-center px-4 sm:px-6 lg:px-8 py-10">
				<div className="w-full max-w-7xl">
					{children}
				</div>
			</div>
		</>
	);
}
