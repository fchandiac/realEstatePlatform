
"use client";
import React, { useState } from "react";
import { TextField } from "../TextField/TextField";
import AutoComplete, { Option } from "../AutoComplete/AutoComplete";
import { Button } from "../Button/Button";
import CircularProgress from "../CircularProgress/CircularProgress";
import DotProgress from "../DotProgress/DotProgress";
import Alert from "../Alert/Alert";
import Switch from "../Switch/Switch";
import Select from "../Select/Select";
import RangeSlider from "../RangeSlider/RangeSlider";
import CreateLocationPicker from "../LocationPicker/CreateLocationPickerWrapper";


export interface BaseFormField {
	name: string;
	label: string;
	type:
	| "text"
	| "textarea"
	| "autocomplete"
	| "number"
	| "email"
	| "password"
	| "switch"
	| "select"
	| "range"
	| "location"
	| "dni"
	| "currency";
	required?: boolean;
	autoFocus?: boolean;
	options?: Option[];
	multiline?: boolean;
	rows?: number;
	formatFn?: (input: string) => string;
	startIcon?: string;
	endIcon?: string;
	min?: number;
	max?: number;
	col?: number;
	labelPosition?: 'left' | 'right';
}

export interface CreateBaseFormProps {
	fields: BaseFormField[];
	values: Record<string, any>;
	onChange: (field: string, value: any) => void;
	onSubmit: () => void;
	isSubmitting?: boolean;
	submitLabel?: string;
	title?: string;
	subtitle?: string;
	errors?: string[];
	["data-test-id"]?: string;
	columns?: number;
	cancelButton?: boolean;
	cancelButtonText?: string;
	onCancel?: () => void;
}

const CreateBaseForm: React.FC<CreateBaseFormProps> = ({
	fields,
	values,
	onChange,
	onSubmit,
	isSubmitting = false,
	submitLabel,
	title = "",
	subtitle = "",
	errors = [],
	columns = 1,
	cancelButton = false,
	cancelButtonText = "Cerrar",
	onCancel,
	...props
}) => {
	const dataTestId = props["data-test-id"];
	// Función para agrupar campos por columnas
	const groupFieldsByColumns = (fields: BaseFormField[], columns: number) => {
		const columnGroups: BaseFormField[][] = Array.from({ length: columns }, () => []);

		fields.forEach((field) => {
			const colIndex = field.col ? Math.max(0, Math.min(field.col - 1, columns - 1)) : 0;
			columnGroups[colIndex].push(field);
		});

		return columnGroups;
	};

	const columnGroups = groupFieldsByColumns(fields, columns);

	// Función para renderizar un campo individual
	const renderField = (field: BaseFormField) => (
		<div key={field.name} className="mb-2">
			{field.type === "location" ? (
				<CreateLocationPicker
					onChange={coords => onChange(field.name, coords)}
				/>
			) : field.type === "range" ? (
				<RangeSlider
					min={field.min ?? 0}
					max={field.max ?? 100}
					value={values[field.name]}
					onChange={val => onChange(field.name, val)}
				/>
			) : field.type === "select" ? (
				<Select
					options={field.options || []}
					placeholder={field.label}
					value={values[field.name]}
					onChange={(id: string | number | null) => onChange(field.name, id)}
					required={field.required}
					data-test-id={`select-${field.name}`}
				/>
			) : field.type === "autocomplete" ? (
				<AutoComplete
					options={field.options || []}
					label={field.label}
					value={field.options?.find(opt => opt.id === values[field.name]) || null}
					onChange={opt => onChange(field.name, opt?.id || "")}
					required={field.required}
					name={field.name}
					data-test-id={`autocomplete-${field.name}`}
				/>
			) : field.type === "switch" ? (
				<Switch
					checked={Boolean(values[field.name])}
					onChange={val => onChange(field.name, val)}
					label={field.label}
					labelPosition={field.labelPosition || 'left'}
					data-test-id={`switch-${field.name}`}
				/>
			) : (
				<TextField
					label={field.label}
					value={values[field.name] || ""}
					onChange={e => onChange(field.name, field.formatFn ? field.formatFn(e.target.value) : e.target.value)}
					type={field.type}
					name={field.name}
					rows={field.multiline ? field.rows : undefined}
					startIcon={field.startIcon}
					endIcon={field.endIcon}
					required={field.required}
					data-test-id={`input-${field.name}`}
				/>
			)}
		</div>
	);

	return (
		<>
			{title && title !== "" && (
				<div className="title p-1 pb-0 w-full mb-0 leading-tight">{title}</div>
			)}
			{subtitle && subtitle !== "" && (
				<div className="subtitle p-1 pt-0 w-full mb-3 leading-snug">{subtitle}</div>
			)}
			<form
				onSubmit={(e) => {
					e.preventDefault();
					onSubmit();
				}}
				className={`w-full ${columns > 1 ? 'grid' : 'flex flex-col'} gap-2`}
				style={columns > 1 ? { gridTemplateColumns: `repeat(${columns}, 1fr)`, gap: '1rem' } : {}}
				{...(dataTestId ? { 'data-test-id': dataTestId } : {})}
			>
				{columns === 1 ? (
					fields.map(renderField)
				) : (
					columnGroups.map((columnFields, columnIndex) => (
						<div key={columnIndex} className="flex flex-col gap-2 w-full">
							{columnFields.map(renderField)}
						</div>
					))
				)}
				<div className="col-span-full flex justify-end gap-2 mt-4">
					{cancelButton && onCancel && (
						<Button
							variant="outlined"
							type="button"
							onClick={onCancel}
							disabled={isSubmitting}
						>
							{cancelButtonText}
						</Button>
					)}
					{isSubmitting ? (
						<DotProgress size={18} className="self-end" />
					) : (
						<Button variant="primary" type="submit">
							{submitLabel ?? "Guardar"}
						</Button>
					)}
				</div>
				{errors.length > 0 && (
					<div className="col-span-full flex flex-col gap-2 mt-4">
						{errors.map((err, i) => (
							<Alert key={i} variant="error">{err}</Alert>
						))}
					</div>
				)}
			</form>
		</>
	);
};

export default CreateBaseForm;


