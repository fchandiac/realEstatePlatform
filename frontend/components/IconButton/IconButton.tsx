
import React from "react";

type IconButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;

interface IconButtonProps {
	icon: string; // nombre del icono material-symbols
	variant?: "containedPrimary" | "containedSecondary" | "text" | "basic" | "outlined";
	size?: IconButtonSize;
	className?: string;
	onClick?: React.MouseEventHandler<HTMLButtonElement>;
	ariaLabel?: string;
	[key: string]: any;
}



// Estilos base sin tamaño fijo
const containedPrimary = `
	inline-flex items-center justify-center align-middle
	gap-0 leading-none rounded-full
	transition-all duration-200 ease-in-out
	border-none outline-none
	bg-primary text-background
	hover:bg-accent
	active:scale-90
`;

const containedSecondary = `
	inline-flex items-center justify-center align-middle
	p-2 gap-0 leading-none rounded-full
	transition-all duration-200 ease-in-out
	border-none outline-none
	bg-secondary text-background
	hover:bg-accent
	active:scale-90
`;

const textStyle = `
	inline-flex items-center justify-center align-middle
	p-2 gap-0 leading-none rounded-full
	transition-all duration-200 ease-in-out
	border-none outline-none
	bg-transparent text-secondary
	hover:text-accent
	active:scale-90
`;

const basic = `
	inline-flex items-center justify-center align-middle
	p-2 gap-0 leading-none rounded-full
	transition-all duration-200 ease-in-out
	border-none outline-none
	bg-transparent text-primary
	active:scale-90
`;

const baseStyle = `
	inline-flex items-center justify-center align-middle
	p-2 gap-0 leading-none rounded-full
	transition-all duration-200 ease-in-out
	border-none outline-none
	active:scale-90
`;

const outlined = `
	inline-flex items-center justify-center align-middle
	p-1 gap-0 leading-none rounded-full
	transition-all duration-200 ease-in-out
	border border-primary outline-none
	text-primary bg-transparent
	hover:bg-accent hover:text-background
	active:scale-90
`;

const variantClasses: Record<string, string> = {
	containedPrimary: containedPrimary,
	containedSecondary: containedSecondary,
	text: textStyle,
	basic: basic,
	outlined: outlined,
};


const sizeMap: Record<Exclude<IconButtonSize, number>, number> = {
  xs: 16,
  sm: 20,
  md: 24,
  lg: 32,
  xl: 40,
};

const IconButton: React.FC<IconButtonProps> = ({ icon, variant = "containedPrimary", size = 'md', className = "", onClick, ariaLabel, ...props }) => {
	const pixelSize = typeof size === 'number' ? size : sizeMap[size] || sizeMap['md'];
	const sizeClass = size === 'xs' ? 'w-4 h-4' : size === 'sm' ? 'w-5 h-5' : size === 'md' ? 'w-6 h-6' : size === 'lg' ? 'w-8 h-8' : size === 'xl' ? 'w-10 h-10' : `w-[${pixelSize}px] h-[${pixelSize}px]`;
	
	return (
		<button
			type="button"
			className={`${variantClasses[variant] || variantClasses["containedPrimary"]} ${className} cursor-pointer ${sizeClass}`}
			data-test-id="icon-button-root"
			onClick={onClick}
			aria-label={ariaLabel}
			{...props}
		>
			<span
				className="material-symbols-outlined select-none"
				style={{ fontSize: pixelSize }}
				aria-hidden
			>
				{icon}
			</span>
		</button>
	);
};

export default IconButton;