/**
 * UpdateBaseForm
 *
 * Formulario flexible para edición, usando componentes personalizados.
 *
 * Props:
 * - fields: Array de objetos BaseUpdateFormField que definen cada campo.
 * - initialState: Objeto con los valores iniciales.
 * - onSubmit: Función que recibe los valores actualizados.
 * - isSubmitting: (opcional) boolean para mostrar loading.
 * - errors: (opcional) array de strings para mostrar errores.
 * - title: (opcional) título del formulario.
 */

// Ejemplo de uso:
// import UpdateBaseForm, { BaseUpdateFormField } from './BaseForm/UpdateBaseForm';
// const fields: BaseUpdateFormField[] = [
//   { name: 'nombre', label: 'Nombre', type: 'text', required: true },
//   { name: 'opcion', label: 'Opción', type: 'autocomplete', options: [{ id: 1, name: 'A' }, { id: 2, name: 'B' }] },
//   { name: 'activo', label: 'Activo', type: 'switch' },
// ];
// const [isSubmitting, setIsSubmitting] = useState(false);
// <UpdateBaseForm
//   fields={fields}
//   initialState={{ nombre: '', opcion: null, activo: false }}
//   onSubmit={values => { /* lógica de actualización */ }}
//   isSubmitting={isSubmitting}
//   errors={[]}
//   title="Ejemplo"
// />

import React, { useState, useEffect } from "react";
import { TextField } from "../TextField/TextField";
import AutoComplete, { Option } from "../AutoComplete/AutoComplete";
import { Button } from "../Button/Button";
import CircularProgress from "../CircularProgress/CircularProgress";
import DotProgress from "../DotProgress/DotProgress";
import Alert from "../Alert/Alert";
import Switch from "../Switch/Switch";
import Select from "../Select/Select";
import RangeSlider from "../RangeSlider/RangeSlider";
import UpdateLocationPicker from "../LocationPicker/UpdateLocationPickerWrapper";

export interface BaseUpdateFormField {
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
	options?: Option[];
	multiline?: boolean;
	rows?: number;
	disabled?: boolean;
	formatFn?: (input: string) => string;
	startIcon?: string;
	endIcon?: string;
	min?: number;
	max?: number;
}

export interface UpdateBaseFormProps {
	fields: BaseUpdateFormField[];
	initialState: Record<string, any>;
	onSubmit: (values: Record<string, any>) => void;
	isSubmitting?: boolean;
	errors?: string[];
	title?: string;
	subtitle?: string;
	submitLabel?: string;
	["data-test-id"]?: string;
	columns?: number;
}


const UpdateBaseForm: React.FC<UpdateBaseFormProps> = ({
	fields,
	initialState,
	onSubmit,
	isSubmitting = false,
	errors = [],
	title = "Elemento",
	subtitle,
	submitLabel,
	columns = 1,
	...props
}) => {
	const dataTestId = props["data-test-id"];
	const [values, setValues] = useState(initialState);

	useEffect(() => {
		setValues(initialState);
	}, [initialState]);

	const handleChange = (field: string, value: any) => {
		setValues((prev) => ({ ...prev, [field]: value }));
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onSubmit(values);
	};

	// Agrupar campos por columna
	const groupFieldsByColumns = (fields: BaseUpdateFormField[], columns: number) => {
		const columnGroups: BaseUpdateFormField[][] = Array.from({ length: columns }, () => []);
		fields.forEach((field) => {
			const colIndex = (field as any).col ? Math.max(0, Math.min((field as any).col - 1, columns - 1)) : 0;
			columnGroups[colIndex].push(field);
		});
		return columnGroups;
	};
	const columnGroups = groupFieldsByColumns(fields, columns);

	// Renderizar campo individual
	const renderField = (field: BaseUpdateFormField) => (
		<div key={field.name} className="mb-2">
			{field.type === "location" ? (
				<UpdateLocationPicker
					initialCoordinates={values[field.name]}
					onChange={coords => handleChange(field.name, coords)}
				/>
			) : field.type === "range" ? (
				<RangeSlider
					min={field.min ?? 0}
					max={field.max ?? 100}
					value={values[field.name]}
					onChange={val => handleChange(field.name, val)}
				/>
			) : field.type === "select" ? (
				<Select
					options={field.options || []}
					placeholder={field.label}
					value={values[field.name]}
					onChange={(id: number | null) => handleChange(field.name, id)}
				/>
			) : field.type === "autocomplete" ? (
				<AutoComplete
					options={field.options || []}
					label={field.label}
					value={field.options?.find(opt => opt.id === values[field.name]) || null}
					onChange={opt => handleChange(field.name, opt?.id || "")}
					required={field.required}
					name={field.name}
				/>
			) : field.type === "switch" ? (
				<Switch
					checked={Boolean(values[field.name])}
					onChange={val => handleChange(field.name, val)}
					label={field.label}
				/>
			) : (
				<TextField
					label={field.label}
					value={values[field.name] || ""}
					onChange={e => handleChange(field.name, field.formatFn ? field.formatFn(e.target.value) : e.target.value)}
					type={field.type}
					name={field.name}
					rows={field.multiline ? field.rows : undefined}
					startIcon={field.startIcon}
					endIcon={field.endIcon}
					required={field.required}
				/>
			)}
		</div>
	);

	return (
		<form
			onSubmit={handleSubmit}
			className={`w-full ${columns > 1 ? 'grid' : 'flex flex-col'} gap-2`}
			style={columns > 1 ? { gridTemplateColumns: `repeat(${columns}, 1fr)`, gap: '1rem' } : {}}
			{...(dataTestId ? { 'data-test-id': dataTestId } : {})}
		>
			{title && title !== "" && (
				<div className="title p-1 pb-0 w-full mb-0 leading-tight">{title}</div>
			)}
			{subtitle && subtitle !== "" && (
				<div className="subtitle p-1 pt-0 w-full mb-3 leading-snug">{subtitle}</div>
			)}
			{columns === 1 ? (
				fields.map(renderField)
			) : (
				columnGroups.map((columnFields, columnIndex) => (
					<div key={columnIndex} className="flex flex-col gap-2 w-full">
						{columnFields.map(renderField)}
					</div>
				))
			)}
			<div className="col-span-full flex justify-end mt-4">
				{isSubmitting ? (
					<DotProgress size={18} className="self-end" />
				) : (
					<Button variant="primary" type="submit">
						{submitLabel ?? "Actualizar"}
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
	);
};

export default UpdateBaseForm;